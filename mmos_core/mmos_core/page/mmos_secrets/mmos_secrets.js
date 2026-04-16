frappe.pages["mmos-secrets"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "MMOS Secrets",
    single_column: true,
  })

  $(page.body).html(`
    <div class="mmos-console-shell mmos-resources-shell">
      <main class="mmos-console-chat mmos-resources-main">
        <header class="mmos-console-chat-head">
          <div>
            <div class="mmos-console-chat-kicker">Central secret registry</div>
            <h3>MMOS Secrets</h3>
            <div class="mmos-console-chat-subtitle">Vista operativa per token, credenziali tecniche e target di distribuzione.</div>
          </div>
          <div class="mmos-console-chat-actions">
            <button class="btn btn-default btn-sm" data-action="open-console">Console</button>
            <button class="btn btn-default btn-sm" data-action="open-resources">Resources</button>
            <button class="btn btn-default btn-sm" data-action="import-secrets" data-node="press">Importa Press</button>
            <button class="btn btn-default btn-sm" data-action="import-secrets" data-node="wireguard">Importa WireGuard</button>
            <button class="btn btn-default btn-sm" data-action="import-secrets" data-node="mailmx.onekeyco.com">Importa Mail</button>
            <button class="btn btn-primary btn-sm" data-action="refresh">Aggiorna</button>
          </div>
        </header>

        <section class="mmos-console-overview">
          <div class="mmos-console-overview-card">
            <span>Secrets</span>
            <strong data-role="secret-total">0</strong>
            <small data-role="secret-configured">0 configured</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Registry</span>
            <strong data-role="registry-path">-</strong>
            <small data-role="secret-root">-</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Visible</span>
            <strong data-role="visible-count">0</strong>
            <small data-role="visible-summary">Nessun secret visibile</small>
          </div>
          <div class="mmos-console-overview-card">
            <span>Categories</span>
            <strong data-role="category-count">0</strong>
            <small data-role="category-summary">Nessuna categoria</small>
          </div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Stato operativo</strong>
            <span>Feedback per refresh, import e salvataggio</span>
          </div>
          <div class="mmos-console-muted" data-role="status-banner">Caricamento registry in corso...</div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Create or rotate</strong>
            <span>Scrive un file con permessi 600 e aggiorna il registry</span>
          </div>
          <div class="form-group">
            <label>Key</label>
            <input class="form-control" data-role="secret-key" placeholder="github_token">
          </div>
          <div class="form-group">
            <label>Path override (optional)</label>
            <input class="form-control" data-role="secret-path" placeholder="/root/.secrets/custom_secret">
          </div>
          <div class="form-group">
            <label>Value</label>
            <textarea class="form-control" rows="4" data-role="secret-value" placeholder="Paste the secret value here"></textarea>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-primary btn-sm" data-action="save-secret">Salva secret</button>
          </div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Mail channel</strong>
            <span>Configurazione minima per collegare inbox IMAP e reply SMTP senza ricordare le chiavi a mano</span>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label>IMAP host</label>
                <input class="form-control" data-role="mail-imap-host" placeholder="imap.example.com">
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group">
                <label>IMAP port</label>
                <input class="form-control" data-role="mail-imap-port" placeholder="993">
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group">
                <label>SSL</label>
                <select class="form-control" data-role="mail-imap-ssl">
                  <option value="true" selected>true</option>
                  <option value="false">false</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label>Username</label>
                <input class="form-control" data-role="mail-username" placeholder="ops@example.com">
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label>Password / App password</label>
                <input type="password" class="form-control" data-role="mail-password" placeholder="Enter mail password">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label>SMTP host (optional)</label>
                <input class="form-control" data-role="mail-smtp-host" placeholder="smtp.example.com">
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group">
                <label>SMTP port</label>
                <input class="form-control" data-role="mail-smtp-port" placeholder="465">
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group">
                <label>Reply from</label>
                <input class="form-control" data-role="mail-reply-from" placeholder="ops@example.com">
              </div>
            </div>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-primary btn-sm" data-action="save-mail-config">Salva config mail</button>
          </div>
          <div class="mmos-console-muted" data-role="mail-config-summary">Compila host, username e password per attivare il canale mail.</div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Tracked secrets</strong>
            <span>Vista leggibile del registry centrale</span>
          </div>
          <div class="form-group">
            <label>Cerca</label>
            <input class="form-control" data-role="secret-search" placeholder="Filtra per key, path, categoria, nodo o target">
          </div>
          <div class="mmos-console-command-palette" data-role="filter-buttons">
            <button class="btn btn-primary btn-xs" data-filter="all">Tutti</button>
            <button class="btn btn-default btn-xs" data-filter="press">Press</button>
            <button class="btn btn-default btn-xs" data-filter="wireguard">WireGuard</button>
            <button class="btn btn-default btn-xs" data-filter="mail">Mail</button>
            <button class="btn btn-default btn-xs" data-filter="dns">DNS</button>
            <button class="btn btn-default btn-xs" data-filter="git">Git</button>
            <button class="btn btn-default btn-xs" data-action="clear-filters">Reset</button>
          </div>
          <div class="mmos-console-muted" data-role="filter-summary">Nessun filtro attivo.</div>
          <div data-role="secret-list"></div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Access inventory</strong>
            <span>Utenti, URL e credenziali operative note nel sistema</span>
          </div>
          <div class="mmos-console-muted" data-role="access-summary">Inventario accessi in caricamento...</div>
          <div data-role="access-list"></div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Secrets in chiaro</strong>
            <span>Vista ordinata dei valori reali per amministrazione operativa e troubleshooting</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-action="reveal-all-secrets">Mostra tutti i secret</button>
          </div>
          <div class="mmos-console-muted" data-role="cleartext-summary">Valori non ancora caricati.</div>
          <div data-role="cleartext-list"></div>
        </section>

        <section class="mmos-console-output-panel">
          <div class="mmos-console-output-head">
            <strong>Raw registry</strong>
            <span>Metadata only. Values are never displayed.</span>
          </div>
          <div class="mmos-console-command-palette">
            <button class="btn btn-default btn-xs" data-action="toggle-raw">Mostra raw registry</button>
          </div>
          <pre class="mmos-console-output" data-role="secrets-json" style="display:none;">Loading...</pre>
        </section>
      </main>
    </div>
  `)

  const $root = $(page.body)
  let currentEntries = []
  let currentAccessInventory = []
  let currentFilter = "all"
  let currentQuery = ""
  let currentMessage = null
  let currentClearSecrets = []
  let rawVisible = false
  let busyState = null
  let currentMailConfig = {}

  function pretty(payload) {
    return JSON.stringify(payload, null, 2)
  }

  function unwrap(payload) {
    if (payload && typeof payload === "object" && payload.result && typeof payload.result === "object") {
      return payload.result
    }
    return payload || {}
  }

  function looksLikeSecretValue(text) {
    const value = String(text || "").trim()
    if (!value) return false
    return /^(gh[pousr]_|sk-|AIza|AKIA|eyJ|-----BEGIN|mmos-|FhOff)/.test(value) || value.length > 32
  }

  function validSecretKey(text) {
    const value = String(text || "").trim()
    return /^[a-z][a-z0-9_\\-]{1,199}$/.test(value)
  }

  function escape(text) {
    return frappe.utils.escape_html(String(text || "-"))
  }

  function summarizeEntry(entry) {
    return [
      entry.key,
      entry.category,
      entry.path,
      entry.source_node,
      (entry.distribute_to || []).join(" "),
      entry.description,
    ]
      .join(" ")
      .toLowerCase()
  }

  function summarizeClearSecret(entry) {
    return [
      entry.key,
      entry.category,
      entry.path,
      entry.source_node,
      entry.description,
      entry.value,
    ]
      .join(" ")
      .toLowerCase()
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
    $root.find("[data-role='status-banner']").text(message).css({
      background: colorMap[indicator] || colorMap.gray,
      border: `1px solid ${borderMap[indicator] || borderMap.gray}`,
      borderRadius: "10px",
      padding: "12px 14px",
    })
  }

  function setBusy(action, enabled) {
    busyState = enabled ? action : null
    $root.find("[data-action='refresh']").prop("disabled", enabled)
    $root.find("[data-action='save-secret']").prop("disabled", enabled)
    $root.find("[data-action='import-secrets']").prop("disabled", enabled)
    $root.find("[data-role='secret-search']").prop("disabled", enabled && action !== "refresh")
  }

  function updateRawRegistry() {
    $root.find("[data-role='secrets-json']").text(pretty(currentMessage || {})).toggle(rawVisible)
    $root.find("[data-action='toggle-raw']").text(rawVisible ? "Nascondi raw registry" : "Mostra raw registry")
  }

  function updateFilterButtons() {
    $root.find("[data-filter]").each((_, element) => {
      const $button = $(element)
      const isActive = String($button.data("filter")) === currentFilter
      $button.toggleClass("btn-primary", isActive)
      $button.toggleClass("btn-default", !isActive)
    })
  }

  function getVisibleEntries(entries) {
    const query = currentQuery.trim().toLowerCase()
    return (entries || [])
      .filter((entry) => {
        if (currentFilter !== "all" && String(entry.category || "") !== currentFilter) {
          return false
        }
        if (!query) return true
        return summarizeEntry(entry).includes(query)
      })
      .sort((left, right) => {
        const configuredDiff = Number(Boolean(right.exists)) - Number(Boolean(left.exists))
        if (configuredDiff) return configuredDiff
        const categoryDiff = String(left.category || "").localeCompare(String(right.category || ""))
        if (categoryDiff) return categoryDiff
        return String(left.key || "").localeCompare(String(right.key || ""))
      })
  }

  function renderSecretCards(entries) {
    const visible = getVisibleEntries(entries)
    const configured = visible.filter((entry) => entry.exists).length
    const summaryParts = []
    if (currentFilter !== "all") summaryParts.push(`categoria: ${currentFilter}`)
    if (currentQuery.trim()) summaryParts.push(`ricerca: "${currentQuery.trim()}"`)
    $root.find("[data-role='visible-count']").text(String(visible.length))
    $root.find("[data-role='visible-summary']").text(
      visible.length ? `${configured} configurati, ${visible.length - configured} mancanti` : "Nessun secret visibile"
    )
    $root.find("[data-role='filter-summary']").text(summaryParts.join(" · ") || "Nessun filtro attivo.")
    updateFilterButtons()

    const html = visible
      .map((entry) => {
        const distributeTo = (entry.distribute_to || []).join(", ") || "-"
        const stateLabel = entry.exists ? "Configured" : "Missing"
        const stateClass = entry.exists ? "is-configured" : "is-missing"
        return `
          <article class="mmos-secret-row ${stateClass}">
            <div class="mmos-secret-row-main">
              <div class="mmos-secret-row-top">
                <div class="mmos-secret-row-key">${escape(entry.key)}</div>
                <span class="mmos-secret-pill ${stateClass}">${escape(stateLabel)}</span>
              </div>
              <div class="mmos-secret-row-meta">
                <span class="mmos-secret-pill">${escape(entry.category)}</span>
                <span>${escape(entry.source_node || "local")}</span>
                <span><code>${escape(entry.path)}</code></span>
                <span>${escape(entry.permissions || "-")}</span>
              </div>
              <div class="mmos-secret-row-desc">
                ${escape(entry.description || "Nessuna descrizione")}
              </div>
            </div>
            <div class="mmos-secret-row-side">
              <strong>Target</strong>
              <span>${escape(distributeTo)}</span>
            </div>
          </article>
        `
      })
      .join("")

    const table = visible.length
      ? `
        <div class="mmos-secret-list-shell">
          <div class="mmos-secret-list-head">
            <span>Secret</span>
            <span>Stato</span>
            <span>Contesto</span>
            <span>Distribuzione</span>
          </div>
          <div class="mmos-secret-list-body">${html}</div>
        </div>
      `
      : "<div class='mmos-console-empty'><h4>Nessun secret corrisponde ai filtri correnti.</h4></div>"

    $root.find("[data-role='secret-list']").html(table)
  }

  function renderAccessInventory(entries) {
    currentAccessInventory = entries || []
    const query = currentQuery.trim().toLowerCase()
    const visible = currentAccessInventory.filter((entry) => {
      if (!query) return true
      return [
        entry.system,
        entry.service,
        entry.url,
        entry.username,
        entry.password_key,
        entry.password_value,
        entry.notes,
        entry.source,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    })
    $root.find("[data-role='access-summary']").text(
      visible.length
        ? `${visible.length} accessi noti o gestiti dal sistema`
        : currentAccessInventory.length
          ? "Nessun accesso corrisponde ai filtri correnti."
        : "Nessun accesso inventariato."
    )

    const html = visible
      .map((entry) => {
        const revealButton = entry.password_key
          ? `<button class="btn btn-default btn-xs" data-action="reveal-secret" data-key="${escape(entry.password_key)}">Mostra secret</button>`
          : ""
        const passwordBlock = entry.password_value
          ? `<div class="mmos-secret-row-desc"><strong>Password</strong><div><code>${escape(entry.password_value)}</code></div></div>`
          : entry.password_key
            ? `<div class="mmos-secret-row-desc"><strong>Password</strong><div>Gestita dal secret <code>${escape(entry.password_key)}</code></div></div>`
            : ""
        return `
          <article class="mmos-secret-row">
            <div class="mmos-secret-row-main">
              <div class="mmos-secret-row-top">
                <div class="mmos-secret-row-key">${escape(entry.system)} · ${escape(entry.service)}</div>
                <span class="mmos-secret-pill">${escape(entry.source || "inventory")}</span>
              </div>
              <div class="mmos-secret-row-meta">
                <span>${escape(entry.url || "-")}</span>
                <span>${escape(entry.username || "-")}</span>
              </div>
              <div class="mmos-secret-row-desc">${escape(entry.notes || "")}</div>
              ${passwordBlock}
            </div>
            <div class="mmos-secret-row-side">
              <strong>Actions</strong>
              <span>${revealButton || "Nessuna"}</span>
            </div>
          </article>
        `
      })
      .join("")

    $root.find("[data-role='access-list']").html(
      html || "<div class='mmos-console-empty'><h4>Nessun accesso noto.</h4></div>"
    )
  }

  function renderClearSecrets(entries) {
    currentClearSecrets = entries || []
    const query = currentQuery.trim().toLowerCase()
    const visible = currentClearSecrets.filter((entry) => {
      if (currentFilter !== "all" && String(entry.category || "") !== currentFilter) {
        return false
      }
      if (!query) return true
      return summarizeClearSecret(entry).includes(query)
    })

    $root.find("[data-role='cleartext-summary']").text(
      visible.length
        ? `${visible.length} secret in chiaro visibili su ${currentClearSecrets.length} caricati`
        : currentClearSecrets.length
          ? "Nessun secret in chiaro corrisponde ai filtri correnti."
          : "Valori non ancora caricati."
    )

    if (!visible.length) {
      $root.find("[data-role='cleartext-list']").html(
        currentClearSecrets.length
          ? "<div class='mmos-console-empty'><h4>Nessun secret in chiaro corrisponde ai filtri correnti.</h4></div>"
          : "<div class='mmos-console-empty'><h4>Premi “Mostra tutti i secret” per caricare i valori in chiaro.</h4></div>"
      )
      return
    }

    const rows = visible
      .map((entry) => `
        <article class="mmos-secret-row is-configured">
          <div class="mmos-secret-row-main">
            <div class="mmos-secret-row-top">
              <div class="mmos-secret-row-key">${escape(entry.key)}</div>
              <span class="mmos-secret-pill">${escape(entry.category || "uncategorized")}</span>
            </div>
            <div class="mmos-secret-row-meta">
              <span>${escape(entry.source_node || "local")}</span>
              <span><code>${escape(entry.path || "-")}</code></span>
              <span>${escape(entry.permissions || "-")}</span>
              <span>${escape(entry.sha256 || "-")}</span>
            </div>
            <div class="mmos-secret-row-desc">${escape(entry.description || "Nessuna descrizione")}</div>
            <div class="mmos-secret-row-desc">
              <strong>Value</strong>
              <pre class="mmos-console-output" style="display:block; margin-top:8px; white-space:pre-wrap; word-break:break-word;">${escape(entry.value || "")}</pre>
            </div>
          </div>
          <div class="mmos-secret-row-side">
            <strong>Context</strong>
            <span>${escape(entry.category || "-")}</span>
          </div>
        </article>
      `)
      .join("")

    $root.find("[data-role='cleartext-list']").html(`
      <div class="mmos-secret-list-shell">
        <div class="mmos-secret-list-head">
          <span>Secret</span>
          <span>Categoria</span>
          <span>Path / hash</span>
          <span>Valore</span>
        </div>
        <div class="mmos-secret-list-body">${rows}</div>
      </div>
    `)
  }

  function render(message) {
    currentMessage = message || {}
    const categories = currentMessage.categories || {}
    const categoryNames = Object.keys(categories)
    currentEntries = currentMessage.entries || []
    currentAccessInventory = currentMessage.access_inventory || []
    $root.find("[data-role='secret-total']").text(String(currentMessage.total || 0))
    $root.find("[data-role='secret-configured']").text(`${currentMessage.configured || 0} configured`)
    $root.find("[data-role='registry-path']").text(currentMessage.registry || "-")
    $root.find("[data-role='secret-root']").text(currentMessage.root || "-")
    $root.find("[data-role='category-count']").text(String(categoryNames.length))
    $root.find("[data-role='category-summary']").text(categoryNames.join(", ") || "Nessuna categoria")
    renderSecretCards(currentEntries)
    renderAccessInventory(currentAccessInventory)
    renderClearSecrets(currentClearSecrets)
    renderMailConfigSummary()
    updateRawRegistry()
  }

  function renderMailConfigSummary() {
    const requiredConfigured = [
      Boolean(currentMailConfig.mail_imap_host),
      Boolean(currentMailConfig.mail_imap_port),
      Boolean(currentMailConfig.mail_username),
      Boolean(currentMailConfig.mail_password_configured),
      currentMailConfig.mail_use_ssl === true || currentMailConfig.mail_use_ssl === false,
    ].filter(Boolean).length
    const smtpConfigured = [
      Boolean(currentMailConfig.mail_smtp_host),
      Boolean(currentMailConfig.mail_smtp_port),
      Boolean(currentMailConfig.mail_reply_from),
    ].filter(Boolean).length
    $root
      .find("[data-role='mail-config-summary']")
      .text(`Site config mail: ${requiredConfigured}/5 campi minimi configurati. SMTP: ${smtpConfigured}/3 opzionali.`)
  }

  function renderMailConfigForm(config) {
    currentMailConfig = config || {}
    $root.find("[data-role='mail-imap-host']").val(config.mail_imap_host || "")
    $root.find("[data-role='mail-imap-port']").val(config.mail_imap_port || "")
    $root.find("[data-role='mail-imap-ssl']").val(String(Boolean(config.mail_use_ssl)))
    $root.find("[data-role='mail-username']").val(config.mail_username || "")
    $root.find("[data-role='mail-password']").val("")
    $root.find("[data-role='mail-smtp-host']").val(config.mail_smtp_host || "")
    $root.find("[data-role='mail-smtp-port']").val(config.mail_smtp_port || "")
    $root.find("[data-role='mail-reply-from']").val(config.mail_reply_from || "")
    if (config.mail_password_configured) {
      $root.find("[data-role='mail-password']").attr("placeholder", "Password gia configurata. Inseriscila solo per cambiarla.")
    } else {
      $root.find("[data-role='mail-password']").attr("placeholder", "Enter mail password")
    }
    renderMailConfigSummary()
  }

  async function refresh() {
    try {
      setBusy("refresh", true)
      setStatus("Aggiornamento registry in corso...", "blue")
      const [response, mailConfigResponse] = await Promise.all([
        frappe.call({ method: "mmos_core.api.secrets_status" }),
        frappe.call({ method: "mmos_core.api.mail_channel_config_get" }),
      ])
      const payload = unwrap(response.message)
      const mailConfig = unwrap(mailConfigResponse.message)
      render(payload)
      renderMailConfigForm(mailConfig)
      setStatus(`Registry aggiornato. ${payload?.configured || 0} secret configurati.`, "green")
    } catch (error) {
      setStatus(error?.message || "Refresh del registry fallito.", "red")
      frappe.msgprint(error?.message || "Refresh del registry fallito.")
    } finally {
      setBusy("refresh", false)
    }
  }

  async function saveSecret() {
    let key = String($root.find("[data-role='secret-key']").val() || "").trim()
    let value = String($root.find("[data-role='secret-value']").val() || "")
    const path = String($root.find("[data-role='secret-path']").val() || "").trim()

    if (looksLikeSecretValue(key) && !String(value).trim()) {
      value = key
      key = ""
      $root.find("[data-role='secret-key']").val("")
      $root.find("[data-role='secret-value']").val(value)
      frappe.show_alert({
        message: "Hai incollato il valore nel campo Key. L'ho spostato in Value: inserisci ora un nome chiave come github_token.",
        indicator: "orange",
      })
      return
    }

    if (!validSecretKey(key)) {
      frappe.msgprint("La chiave deve essere un nome stabile tipo github_token, cloudflare_api_token o custom_secret.")
      return
    }

    if (!String(value).trim()) {
      frappe.msgprint("Il valore del secret non pu\\u00f2 essere vuoto.")
      return
    }

    try {
      setBusy("save", true)
      setStatus(`Salvataggio del secret ${key} in corso...`, "blue")
      await frappe.call({ method: "mmos_core.api.set_secret", args: { key, value, path } })
      frappe.show_alert({ message: "Secret salvato", indicator: "green" })
      $root.find("[data-role='secret-value']").val("")
      setStatus(`Secret ${key} salvato correttamente.`, "green")
      await refresh()
    } catch (error) {
      setStatus(error?.message || `Salvataggio del secret ${key} fallito.`, "red")
      frappe.msgprint(error?.message || `Salvataggio del secret ${key} fallito.`)
    } finally {
      setBusy("save", false)
    }
  }

  async function saveMailConfig() {
    const payload = {
      mail_enabled: true,
      mail_imap_host: String($root.find("[data-role='mail-imap-host']").val() || "").trim(),
      mail_imap_port: String($root.find("[data-role='mail-imap-port']").val() || "").trim(),
      mail_use_ssl: String($root.find("[data-role='mail-imap-ssl']").val() || "true").trim(),
      mail_username: String($root.find("[data-role='mail-username']").val() || "").trim(),
      mail_password: String($root.find("[data-role='mail-password']").val() || ""),
      mail_smtp_host: String($root.find("[data-role='mail-smtp-host']").val() || "").trim(),
      mail_smtp_port: String($root.find("[data-role='mail-smtp-port']").val() || "").trim(),
      mail_reply_from: String($root.find("[data-role='mail-reply-from']").val() || "").trim(),
    }
    const requiredMissing = ["mail_imap_host", "mail_imap_port", "mail_username"].filter((key) => !String(payload[key] || "").trim())
    if (!String(payload.mail_password || "").trim() && !currentMailConfig.mail_password_configured) {
      requiredMissing.push("mail_password")
    }
    if (requiredMissing.length) {
      frappe.msgprint(`Campi obbligatori mancanti: ${requiredMissing.join(", ")}`)
      return
    }

    try {
      setBusy("save-mail", true)
      setStatus("Salvataggio configurazione mail nel site in corso...", "blue")
      const response = await frappe.call({ method: "mmos_core.api.mail_channel_config_set", args: payload })
      renderMailConfigForm(unwrap(response.message))
      frappe.show_alert({ message: "Configurazione mail salvata", indicator: "green" })
      setStatus("Configurazione mail salvata correttamente nel site.", "green")
      await refresh()
    } catch (error) {
      setStatus(error?.message || "Salvataggio configurazione mail fallito.", "red")
      frappe.msgprint(error?.message || "Salvataggio configurazione mail fallito.")
    } finally {
      setBusy("save-mail", false)
    }
  }

  async function importSecrets(node) {
    try {
      setBusy("import", true)
      setStatus(`Import dei secret da ${node} in corso...`, "blue")
      const response = await frappe.call({ method: "mmos_core.api.import_remote_secrets", args: { node } })
      frappe.show_alert({ message: `Import ${node} completato`, indicator: "green" })
      currentMessage = unwrap(response.message) || currentMessage
      updateRawRegistry()
      setStatus(`Import da ${node} completato. Registry sincronizzato.`, "green")
      await refresh()
    } catch (error) {
      setStatus(error?.message || `Import da ${node} fallito.`, "red")
      frappe.msgprint(error?.message || `Import da ${node} fallito.`)
    } finally {
      setBusy("import", false)
    }
  }

  async function revealSecret(key) {
    try {
      setBusy("reveal", true)
      setStatus(`Lettura del secret ${key} in corso...`, "blue")
      const response = await frappe.call({ method: "mmos_core.api.reveal_secret", args: { key } })
      const payload = unwrap(response.message)
      frappe.msgprint({
        title: `Secret ${key}`,
        message: `<div><p><strong>Path</strong><br><code>${escape(payload.path || "-")}</code></p><p><strong>Value</strong></p><pre style="white-space:pre-wrap;word-break:break-word;">${escape(payload.value || "")}</pre></div>`,
        wide: true,
      })
      setStatus(`Secret ${key} letto correttamente.`, "green")
    } catch (error) {
      setStatus(error?.message || `Lettura del secret ${key} fallita.`, "red")
      frappe.msgprint(error?.message || `Lettura del secret ${key} fallita.`)
    } finally {
      setBusy("reveal", false)
    }
  }

  async function revealAllSecrets() {
    try {
      setBusy("reveal-all", true)
      setStatus("Lettura di tutti i secret in chiaro in corso...", "blue")
      const response = await frappe.call({ method: "mmos_core.api.reveal_all_secrets" })
      const payload = unwrap(response.message)
      currentClearSecrets = payload.items || []
      renderClearSecrets(currentClearSecrets)
      setStatus(`Caricati ${payload.count || currentClearSecrets.length || 0} secret in chiaro.`, "green")
    } catch (error) {
      setStatus(error?.message || "Lettura dei secret in chiaro fallita.", "red")
      frappe.msgprint(error?.message || "Lettura dei secret in chiaro fallita.")
    } finally {
      setBusy("reveal-all", false)
    }
  }

  $root.on("click", "[data-action='refresh']", () => {
    refresh()
  })

  $root.on("click", "[data-action='save-secret']", () => {
    saveSecret()
  })

  $root.on("click", "[data-action='save-mail-config']", () => {
    saveMailConfig()
  })

  $root.on("click", "[data-action='import-secrets']", (event) => {
    importSecrets($(event.currentTarget).data("node"))
  })

  $root.on("click", "[data-filter]", (event) => {
    currentFilter = String($(event.currentTarget).data("filter") || "all")
    renderSecretCards(currentEntries)
    renderClearSecrets(currentClearSecrets)
  })

  $root.on("click", "[data-action='clear-filters']", () => {
    currentFilter = "all"
    currentQuery = ""
    $root.find("[data-role='secret-search']").val("")
    renderSecretCards(currentEntries)
    renderClearSecrets(currentClearSecrets)
  })

  $root.on("input", "[data-role='secret-search']", (event) => {
    currentQuery = String($(event.currentTarget).val() || "")
    renderSecretCards(currentEntries)
    renderAccessInventory(currentAccessInventory)
    renderClearSecrets(currentClearSecrets)
  })

  $root.on("click", "[data-action='toggle-raw']", () => {
    rawVisible = !rawVisible
    updateRawRegistry()
  })

  $root.on("click", "[data-action='reveal-secret']", (event) => {
    revealSecret(String($(event.currentTarget).data("key") || ""))
  })

  $root.on("click", "[data-action='reveal-all-secrets']", () => {
    revealAllSecrets()
  })

  $root.on("click", "[data-action='open-console']", () => {
    frappe.set_route("mmos-console")
  })

  $root.on("click", "[data-action='open-resources']", () => {
    frappe.set_route("mmos-resources")
  })

  refresh()
}
