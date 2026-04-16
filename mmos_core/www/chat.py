import frappe


def get_context(context):
    context.no_cache = 1
    context.title = "MMOS Chat"
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.is_guest = frappe.session.user in ("Guest", None)
    context.user = frappe.session.user
    return context
