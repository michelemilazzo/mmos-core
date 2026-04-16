frappe.pages["mmos-ai"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "MMOS AI",
    single_column: true,
  })

  $(page.body).html(`
    <style>
      .mmos-ai-shell {
        max-width: 1240px;
        margin: 0 auto;
        padding: 22px 18px 28px;
      }
      .mmos-ai-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 320px;
        gap: 18px;
        align-items: start;
      }
      .mmos-ai-head {
        margin-bottom: 16px;
      }
      .mmos-ai-head h3 {
        margin: 0 0 6px;
        font-size: 1.35rem;
      }
      .mmos-ai-subtitle {
        color: #64748b;
        font-size: 0.92rem;
      }
      .mmos-ai-timeline {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 18px;
      }
      .mmos-ai-card {
        border: 1px solid #dbe4f0;
        border-radius: 16px;
        padding: 14px 16px;
        background: #f8fbff;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
      }
      .mmos-ai-card.user {
        background: #eef6ff;
      }
      .mmos-ai-card.agent {
        background: #f8fafc;
      }
      .mmos-ai-summary {
        background: #ffffff;
        border: 1px solid #dbe4f0;
        border-radius: 16px;
        padding: 18px;
        margin-top: 8px;
        margin-bottom: 14px;
        box-shadow: 0 8px 28px rgba(15, 23, 42, 0.06);
        display: grid;
        gap: 12px;
      }
      .mmos-ai-summary .mmos-ai-section {
        margin-top: 0;
        padding: 0;
        border-top: 0;
      }
      .mmos-ai-details {
        margin-top: 8px;
      }
      .mmos-ai-details summary {
        cursor: pointer;
        color: #64748b;
        font-weight: 600;
        font-size: 0.9rem;
      }
      .mmos-ai-details .mmos-ai-section {
        opacity: 0.85;
      }
      .mmos-ai-emphasis {
        border-left: 4px solid #2563eb;
        padding-left: 12px;
      }
      .mmos-ai-label {
        font-size: 0.72rem;
        font-weight: 700;
        color: #475569;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .mmos-ai-section {
        padding: 10px 0;
        border-top: 1px solid #e5e7eb;
      }
      .mmos-ai-section:first-of-type {
        border-top: 0;
        padding-top: 0;
      }
      .mmos-ai-section-title {
        font-size: 0.8rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .mmos-ai-context-item,
      .mmos-ai-action-item {
        padding: 8px 10px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        background: #fff;
        margin-bottom: 8px;
      }
      .mmos-ai-context-label,
      .mmos-ai-action-label {
        font-weight: 600;
        color: #0f172a;
      }
      .mmos-ai-action-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .mmos-ai-badges {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .mmos-ai-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }
      .mmos-ai-badge.done {
        background: #dcfce7;
        color: #166534;
      }
      .mmos-ai-badge.failed {
        background: #fee2e2;
        color: #991b1b;
      }
      .mmos-ai-badge.running {
        background: #dbeafe;
        color: #1d4ed8;
      }
      .mmos-ai-meta {
        color: #64748b;
        font-size: 0.8rem;
        margin-top: 2px;
      }
      .mmos-ai-output {
        margin-top: 6px;
        color: #334155;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 0.78rem;
      }
      .mmos-ai-controls {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .mmos-ai-input {
        flex: 1 1 auto;
        min-height: 46px;
        border-radius: 12px;
        border: 1px solid #cbd5e1;
        padding: 12px 14px;
      }
      .mmos-ai-status {
        min-height: 20px;
        margin-top: 10px;
        color: #64748b;
        font-size: 0.82rem;
      }
      .mmos-ai-empty {
        padding: 14px;
        border: 1px dashed #cbd5e1;
        border-radius: 14px;
        color: #64748b;
        background: #fff;
      }
      .mmos-ai-history {
        border: 1px solid #dbe4f0;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
        overflow: hidden;
      }
      .mmos-ai-history-head {
        padding: 14px 16px;
        border-bottom: 1px solid #e2e8f0;
      }
      .mmos-ai-history-toolbar {
        padding: 12px 16px 0;
        display: grid;
        gap: 10px;
      }
      .mmos-ai-history-filters {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .mmos-ai-filter-chip {
        border: 1px solid #cbd5e1;
        border-radius: 999px;
        background: #fff;
        color: #334155;
        padding: 4px 10px;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
      }
      .mmos-ai-filter-chip.active {
        background: #0f172a;
        border-color: #0f172a;
        color: #fff;
      }
      .mmos-ai-search {
        width: 100%;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        padding: 8px 10px;
        min-height: 38px;
      }
      .mmos-ai-history-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
      }
      .mmos-ai-history-subtitle {
        margin-top: 4px;
        color: #64748b;
        font-size: 0.82rem;
      }
      .mmos-ai-history-list {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .mmos-ai-history-item {
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #f8fafc;
        padding: 10px 12px;
        cursor: pointer;
        transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease;
      }
      .mmos-ai-history-item:hover {
        border-color: #93c5fd;
        background: #eff6ff;
      }
      .mmos-ai-history-item.active {
        border-color: #2563eb;
        background: #eff6ff;
        box-shadow: inset 0 0 0 1px rgba(37, 99, 235, 0.12);
      }
      .mmos-ai-history-headline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 6px;
      }
      .mmos-ai-status-dot {
        width: 9px;
        height: 9px;
        border-radius: 999px;
        background: #94a3b8;
        flex: 0 0 auto;
      }
      .mmos-ai-status-dot.ok {
        background: #16a34a;
      }
      .mmos-ai-status-dot.error,
      .mmos-ai-status-dot.failed {
        background: #dc2626;
      }
      .mmos-ai-status-dot.warning,
      .mmos-ai-status-dot.partial {
        background: #f59e0b;
      }
      .mmos-ai-history-topic {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.76rem;
        font-weight: 700;
        color: #0f172a;
      }
      .mmos-ai-history-stats {
        color: #64748b;
        font-size: 0.76rem;
        font-weight: 600;
        white-space: nowrap;
      }
      .mmos-ai-history-prompt {
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 4px;
        line-height: 1.4;
      }
      .mmos-ai-history-meta {
        color: #64748b;
        font-size: 0.78rem;
      }
      .mmos-ai-run-overview {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }
      .mmos-ai-run-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 9px;
        border-radius: 999px;
        border: 1px solid #dbe4f0;
        background: #fff;
        color: #334155;
        font-size: 0.75rem;
        font-weight: 700;
      }
      .mmos-ai-output-wrap {
        margin-top: 8px;
      }
      .mmos-ai-output-toggle {
        cursor: pointer;
        color: #334155;
        font-size: 0.76rem;
        font-weight: 700;
      }
      .mmos-ai-output-wrap pre {
        margin: 8px 0 0;
      }
      .mmos-ai-decision {
        display: grid;
        gap: 8px;
        font-size: 0.95rem;
        line-height: 1.5;
      }
      .mmos-ai-decision-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .mmos-ai-decision-text {
        color: #0f172a;
      }
      .mmos-ai-decision-text strong {
        display: inline-block;
        margin-right: 6px;
      }
      .mmos-ai-decision-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 4px;
      }
      .mmos-ai-run-pill.safe {
        background: #dcfce7;
        border-color: #bbf7d0;
        color: #166534;
      }
      .mmos-ai-run-pill.check {
        background: #fef3c7;
        border-color: #fde68a;
        color: #92400e;
      }
      .mmos-ai-run-pill.investigate {
        background: #fee2e2;
        border-color: #fecaca;
        color: #991b1b;
      }
      @media (max-width: 768px) {
        .mmos-ai-shell {
          padding-left: 12px;
          padding-right: 12px;
        }
        .mmos-ai-grid {
          grid-template-columns: 1fr;
        }
        .mmos-ai-controls {
          flex-direction: column;
          align-items: stretch;
        }
      }
    </style>

    <div class="mmos-ai-shell">
      <div class="mmos-ai-head">
        <h3 class="mmos-title">MMOS AI</h3>
        <div class="mmos-ai-subtitle mmos-sub">Sintesi operativa sopra, dettaglio tecnico sotto.</div>
      </div>

      <div class="mmos-ai-grid">
        <div>
          <div class="mmos-ai-timeline" data-role="timeline">
            <div class="mmos-ai-empty">Nessuna esecuzione ancora. Invia un prompt per interrogare l'agente.</div>
          </div>

          <div class="mmos-ai-controls">
            <input class="mmos-ai-input" data-role="prompt" type="text" placeholder="Scrivi comando o domanda..." />
            <button class="btn btn-primary" data-action="run-agent">Run</button>
            <button class="btn btn-default" data-action="cancel-agent" disabled>Cancel</button>
          </div>

          <div class="mmos-ai-status" data-role="status"></div>
        </div>

        <aside class="mmos-ai-history mmos-card">
          <div class="mmos-ai-history-head">
            <h4 class="mmos-ai-history-title">Recent runs</h4>
            <div class="mmos-ai-history-subtitle">Storico operativo delle ultime verifiche e analisi salvate.</div>
          </div>
          <div class="mmos-ai-history-toolbar">
            <div class="mmos-ai-history-filters" data-role="history-filters"></div>
            <input class="mmos-ai-search" data-role="history-search" type="text" placeholder="Cerca in prompt o final..." />
          </div>
          <div class="mmos-ai-history-list" data-role="history-list">
            <div class="mmos-ai-empty">Nessuna run disponibile.</div>
          </div>
        </aside>
      </div>
    </div>
  `)

  const $root = $(page.body)
  let historyItems = []
  let selectedRunId = ""
  let activeTopic = "all"
  let currentStream = null

  function truncate(text, limit = 88) {
    const value = String(text || "").trim()
    if (value.length <= limit) return value
    return `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}…`
  }

  function escape(text) {
    return frappe.utils.escape_html(String(text || ""))
  }

  function describeError(error) {
    if (!error) return "Errore sconosciuto"
    if (typeof error === "string") return error
    if (error.message) return String(error.message)
    if (error.responseJSON) return JSON.stringify(error.responseJSON, null, 2)
    if (error.responseText) return String(error.responseText)
    return JSON.stringify(error, null, 2)
  }

  function relativeTime(value) {
    if (!value) return ""
    const dt = new Date(String(value).replace(" ", "T") + (String(value).includes("T") ? "" : "Z"))
    const ms = dt.getTime()
    if (!Number.isFinite(ms)) return String(value)
    const delta = Date.now() - ms
    const seconds = Math.max(0, Math.floor(delta / 1000))
    if (seconds < 60) return `${seconds}s fa`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m fa`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h fa`
    const days = Math.floor(hours / 24)
    return `${days}d fa`
  }

  function historyTopics(items) {
    const topics = new Set(["all"])
    for (const item of items || []) {
      if (item && item.retrieval_topic) topics.add(String(item.retrieval_topic))
    }
    return Array.from(topics)
  }

  function filteredHistoryItems() {
    const query = String($root.find("[data-role='history-search']").val() || "").trim().toLowerCase()
    return historyItems.filter((item) => {
      if (activeTopic !== "all" && String(item.retrieval_topic || "") !== activeTopic) {
        return false
      }
      if (!query) return true
      const haystack = `${item.prompt || ""}\n${item.final || ""}`.toLowerCase()
      return haystack.includes(query)
    })
  }

  function renderHistoryFilters() {
    const $filters = $root.find("[data-role='history-filters']")
    const topics = historyTopics(historyItems)
    if (!topics.includes(activeTopic)) activeTopic = "all"
    $filters.html(topics.map((topic) => `
      <button class="mmos-ai-filter-chip ${topic === activeTopic ? "active" : ""}" data-action="history-filter" data-topic="${escape(topic)}">${escape(topic)}</button>
    `).join(""))
  }

  function renderContext(items) {
    if (!Array.isArray(items) || !items.length) {
      return `<div class="mmos-ai-empty">No context</div>`
    }
    return items.map((item) => `
      <div class="mmos-ai-context-item">
        <div class="mmos-ai-context-label">${escape(item.label || item.path || "context")}</div>
        <div class="mmos-ai-meta">${escape(item.path || "")} (${escape(item.source_type || "unknown")})${item.score != null ? ` · score ${escape(item.score)}` : ""}</div>
      </div>
    `).join("")
  }

  function renderActions(actions) {
    if (!Array.isArray(actions) || !actions.length) {
      return `<div class="mmos-ai-empty">No actions</div>`
    }
    return actions.map((item) => `
      <div class="mmos-ai-action-item">
        <div class="mmos-ai-action-head">
          <div class="mmos-ai-action-label">${escape(item.tool || "tool")}${item.container ? ` (${escape(item.container)})` : ""}</div>
          <div class="mmos-ai-badges">
            <span class="mmos-ai-badge ${escape(item.status || "running")}">${escape(item.status || "running")}</span>
            ${item.duration_ms != null ? `<span class="mmos-ai-meta">${escape(item.duration_ms)} ms</span>` : ""}
          </div>
        </div>
        <div class="mmos-ai-meta">${escape(item.summary || "")}</div>
        <details class="mmos-ai-output-wrap">
          <summary class="mmos-ai-output-toggle">Output tecnico</summary>
          <div class="mmos-ai-output">${escape(item.output || "")}</div>
        </details>
      </div>
    `).join("")
  }

  function renderPlanner(planner) {
    if (!planner || typeof planner !== "object") {
      return `<div class="mmos-ai-empty">Planner non disponibile.</div>`
    }
    const agents = Array.isArray(planner.selected_agents) ? planner.selected_agents : []
    return `
      <div class="mmos-ai-run-overview">
        <span class="mmos-ai-run-pill">Mode: ${escape(planner.mode || "multi_agent")}</span>
        <span class="mmos-ai-run-pill">Agents: ${escape(agents.join(", ") || "-")}</span>
      </div>
      <div>${escape(planner.thought || "")}</div>
    `
  }

  function deriveObjective(prompt, payload) {
    const value = String(prompt || payload?.prompt || "").trim()
    if (!value) {
      return "Valutare lo stato operativo corrente e restituire una decisione chiara."
    }
    return `Verificare: ${value}`
  }

  function deriveDecision(payload) {
    const shared = window.MMOSDecision && typeof window.MMOSDecision.deriveDecision === "function"
      ? window.MMOSDecision.deriveDecision(payload)
      : null
    if (shared) {
      return {
        state: shared.state,
        status: shared.esito,
        risk: shared.rischio,
        confidence: shared.confidenza,
        decision: shared.decisione,
        next: shared.prossimaAzione,
        cta: shared.cta || [],
      }
    }
    return {
      state: "safe",
      status: "Stabile",
      risk: "basso",
      confidence: "media",
      decision: "Non emerge un problema critico da questa run.",
      next: "Continuare monitoraggio o aprire debug solo per approfondimento.",
      cta: [],
    }
  }

  function renderDecisionActions(decision, payload) {
    const actions = Array.isArray(decision?.cta) ? decision.cta : []
    const buttons = []
    const runId = payload?.run_id || ""
    const prompt = payload?.prompt || ""
    if ((actions.includes("open_ai") || actions.includes("open_ai_optional")) && runId) {
      buttons.push(`<button class="mmos-btn-primary" data-action="open-run" data-run-id="${escape(runId)}">Apri analisi completa</button>`)
    }
    if (actions.includes("rerun") && prompt) {
      buttons.push(`<button class="btn btn-warning btn-xs" data-action="rerun-decision" data-prompt="${escape(prompt)}">Rilancia run</button>`)
    }
    if (!buttons.length) return ""
    return `<div class="mmos-ai-decision-actions">${buttons.join("")}</div>`
  }

  function renderDecision(payload) {
    const decision = deriveDecision(payload)
    if (decision && window.MMOSTelemetry && typeof window.MMOSTelemetry.send === "function") {
      window.MMOSTelemetry.send("decision_rendered", {
        state: decision.state,
        rischio: decision.risk,
        confidenza: decision.confidence,
        surface: "mmos_ai",
        run_id: payload?.run_id || "",
      })
    }
    return `
      <div class="mmos-ai-decision mmos-card">
        <div class="mmos-ai-decision-row">
          <span class="mmos-status mmos-status-${escape(decision.state)}">Esito: ${escape(decision.status)}</span>
          <span class="mmos-ai-run-pill">Rischio: ${escape(decision.risk)}</span>
          <span class="mmos-ai-run-pill">Confidenza: ${escape(decision.confidence || "media")}</span>
        </div>
        <div class="mmos-ai-decision-text"><strong>Decisione</strong>${escape(decision.decision)}</div>
        <div class="mmos-ai-decision-text"><strong>Prossima azione</strong>${escape(decision.next)}</div>
        ${renderDecisionActions(decision, payload)}
      </div>
    `
  }

  function renderAgentResults(agentResults) {
    if (!Array.isArray(agentResults) || !agentResults.length) {
      return `<div class="mmos-ai-empty">Nessun agente eseguito.</div>`
    }
    return agentResults.map((item) => `
      <div class="mmos-ai-section">
        <div class="mmos-ai-section-title">Agent: ${escape(item.agent || "agent")}</div>
        <div class="mmos-ai-meta">${escape(item.thought || "")}</div>
        <div class="mmos-ai-output-wrap">
          <strong>Final:</strong> ${escape(item.final || "")}
        </div>
        <div class="mmos-ai-output-wrap">
          ${renderActions(item.actions || [])}
        </div>
      </div>
    `).join("")
  }

  function renderHistory(items) {
    const $list = $root.find("[data-role='history-list']")
    historyItems = Array.isArray(items) ? items : []
    renderHistoryFilters()
    const visible = filteredHistoryItems()
    if (!visible.length) {
      $list.html(`<div class="mmos-ai-empty">Nessuna run disponibile.</div>`)
      return
    }
    $list.html(visible.map((item) => `
      <div class="mmos-ai-history-item ${selectedRunId === item.name ? "active" : ""}" data-action="open-run" data-run-id="${escape(item.name)}">
        <div class="mmos-ai-history-headline">
          <div class="mmos-ai-history-topic">
            <span class="mmos-ai-status-dot ${escape(item.status || "unknown")}"></span>
            <span>${escape(item.retrieval_topic || "run")}</span>
          </div>
          <div class="mmos-ai-history-stats">${item.duration_ms != null ? `${escape(item.duration_ms)}ms` : "-"} · ${escape(relativeTime(item.started_at))}</div>
        </div>
        <div class="mmos-ai-history-prompt">${escape(truncate(item.prompt || "Run"))}</div>
        <div class="mmos-ai-history-meta">${escape(item.status || "unknown")} · ${escape(item.started_at || "")}</div>
      </div>
    `).join(""))
  }

  function addCard(kind, html, key) {
    const $timeline = $root.find("[data-role='timeline']")
    if ($timeline.find(".mmos-ai-empty").length) {
      $timeline.empty()
    }
    const dataKey = key ? ` data-key="${escape(key)}"` : ""
    $timeline.append(`<div class="mmos-ai-card ${kind}"${dataKey}>${html}</div>`)
    const node = $timeline.get(0)
    if (node) {
      node.scrollTop = node.scrollHeight
    }
  }

  function renderUser(prompt) {
    addCard("user", `
      <div class="mmos-ai-label">User</div>
      <div>${escape(prompt)}</div>
    `)
  }

  function renderAgent(payload, key) {
    const html = `
      <div class="mmos-ai-label">Agent</div>
      <div class="mmos-ai-run-overview">
        ${payload.status ? `<span class="mmos-ai-run-pill">Status: ${escape(payload.status)}</span>` : ""}
        ${payload.final_status ? `<span class="mmos-ai-run-pill">Final: ${escape(payload.final_status)}</span>` : ""}
        ${payload.mode ? `<span class="mmos-ai-run-pill">Mode: ${escape(payload.mode)}</span>` : ""}
        ${payload.retrieval_topic ? `<span class="mmos-ai-run-pill">Topic: ${escape(payload.retrieval_topic)}</span>` : ""}
        ${payload.duration_ms != null ? `<span class="mmos-ai-run-pill">Execution: ${escape(payload.duration_ms)} ms</span>` : ""}
        ${payload.run_id ? `<span class="mmos-ai-run-pill">Run: ${escape(payload.run_id)}</span>` : ""}
      </div>
      <div class="mmos-ai-summary">
        <div class="mmos-ai-section mmos-ai-emphasis">
          <div class="mmos-ai-section-title">Objective</div>
          <div>${escape(deriveObjective(payload.prompt, payload))}</div>
        </div>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Outcome</div>
          <div>${escape(payload.final || "")}</div>
        </div>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Decision</div>
          ${renderDecision(payload)}
        </div>
      </div>
      <details class="mmos-ai-details">
        <summary>Execution details</summary>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Thought</div>
          <div>${escape(payload.thought || "")}</div>
        </div>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Context</div>
          ${renderContext(payload.context_used || [])}
        </div>
        ${payload.planner ? `
          <div class="mmos-ai-section">
            <div class="mmos-ai-section-title">Planner</div>
            ${renderPlanner(payload.planner)}
          </div>
        ` : ""}
        ${Array.isArray(payload.agent_results) && payload.agent_results.length ? `
          <div class="mmos-ai-section">
            <div class="mmos-ai-section-title">Agents</div>
            ${renderAgentResults(payload.agent_results)}
          </div>
        ` : ""}
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Actions</div>
          ${renderActions(payload.actions || [])}
        </div>
      </details>
    `
    if (key) {
      $root.find(`[data-key='${CSS.escape(key)}']`).replaceWith(`<div class="mmos-ai-card agent" data-key="${escape(key)}">${html}</div>`)
      return
    }
    addCard("agent", html)
  }

  function loadHistory() {
    frappe.call({
      method: "mmos_core.api.agent_runs_recent",
      args: { limit: 10 },
      callback: function (response) {
        renderHistory((response && response.message && response.message.items) || [])
      },
    })
  }

  function renderRunningCard(key, prompt) {
    addCard("agent", `
      <div class="mmos-ai-label">Agent</div>
      <div class="mmos-ai-run-overview">
        <span class="mmos-ai-run-pill">Status: running</span>
      </div>
      <div class="mmos-ai-summary">
        <div class="mmos-ai-section mmos-ai-emphasis">
          <div class="mmos-ai-section-title">Objective</div>
          <div>${escape(deriveObjective(prompt))}</div>
        </div>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Outcome</div>
          <div data-role="live-final">In attesa del risultato finale per: ${escape(prompt)}</div>
        </div>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Decision</div>
          <div data-role="live-decision" class="mmos-ai-empty">La decisione operativa sarà disponibile al termine della run.</div>
        </div>
      </div>
      <details class="mmos-ai-details" open>
        <summary>Execution details</summary>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Thought</div>
          <div data-role="live-thought">Analizzo la richiesta e preparo gli agenti specializzati.</div>
        </div>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Planner</div>
          <div data-role="live-meta"></div>
          <div data-role="live-planner" class="mmos-ai-empty">Planner in attesa...</div>
        </div>
        <div class="mmos-ai-section">
          <div class="mmos-ai-section-title">Agents</div>
          <div data-role="live-agents" class="mmos-ai-empty">Nessun agente avviato ancora.</div>
        </div>
      </details>
      <div class="mmos-ai-section">
        <div data-role="live-context" class="mmos-ai-empty" style="display:none;"></div>
      </div>
    `, key)
  }

  function setStatus(text) {
    $root.find("[data-role='status']").text(text || "")
  }

  function setCancelEnabled(enabled) {
    $root.find("[data-action='cancel-agent']").prop("disabled", !enabled)
  }

  function runAgent() {
    const $input = $root.find("[data-role='prompt']")
    const prompt = String($input.val() || "").trim()
    if (!prompt) return

    renderUser(prompt)
    $input.val("")
    setStatus("running...")
    const runKey = `agent-${Date.now()}`
    renderRunningCard(runKey, prompt)
    const params = new URLSearchParams({
      prompt,
      site: window.location.hostname,
      user: frappe.session && frappe.session.user ? frappe.session.user : "",
    })
    const controlBase = window.location.origin + "/control"
    const streamUrl = `${controlBase}/agent/run/stream?${params.toString()}`
    const eventSource = new EventSource(streamUrl)
    currentStream = {
      key: runKey,
      eventSource,
      runId: "",
      cancelled: false,
    }
    setCancelEnabled(true)
    const liveAgentSteps = {}
    let finalPayload = null
    let streamedRunId = ""

    eventSource.onmessage = function (event) {
      try {
        const message = JSON.parse(event.data || "{}")
        if (message.type === "meta") {
          streamedRunId = message.run_id || ""
          if (currentStream) currentStream.runId = streamedRunId
          if (streamedRunId) {
            const $card = $root.find(`[data-key='${CSS.escape(runKey)}']`)
            $card.find("[data-role='live-meta']").html(`
              <div class="mmos-ai-run-overview">
                <span class="mmos-ai-run-pill">Run: ${escape(streamedRunId)}</span>
              </div>
            `)
          }
          return
        }
        if (message.type === "thought") {
          updateLiveThought(runKey, message.value || "")
          return
        }
        if (message.type === "planner") {
          updatePlannerLive(runKey, message.data || {})
          return
        }
        if (message.type === "agent_start") {
          updateAgentStart(runKey, message.agent || "agent")
          return
        }
        if (message.type === "agent_step") {
          updateAgentStep(runKey, message.agent || "agent", liveAgentSteps, message.data || {})
          return
        }
        if (message.type === "agent_done") {
          updateAgentDone(runKey, message.agent || "agent", message.payload || {})
          return
        }
        if (message.type === "cancelled") {
          if (currentStream) currentStream.cancelled = true
          setStatus("cancelled")
          $root.find(`[data-key='${CSS.escape(runKey)}'] [data-role='live-final']`).text("Esecuzione annullata. Chiusura in corso...")
          return
        }
        if (message.type === "final") {
          finalPayload = message.payload || null
          eventSource.close()
          currentStream = null
          setCancelEnabled(false)
          if (!finalPayload) {
            setStatus("")
            renderAgent({
              thought: "Errore",
              context_used: [],
              actions: [],
              final: "Errore: payload finale vuoto",
            }, runKey)
            return
          }
          if (streamedRunId && !finalPayload.run_id) {
            finalPayload.run_id = streamedRunId
          }
          frappe.call({
            method: "mmos_core.api.agent_run_store",
            args: {
              prompt,
              payload_json: JSON.stringify(finalPayload),
            },
            callback: function (response) {
              setStatus("")
              const stored = response && response.message ? response.message : finalPayload
              selectedRunId = stored.run_id || ""
              renderAgent(stored, runKey)
              loadHistory()
            },
            error: function (error) {
              setStatus(describeError(error))
              renderAgent(finalPayload, runKey)
            },
          })
        }
      } catch (error) {
        setStatus(describeError(error))
      }
    }

    eventSource.onerror = function () {
      eventSource.close()
      const wasCancelled = currentStream && currentStream.cancelled
      currentStream = null
      setCancelEnabled(false)
      setStatus(wasCancelled ? "cancelled" : "stream error")
      if (wasCancelled) {
        return
      }
      renderAgent({
        thought: "Errore",
        context_used: [],
        actions: [],
        final: "Errore streaming live",
      }, runKey)
    }
  }

  function openRun(runId) {
    if (!runId) return
    setStatus("loading run...")
    frappe.call({
      method: "mmos_core.api.agent_run_get",
      args: { run_id: runId },
      callback: function (response) {
        setStatus("")
        const payload = response && response.message
        if (!payload) {
          setStatus("Run non trovata o scaduta")
          addCard("agent", `
            <div class="mmos-ai-label">Agent</div>
            <div class="mmos-ai-section">
              <div class="mmos-ai-section-title">Run</div>
              <div>Questa run non è più disponibile (cleanup / retention).</div>
            </div>
          `)
          return
        }
        selectedRunId = runId
        renderHistory(historyItems)
        renderUser(payload.prompt || runId)
        renderAgent(payload)
        const node = $root.find("[data-role='timeline']").get(0)
        if (node) node.scrollIntoView({ behavior: "smooth", block: "start" })
      },
      error: function (error) {
        setStatus(describeError(error))
      },
    })
  }

  function updateLiveThought(key, thought) {
    const $card = $root.find(`[data-key='${CSS.escape(key)}']`)
    $card.find("[data-role='live-thought']").text(thought || "")
  }

  function agentDomKey(agent) {
    return String(agent || "agent").replace(/[^a-zA-Z0-9_-]/g, "_")
  }

  function ensureAgentCard(runKey, agentName) {
    const $run = $root.find(`[data-key='${CSS.escape(runKey)}']`)
    const domKey = agentDomKey(agentName)
    let $agent = $run.find(`[data-agent-key='${domKey}']`)
    if ($agent.length) return $agent

    const $agents = $run.find("[data-role='live-agents']")
    if ($agents.hasClass("mmos-ai-empty")) {
      $agents.removeClass("mmos-ai-empty").empty()
    }
    $agents.append(`
      <div class="mmos-ai-section" data-agent-key="${domKey}">
        <div class="mmos-ai-section-title">Agent: ${escape(agentName)}</div>
        <div class="mmos-ai-meta" data-role="agent-thought">In attesa...</div>
        <div data-role="agent-steps">${renderActions([])}</div>
        <div class="mmos-ai-meta" data-role="agent-final"></div>
      </div>
    `)
    return $run.find(`[data-agent-key='${domKey}']`)
  }

  function updatePlannerLive(runKey, planner) {
    const $card = $root.find(`[data-key='${CSS.escape(runKey)}']`)
    $card.find("[data-role='live-planner']").removeClass("mmos-ai-empty").html(`
      <div class="mmos-ai-run-overview">
        <span class="mmos-ai-run-pill">Mode: ${escape(planner.mode || "multi_agent")}</span>
        <span class="mmos-ai-run-pill">Agents: ${escape(((planner.selected_agents || []).join(", ")) || "-")}</span>
      </div>
    `)
  }

  function updateAgentStart(runKey, agentName) {
    const $agent = ensureAgentCard(runKey, agentName)
    $agent.find("[data-role='agent-thought']").text(`Avvio ${agentName}...`)
  }

  function updateAgentStep(runKey, agentName, liveAgentSteps, step) {
    if (!liveAgentSteps[agentName]) liveAgentSteps[agentName] = []
    const unique = stepKey(step)
    const existingIndex = liveAgentSteps[agentName].findIndex((item) => stepKey(item) === unique)
    if (existingIndex >= 0) {
      liveAgentSteps[agentName][existingIndex] = { ...liveAgentSteps[agentName][existingIndex], ...step }
    } else {
      liveAgentSteps[agentName].push(step)
    }
    const $agent = ensureAgentCard(runKey, agentName)
    $agent.find("[data-role='agent-steps']").html(renderActions(liveAgentSteps[agentName]))
  }

  function updateAgentDone(runKey, agentName, payload) {
    const $agent = ensureAgentCard(runKey, agentName)
    $agent.find("[data-role='agent-thought']").text(payload && payload.thought ? payload.thought : "")
    $agent.find("[data-role='agent-final']").html(`
      <div class="mmos-ai-output-wrap">
        <strong>Final:</strong> ${escape((payload && payload.final) || "")}
      </div>
    `)
  }

  function stepKey(step) {
    return `${step.tool || "tool"}::${step.container || ""}`
  }

  $root.on("click", "[data-action='run-agent']", runAgent)
  $root.on("click", "[data-action='cancel-agent']", function () {
    if (!currentStream || !currentStream.runId) return
    setStatus("cancelling...")
    currentStream.cancelled = true
    frappe.call({
      method: "mmos_core.api.agent_run_cancel",
      args: { run_id: currentStream.runId },
      callback: function () {
        setStatus("cancelling...")
      },
      error: function (error) {
        setStatus(describeError(error))
      },
    })
  })
  $root.on("click", "[data-action='open-run']", function () {
    const runId = $(this).attr("data-run-id")
    const isDecisionCTA = $(this).closest(".mmos-ai-decision").length > 0
    if (window.MMOSTelemetry && typeof window.MMOSTelemetry.send === "function") {
      if (isDecisionCTA) {
        window.MMOSTelemetry.send("cta_clicked", {
          type: "open_ai",
          surface: "mmos_ai",
          run_id: runId || "",
        })
      } else {
        window.MMOSTelemetry.send("debug_opened_without_cta", {
          surface: "mmos_ai",
          run_id: runId || "",
        })
      }
    }
    openRun(runId)
  })
  $root.on("click", "[data-action='rerun-decision']", function () {
    const prompt = String($(this).attr("data-prompt") || "").trim()
    if (!prompt) return
    if (window.MMOSTelemetry && typeof window.MMOSTelemetry.send === "function") {
      window.MMOSTelemetry.send("rerun_clicked", {
        surface: "mmos_ai",
      })
    }
    $root.find("[data-role='prompt']").val(prompt)
    runAgent()
  })
  $root.on("click", "[data-action='history-filter']", function () {
    activeTopic = String($(this).attr("data-topic") || "all")
    renderHistory(historyItems)
  })
  $root.on("input", "[data-role='history-search']", function () {
    renderHistory(historyItems)
  })
  $root.on("keypress", "[data-role='prompt']", function (event) {
    if (event.which === 13) {
      event.preventDefault()
      runAgent()
    }
  })

  loadHistory()
  const initialRunId = new URLSearchParams(window.location.search).get("run_id")
  if (initialRunId) {
    openRun(initialRunId)
  }
}
