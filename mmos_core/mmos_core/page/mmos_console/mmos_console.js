frappe.pages["mmos-console"].on_page_load = function (wrapper) {
  function ensureRuntimeStyles() {
    if (document.getElementById("mmos-console-runtime-style")) return
    const style = document.createElement("style")
    style.id = "mmos-console-runtime-style"
    style.textContent = `
.mmos-console-chat{border:1px solid rgba(148,163,184,.16);border-radius:1.75rem;background:linear-gradient(180deg,rgba(255,255,255,.96) 0%,rgba(248,250,252,.98) 100%);box-shadow:0 28px 60px rgba(15,23,42,.12);overflow:hidden}
.mmos-console-thread{padding:0 1.5rem 1.5rem;overflow:auto;display:grid;gap:1.25rem;align-content:start;justify-items:center}
.mmos-console-topline{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:.85rem;padding:0 1.5rem 1rem}
.mmos-console-pill{border:1px solid rgba(226,232,240,.92);border-radius:999px;background:rgba(255,255,255,.88);padding:.85rem 1rem;min-height:5.1rem}
.mmos-console-pill.is-health{background:linear-gradient(135deg,#fff7ed 0%,#f0fdfa 100%);border-color:rgba(194,65,12,.16)}
.mmos-console-pill span{display:block;color:#64748b;font-size:.74rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700}
.mmos-console-pill strong{display:block;margin-top:.32rem;color:#0f172a;font-size:1.05rem;line-height:1.2}
.mmos-console-pill small{display:block;margin-top:.2rem;color:#64748b;line-height:1.35}
.mmos-console-empty{margin:auto 0;padding:3rem 1.5rem;text-align:center;color:#64748b;max-width:720px}
.mmos-console-empty-prompts{display:flex;flex-wrap:wrap;justify-content:center;gap:.6rem;margin-top:1rem}
.mmos-console-message{width:min(100%,860px)}
.mmos-console-message-body{font-size:.98rem;line-height:1.7;word-break:break-word}
.mmos-console-message-meta{color:#64748b}
.mmos-console-message pre{white-space:pre-wrap;margin:0;font-family:inherit;background:transparent;border:0;padding:0}
.mmos-console-message.user .mmos-console-message-body{background:linear-gradient(180deg,#fff7ed 0%,#ffedd5 100%);border:1px solid rgba(234,88,12,.15)}
.mmos-console-composer{max-width:960px;margin:0 auto;width:100%}
.mmos-console-composer textarea{min-height:124px;border-radius:1.2rem;padding:1rem 1.05rem;font-size:1rem;line-height:1.6}
@media (max-width: 768px){.mmos-console-topline{grid-template-columns:1fr;padding:0 1rem 1rem}.mmos-console-thread{padding:0 1rem 1rem}.mmos-console-chat-head{padding:1rem}.mmos-console-chat-actions{width:100%}.mmos-console-chat-actions .btn{flex:1}}
`
    document.head.appendChild(style)
  }

  ensureRuntimeStyles()

  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "MMOS Console",
    single_column: true,
  })

  $(page.body).html(`
    <div class="mmos-console-shell">
      <aside class="mmos-console-sidebar">
        <div class="mmos-console-brand">
          <div class="mmos-console-brand-mark">M</div>
          <div>
            <div class="mmos-console-brand-kicker">AI Workspace</div>
            <h2>MMOS Console</h2>
            <div class="mmos-console-brand-subtitle">Chat operativa per infrastruttura, codice, deploy e diagnosi dal Desk Frappe.</div>
          </div>
        </div>

        <button class="btn btn-primary btn-sm mmos-console-new" data-action="new-chat">Nuova chat</button>

        <div class="mmos-console-status-card">
          <div class="mmos-console-status-head">
            <span>Sessione</span>
            <strong data-role="user">...</strong>
          </div>
          <div class="mmos-console-status-grid">
            <div class="mmos-console-mini-stat">
              <span>Server</span>
              <strong data-role="server-count">0</strong>
            </div>
            <div class="mmos-console-mini-stat">
              <span>Siti</span>
              <strong data-role="site-count">0</strong>
            </div>
            <div class="mmos-console-mini-stat">
              <span>Docker</span>
              <strong data-role="docker-nodes">0</strong>
            </div>
            <div class="mmos-console-mini-stat">
              <span>Backup</span>
              <strong data-role="backup-count">0</strong>
            </div>
            <div class="mmos-console-mini-stat">
              <span>Storage</span>
              <strong data-role="storage-status">-</strong>
            </div>
            <div class="mmos-console-mini-stat">
              <span>GitHub</span>
              <strong data-role="github-status">-</strong>
            </div>
            <div class="mmos-console-mini-stat">
              <span>Workers</span>
              <strong data-role="workers-status">-</strong>
            </div>
          </div>
          <div class="mmos-console-muted" data-role="workers-caption" style="margin-top:.75rem;">I worker locali preparano stato e health check in background.</div>
        </div>

        <div class="mmos-console-section">
          <div class="mmos-console-section-title">Suggerimenti</div>
          <div class="mmos-console-shortcuts">
            <button class="btn btn-default btn-xs" data-prompt="analizza lo stato di tutti i nodi e dimmi solo i problemi reali">Stato reale</button>
            <button class="btn btn-default btn-xs" data-prompt="controlla press servizi e stack">Press</button>
            <button class="btn btn-default btn-xs" data-prompt="controlla wireguard servizi e stack">WireGuard</button>
            <button class="btn btn-default btn-xs" data-prompt="controlla mailmx.onekeyco.com servizi e stack">Mail</button>
            <button class="btn btn-default btn-xs" data-prompt="show docker fleet status">Docker fleet</button>
            <button class="btn btn-default btn-xs" data-prompt="show storage status">Storage</button>
            <button class="btn btn-default btn-xs" data-prompt="show backup jobs">Backup jobs</button>
            <button class="btn btn-default btn-xs" data-prompt="usa codex per analizzare questo problema Frappe">Codex</button>
          </div>
        </div>

        <div class="mmos-console-section">
          <div class="mmos-console-section-title">Nodi</div>
          <div class="mmos-console-server-list" data-role="server-list"></div>
        </div>

        <div class="mmos-console-section">
          <div class="mmos-console-section-title">Storage</div>
          <div class="mmos-console-nas-card">
            <div><strong>Nodo attivo</strong><span data-role="nas-node">-</span></div>
            <div><strong>Mount</strong><span data-role="backup-root">/mnt/mmos-nas/mmos-backups</span></div>
            <div><strong>Stato</strong><span data-role="nas-text">Controllo in corso</span></div>
            <div><strong>Spazio libero</strong><span data-role="nas-free">-</span></div>
            <div><strong>Ruolo</strong><span data-role="nas-roles">backup, staging, artifacts</span></div>
          </div>
        </div>
      </aside>

      <main class="mmos-console-chat">
        <header class="mmos-console-chat-head">
          <div>
            <div class="mmos-console-chat-kicker">Chat-first operations</div>
            <h3>Assistant Workspace</h3>
            <div class="mmos-console-chat-subtitle">Conversazione centrale, output tecnico separato e comandi reali dietro la chat.</div>
          </div>
          <div class="mmos-console-chat-actions">
            <button class="btn btn-default btn-sm" data-action="refresh-monitor">Aggiorna stato</button>
            <button class="btn btn-default btn-sm" data-action="open-monitor">Monitor</button>
            <button class="btn btn-default btn-sm" data-action="open-resources">Risorse</button>
            <button class="btn btn-default btn-sm" data-action="open-secrets">Secrets</button>
          </div>
        </header>

        <section class="mmos-console-topline">
          <div class="mmos-console-pill is-health">
            <span>Health</span>
            <strong data-role="health-label">Loading</strong>
            <small data-role="health-detail">Sto raccogliendo stato operativo.</small>
          </div>
          <div class="mmos-console-pill">
            <span>Press</span>
            <strong data-role="press-summary">-</strong>
            <small data-role="press-detail">Siti e app installate.</small>
          </div>
          <div class="mmos-console-pill">
            <span>Backups</span>
            <strong data-role="backup-summary">-</strong>
            <small data-role="backup-detail">Job configurati sul control plane.</small>
          </div>
          <div class="mmos-console-pill">
            <span>Docker Fleet</span>
            <strong data-role="docker-summary">-</strong>
            <small data-role="docker-detail">Container e nodi gestiti.</small>
          </div>
          <div class="mmos-console-pill">
            <span>Workers</span>
            <strong data-role="worker-summary">-</strong>
            <small data-role="worker-detail">Loop locali e prossimo refresh.</small>
          </div>
        </section>

        <section class="mmos-console-thread" data-role="history"></section>

        <details class="mmos-console-output-panel" data-role="raw-panel">
          <summary class="mmos-console-output-head">
            <strong>Dettaglio tecnico</strong>
            <span>JSON e output completi, separati dalla chat</span>
          </summary>
          <pre class="mmos-console-output">Ready.</pre>
        </details>

        <footer class="mmos-console-composer">
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-prompt="analizza lo stato di tutti i nodi e dimmi solo i problemi reali">Problemi reali</button>
            <button class="btn btn-default btn-xs" data-prompt="crea sito demo.onekeyco.com">Crea sito</button>
            <button class="btn btn-default btn-xs" data-prompt="show docker fleet status">Docker fleet</button>
            <button class="btn btn-default btn-xs" data-prompt="show storage status">Storage</button>
            <button class="btn btn-default btn-xs" data-prompt="usa codex per analizzare un bug Frappe">Analizza con Codex</button>
          </div>
          <textarea class="form-control" rows="3" placeholder="Scrivi come in ChatGPT. Esempio: controlla tutti i nodi, dimmi gli errori reali e proponi il fix più sicuro."></textarea>
          <div class="mmos-console-composer-bar">
            <div class="mmos-console-hint">Invio per mandare. Shift + Invio per andare a capo.</div>
            <div class="mmos-console-composer-actions">
              <button class="btn btn-default btn-sm" data-action="new-chat">Reset</button>
              <button class="btn btn-primary btn-sm" data-action="prompt">Invia</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `)

  const $root = $(page.body)
  const $output = $root.find(".mmos-console-output")
  const $textarea = $root.find("textarea")
  const $history = $root.find("[data-role='history']")
  const STORAGE_KEY = "mmos_console_thread_v1"

  let currentThread = []
  let isRunning = false

  function escapeHtml(value) {
    return frappe.utils.escape_html(String(value ?? ""))
  }

  function pretty(payload) {
    if (typeof payload === "string") return payload
    return JSON.stringify(payload, null, 2)
  }

  function unwrapPayload(payload) {
    return payload?.result ?? payload
  }

  function clip(value, max = 220) {
    const text = String(value ?? "").trim()
    if (!text) return ""
    if (text.length <= max) return text
    return `${text.slice(0, max - 1)}...`
  }

  function summarizeResult(result) {
    if (result == null) return "Nessun output disponibile."
    if (typeof result === "string") return result
    if (result.summary) return pretty(result.summary)
    if (result.status) return `Status: ${result.status}`
    if (Array.isArray(result.checks)) return `${result.checks.length} check eseguiti`
    if (Array.isArray(result.sites)) return `${result.sites.length} siti rilevati`
    if (Array.isArray(result.nodes)) return `${result.nodes.length} nodi rilevati`
    if (result.server && result.checks) return `${result.server.name || "server"} verificato`
    if (result.workdir && result.codex_result?.stdout) return clip(result.codex_result.stdout, 500)
    return pretty(result)
  }

  function summarizeForChat(message) {
    const plan = message?.plan || {}
    const execution = message?.execution || {}
    const result = execution?.result ?? message?.result ?? null
    const issues = summarizeIssues(message)
    const lines = []

    if (result?.reply) lines.push(String(result.reply).trim())

    if (!lines.length && typeof result === "string") {
      lines.push(result)
    }

    if (!lines.length && result?.summary && typeof result.summary === "string") {
      lines.push(result.summary)
    }

    if (!lines.length && plan?.action) {
      lines.push(`Ho eseguito ${plan.action}.`)
    }

    if (issues.length) {
      lines.push(`Blocco reale: ${issues[0]}`)
    }

    const status = result?.status || execution?.status
    if (status && !issues.length) {
      lines.push(`Stato: ${status}`)
    }

    const nextStep = result?.next_step || result?.next || message?.next_step
    if (nextStep) {
      lines.push(`Prossimo passo: ${nextStep}`)
    }

    return lines.filter(Boolean).join("\n\n")
  }

  function summarizeIssues(payload) {
    const issues = []
    function walk(value) {
      if (!value) return
      if (Array.isArray(value)) {
        value.forEach(walk)
        return
      }
      if (typeof value !== "object") return
      if (Array.isArray(value.issues)) {
        value.issues.forEach((item) => {
          if (item && item.message) issues.push(String(item.message))
        })
      }
      Object.values(value).forEach(walk)
    }
    walk(payload)
    return Array.from(new Set(issues)).slice(0, 3)
  }

  function toMessageState(entry) {
    if (entry.kind === "system") return "System"
    if (entry.kind === "user") return "Prompt"
    return "Assistant"
  }

  function buildAssistantPayload(message) {
    const chatSummary = summarizeForChat(message)
    if (chatSummary) return chatSummary
    const plan = message?.plan || {}
    const execution = message?.execution || {}
    const result = execution?.result ?? message?.result ?? null
    const parts = []
    if (plan.action) parts.push(`Azione: ${plan.action}`)
    if (plan.reason) parts.push(`Motivo: ${plan.reason}`)
    const issues = summarizeIssues(message)
    if (issues.length) parts.push(`Blocco reale:\n- ${issues.join("\n- ")}`)
    if (result != null) parts.push(summarizeResult(result))
    return parts.filter(Boolean).join("\n\n")
  }

  function humanizePayload(entry) {
    const payload = entry.payload
    if (entry.kind === "user") {
      return {
        title: "Tu",
        body: typeof payload === "string" ? payload : pretty(payload),
        meta: "",
      }
    }

    if (entry.kind === "system") {
      return {
        title: entry.title || "System",
        body: typeof payload === "string" ? payload : summarizeResult(payload),
        meta: "System event",
      }
    }

    return {
      title: "MMOS",
      body: buildAssistantPayload(payload),
      meta: payload?.plan?.action || "",
    }
  }

  function renderThread() {
    if (!currentThread.length) {
      $history.html(`
        <div class="mmos-console-empty">
          <h4>Pronto.</h4>
          <p>Scrivi qui in naturale. Non serve il terminale: traduco la richiesta in controlli, playbook, repo diagnostics e analisi tecniche reali.</p>
          <div class="mmos-console-empty-prompts">
            <button class="btn btn-default btn-sm" data-prompt="mi scrivi cosa puoi fare">Cosa puoi fare</button>
            <button class="btn btn-default btn-sm" data-prompt="analizza lo stato di tutti i nodi e dimmi solo i problemi reali">Problemi reali</button>
            <button class="btn btn-default btn-sm" data-prompt="controlla press servizi e stack">Controlla Press</button>
            <button class="btn btn-default btn-sm" data-prompt="show storage status">Stato storage</button>
          </div>
        </div>
      `)
      return
    }

    const html = currentThread
      .map((entry) => {
        const rendered = humanizePayload(entry)
        const bodyClass = entry.kind === "assistant" ? "mmos-console-message-rich" : ""
        const meta = rendered.meta
          ? `<div class="mmos-console-message-meta">${escapeHtml(rendered.meta)}</div>`
          : ""
        return `
          <article class="mmos-console-message mmos-console-message-${entry.kind}">
            <div class="mmos-console-message-avatar">${entry.kind === "user" ? "You" : entry.kind === "assistant" ? "AI" : "Sys"}</div>
            <div class="mmos-console-message-body ${bodyClass}">
              <div class="mmos-console-message-title-row">
                <div class="mmos-console-message-title">${escapeHtml(rendered.title)}</div>
                <div class="mmos-console-message-state">${escapeHtml(toMessageState(entry))}</div>
              </div>
              ${meta}
              <pre>${escapeHtml(rendered.body)}</pre>
            </div>
          </article>
        `
      })
      .join("")

    $history.html(html)
    $history.scrollTop($history[0].scrollHeight)
  }

  function persistThread() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentThread.slice(-30)))
    } catch (error) {
      console.debug("MMOS console thread persistence skipped", error)
    }
  }

  function loadThread() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.debug("MMOS console thread restore skipped", error)
      return []
    }
  }

  function pushMessage(kind, title, payload) {
    currentThread.push({ kind, title, payload })
    persistThread()
    renderThread()
  }

  function setComposerState(running) {
    isRunning = running
    $textarea.prop("disabled", running)
    $root.find("[data-action='prompt']").prop("disabled", running)
    $root.find("[data-action='prompt']").text(running ? "Invio..." : "Invia")
  }

  function renderOverview(data) {
    const servers = unwrapPayload(data?.servers)?.result || unwrapPayload(data?.servers) || []
    const providers = unwrapPayload(data?.providers)?.result || unwrapPayload(data?.providers) || {}
    const repos = unwrapPayload(data?.repos)?.result || unwrapPayload(data?.repos) || {}
    const errors = unwrapPayload(data?.errors)?.result || unwrapPayload(data?.errors) || {}
    const storage = unwrapPayload(data?.storage)?.result || unwrapPayload(data?.storage) || providers?.storage || {}
    const dockerFleet = unwrapPayload(data?.docker_fleet)?.result || unwrapPayload(data?.docker_fleet) || {}
    const backupJobs = unwrapPayload(data?.backup_jobs)?.result || unwrapPayload(data?.backup_jobs) || []
    const pressSites = unwrapPayload(data?.press_sites)?.result?.sites || unwrapPayload(data?.press_sites)?.sites || []
    const workers = unwrapPayload(data?.workers) || {}
    const workerSummary = workers?.summary || {}
    const workerMeta = workers?.workers || {}
    const lastRotation = workerMeta?.last_rotation || {}
    const rotationTimer = workerMeta?.rotation_timer || {}

    $root.find("[data-role='user']").text(data?.user || "Unknown")
    $root.find("[data-role='server-count']").text(String(servers.length))
    $root.find("[data-role='site-count']").text(String(pressSites.length))
    $root.find("[data-role='backup-count']").text(String(backupJobs.length))
    $root.find("[data-role='github-status']").text(providers?.github?.ok ? "OK" : "Check")
    $root.find("[data-role='workers-status']").text(
      `${workerMeta?.active || 0}/${workerMeta?.rotating || 0}`
    )
    $root.find("[data-role='workers-caption']").text(
      workerSummary?.updates
        ? `Worker attivi: ${workerMeta?.active || 0}. Feed pronto: ${workerSummary.updates} update caricate.`
        : "I worker locali preparano stato e health check in background."
    )
    $root.find("[data-role='storage-status']").text(storage?.mounted ? "Online" : "Offline")
    $root.find("[data-role='docker-nodes']").text(String(dockerFleet?.summary?.docker_nodes || 0))
    $root.find("[data-role='nas-text']").text(storage?.mounted ? "Montato e operativo" : "Offline o non montato")
    $root.find("[data-role='nas-node']").text(storage?.effective_node || storage?.hostname || "-")
    $root.find("[data-role='backup-root']").text(storage?.backup_root || "/mnt/mmos-nas/mmos-backups")
    $root.find("[data-role='nas-free']").text(storage?.free_human || storage?.free || "-")
    const nasRoles = Object.entries(storage?.config?.roles || {})
      .filter(([, enabled]) => Boolean(enabled))
      .map(([name]) => name.replaceAll("_", " "))
      .join(", ")
    $root.find("[data-role='nas-roles']").text(nasRoles || "backup only")

    const healthOk = providers?.hetzner?.configured && !errors?.has_issues
    $root.find("[data-role='health-label']").text(healthOk ? "Operational" : "Needs attention")
    $root.find("[data-role='health-detail']").text(
      healthOk ? "Stato generale coerente. Chat pronta per operazioni e debug." : "Ci sono elementi che richiedono verifica."
    )
    $root.find("[data-role='press-summary']").text(`${pressSites.length} siti`)
    $root.find("[data-role='press-detail']").text(
      pressSites.length ? "Inventario Press disponibile." : "Nessun sito Press rilevato."
    )
    $root.find("[data-role='backup-summary']").text(`${backupJobs.length} job`)
    $root.find("[data-role='backup-detail']").text(
      storage?.mounted ? "Storage disponibile per backup e staging." : "Storage da verificare."
    )
    $root.find("[data-role='docker-summary']").text(
      `${dockerFleet?.summary?.running_containers || 0}/${dockerFleet?.summary?.total_containers || 0}`
    )
    $root.find("[data-role='docker-detail']").text(
      `${dockerFleet?.summary?.docker_nodes || 0} nodi Docker, ${dockerFleet?.summary?.issue_nodes || 0} con issue`
    )
    $root.find("[data-role='worker-summary']").text(
      `${lastRotation?.ok || 0}/${lastRotation?.count || workerMeta?.rotating || 0} ok`
    )
    $root.find("[data-role='worker-detail']").text(
      rotationTimer?.next_elapse
        ? `Prossimo giro: ${rotationTimer.next_elapse}`
        : `Ultimo refresh: ${workers?.generated_at || "non disponibile"}`
    )

    const serverHtml = servers
      .map((server) => `
        <div class="mmos-console-server-item">
          <strong>${escapeHtml(server.name || "-")}</strong>
          <span>${escapeHtml(server.role || "-")}</span>
          <small>${escapeHtml(server.public_ip || server.private_ip || "-")}</small>
        </div>
      `)
      .join("")

    $root.find("[data-role='server-list']").html(
      serverHtml || "<div class='mmos-console-muted'>Nessun server disponibile.</div>"
    )

    if (repos?.local?.repos?.length) {
      $root.find("[data-role='server-list']").append(
        `<div class='mmos-console-muted' style='margin-top:10px;'>Repo locali: ${repos.local.repos.length}</div>`
      )
    }
  }

  async function run(method, args = {}) {
    $output.text("Loading...")
    try {
      const response = await frappe.call({ method, args })
      const message = unwrapPayload(response.message)
      $output.text(JSON.stringify(message, null, 2))
      if (message?.detail || message?.error || message?.result?.stderr) {
        $root.find("[data-role='raw-panel']").attr("open", true)
      }
      if (method === "mmos_core.api.console_bootstrap") {
        renderOverview(message)
      }
      return message
    } catch (error) {
      const message = error?.message || String(error)
      $output.text(message)
      pushMessage("system", "Errore", message)
      throw error
    }
  }

  async function submitPrompt(prompt) {
    const clean = String(prompt || "").trim()
    if (!clean || isRunning) return

    pushMessage("user", "Prompt", clean)
    $textarea.val("")
    setComposerState(true)
    try {
      const message = await run("mmos_core.api.ai_command", { prompt: clean })
      pushMessage("assistant", "Risposta", message)
    } finally {
      setComposerState(false)
      $textarea.trigger("focus")
    }
  }

  function resetThread() {
    currentThread = []
    persistThread()
    renderThread()
    $output.text("Ready.")
    pushMessage("assistant", "Welcome", {
      plan: { action: "ready", reason: "Console pronta con comportamento chat-first" },
      execution: {
        result: "Posso aiutarti con stato sistemi, debug, backup, deploy, Frappe e task di codice via Codex.",
      },
    })
  }

  $root.on("click", "[data-action='new-chat']", () => {
    resetThread()
  })

  $root.on("click", "[data-action='refresh-monitor']", () => {
    run("mmos_core.api.console_bootstrap").then((message) => {
      pushMessage("system", "Monitor aggiornato", {
        servers: unwrapPayload(message?.servers)?.length || unwrapPayload(message?.servers)?.result?.length || 0,
        sites: unwrapPayload(message?.press_sites)?.sites?.length || unwrapPayload(message?.press_sites)?.result?.sites?.length || 0,
        backup_jobs: unwrapPayload(message?.backup_jobs)?.length || unwrapPayload(message?.backup_jobs)?.result?.length || 0,
        storage_mounted: !!unwrapPayload(message?.storage)?.mounted || !!unwrapPayload(message?.storage)?.result?.mounted,
      })
    })
  })

  $root.on("click", "[data-action='prompt']", () => {
    submitPrompt($textarea.val())
  })

  $root.on("click", "[data-action='open-resources']", () => {
    frappe.set_route("mmos-resources")
  })

  $root.on("click", "[data-action='open-monitor']", () => {
    frappe.set_route("mmos-monitor")
  })

  $root.on("click", "[data-action='open-secrets']", () => {
    frappe.set_route("mmos-secrets")
  })

  $root.on("click", "[data-prompt]", function () {
    const prompt = $(this).attr("data-prompt")
    $textarea.val(prompt)
    submitPrompt(prompt)
  })

  $textarea.on("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submitPrompt($textarea.val())
    }
  })

  currentThread = loadThread()
  renderThread()
  if (!currentThread.length) {
    resetThread()
  }
  run("mmos_core.api.console_bootstrap").then((message) => {
    if (!currentThread.some((entry) => entry.kind === "system" && entry.title === "Bootstrap")) {
      pushMessage("system", "Bootstrap", {
        user: message.user,
        servers: unwrapPayload(message?.servers)?.length || unwrapPayload(message?.servers)?.result?.length || 0,
        sites: unwrapPayload(message?.press_sites)?.sites?.length || unwrapPayload(message?.press_sites)?.result?.sites?.length || 0,
        backup_jobs: unwrapPayload(message?.backup_jobs)?.length || unwrapPayload(message?.backup_jobs)?.result?.length || 0,
      })
    }
  })
}
