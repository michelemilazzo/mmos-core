from __future__ import annotations
import json
import re
import subprocess
from pathlib import Path
from typing import Any

import requests

import frappe


DOCUMENT_SOURCE_KEYWORDS = ("mail", "email", "whatsapp", "documento", "pdf", "contratto", "fattura", "reclamo")


def _control_plane_base() -> str:
    return (
        frappe.conf.get("mmos_control_plane_base")
        or "http://ai-mmos-core:18080"
    ).rstrip("/")


def _request(method: str, path: str, payload: dict[str, Any] | None = None) -> Any:
    url = f"{_control_plane_base()}{path}"
    try:
        with requests.Session() as session:
            session.trust_env = False
            response = session.request(method, url, json=payload, timeout=180)
        response.raise_for_status()
        return response.json()
    except Exception:
        command = [
            "curl",
            "-sS",
            "-X",
            method.upper(),
            "-H",
            "Content-Type: application/json",
            url,
        ]
        body = json.dumps(payload or {})
        if method.upper() != "GET":
            command.extend(["-d", body])
        result = subprocess.run(command, capture_output=True, text=True, timeout=180, check=False)
        if result.returncode != 0:
            raise
        return json.loads(result.stdout or "{}")


def has_page_permission(doc, user=None, permission_type=None) -> bool:
    user = user or frappe.session.user
    return user not in ("Guest", None)


def _parse_dt(value: Any):
    if not value:
        return None
    try:
        return frappe.utils.get_datetime(value)
    except Exception:
        return None


def _db_dt(value: Any) -> str | None:
    parsed = _parse_dt(value)
    if not parsed:
        return None
    return frappe.utils.get_datetime_str(parsed.replace(tzinfo=None))


def _save_agent_run(prompt: str, payload: dict[str, Any]) -> str:
    requested_name = str(payload.get("run_id") or "").strip()
    actions = payload.get("actions") or []
    if not actions and payload.get("agent_results"):
        for item in payload.get("agent_results") or []:
            for action in item.get("actions", []) or []:
                if isinstance(action, dict):
                    actions.append(action)
    started_candidates = [_parse_dt(item.get("started_at")) for item in actions if item.get("started_at")]
    finished_candidates = [_parse_dt(item.get("finished_at")) for item in actions if item.get("finished_at")]
    started_at = min((item for item in started_candidates if item is not None), default=None)
    finished_at = max((item for item in finished_candidates if item is not None), default=None)
    duration_ms = None
    if started_at and finished_at:
        duration_ms = int((finished_at - started_at).total_seconds() * 1000)

    doc = frappe.get_doc(
        {
            "doctype": "MMOS Agent Run",
            "name": payload.get("run_id") or None,
            "prompt": prompt,
            "status": payload.get("status"),
            "thought": payload.get("thought"),
            "retrieval_topic": payload.get("retrieval_topic"),
            "final": payload.get("final"),
            "site": frappe.local.site,
            "run_user": frappe.session.user,
            "started_at": _db_dt(started_at),
            "finished_at": _db_dt(finished_at),
            "duration_ms": duration_ms,
            "context_json": json.dumps(payload.get("context_used") or [], ensure_ascii=True),
            "actions_json": json.dumps(actions, ensure_ascii=True),
        }
    )
    doc.insert(ignore_permissions=True)
    if requested_name and doc.name != requested_name:
        try:
            exists = frappe.db.exists("MMOS Agent Run", requested_name)
            if not exists:
                frappe.db.sql(
                    "update `tabMMOS Agent Run` set name=%s where name=%s",
                    (requested_name, doc.name),
                )
                doc.name = requested_name
        except Exception:
            pass
    frappe.db.commit()
    return str(doc.name)


def _detect_document_prompt(prompt: str) -> bool:
    text = str(prompt or "").strip().lower()
    if not text:
        return False
    if any(token in text for token in DOCUMENT_SOURCE_KEYWORDS):
        return True
    return bool(re.search(r"\b(crea pratica|apri pratica|cataloga|classifica)\b", text))


def _title_from_prompt(prompt: str) -> str:
    text = " ".join(str(prompt or "").strip().split())
    if not text:
        return "Untitled document"
    return text[:120]


def _run_document_prompt(prompt: str) -> dict[str, Any]:
    from mmos_core.agents.document_agent import create_document_case

    result = create_document_case(
        title=_title_from_prompt(prompt),
        content=prompt,
        source="chat",
        sender=frappe.session.user,
    )
    summary = str(result.get("summary") or "Documento acquisito.")
    case_name = str(((result.get("case") or {}).get("name")) or "")
    document_name = str(((result.get("document") or {}).get("name")) or "")
    final = summary
    if case_name and document_name:
        final = f"{summary} Documento {document_name} collegato alla pratica {case_name}."
    human = final
    return {
        "status": "ok",
        "final_status": "done",
        "mode": "specialized_agent",
        "planner": {
            "mode": "specialized_agent",
            "selected_agents": ["document_agent"],
            "thought": "Attivo Document Agent per classificazione e apertura pratica",
        },
        "thought": "Classifico il contenuto, catalogo il documento e apro la pratica collegata",
        "context_used": [],
        "agent_results": [
            {
                "agent": "document_agent",
                "thought": "Analizzo il contenuto documentale e creo la pratica collegata",
                "status": "done",
                "final": final,
                "actions": [
                    {
                        "tool": "document_intake",
                        "status": "done",
                        "summary": summary,
                        "output": json.dumps(result, ensure_ascii=True),
                    }
                ],
                "data": result,
                "decision": str(result.get("decision") or "review"),
                "next_action": str(result.get("next_action") or "manual_review"),
            }
        ],
        "actions": [
            {
                "tool": "document_intake",
                "status": "done",
                "summary": summary,
                "output": json.dumps(result, ensure_ascii=True),
            }
        ],
        "retrieval_topic": "document_ops",
        "final": final,
        "decision": str(result.get("decision") or "review"),
        "next_action": str(result.get("next_action") or "manual_review"),
        "human": human,
        "data": result,
    }


def _cases_feed_token() -> str:
    configured = str(frappe.conf.get("mmos_cases_feed_token") or "").strip()
    if configured:
        return configured
    fallback = Path("/root/.secrets/mmos_cases_feed_token")
    try:
        return fallback.read_text(encoding="utf-8").strip()
    except Exception:
        return ""


def _build_document_intake_payload(result: dict[str, Any], *, prompt: str, source: str, sender: str = "") -> dict[str, Any]:
    summary = str(result.get("summary") or "Documento acquisito.")
    case_name = str(((result.get("case") or {}).get("name")) or "")
    document_name = str(((result.get("document") or {}).get("name")) or "")
    final = summary
    if case_name and document_name:
        final = f"{summary} Documento {document_name} collegato alla pratica {case_name}."
    return {
        "status": "ok",
        "final_status": "done",
        "mode": "specialized_agent",
        "planner": {
            "mode": "specialized_agent",
            "selected_agents": ["document_agent"],
            "thought": f"Attivo Document Agent da intake {source}",
        },
        "thought": f"Acquisisco il contenuto da {source}, lo catalogo e apro la pratica collegata",
        "context_used": [],
        "agent_results": [
            {
                "agent": "document_agent",
                "thought": f"Analizzo contenuto in ingresso da {source}",
                "status": "done",
                "final": final,
                "actions": [
                    {
                        "tool": "document_intake",
                        "status": "done",
                        "summary": summary,
                        "output": json.dumps(result, ensure_ascii=True),
                    }
                ],
                "data": result,
                "decision": str(result.get("decision") or "review"),
                "next_action": str(result.get("next_action") or "manual_review"),
            }
        ],
        "actions": [
            {
                "tool": "document_intake",
                "status": "done",
                "summary": summary,
                "output": json.dumps(result, ensure_ascii=True),
            }
        ],
        "retrieval_topic": "document_ops",
        "final": final,
        "decision": str(result.get("decision") or "review"),
        "next_action": str(result.get("next_action") or "manual_review"),
        "human": final,
        "data": result,
        "prompt": prompt,
        "source": source,
        "sender": sender,
    }


@frappe.whitelist()
def console_bootstrap() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    overview = _request("GET", "/resources/overview")
    workers = _request("GET", "/workers/status")
    return {
        "user": frappe.session.user,
        "roles": frappe.get_roles(),
        "control_plane_base": _control_plane_base(),
        "workers": workers.get("result", {}),
        **overview.get("result", {}),
    }


@frappe.whitelist()
def console_lite_bootstrap() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    payload = _request("GET", "/console/lite-bootstrap")
    return {
        "user": frappe.session.user,
        "roles": frappe.get_roles(),
        "control_plane_base": _control_plane_base(),
        **payload,
    }


@frappe.whitelist()
def coder_providers() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/coder/providers")


@frappe.whitelist()
def coder_execute(provider: str, prompt: str, workdir: str = "/root", session_id: str | None = None) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request(
        "POST",
        "/coder/execute",
        {
            "provider": provider,
            "prompt": prompt,
            "workdir": workdir,
            "session_id": session_id,
        },
    )


@frappe.whitelist()
def branches_list() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/branches")


@frappe.whitelist()
def branch_merge_preview(source_branch: str, target_branch: str = "main") -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request(
        "POST",
        f"/branches/{source_branch}/merge-preview",
        {"target": target_branch},
    )


@frappe.whitelist()
def branch_merge_execute(source_branch: str, target_branch: str = "main") -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request(
        "POST",
        f"/branches/{source_branch}/merge",
        {"target": target_branch},
    )


@frappe.whitelist()
def branch_conflicts(source_branch: str, target_branch: str = "main") -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request(
        "POST",
        f"/branches/{source_branch}/conflicts",
        {"target": target_branch},
    )


@frappe.whitelist()
def branch_resolve_conflict(source_branch: str, target_branch: str, path: str, resolution: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request(
        "POST",
        f"/branches/{source_branch}/resolve-conflict",
        {"target": target_branch, "path": path, "resolution": resolution},
    )


@frappe.whitelist()
def branch_resolve_history(source_branch: str, target_branch: str = "main") -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request(
        "POST",
        f"/branches/{source_branch}/resolve-history",
        {"target": target_branch},
    )


@frappe.whitelist()
def rag_search(query: str, limit: int = 6) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/rag/search", {"query": query, "limit": int(limit)})


@frappe.whitelist()
def rag_ingest(paths: list[str] | None = None) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/rag/ingest", {"paths": paths or []})


@frappe.whitelist()
def ai_command(prompt: str, cheap_first: bool = True) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/ai/command", {"prompt": prompt, "cheap_first": bool(cheap_first)})


@frappe.whitelist()
def agent_run(prompt: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    if _detect_document_prompt(prompt):
        payload = _run_document_prompt(prompt)
        run_id = _save_agent_run(prompt, payload)
        payload["run_id"] = run_id
        return payload
    payload = _request(
        "POST",
        "/agent/run",
        {
            "prompt": prompt,
            "context": {
                "site": frappe.local.site,
                "user": frappe.session.user,
            },
        },
    )
    run_id = _save_agent_run(prompt, payload)
    payload["run_id"] = run_id
    return payload


@frappe.whitelist()
def agent_erp_customer_exposure(customer: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    from mmos_core.agents.erp_agent import analyze_customer_exposure

    return analyze_customer_exposure(customer)


@frappe.whitelist()
def agent_document_intake(
    title: str,
    content: str,
    source: str = "manual",
    sender: str = "",
    customer: str = "",
    metadata_json: str = "",
) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    from mmos_core.agents.document_agent import create_document_case

    metadata: dict[str, Any] = {}
    if metadata_json:
        try:
            metadata = json.loads(metadata_json)
        except Exception:
            metadata = {"raw": metadata_json}

    return create_document_case(
        title=title,
        content=content,
        source=source,
        sender=sender,
        customer=customer,
        metadata=metadata,
    )


@frappe.whitelist()
def agent_document_email_intake(
    subject: str,
    body: str,
    sender: str,
    customer: str = "",
    metadata_json: str = "",
) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    result = agent_document_intake(
        title=subject,
        content=body,
        source="email",
        sender=sender,
        customer=customer,
        metadata_json=metadata_json,
    )
    payload = _build_document_intake_payload(
        result,
        prompt=f"mail: {subject}",
        source="email",
        sender=sender,
    )
    run_id = _save_agent_run(f"mail: {subject}", payload)
    payload["run_id"] = run_id
    return payload


@frappe.whitelist()
def agent_document_whatsapp_intake(
    message: str,
    sender: str,
    customer: str = "",
    metadata_json: str = "",
) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    result = agent_document_intake(
        title=f"WhatsApp da {sender}",
        content=message,
        source="whatsapp",
        sender=sender,
        customer=customer,
        metadata_json=metadata_json,
    )
    payload = _build_document_intake_payload(
        result,
        prompt=f"whatsapp: {message[:120]}",
        source="whatsapp",
        sender=sender,
    )
    run_id = _save_agent_run(f"whatsapp: {message[:120]}", payload)
    payload["run_id"] = run_id
    return payload


@frappe.whitelist(allow_guest=True)
def document_cases_feed(
    limit: int = 20,
    offset: int = 0,
    token: str = "",
    entity_name: str = "",
    status: str = "",
) -> dict[str, Any]:
    """
    Feed cases for Aidrive integration.
    Supports:
    - entity_name: filter by Aidrive Drive document entity (source_id on MMOS Document)
    - status: filter by case status
    - limit/offset: pagination
    Returns: {"cases": [...], "total": N}
    """
    expected = _cases_feed_token()
    if expected:
        if str(token or "").strip() != expected:
            frappe.throw("Invalid cases feed token", frappe.PermissionError)
    else:
        frappe.only_for(("System Manager", "Administrator"))

    limit_n = max(1, min(int(limit), 50))
    offset_n = max(0, int(offset))

    # If entity_name provided, find linked document IDs first
    linked_doc_ids: list[str] = []
    if entity_name:
        docs = frappe.get_all(
            "MMOS Document",
            filters={"source_id": str(entity_name)},
            fields=["name"],
            limit_page_length=20,
        )
        linked_doc_ids = [d["name"] for d in docs]
        if not linked_doc_ids:
            return {"cases": [], "total": 0}

    case_filters: dict[str, Any] = {}
    if linked_doc_ids:
        case_filters["document"] = ("in", linked_doc_ids)
    if status:
        case_filters["status"] = str(status)

    total = frappe.db.count("MMOS Case", filters=case_filters) if case_filters else frappe.db.count("MMOS Case")

    rows = frappe.get_all(
        "MMOS Case",
        filters=case_filters,
        fields=["name", "title", "case_type", "customer", "priority", "status", "source", "summary", "next_action", "document", "creation"],
        order_by="creation desc",
        limit_start=offset_n,
        limit_page_length=limit_n,
    )

    document_names = [row.get("document") for row in rows if row.get("document")]
    documents: dict[str, Any] = {}
    if document_names:
        documents = {
            item["name"]: item
            for item in frappe.get_all(
                "MMOS Document",
                filters={"name": ("in", document_names)},
                fields=["name", "title", "document_type", "status", "source", "source_id"],
                limit_page_length=max(1, len(document_names)),
            )
        }

    cases = []
    for row in rows:
        document = documents.get(row.get("document") or "", {})
        cases.append(
            {
                "name": row.get("name"),
                "title": row.get("title"),
                "case_type": row.get("case_type"),
                "customer": row.get("customer"),
                "priority": row.get("priority"),
                "status": row.get("status"),
                "source": row.get("source"),
                "summary": row.get("summary"),
                "next_action": row.get("next_action"),
                "creation": str(row.get("creation") or ""),
                "document": {
                    "name": document.get("name"),
                    "title": document.get("title"),
                    "document_type": document.get("document_type"),
                    "status": document.get("status"),
                    "source": document.get("source"),
                    "source_id": document.get("source_id"),
                } if document else None,
                "ai_url": "https://ai.onekeyco.com/app/mmos-ai",
            }
        )
    return {"cases": cases, "total": total}


@frappe.whitelist(allow_guest=True)
def document_intake_external(
    title: str,
    content: str = "",
    source_id: str = "",
    source: str = "aidrive",
    sender: str = "",
    customer: str = "",
    document_type: str = "general",
    token: str = "",
) -> dict[str, Any]:
    """
    Token-authenticated intake endpoint for external sources (Aidrive, mail, etc).
    source_id: external entity identifier (e.g. Aidrive file entity_name)
    """
    expected = _cases_feed_token()
    if expected:
        if str(token or "").strip() != expected:
            frappe.throw("Invalid token", frappe.PermissionError)
    else:
        frappe.throw("Feed token not configured", frappe.PermissionError)

    from mmos_core.agents.document_agent import create_document_case

    result = create_document_case(
        title=title,
        content=content or title,
        source=source,
        sender=sender,
        customer=customer,
        metadata={"source_id": source_id, "document_type": document_type},
    )

    # Store source_id on the created document for cross-reference
    doc_name = (result.get("document") or {}).get("name")
    if source_id and doc_name:
        try:
            mmos_doc = frappe.get_doc("MMOS Document", doc_name)
            mmos_doc.source_id = source_id
            mmos_doc.save(ignore_permissions=True)
            frappe.db.commit()
            result.setdefault("document", {})["source_id"] = source_id
        except Exception:
            pass

    return result


def _mail_channel_doc():
    return frappe.get_single("MMOS Channel Config")


@frappe.whitelist()
def mail_channel_config_get() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    doc = _mail_channel_doc()
    return {
        "mail_enabled": bool(doc.mail_enabled),
        "mail_imap_host": str(doc.mail_imap_host or ""),
        "mail_imap_port": int(doc.mail_imap_port or 0) or "",
        "mail_use_ssl": bool(doc.mail_use_ssl),
        "mail_username": str(doc.mail_username or ""),
        "mail_smtp_host": str(doc.mail_smtp_host or ""),
        "mail_smtp_port": int(doc.mail_smtp_port or 0) or "",
        "mail_reply_from": str(doc.mail_reply_from or ""),
        "mail_password_configured": bool(doc.get_password("mail_password", raise_exception=False)),
    }


@frappe.whitelist()
def mail_channel_config_set(
    mail_imap_host: str,
    mail_imap_port: int,
    mail_use_ssl: str | int | bool,
    mail_username: str,
    mail_password: str = "",
    mail_smtp_host: str = "",
    mail_smtp_port: int | str = "",
    mail_reply_from: str = "",
    mail_enabled: str | int | bool = True,
) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    doc = _mail_channel_doc()
    doc.mail_enabled = 1 if str(mail_enabled).lower() in ("1", "true", "yes", "on") else 0
    doc.mail_imap_host = str(mail_imap_host or "").strip()
    doc.mail_imap_port = int(mail_imap_port or 0)
    doc.mail_use_ssl = 1 if str(mail_use_ssl).lower() in ("1", "true", "yes", "on") else 0
    doc.mail_username = str(mail_username or "").strip()
    if str(mail_password or ""):
        doc.mail_password = str(mail_password)
    doc.mail_smtp_host = str(mail_smtp_host or "").strip()
    doc.mail_smtp_port = int(mail_smtp_port or 0) if str(mail_smtp_port or "").strip() else 0
    doc.mail_reply_from = str(mail_reply_from or "").strip()
    doc.save(ignore_permissions=True)
    frappe.db.commit()
    return mail_channel_config_get()


@frappe.whitelist()
def agent_run_store(prompt: str, payload_json: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    payload = json.loads(payload_json or "{}")
    run_id = _save_agent_run(prompt, payload)
    payload["run_id"] = run_id
    return payload


@frappe.whitelist()
def agent_run_cancel(run_id: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/agent/run/cancel", {"run_id": run_id})


@frappe.whitelist()
def agent_runs_recent(limit: int = 10) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    rows = frappe.get_all(
        "MMOS Agent Run",
        fields=["name", "prompt", "status", "retrieval_topic", "run_user", "site", "started_at", "duration_ms", "final"],
        order_by="creation desc",
        limit_page_length=max(1, min(int(limit), 30)),
    )
    return {"items": rows}


@frappe.whitelist()
def agent_run_get(run_id: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    doc = frappe.get_doc("MMOS Agent Run", run_id)
    context_used = json.loads(doc.context_json or "[]")
    actions = json.loads(doc.actions_json or "[]")
    return {
        "run_id": doc.name,
        "status": doc.status,
        "thought": doc.thought,
        "retrieval_topic": doc.retrieval_topic,
        "final": doc.final,
        "context_used": context_used,
        "actions": actions,
        "context": {
            "site": doc.site,
            "user": doc.run_user,
        },
        "started_at": str(doc.started_at or ""),
        "finished_at": str(doc.finished_at or ""),
        "duration_ms": doc.duration_ms,
        "prompt": doc.prompt,
    }


@frappe.whitelist(allow_guest=True)
def telemetry() -> dict[str, Any]:
    payload: dict[str, Any] = {}
    try:
        if getattr(frappe.request, "data", None):
            payload = json.loads(frappe.request.data.decode("utf-8") or "{}")
        elif frappe.form_dict:
            payload = dict(frappe.form_dict)
    except Exception:
        payload = dict(frappe.form_dict or {})

    safe_payload = {
        "event": str(payload.get("event") or ""),
        "ts": payload.get("ts"),
        "state": str(payload.get("state") or ""),
        "rischio": str(payload.get("rischio") or ""),
        "confidenza": str(payload.get("confidenza") or ""),
        "type": str(payload.get("type") or ""),
        "surface": str(payload.get("surface") or ""),
        "run_id": str(payload.get("run_id") or ""),
        "user": frappe.session.user,
        "site": frappe.local.site,
    }
    frappe.logger("mmos_telemetry").info(json.dumps(safe_payload, ensure_ascii=True))
    return {"ok": True}


@frappe.whitelist()
def list_servers() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/servers")


@frappe.whitelist()
def storage_status() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/storage/status")


@frappe.whitelist()
def storage_bootstrap() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/storage/bootstrap")


@frappe.whitelist()
def docker_fleet_status() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/docker/fleet")


@frappe.whitelist()
def secrets_status() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/secrets/status")


@frappe.whitelist()
def set_secret(key: str, value: str, path: str | None = None) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/secrets/set", {"key": key, "value": value, "path": path})


@frappe.whitelist()
def delete_secret(key: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/secrets/delete", {"key": key})


@frappe.whitelist()
def reveal_secret(key: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/secrets/reveal", {"key": key})


@frappe.whitelist()
def reveal_all_secrets() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/secrets/reveal-all", {})


@frappe.whitelist()
def import_press_secrets() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/secrets/import/press")


@frappe.whitelist()
def import_remote_secrets(node: str = "press") -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/secrets/import", {"node": node})


@frappe.whitelist()
def import_all_secrets() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/secrets/import-all")


@frappe.whitelist()
def system_updates() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/system/updates")


@frappe.whitelist()
def agents_status() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/agents/status")


@frappe.whitelist()
def workers_status() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/workers/status")


@frappe.whitelist()
def run_agent(agent: str, command: str = "", action: str | None = None) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/agents/run", {"agent": agent, "command": command, "action": action})


@frappe.whitelist()
def run_agent_playbook(agent: str, playbook: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/agents/playbook", {"agent": agent, "playbook": playbook})


@frappe.whitelist()
def rotate_agents() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/agents/rotate", {})


@frappe.whitelist()
def resources_overview() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/resources/overview")


@frappe.whitelist()
def backup_jobs() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/backup/jobs")


@frappe.whitelist()
def providers_status() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/providers/status")


@frappe.whitelist()
def repos_status() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/repos/status")


@frappe.whitelist()
def errors_overview() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/errors/overview")


@frappe.whitelist()
def press_sites() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/press/sites")


@frappe.whitelist()
def press_inventory() -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("GET", "/press/inventory")


@frappe.whitelist()
def run_backup(target: str) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/backup/run", {"target": target})


@frappe.whitelist()
def create_site(hostname: str, server: str = "press") -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/sites/create", {"hostname": hostname, "server": server})


@frappe.whitelist()
def port_scan(name: str, ports: list[int] | None = None) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/ports/scan", {"name": name, "ports": ports or []})


@frappe.whitelist()
def port_policy(name: str | None = None) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    query = f"?name={name}" if name else ""
    return _request("GET", f"/ports/policy{query}")


@frappe.whitelist()
def port_preflight(name: str, service: str, ports: list[int] | None = None) -> dict[str, Any]:
    frappe.only_for(("System Manager", "Administrator"))
    return _request("POST", "/ports/preflight", {"name": name, "service": service, "ports": ports or []})
