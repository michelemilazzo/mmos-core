frappe.pages["mmos-monitor"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "MMOS Monitor",
    single_column: true,
  })

  $(page.body).html(`
    <div class="mmos-console-shell mmos-resources-shell">
      <main class="mmos-console-chat mmos-resources-main">
        <header class="mmos-console-chat-head">
          <div>
            <div class="mmos-console-chat-kicker">Health, processes and errors</div>
            <h3>MMOS Monitor</h3>
            <div class="mmos-console-chat-subtitle">Vista dedicata per worker, processi, nodi, Docker fleet, storage ed errori reali.</div>
          </div>
          <div class="mmos-console-chat-actions">
            <button class="btn btn-default btn-sm" data-action="open-console">Console</button>
            <button class="btn btn-default btn-sm" data-action="open-resources">Resources</button>
            <button class="btn btn-primary btn-sm" data-action="refresh">Aggiorna</button>
          </div>
        </header>

        <section class="mmos-console-overview">
          <div class="mmos-console-overview-card">
            <span>Workers</span>
            <strong data-role="workers-summary">Loading</strong>
            <small data-role="workers-detail">Stato dei loop persistenti.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Servers</span>
            <strong data-role="servers-summary">Loading</strong>
            <small data-role="servers-detail">Nodi nel control plane.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Docker</span>
            <strong data-role="docker-summary">Loading</strong>
            <small data-role="docker-detail">Fleet e processi attivi.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Storage</span>
            <strong data-role="storage-summary">Loading</strong>
            <small data-role="storage-detail">Mount e nodo effettivo.</small>
          </div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Worker Status</strong>
            <span>Loop persistenti e ultimo giro</span>
          </div>
          <pre class="mmos-console-output" data-role="workers-json">Loading...</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Errors</strong>
            <span>Blocchi reali e issue note</span>
          </div>
          <div class="mmos-console-muted" data-role="errors-human">Controllo errori in corso.</div>
          <pre class="mmos-console-output" data-role="errors-json">Loading...</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Docker Fleet</strong>
            <span>Container e nodi gestiti</span>
          </div>
          <pre class="mmos-console-output" data-role="docker-json">Loading...</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Servers</strong>
            <span>Inventario server e ruoli</span>
          </div>
          <pre class="mmos-console-output" data-role="servers-json">Loading...</pre>
        </section>
      </main>
    </div>
  `)

  const $root = $(page.body)

  function pretty(payload) {
    return JSON.stringify(payload, null, 2)
  }

  async function run(method, args = {}) {
    const response = await frappe.call({ method, args })
    return response.message?.result || response.message
  }

  function renderErrors(errors) {
    const local = errors?.local || []
    const press = errors?.press || []
    const github = errors?.github || []
    const count = local.length + press.length + github.length
    $root.find("[data-role='errors-human']").text(
      count ? `${count} issue rilevate. Locali: ${local.length}, Press: ${press.length}, GitHub: ${github.length}.` : "Nessun errore rilevante."
    )
  }

  async function refresh() {
    const [workers, resources, errors] = await Promise.all([
      run("mmos_core.api.workers_status"),
      run("mmos_core.api.resources_overview"),
      run("mmos_core.api.errors_overview"),
    ])

    const docker = resources?.docker_fleet?.result || resources?.docker_fleet || {}
    const storage = resources?.storage?.result || resources?.storage || {}
    const servers = resources?.servers?.result || resources?.servers || []
    const workerMeta = workers?.workers || {}
    const workerSummary = workers?.summary || {}
    const lastRotation = workerMeta?.last_rotation || {}

    $root.find("[data-role='workers-summary']").text(`${lastRotation.ok || 0}/${lastRotation.count || workerMeta.rotating || 0} ok`)
    $root.find("[data-role='workers-detail']").text(`Ultimo refresh: ${workers?.generated_at || "-"}`)
    $root.find("[data-role='servers-summary']").text(String(workerSummary.servers || servers.length || 0))
    $root.find("[data-role='servers-detail']").text(`${workerSummary.sites || 0} siti Press rilevati`)
    $root.find("[data-role='docker-summary']").text(`${docker?.summary?.running_containers || 0}/${docker?.summary?.total_containers || 0}`)
    $root.find("[data-role='docker-detail']").text(`${docker?.summary?.docker_nodes || 0} nodi, ${docker?.summary?.issue_nodes || 0} con issue`)
    $root.find("[data-role='storage-summary']").text(storage?.mounted ? "Online" : "Offline")
    $root.find("[data-role='storage-detail']").text(`Nodo effettivo: ${storage?.effective_node || workerSummary.storage_node || "-"}`)

    $root.find("[data-role='workers-json']").text(pretty(workers))
    $root.find("[data-role='errors-json']").text(pretty(errors))
    $root.find("[data-role='docker-json']").text(pretty(docker))
    $root.find("[data-role='servers-json']").text(pretty(servers))
    renderErrors(errors)
  }

  $root.on("click", "[data-action='refresh']", refresh)
  $root.on("click", "[data-action='open-console']", () => frappe.set_route("mmos-console"))
  $root.on("click", "[data-action='open-resources']", () => frappe.set_route("mmos-resources"))

  refresh()
}
