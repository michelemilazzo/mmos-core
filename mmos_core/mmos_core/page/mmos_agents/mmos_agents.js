frappe.pages["mmos-agents"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "MMOS Agents",
    single_column: true,
  })

  $(page.body).html(`
    <div class="mmos-console-shell mmos-resources-shell">
      <main class="mmos-console-chat mmos-resources-main">
        <header class="mmos-console-chat-head">
          <div>
            <div class="mmos-console-chat-kicker">Domain workflows</div>
            <h3>MMOS Agents</h3>
            <div class="mmos-console-chat-subtitle">Agenti dedicati ai processi standard già rotativi: monitor, quick check e comandi naturali con contesto di dominio.</div>
          </div>
          <div class="mmos-console-chat-actions">
            <button class="btn btn-default btn-sm" data-action="open-console">Console</button>
            <button class="btn btn-default btn-sm" data-action="open-resources">Resources</button>
            <button class="btn btn-default btn-sm" data-action="open-secrets">Secrets</button>
            <button class="btn btn-default btn-sm" data-action="rotate-all">Esegui rotazione</button>
            <button class="btn btn-primary btn-sm" data-action="refresh">Aggiorna</button>
          </div>
        </header>

        <section class="mmos-console-overview">
          <div class="mmos-console-overview-card">
            <span>Agents</span>
            <strong data-role="agent-count">0</strong>
            <small data-role="agent-summary">Registry agenti non caricato.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Active</span>
            <strong data-role="agent-active">0</strong>
            <small>Agenti attivi per lavoro operativo.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Rotating</span>
            <strong data-role="agent-rotating">0</strong>
            <small>Flussi standard già ricorrenti.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Registry</span>
            <strong data-role="agent-registry">-</strong>
            <small data-role="selected-agent">Seleziona un agente per lanciare un check.</small>
          </div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Rotation health</strong>
            <span>Stato dell’ultimo giro automatico e prossima esecuzione</span>
          </div>
          <div class="mmos-console-overview">
            <div class="mmos-console-overview-card">
              <span>Last rotation</span>
              <strong data-role="rotation-ok">0 / 0</strong>
              <small data-role="rotation-window">Nessun giro registrato.</small>
            </div>
            <div class="mmos-console-overview-card">
              <span>Failures</span>
              <strong data-role="rotation-failed">0</strong>
              <small data-role="rotation-summary">Nessun risultato disponibile.</small>
            </div>
            <div class="mmos-console-overview-card">
              <span>Next run</span>
              <strong data-role="rotation-next">-</strong>
              <small data-role="rotation-state">Timer non rilevato.</small>
            </div>
          </div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Agent router</strong>
            <span>Scrivi naturale oppure usa i quick check del dominio</span>
          </div>
          <div class="form-group">
            <label>Agent</label>
            <select class="form-control" data-role="agent-select"></select>
          </div>
          <div class="form-group">
            <label>Natural command</label>
            <textarea class="form-control" rows="4" data-role="agent-command" placeholder="Esempio: controlla se il NAS è stabile e se i backup stanno scrivendo davvero"></textarea>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-primary btn-sm" data-action="run-command">Esegui comando</button>
            <button class="btn btn-default btn-sm" data-action="run-status">Quick status</button>
          </div>
          <div class="mmos-console-muted" data-role="agent-status-banner">In attesa del primo refresh.</div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Filter</strong>
            <span>Trova rapidamente l’agente giusto per processo, tool o responsabilità</span>
          </div>
          <div class="form-group">
            <label>Cerca</label>
            <input class="form-control" data-role="agent-search" placeholder="infra, press, repo, secrets, erp, backup...">
          </div>
          <div data-role="agents-list"></div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Execution output</strong>
            <span>Risultato dell’ultimo check o comando instradato</span>
          </div>
          <pre class="mmos-console-output" data-role="agent-output">Nessuna esecuzione ancora.</pre>
        </section>
      </main>
    </div>
  `)

  const $root = $(page.body)
  let state = {
    registry: null,
    agents: [],
    selectedAgent: "",
    query: "",
  }

  function unwrap(payload) {
    if (payload && typeof payload === "object" && payload.result && typeof payload.result === "object") {
      return payload.result
    }
    return payload || {}
  }

  function escape(text) {
    return frappe.utils.escape_html(String(text || ""))
  }

  function pretty(payload) {
    return JSON.stringify(payload, null, 2)
  }

  function summaryText(agent) {
    return [
      agent.key,
      agent.title,
      agent.summary,
      ...(agent.responsibilities || []),
      ...(agent.tools || []),
      ...(agent.examples || []),
    ].join(" ").toLowerCase()
  }

  function visibleAgents() {
    const query = String(state.query || "").trim().toLowerCase()
    const items = state.agents || []
    if (!query) return items
    return items.filter((agent) => summaryText(agent).includes(query))
  }

  function setStatus(message, indicator) {
    const colorMap = {
      green: "#effaf3",
      orange: "#fff7e6",
      red: "#fff1f0",
      blue: "#eef6ff",
      gray: "#f7f7f7",
    }
    const borderMap = {
      green: "#9bd3ae",
      orange: "#f0c36d",
      red: "#e99a9a",
      blue: "#93bff5",
      gray: "#dddddd",
    }
    $root.find("[data-role='agent-status-banner']").text(message).css({
      background: colorMap[indicator] || colorMap.gray,
      border: `1px solid ${borderMap[indicator] || borderMap.gray}`,
      borderRadius: "10px",
      padding: "12px 14px",
    })
  }

  function renderSelect() {
    const options = (state.agents || [])
      .map((agent) => `<option value="${escape(agent.key)}">${escape(agent.title)} (${escape(agent.key)})</option>`)
      .join("")
    $root.find("[data-role='agent-select']").html(options)
    if (!state.selectedAgent && state.agents.length) {
      state.selectedAgent = state.agents[0].key
    }
    $root.find("[data-role='agent-select']").val(state.selectedAgent)
    const current = state.agents.find((agent) => agent.key === state.selectedAgent)
    $root.find("[data-role='selected-agent']").text(
      current ? `${current.title} · ${current.summary}` : "Seleziona un agente per lanciare un check."
    )
  }

  function renderSummary() {
    const payload = state.registry || {}
    $root.find("[data-role='agent-count']").text(String(payload.count || 0))
    $root.find("[data-role='agent-active']").text(String(payload.active || 0))
    $root.find("[data-role='agent-rotating']").text(String(payload.rotating || 0))
    $root.find("[data-role='agent-registry']").text(payload.registry || "-")
    $root.find("[data-role='agent-summary']").text(
      `${visibleAgents().length} agenti visibili su ${payload.count || 0} registrati`
    )

    const rotation = payload.last_rotation || {}
    const timer = payload.rotation_timer || {}
    const ok = Number(rotation.ok || 0)
    const count = Number(rotation.count || 0)
    const failed = Number(rotation.failed || 0)
    $root.find("[data-role='rotation-ok']").text(count ? `${ok} / ${count}` : "0 / 0")
    $root.find("[data-role='rotation-failed']").text(String(failed))
    $root.find("[data-role='rotation-window']").text(
      rotation.started_at ? `${rotation.started_at} -> ${rotation.completed_at || "-"}` : "Nessun giro registrato."
    )
    $root.find("[data-role='rotation-summary']").text(
      count ? `${ok} agenti riusciti, ${failed} falliti nell’ultimo giro` : "Nessun risultato disponibile."
    )
    $root.find("[data-role='rotation-next']").text(timer.next_elapse || "-")
    $root.find("[data-role='rotation-state']").text(
      timer.active_state ? `Timer ${timer.active_state} · last trigger ${timer.last_trigger || "-"}` : "Timer non rilevato."
    )
  }

  function renderAgents() {
    const html = visibleAgents()
      .map((agent) => {
        const lastRotation = agent.last_rotation_result || {}
        const health = String(agent.health || "unknown")
        const tasks = (agent.recent_tasks || []).slice(0, 3)
          .map((task) => `<div class="mmos-console-muted">${escape(task.timestamp)} · ${escape(task.summary)}</div>`)
          .join("")
        const updates = (agent.recent_updates || []).slice(0, 2)
          .map((update) => `<div class="mmos-console-muted">${escape(update.date || "-")} · ${escape(update.title || "")}</div>`)
          .join("")
        const quickActions = (agent.quick_actions || [])
          .map((item) => `<button class="btn btn-default btn-xs" data-action="quick-action" data-agent="${escape(agent.key)}" data-agent-action="${escape(item.action || "")}">${escape(item.label || item.action || "Run")}</button>`)
          .join("")
        const playbooks = (agent.playbooks || [])
          .map((item) => `<button class="btn btn-primary btn-xs" data-action="playbook" data-agent="${escape(agent.key)}" data-playbook="${escape(item.key || "")}">${escape(item.label || item.key || "Playbook")}</button>`)
          .join("")
        return `
          <article class="mmos-agent-card ${tasks ? "mmos-agent-has-tasks" : ""} mmos-agent-health-${escape(health)}">
            <div class="mmos-agent-head">
              <div>
                <div class="mmos-update-meta">${escape(agent.key)} · ${escape(agent.cadence || "adhoc")}</div>
                <h4>${escape(agent.title)}</h4>
              </div>
              <div class="mmos-agent-pill-stack">
                <span class="mmos-secret-pill mmos-agent-health-pill mmos-agent-health-${escape(health)}">${escape(health)}</span>
                <span class="mmos-update-pill">${escape(agent.status || "unknown")}</span>
              </div>
            </div>
            <p>${escape(agent.summary || "")}</p>
            <div class="mmos-secret-row-meta">
              <span><strong>Owner</strong> ${escape(agent.owner || "MMOS")}</span>
              <span><strong>Tools</strong> ${escape((agent.tools || []).join(", "))}</span>
            </div>
            <div class="mmos-secret-row-meta">
              <span><strong>Last run</strong> ${escape(agent.last_run_at || "-")}</span>
              <span><strong>Last mode</strong> ${escape(agent.last_mode || "-")}</span>
              <span><strong>Last summary</strong> ${escape(agent.last_summary || "-")}</span>
            </div>
            <div class="mmos-secret-row-meta">
              <span><strong>Last rotation action</strong> ${escape(lastRotation.action || "-")}</span>
              <span><strong>Last rotation result</strong> ${escape(lastRotation.summary || "-")}</span>
            </div>
            <div class="mmos-agent-block">
              <strong>Responsibilities</strong>
              <div class="mmos-console-muted">${escape((agent.responsibilities || []).join(" · "))}</div>
            </div>
            <div class="mmos-agent-block">
              <strong>Examples</strong>
              <div class="mmos-console-muted">${escape((agent.examples || []).join(" · "))}</div>
            </div>
            <div class="mmos-console-command-palette">${quickActions}</div>
            <div class="mmos-agent-block">
              <strong>Playbooks</strong>
              <div class="mmos-console-command-palette">${playbooks || "<span class='mmos-console-muted'>Nessun playbook.</span>"}</div>
            </div>
            <div class="mmos-agent-block">
              <strong>Recent tasks</strong>
              ${tasks || "<div class='mmos-console-muted'>Nessun task registrato ancora.</div>"}
            </div>
            <div class="mmos-agent-block">
              <strong>Recent updates</strong>
              ${updates || "<div class='mmos-console-muted'>Nessun update correlato trovato.</div>"}
            </div>
          </article>
        `
      })
      .join("")

    $root.find("[data-role='agents-list']").html(
      html || "<div class='mmos-console-empty'><h4>Nessun agente corrisponde ai filtri correnti.</h4></div>"
    )
  }

  async function refresh() {
    try {
      setStatus("Aggiornamento registry agenti in corso...", "blue")
      const response = await frappe.call({ method: "mmos_core.api.agents_status" })
      const payload = unwrap(response.message)
      state.registry = payload
      state.agents = payload.agents || []
      if (!state.selectedAgent && state.agents.length) {
        state.selectedAgent = state.agents[0].key
      }
      renderSelect()
      renderSummary()
      renderAgents()
      setStatus(`Registry agenti aggiornato. ${payload.active || 0} agenti attivi.`, "green")
    } catch (error) {
      setStatus(error?.message || "Refresh agenti fallito.", "red")
      frappe.msgprint(error?.message || "Refresh agenti fallito.")
    }
  }

  async function runAgent(agent, command, action) {
    try {
      const mode = String(command || "").trim() ? "command" : "status"
      setStatus(`Esecuzione ${mode} su ${agent} in corso...`, "blue")
      const response = await frappe.call({
        method: "mmos_core.api.run_agent",
        args: { agent, command: command || "", action: action || "" },
      })
      const payload = unwrap(response.message)
      $root.find("[data-role='agent-output']").text(pretty(payload))
      setStatus(`Agente ${agent} eseguito correttamente in modalità ${payload.mode || mode}.`, "green")
      await refresh()
    } catch (error) {
      setStatus(error?.message || `Esecuzione agente ${agent} fallita.`, "red")
      frappe.msgprint(error?.message || `Esecuzione agente ${agent} fallita.`)
    }
  }

  async function rotateAgents() {
    try {
      setStatus("Rotazione agenti in corso...", "blue")
      const response = await frappe.call({ method: "mmos_core.api.rotate_agents" })
      const payload = unwrap(response.message)
      $root.find("[data-role='agent-output']").text(pretty(payload))
      setStatus(`Rotazione completata. ${payload.ok || 0} OK, ${payload.failed || 0} failed.`, payload.failed ? "orange" : "green")
      await refresh()
    } catch (error) {
      setStatus(error?.message || "Rotazione agenti fallita.", "red")
      frappe.msgprint(error?.message || "Rotazione agenti fallita.")
    }
  }

  async function runPlaybook(agent, playbook) {
    try {
      setStatus(`Esecuzione playbook ${playbook} su ${agent} in corso...`, "blue")
      const response = await frappe.call({
        method: "mmos_core.api.run_agent_playbook",
        args: { agent, playbook },
      })
      const payload = unwrap(response.message)
      $root.find("[data-role='agent-output']").text(pretty(payload))
      setStatus(`Playbook ${playbook} eseguito correttamente su ${agent}.`, "green")
      await refresh()
    } catch (error) {
      setStatus(error?.message || `Playbook ${playbook} fallito.`, "red")
      frappe.msgprint(error?.message || `Playbook ${playbook} fallito.`)
    }
  }

  $root.on("click", "[data-action='refresh']", () => refresh())
  $root.on("click", "[data-action='rotate-all']", () => rotateAgents())
  $root.on("click", "[data-action='open-console']", () => frappe.set_route("mmos-console"))
  $root.on("click", "[data-action='open-resources']", () => frappe.set_route("mmos-resources"))
  $root.on("click", "[data-action='open-secrets']", () => frappe.set_route("mmos-secrets"))

  $root.on("change", "[data-role='agent-select']", function () {
    state.selectedAgent = String($(this).val() || "")
    renderSelect()
  })

  $root.on("input", "[data-role='agent-search']", function () {
    state.query = String($(this).val() || "")
    renderSummary()
    renderAgents()
  })

  $root.on("click", "[data-action='run-command']", () => {
    runAgent(state.selectedAgent, String($root.find("[data-role='agent-command']").val() || ""), "")
  })

  $root.on("click", "[data-action='run-status']", () => {
    runAgent(state.selectedAgent, "", "")
  })

  $root.on("click", "[data-action='quick-action']", function () {
    const agent = String($(this).data("agent") || "")
    const action = String($(this).data("agentAction") || "")
    state.selectedAgent = agent
    renderSelect()
    runAgent(agent, "", action)
  })

  $root.on("click", "[data-action='playbook']", function () {
    const agent = String($(this).data("agent") || "")
    const playbook = String($(this).data("playbook") || "")
    state.selectedAgent = agent
    renderSelect()
    runPlaybook(agent, playbook)
  })

  refresh()
}
