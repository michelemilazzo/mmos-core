import frappe


def get_context(context):
    if frappe.session.user == "Guest":
        frappe.throw("Authentication required")
    context.no_cache = 1
    return context
