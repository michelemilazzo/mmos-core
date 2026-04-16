app_name = "mmos_core"
app_title = "MMOS Core"
app_publisher = "OneKeyCo"
app_description = "AI operations console and agent control for MMOS"
app_email = "admin@onekeyco.com"
app_license = "MIT"
app_logo_url = "/assets/mmos_core/images/mmos-mark.svg"
app_home = "/app/mmos-lite"

required_apps = []

app_include_css = [
    "/assets/mmos_core/css/mmos_console.css",
    "/assets/mmos_core/css/mmos.css?v=20260328a",
]
app_include_js = [
    "/assets/mmos_core/js/decision.js",
    "/assets/mmos_core/js/telemetry.js",
]

has_website_permission = {
    "Page": "mmos_core.api.has_page_permission",
}

add_to_apps_screen = [
    {
        "name": "mmos_core",
        "logo": app_logo_url,
        "title": "MMOS Lite",
        "route": app_home,
        "color": "#0f766e",
        "icon": "octicon octicon-cpu",
    },
    {
        "name": "mmos_console",
        "logo": app_logo_url,
        "title": app_title,
        "route": "/app/mmos-console",
        "color": "#115e59",
        "icon": "octicon octicon-terminal",
    },
    {
        "name": "mmos_resources",
        "logo": app_logo_url,
        "title": "MMOS Resources",
        "route": "/app/mmos-resources",
        "color": "#155e75",
        "icon": "octicon octicon-server",
    },
    {
        "name": "mmos_monitor",
        "logo": app_logo_url,
        "title": "MMOS Monitor",
        "route": "/app/mmos-monitor",
        "color": "#0f172a",
        "icon": "octicon octicon-pulse",
    },
    {
        "name": "mmos_secrets",
        "logo": app_logo_url,
        "title": "MMOS Secrets",
        "route": "/app/mmos-secrets",
        "color": "#7c2d12",
        "icon": "octicon octicon-lock",
    },
    {
        "name": "mmos_updates",
        "logo": app_logo_url,
        "title": "MMOS Updates",
        "route": "/app/mmos-updates",
        "color": "#4338ca",
        "icon": "octicon octicon-megaphone",
    },
    {
        "name": "mmos_agents",
        "logo": app_logo_url,
        "title": "MMOS Agents",
        "route": "/app/mmos-agents",
        "color": "#0f172a",
        "icon": "octicon octicon-organization",
    },
]
