from __future__ import annotations

import json
import re
from typing import Any

import frappe


def classify_document_content(title: str = "", content: str = "", source: str = "manual") -> dict[str, Any]:
    text = f"{title}\n{content}".strip().lower()
    document_type = "generic"
    priority = "Medium"
    case_type = "Document Review"
    decision = "review"
    next_action = "manual_review"
    summary = "Documento acquisito e in attesa di revisione."

    if any(token in text for token in ("fattura", "invoice", "pagamento", "payment")):
        document_type = "invoice"
        case_type = "Accounts Receivable"
        decision = "catalog"
        next_action = "verify_payment_flow"
        summary = "Documento classificato come fattura o richiesta di pagamento."
    elif any(token in text for token in ("contratto", "contract", "accordo")):
        document_type = "contract"
        case_type = "Contract Review"
        priority = "High"
        decision = "open_case"
        next_action = "legal_review"
        summary = "Documento classificato come contratto e pronto per apertura pratica."
    elif any(token in text for token in ("reclamo", "claim", "contestazione", "complaint")):
        document_type = "claim"
        case_type = "Customer Claim"
        priority = "High"
        decision = "open_case"
        next_action = "assign_claim_owner"
        summary = "Documento classificato come reclamo o contestazione."
    elif any(token in text for token in ("kpi", "report", "bilancio", "statement")):
        document_type = "report"
        case_type = "Operational Review"
        decision = "catalog"
        next_action = "route_to_ops"
        summary = "Documento classificato come report operativo."

    customer = extract_customer_reference(title=title, content=content)

    return {
        "document_type": document_type,
        "case_type": case_type,
        "priority": priority,
        "decision": decision,
        "next_action": next_action,
        "summary": summary,
        "customer": customer,
        "source": source,
    }


def extract_customer_reference(title: str = "", content: str = "") -> str:
    text = f"{title}\n{content}".strip()
    match = re.search(r"\b(?:cliente|customer)\s+([A-Za-z0-9_.@&' -]{2,80})", text, flags=re.IGNORECASE)
    if not match:
        return ""
    value = re.split(
        r"\s+(?:fattura|invoice|contratto|contract|reclamo|claim|pagamento|payment)\b",
        match.group(1),
        maxsplit=1,
        flags=re.IGNORECASE,
    )[0].strip(" ,.:;")
    return value


def create_document_case(
    title: str,
    content: str,
    source: str = "manual",
    sender: str = "",
    customer: str = "",
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    title = str(title or "").strip() or "Untitled document"
    content = str(content or "").strip()
    source = str(source or "manual").strip() or "manual"
    sender = str(sender or "").strip()
    metadata = metadata or {}

    analysis = classify_document_content(title=title, content=content, source=source)
    customer = str(customer or analysis.get("customer") or "").strip()

    document_doc = frappe.get_doc(
        {
            "doctype": "MMOS Document",
            "title": title,
            "source": source,
            "sender": sender,
            "customer": customer,
            "document_type": analysis["document_type"],
            "status": "Received",
            "summary": analysis["summary"],
            "content_excerpt": content[:2000],
            "extracted_data_json": json.dumps(
                {
                    "analysis": analysis,
                    "metadata": metadata,
                },
                ensure_ascii=True,
            ),
        }
    )
    document_doc.insert(ignore_permissions=True)

    case_doc = frappe.get_doc(
        {
            "doctype": "MMOS Case",
            "title": f"{analysis['case_type']}: {title[:100]}",
            "case_type": analysis["case_type"],
            "customer": customer,
            "priority": analysis["priority"],
            "status": "Open",
            "source": source,
            "summary": analysis["summary"],
            "next_action": analysis["next_action"],
            "document": document_doc.name,
        }
    )
    case_doc.insert(ignore_permissions=True)

    document_doc.linked_case = case_doc.name
    document_doc.save(ignore_permissions=True)
    frappe.db.commit()

    return {
        "document": {
            "name": document_doc.name,
            "title": document_doc.title,
            "document_type": document_doc.document_type,
            "status": document_doc.status,
        },
        "case": {
            "name": case_doc.name,
            "title": case_doc.title,
            "case_type": case_doc.case_type,
            "priority": case_doc.priority,
            "status": case_doc.status,
            "next_action": case_doc.next_action,
        },
        "decision": analysis["decision"],
        "next_action": analysis["next_action"],
        "summary": analysis["summary"],
        "customer": customer,
    }
