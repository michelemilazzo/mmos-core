frappe.pages["mmos-updates"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "MMOS Updates",
    single_column: true,
  })

  $(page.body).html(`
    <div class="mmos-console-shell mmos-resources-shell">
      <main class="mmos-console-chat mmos-resources-main">
        <header class="mmos-console-chat-head">
          <div>
            <div class="mmos-console-chat-kicker">Internal update stream</div>
            <h3>MMOS Updates</h3>
            <div class="mmos-console-chat-subtitle">Feed strutturato per operatori oggi, pronto per utenti, partner e investitori domani.</div>
          </div>
          <div class="mmos-console-chat-actions">
            <button class="btn btn-default btn-sm" data-action="open-console">Console</button>
            <button class="btn btn-default btn-sm" data-action="open-secrets">Secrets</button>
            <button class="btn btn-primary btn-sm" data-action="refresh">Aggiorna</button>
          </div>
        </header>

        <section class="mmos-console-overview">
          <div class="mmos-console-overview-card">
            <span>Total updates</span>
            <strong data-role="total-updates">0</strong>
            <small data-role="updates-detail">Nessun elemento caricato.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Done</span>
            <strong data-role="done-updates">0</strong>
            <small>Elementi completati e comunicabili.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Planned</span>
            <strong data-role="planned-updates">0</strong>
            <small>Elementi di roadmap o backlog.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>In progress</span>
            <strong data-role="progress-updates">0</strong>
            <small>Lavori attivi con impatto sul prodotto.</small>
          </div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Audience split</strong>
            <span>Riutilizzabile per area operatori, investitori e partner</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-filter="all">Tutto</button>
            <button class="btn btn-default btn-xs" data-filter="operators">Operatori</button>
            <button class="btn btn-default btn-xs" data-filter="investors">Investitori</button>
            <button class="btn btn-default btn-xs" data-filter="partners">Partner</button>
            <button class="btn btn-default btn-xs" data-status="done">Done</button>
            <button class="btn btn-default btn-xs" data-status="in_progress">In progress</button>
            <button class="btn btn-default btn-xs" data-status="planned">Planned</button>
          </div>
        </section>

        <section class="mmos-console-thread" data-role="updates-list"></section>
      </main>
    </div>
  `)

  const $root = $(page.body)
  let allUpdates = []
  let currentFilter = "all"
  let currentStatusFilter = "all"

  function unwrapUpdates(payload) {
    return payload?.result?.updates || payload?.updates || []
  }

  function filteredUpdates() {
    return allUpdates.filter((entry) => {
      const audience = Array.isArray(entry.audience) ? entry.audience : [entry.audience || "general"]
      const audienceMatch = currentFilter === "all" || audience.includes(currentFilter)
      const statusMatch = currentStatusFilter === "all" || entry.status === currentStatusFilter
      return audienceMatch && statusMatch
    })
  }

  function renderList() {
    const updates = filteredUpdates()
    const html = updates
      .map((entry) => {
        const status = String(entry.status || "unknown").toLowerCase()
        const audience = Array.isArray(entry.audience) ? entry.audience : [entry.audience || "general"]
        return `
          <article class="mmos-update-card mmos-update-${frappe.utils.escape_html(status)}">
            <div class="mmos-update-head">
              <div>
                <div class="mmos-update-meta">${frappe.utils.escape_html(audience.join(", "))} · ${frappe.utils.escape_html(entry.date || "-")}</div>
                <h4>${frappe.utils.escape_html(entry.title || "-")}</h4>
              </div>
              <span class="mmos-update-pill">${frappe.utils.escape_html(status)}</span>
            </div>
            <p>${frappe.utils.escape_html(entry.summary || "")}</p>
          </article>
        `
      })
      .join("")

    $root.find("[data-role='updates-list']").html(
      html || "<div class='mmos-console-empty'><h4>No updates.</h4><p>Nessun elemento per questo filtro.</p></div>"
    )
  }

  function renderSummary() {
    const done = allUpdates.filter((entry) => entry.status === "done").length
    const planned = allUpdates.filter((entry) => entry.status === "planned").length
    const progress = allUpdates.filter((entry) => entry.status === "in_progress").length
    $root.find("[data-role='total-updates']").text(String(allUpdates.length))
    $root.find("[data-role='done-updates']").text(String(done))
    $root.find("[data-role='planned-updates']").text(String(planned))
    $root.find("[data-role='progress-updates']").text(String(progress))
    $root.find("[data-role='updates-detail']").text(
      `${filteredUpdates().length} elementi visibili con audience ${currentFilter} e stato ${currentStatusFilter}`
    )
  }

  async function refresh() {
    const response = await frappe.call({ method: "mmos_core.api.system_updates" })
    allUpdates = unwrapUpdates(response.message)
    renderSummary()
    renderList()
  }

  $root.on("click", "[data-action='refresh']", () => {
    refresh()
  })

  $root.on("click", "[data-action='open-console']", () => {
    frappe.set_route("mmos-console")
  })

  $root.on("click", "[data-action='open-secrets']", () => {
    frappe.set_route("mmos-secrets")
  })

  $root.on("click", "[data-filter]", function () {
    currentFilter = $(this).data("filter")
    renderSummary()
    renderList()
  })

  $root.on("click", "[data-status]", function () {
    currentStatusFilter = $(this).data("status")
    renderSummary()
    renderList()
  })

  refresh()
}
