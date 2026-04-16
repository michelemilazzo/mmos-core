(function () {
  const boot = window.MMOS_CHAT_BOOT || {};
  const root = document.getElementById("mmos-chat-root");
  if (!root) return;
  const sessionStatus = document.body.getAttribute("frappe-session-status") || "";
  const next = encodeURIComponent(window.location.pathname + window.location.search);

  if (sessionStatus === "logged-out") {
    window.location.href = `/login?redirect-to=${next}`;
    return;
  }

  const threadEl = root.querySelector("[data-role='thread']");
  const promptEl = root.querySelector("[data-role='prompt']");
  const statusEl = root.querySelector("[data-role='status']");
  const workerEl = root.querySelector("[data-role='worker-summary']");
  const storageKey = "mmos_chat_standalone_thread_v1";
  let running = false;
  let thread = [];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function getCookie(name) {
    const prefix = `${name}=`;
    const match = document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(prefix));
    return match ? decodeURIComponent(match.slice(prefix.length)) : "";
  }

  function renderThread() {
    if (!thread.length) {
      threadEl.innerHTML = `
        <div class="mmos-chat-empty">
          Scrivi in linguaggio naturale. I worker locali preparano stato e controlli in background, la chat decide e coordina.
        </div>
      `;
      return;
    }

    threadEl.innerHTML = thread.map((message) => `
      <article class="mmos-chat-message ${message.role}">
        <div class="meta">${escapeHtml(message.role === "user" ? "Tu" : "MMOS")}</div>
        <div class="body">${escapeHtml(message.body)}</div>
      </article>
    `).join("");

    threadEl.scrollTop = threadEl.scrollHeight;
  }

  function persist() {
    window.localStorage.setItem(storageKey, JSON.stringify(thread));
  }

  function loadThread() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) thread = saved;
    } catch (e) {
      thread = [];
    }
    renderThread();
  }

  function unwrap(payload) {
    return payload && payload.message && payload.message.result ? payload.message.result : (payload.message || payload.result || payload);
  }

  function summarize(result) {
    if (!result) return "Nessuna risposta disponibile.";
    if (typeof result === "string") return result;
    if (result.reply) return String(result.reply);
    if (result.execution && result.execution.result && result.execution.result.reply) {
      return String(result.execution.result.reply);
    }
    if (result.execution && result.execution.result && result.execution.result.summary) {
      return JSON.stringify(result.execution.result.summary, null, 2);
    }
    if (result.result && result.result.reply) return String(result.result.reply);
    if (result.summary) return typeof result.summary === "string" ? result.summary : JSON.stringify(result.summary, null, 2);
    return JSON.stringify(result, null, 2);
  }

  async function api(method, args) {
    if (window.frappe && typeof frappe.call === "function") {
      return new Promise((resolve, reject) => {
        frappe.call({
          method,
          args: args || {},
          callback: function (response) {
            resolve(response);
          },
          error: function (error) {
            reject(error || new Error("Request failed"));
          },
        });
      });
    }

    const body = new URLSearchParams();
    Object.entries(args || {}).forEach(([key, value]) => {
      body.set(key, value == null ? "" : String(value));
    });
    const response = await fetch(`/api/method/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Frappe-CSRF-Token": boot.csrf_token || getCookie("csrf_token") || "",
      },
      body,
      credentials: "same-origin",
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?._error_message || payload?.exception || response.statusText);
    }
    return payload;
  }

  async function loadBootstrap() {
    try {
      const payload = await api("mmos_core.api.console_bootstrap");
      const result = unwrap(payload) || {};
      const workers = result.workers || {};
      const ok = workers.ok_count ?? 0;
      const total = workers.worker_count ?? 0;
      const user = result.user || boot.user || "";
      const userEl = root.querySelector("[data-role='user']");
      if (userEl && user) userEl.textContent = user;
      workerEl.textContent = total ? `${ok}/${total} worker ok` : "Worker status non disponibile";
    } catch (error) {
      const message = String(error && error.message || "");
      if (
        message.includes("403") ||
        message.includes("400") ||
        message.includes("Not permitted") ||
        message.includes("Method Not Allowed") ||
        message.includes("Permission")
      ) {
        window.location.href = `/login?redirect-to=${next}`;
        return;
      }
      workerEl.textContent = "Bootstrap non disponibile";
    }
  }

  async function sendPrompt(prompt) {
    if (!prompt || running) return;
    running = true;
    setStatus("Sto elaborando...");
    thread.push({ role: "user", body: prompt });
    renderThread();
    persist();

    try {
      const payload = await api("mmos_core.api.ai_command", { prompt });
      const result = unwrap(payload);
      thread.push({ role: "assistant", body: summarize(result) });
      persist();
      renderThread();
      setStatus("Pronto.");
    } catch (error) {
      thread.push({ role: "assistant", body: `Errore reale: ${error.message}` });
      persist();
      renderThread();
      setStatus("Errore.");
    } finally {
      running = false;
    }
  }

  root.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.getAttribute("data-prompt") || "";
      promptEl.value = prompt;
      sendPrompt(prompt);
    });
  });

  root.querySelector("[data-action='send']").addEventListener("click", () => {
    const prompt = promptEl.value.trim();
    if (!prompt) return;
    sendPrompt(prompt);
    promptEl.value = "";
  });

  root.querySelector("[data-action='reset']").addEventListener("click", () => {
    thread = [];
    persist();
    renderThread();
    setStatus("Nuova chat.");
  });

  promptEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      root.querySelector("[data-action='send']").click();
    }
  });

  loadThread();
  loadBootstrap();
})();
