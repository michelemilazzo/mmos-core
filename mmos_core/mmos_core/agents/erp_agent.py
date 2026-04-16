from __future__ import annotations

from typing import Any

import frappe
from frappe.exceptions import DoesNotExistError


def analyze_customer_exposure(customer_name: str) -> dict[str, Any]:
    """Read-only customer exposure analysis based on open Sales Invoices."""
    customer_name = str(customer_name or "").strip()
    if not customer_name:
        return {"error": "customer_name is required"}

    try:
        invoices = frappe.get_all(
            "Sales Invoice",
            filters={
                "customer": customer_name,
                "docstatus": 1,
                "outstanding_amount": (">", 0),
            },
            fields=[
                "name",
                "posting_date",
                "grand_total",
                "outstanding_amount",
                "due_date",
                "currency",
            ],
            order_by="due_date asc",
        )
    except DoesNotExistError:
        return {
            "error": "Sales Invoice DocType not available on this site",
            "customer": customer_name,
            "unpaid_invoices": [],
            "total_due": 0.0,
            "currency": "",
            "decision": "unavailable",
            "next_action": "use_erp_site",
        }

    total_due = float(sum(float(item.get("outstanding_amount") or 0) for item in invoices))
    currency = str(invoices[0].get("currency") or "") if invoices else ""

    if total_due <= 0:
        decision = "ok"
        next_action = "none"
    elif total_due < 1000:
        decision = "monitor"
        next_action = "gentle_reminder"
    elif total_due < 10000:
        decision = "follow_up"
        next_action = "send_payment_reminder"
    else:
        decision = "critical"
        next_action = "escalate_collection"

    return {
        "customer": customer_name,
        "unpaid_invoices": invoices,
        "total_due": total_due,
        "currency": currency,
        "decision": decision,
        "next_action": next_action,
    }
