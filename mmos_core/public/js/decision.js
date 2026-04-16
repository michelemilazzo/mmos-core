(function () {
  function deriveDecision(payload) {
    const source = payload || {}
    const status = String(source.status || "").toLowerCase()
    const finalStatus = String(source.final_status || "").toLowerCase()
    const actions = Array.isArray(source.actions) ? source.actions : []
    const actionStatuses = actions.map((item) => String((item && item.status) || "").toLowerCase())

    const failed = finalStatus === "failed" || status === "error" || actionStatuses.includes("failed")
    const timeout = finalStatus === "timeout" || actionStatuses.includes("timeout")
    const cancelled = finalStatus === "cancelled" || actionStatuses.includes("cancelled")

    if (cancelled) {
      return {
        state: "check",
        esito: "Cancelled",
        rischio: "medio",
        confidenza: "bassa",
        decisione: "La run è stata interrotta prima di produrre un risultato conclusivo.",
        prossimaAzione: "Riavvia solo se serve completare la verifica.",
        cta: ["rerun", "open_ai"],
      }
    }

    if (timeout) {
      return {
        state: "check",
        esito: "Timeout",
        rischio: "medio",
        confidenza: "media",
        decisione: "La verifica ha superato il tempo atteso.",
        prossimaAzione: "Apri analisi completa e controlla il punto che ha rallentato.",
        cta: ["open_ai"],
      }
    }

    if (failed) {
      return {
        state: "investigate",
        esito: "Check richiesto",
        rischio: "alto",
        confidenza: "alta",
        decisione: "Sono emersi errori reali o verifiche fallite.",
        prossimaAzione: "Apri analisi completa e intervieni sul componente segnalato.",
        cta: ["open_ai"],
      }
    }

    if (source.final || source.run_id) {
      return {
        state: "safe",
        esito: "Stabile",
        rischio: "basso",
        confidenza: "media",
        decisione: "Non emerge un problema critico da questa run.",
        prossimaAzione: "Continua monitoraggio o approfondisci se necessario.",
        cta: ["open_ai_optional"],
      }
    }

    return null
  }

  window.MMOSDecision = window.MMOSDecision || {}
  window.MMOSDecision.deriveDecision = deriveDecision
})()
