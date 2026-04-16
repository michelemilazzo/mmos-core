(function () {
  function send(event, payload) {
    try {
      const body = Object.assign(
        {
          event: String(event || ""),
          ts: Date.now(),
        },
        payload || {}
      )

      fetch("/api/method/mmos_core.api.telemetry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).catch(function () {})

      if (window.MMOS_DEBUG_TELEMETRY) {
        console.log("[MMOS telemetry]", body)
      }
    } catch (e) {}
  }

  window.MMOSTelemetry = window.MMOSTelemetry || {}
  window.MMOSTelemetry.send = send
})()
