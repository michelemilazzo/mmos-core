frappe.pages["mmos-resources"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "MMOS Resources",
    single_column: true,
  })

  $(page.body).html(`
    <div class="mmos-console-shell mmos-resources-shell">
      <main class="mmos-console-chat mmos-resources-main">
        <header class="mmos-console-chat-head">
          <div>
            <div class="mmos-console-chat-kicker">System inventory and storage state</div>
            <h3>MMOS Resources</h3>
            <div class="mmos-console-chat-subtitle">Vista unificata per server, provider, storage, backup e siti Press.</div>
          </div>
          <div class="mmos-console-chat-actions">
            <button class="btn btn-default btn-sm" data-action="open-console">Console</button>
            <button class="btn btn-default btn-sm" data-action="open-secrets">Secrets</button>
            <button class="btn btn-primary btn-sm" data-action="refresh">Aggiorna</button>
          </div>
        </header>

        <section class="mmos-console-overview">
          <div class="mmos-console-overview-card">
            <span>Storage</span>
            <strong data-role="storage-summary">Loading</strong>
            <small data-role="storage-detail">Controllo mount in corso.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Providers</span>
            <strong data-role="provider-summary">Loading</strong>
            <small data-role="provider-detail">Verifica prerequisiti remoti.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Git / Errori</span>
            <strong data-role="repo-summary">Loading</strong>
            <small data-role="repo-detail">Repo e problemi aperti.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Press</span>
            <strong data-role="press-summary">Loading</strong>
            <small data-role="press-detail">Inventario siti applicativi.</small>
          </div>
        </section>

        <section class="mmos-console-overview">
          <div class="mmos-console-overview-card">
            <span>GitHub</span>
            <strong data-role="github-summary">Loading</strong>
            <small data-role="github-detail">Token e integrazione repo.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Known Issues</span>
            <strong data-role="issue-summary">Loading</strong>
            <small data-role="issue-detail">Errori applicativi e infrastrutturali.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Backups</span>
            <strong data-role="backup-summary">Loading</strong>
            <small data-role="backup-detail">Job disponibili e storage attivo.</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Dev Site</span>
            <strong data-role="devsite-summary">Loading</strong>
            <small data-role="devsite-detail">Stato ambiente test.</small>
          </div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Storage</strong>
            <span>Mount effettivo e nodi remoti</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-action="copy-section" data-section="storage-json">Copia storage</button>
            <button class="btn btn-default btn-xs" data-action="copy-section" data-section="backups-json">Copia backup</button>
            <button class="btn btn-default btn-xs" data-action="bootstrap-storage">Prepara NAS</button>
          </div>
          <pre class="mmos-console-output" data-role="storage-json">Loading...</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Servers</strong>
            <span>Inventario completo nodi gestiti</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-action="scan-ports" data-target="ai-mmos-core">Scan AI</button>
            <button class="btn btn-default btn-xs" data-action="scan-ports" data-target="wireguard">Scan WireGuard</button>
            <button class="btn btn-default btn-xs" data-action="scan-ports" data-target="press">Scan Press</button>
          </div>
          <pre class="mmos-console-output" data-role="servers-json">Loading...</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Port Scan</strong>
            <span>Porte usate/libere prima di deploy o nuovi servizi</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-action="port-policy">Mostra policy</button>
            <button class="btn btn-default btn-xs" data-action="port-preflight" data-target="wireguard" data-service="gitea-http">Preflight Gitea</button>
            <button class="btn btn-default btn-xs" data-action="port-preflight" data-target="wireguard" data-service="minio-api">Preflight S3 API</button>
            <button class="btn btn-default btn-xs" data-action="port-preflight" data-target="wireguard" data-service="minio-console">Preflight S3 Console</button>
          </div>
          <div class="mmos-console-muted" data-role="port-human">La policy porte e il preflight appariranno qui.</div>
          <pre class="mmos-console-output" data-role="ports-json">Usa i pulsanti Scan per verificare un nodo.</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Repos & Errors</strong>
            <span>Git status locale/remoto ed errori noti</span>
          </div>
          <div class="mmos-console-muted" data-role="repo-human">Sto preparando il riepilogo.</div>
          <div class="mmos-console-muted" data-role="github-human">Sto preparando il riepilogo GitHub.</div>
          <div data-role="press-apps-list"></div>
          <div data-role="github-repos-list"></div>
          <div data-role="github-issues-list"></div>
          <pre class="mmos-console-output" data-role="repos-json">Loading...</pre>
          <pre class="mmos-console-output" data-role="errors-json">Loading...</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Docker Fleet</strong>
            <span>Container state across all managed servers</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-action="copy-section" data-section="docker-json">Copia docker fleet</button>
          </div>
          <pre class="mmos-console-output" data-role="docker-json">Loading...</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Backups</strong>
            <span>Job configurati e target</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-action="run-backup" data-target="ai-mmos-core">Backup Core</button>
            <button class="btn btn-default btn-xs" data-action="run-backup" data-target="wireguard">Backup WireGuard</button>
            <button class="btn btn-default btn-xs" data-action="run-backup" data-target="press">Backup Press</button>
          </div>
          <pre class="mmos-console-output" data-role="backups-json">Loading...</pre>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Press Sites</strong>
            <span>Siti e app installate</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-action="inspect-devsite">Monitora devsite</button>
          </div>
          <div class="mmos-console-muted" data-role="press-paths-human">Percorsi e servizi Press in caricamento.</div>
          <div data-role="press-paths-list"></div>
          <pre class="mmos-console-output" data-role="press-json">Loading...</pre>
        </section>
      </main>
    </div>
  `)

  const $root = $(page.body)

  function pretty(payload) {
    return JSON.stringify(payload, null, 2)
  }

  function humanPortPolicy(payload) {
    const result = payload?.result || payload || {}
    const lines = []
    Object.entries(result).forEach(([node, services]) => {
      lines.push(`${node}`)
      Object.entries(services || {}).forEach(([service, config]) => {
        const ports = (config?.ports || []).join(", ") || "-"
        const domains = (config?.domains || []).join(", ") || "-"
        const forbidden = (config?.forbidden_ports || []).join(", ")
        lines.push(`  ${service}: prefer ${ports} | domains ${domains}${forbidden ? ` | avoid ${forbidden}` : ""}`)
      })
    })
    return lines.join("\n") || "Nessuna policy caricata."
  }

  function humanPreflight(payload) {
    const result = payload?.result || payload || {}
    const checked = (result?.checked_ports || []).join(", ") || "-"
    const used = Object.entries(result?.used || {})
      .map(([port, info]) => `${port}:${info}`)
      .join(", ") || "none"
    const preferred = (result?.preferred_ports || []).join(", ") || "-"
    const service = result?.service || "-"
    const node = result?.server || "-"
    return `Node: ${node} | Service: ${service} | Preferred: ${preferred} | Checked: ${checked} | Used: ${used} | Ready: ${result?.ready ? "yes" : "no"}`
  }

  function humanRepoSummary(repos, errors, providers) {
    const localRepos = repos?.local?.repos || []
    const pressRepos = repos?.press?.repos || []
    const githubRepos = repos?.github?.repos || []
    const localIssues = errors?.local || []
    const pressIssues = errors?.press || []
    const githubIssues = errors?.github || []
    const dirty = [...localRepos, ...pressRepos].filter((repo) => repo.dirty)
    const githubOk = providers?.github?.ok
    const lines = [
      `GitHub: ${githubOk ? "connesso" : "non configurato"}`,
      `Repo locali: ${localRepos.length}`,
      `Repo press: ${pressRepos.length}`,
      `Repo GitHub: ${githubRepos.length}`,
      `Repo dirty: ${dirty.length}`,
      `Errori locali: ${localIssues.length}`,
      `Errori press: ${pressIssues.length}`,
      `Issue GitHub: ${githubIssues.length}`,
    ]
    return lines.join(" | ")
  }

  function renderGithubRepos(repos) {
    const items = (repos || []).slice(0, 8)
    if (!items.length) {
      return "<div class='mmos-console-muted'>Nessun repo GitHub disponibile.</div>"
    }
    return items
      .map(
        (repo) => `
          <article class="mmos-console-message mmos-console-message-system">
            <div class="mmos-console-message-avatar">GH</div>
            <div class="mmos-console-message-body">
              <div class="mmos-console-message-title">${frappe.utils.escape_html(repo.full_name || repo.name || "-")}</div>
              <pre>${frappe.utils.escape_html(JSON.stringify({
                private: repo.private,
                default_branch: repo.default_branch,
                updated_at: repo.updated_at,
                html_url: repo.html_url,
              }, null, 2))}</pre>
            </div>
          </article>
        `
      )
      .join("")
  }

  function renderGithubIssues(issues) {
    const items = (issues || []).slice(0, 8)
    if (!items.length) {
      return "<div class='mmos-console-muted'>Nessuna issue o PR GitHub aperta.</div>"
    }
    return items
      .map(
        (issue) => `
          <article class="mmos-console-message mmos-console-message-system">
            <div class="mmos-console-message-avatar">${issue.pull_request ? "PR" : "IS"}</div>
            <div class="mmos-console-message-body">
              <div class="mmos-console-message-title">${frappe.utils.escape_html(issue.repository || "-")} #${frappe.utils.escape_html(String(issue.number || "-"))}</div>
              <pre>${frappe.utils.escape_html(JSON.stringify({
                title: issue.title,
                state: issue.state,
                updated_at: issue.updated_at,
                html_url: issue.html_url,
              }, null, 2))}</pre>
            </div>
          </article>
        `
      )
      .join("")
  }

  function renderPressApps(repos) {
    const items = (repos || []).slice().sort((a, b) => String(a.name || a.path || "").localeCompare(String(b.name || b.path || "")))
    if (!items.length) {
      return "<div class='mmos-console-muted'>Nessuna app Press rilevata.</div>"
    }
    return items
      .map(
        (repo) => `
          <article class="mmos-console-message mmos-console-message-system">
            <div class="mmos-console-message-avatar">APP</div>
            <div class="mmos-console-message-body">
              <div class="mmos-console-message-title">${frappe.utils.escape_html(repo.name || repo.path || "-")}</div>
              <pre>${frappe.utils.escape_html(JSON.stringify({
                branch: repo.branch,
                commit: repo.commit,
                dirty: repo.dirty,
                changes: repo.changes,
                origin: repo.origin || "no-origin",
                path: repo.path,
              }, null, 2))}</pre>
            </div>
          </article>
        `
      )
      .join("")
  }

  function renderPressPaths(inventory) {
    const result = inventory?.result || inventory || {}
    const repoFiles = result?.repo_files || {}
    const containersRaw = String(result?.containers?.stdout || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 12)
    const sitesEnabled = String(result?.sites_enabled?.stdout || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    const certs = String(result?.certificates?.stdout || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

    const cards = [
      {
        title: "Codebase Press",
        payload: {
          pyproject: repoFiles?.pyproject?.stdout || "missing",
          common_site_config: repoFiles?.common_site_config?.stdout || "missing",
        },
      },
      {
        title: "Nginx vhost",
        payload: {
          path: "/etc/nginx/sites-enabled",
          files: sitesEnabled,
        },
      },
      {
        title: "Let's Encrypt",
        payload: {
          path: "/etc/letsencrypt/live",
          certificates: certs,
        },
      },
      {
        title: "Containers attivi",
        payload: {
          note: "docker ps su press",
          services: containersRaw,
        },
      },
    ]

    return cards
      .map(
        (card) => `
          <article class="mmos-console-message mmos-console-message-system">
            <div class="mmos-console-message-avatar">PR</div>
            <div class="mmos-console-message-body">
              <div class="mmos-console-message-title">${frappe.utils.escape_html(card.title)}</div>
              <pre>${frappe.utils.escape_html(JSON.stringify(card.payload, null, 2))}</pre>
            </div>
          </article>
        `
      )
      .join("")
  }

  function render(data, pressInventory = {}) {
    const servers = data?.servers?.result || []
    const providers = data?.providers?.result || {}
    const repos = data?.repos?.result || {}
    const errors = data?.errors?.result || {}
    const storage = data?.storage?.result || {}
    const dockerFleet = data?.docker_fleet?.result || {}
    const backupJobs = data?.backup_jobs?.result || []
    const pressSites = data?.press_sites?.result?.sites || []

    $root.find("[data-role='storage-summary']").text(storage?.mounted ? "Mounted" : "Offline")
    $root.find("[data-role='storage-detail']").text(
      storage?.mounted
        ? `Nodo attivo: ${storage?.effective_node || storage?.hostname || "-"}`
        : "Storage non ancora operativo."
    )
    $root.find("[data-role='provider-summary']").text(
      [providers?.hetzner?.configured ? "Hetzner" : null, providers?.cloudflare?.ok ? "Cloudflare" : null]
        .filter(Boolean)
        .join(" + ") || "Check"
    )
    $root.find("[data-role='provider-detail']").text(
      `Hetzner: ${providers?.hetzner?.configured ? "OK" : "Check"} | Cloudflare: ${providers?.cloudflare?.ok ? "OK" : "Check"} | GitHub: ${providers?.github?.ok ? "OK" : "Off"}`
    )
    const dockerSummary = dockerFleet?.summary || {}
    const repoCount = (repos?.local?.repos?.length || 0) + (repos?.press?.repos?.length || 0) + (repos?.github?.repos?.length || 0)
    const errorCount = (errors?.local?.length || 0) + (errors?.press?.length || 0) + (errors?.github?.length || 0)
    $root.find("[data-role='repo-summary']").text(`${repoCount} repo / ${errorCount} issue`)
    $root.find("[data-role='repo-detail']").text(
      `${dockerSummary?.docker_nodes || 0} nodi Docker, ${dockerSummary?.running_containers || 0} container up`
    )
    $root.find("[data-role='github-summary']").text(providers?.github?.ok ? "Connected" : "Missing token")
    $root.find("[data-role='github-detail']").text(
      providers?.github?.ok
        ? `Utente: ${providers?.github?.login || "GitHub API pronta"}`
        : "Aggiungi github_token in MMOS Secrets per repo, issue e mirror."
    )
    $root.find("[data-role='issue-summary']").text(`${errorCount} issue`)
    $root.find("[data-role='issue-detail']").text(
      errorCount ? "Ci sono errori da verificare tra control plane e press." : "Nessun errore noto rilevante."
    )
    $root.find("[data-role='backup-summary']").text(`${backupJobs.length} job`)
    $root.find("[data-role='backup-detail']").text(
      storage?.mounted ? `Storage attivo su ${storage?.effective_node || "-"}` : "Storage non montato"
    )
    const devsite = pressSites.find((site) => String(site.name || "").includes("devsite.onekeyco.com"))
    $root.find("[data-role='devsite-summary']").text(devsite ? (devsite.status || "Present") : "Not found")
    $root.find("[data-role='devsite-detail']").text(devsite ? (devsite.apps || []).join(", ") || "Sito presente" : "Il sito dev non è nell'inventario DB corrente.")
    $root.find("[data-role='press-summary']").text(`${pressSites.length} siti`)
    $root.find("[data-role='press-detail']").text(`${servers.length} server, ${backupJobs.length} job backup`)

    $root.find("[data-role='storage-json']").text(pretty(storage))
    $root.find("[data-role='servers-json']").text(pretty(servers))
    $root.find("[data-role='repo-human']").text(humanRepoSummary(repos, errors, providers))
    $root.find("[data-role='github-human']").text(
      providers?.github?.ok
        ? `GitHub ${providers.github.login || ""}: ${(repos?.github?.repos || []).length} repo recenti, ${(errors?.github || []).length} issue aperte.`
        : "GitHub non configurato."
    )
    $root.find("[data-role='press-apps-list']").html(renderPressApps(repos?.press?.repos || []))
    $root.find("[data-role='github-repos-list']").html(renderGithubRepos(repos?.github?.repos || []))
    $root.find("[data-role='github-issues-list']").html(renderGithubIssues(errors?.github || []))
    $root.find("[data-role='repos-json']").text(pretty(repos))
    $root.find("[data-role='errors-json']").text(pretty(errors))
    $root.find("[data-role='docker-json']").text(pretty(dockerFleet))
    $root.find("[data-role='backups-json']").text(pretty(backupJobs))
    $root.find("[data-role='press-json']").text(pretty(data?.press_sites?.result || {}))
    $root.find("[data-role='press-paths-human']").text(
      pressInventory?.result?.repo_files?.pyproject?.stdout
        ? `Press vive in ${pressInventory.result.repo_files.pyproject.stdout} con config principale in ${pressInventory.result.repo_files.common_site_config?.stdout || "-"}.`
        : "Percorsi Press non disponibili."
    )
    $root.find("[data-role='press-paths-list']").html(renderPressPaths(pressInventory))
  }

  async function refresh() {
    const [overviewResponse, pressInventoryResponse] = await Promise.all([
      frappe.call({ method: "mmos_core.api.resources_overview" }),
      frappe.call({ method: "mmos_core.api.press_inventory" }),
    ])
    render(overviewResponse.message, pressInventoryResponse.message)
  }

  async function runBackup(target) {
    const response = await frappe.call({ method: "mmos_core.api.run_backup", args: { target } })
    frappe.show_alert({ message: `Backup ${target} avviato`, indicator: "green" })
    $root.find("[data-role='backups-json']").text(pretty(response.message))
  }

  async function bootstrapStorage() {
    const response = await frappe.call({ method: "mmos_core.api.storage_bootstrap" })
    frappe.show_alert({ message: "Layout NAS preparato", indicator: "green" })
    $root.find("[data-role='storage-json']").text(pretty(response.message))
  }

  async function inspectDevsite() {
    const response = await frappe.call({
      method: "mmos_core.api.ai_command",
      args: { prompt: "show press inventory and highlight devsite.onekeyco.com provisioning status" },
    })
    $root.find("[data-role='press-json']").text(pretty(response.message))
  }

  async function scanPorts(target) {
    const response = await frappe.call({
      method: "mmos_core.api.port_scan",
      args: { name: target },
    })
    $root.find("[data-role='port-human']").text(`Port scan completata su ${target}.`)
    $root.find("[data-role='ports-json']").text(pretty(response.message))
    frappe.show_alert({ message: `Port scan completata su ${target}`, indicator: "green" })
  }

  async function showPortPolicy() {
    const response = await frappe.call({ method: "mmos_core.api.port_policy" })
    $root.find("[data-role='port-human']").text(humanPortPolicy(response.message))
    $root.find("[data-role='ports-json']").text(pretty(response.message))
    frappe.show_alert({ message: "Policy porte aggiornata", indicator: "blue" })
  }

  async function runPortPreflight(target, service) {
    const response = await frappe.call({
      method: "mmos_core.api.port_preflight",
      args: { name: target, service },
    })
    $root.find("[data-role='port-human']").text(humanPreflight(response.message))
    $root.find("[data-role='ports-json']").text(pretty(response.message))
    frappe.show_alert({ message: `Preflight ${service} su ${target}`, indicator: response.message?.result?.ready ? "green" : "orange" })
  }

  $root.on("click", "[data-action='refresh']", () => {
    refresh()
  })

  $root.on("click", "[data-action='run-backup']", function () {
    runBackup($(this).data("target"))
  })

  $root.on("click", "[data-action='bootstrap-storage']", () => {
    bootstrapStorage()
  })

  $root.on("click", "[data-action='scan-ports']", function () {
    scanPorts($(this).data("target"))
  })

  $root.on("click", "[data-action='port-policy']", () => {
    showPortPolicy()
  })

  $root.on("click", "[data-action='port-preflight']", function () {
    runPortPreflight($(this).data("target"), $(this).data("service"))
  })

  $root.on("click", "[data-action='inspect-devsite']", () => {
    inspectDevsite()
  })

  $root.on("click", "[data-action='copy-section']", function () {
    const role = $(this).data("section")
    const text = $root.find(`[data-role='${role}']`).text()
    navigator.clipboard.writeText(text)
    frappe.show_alert({ message: "Copiato negli appunti", indicator: "blue" })
  })

  $root.on("click", "[data-action='open-console']", () => {
    frappe.set_route("mmos-console")
  })

  $root.on("click", "[data-action='open-secrets']", () => {
    frappe.set_route("mmos-secrets")
  })

  refresh()
  showPortPolicy()
}
