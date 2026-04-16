# MMOS Core for Frappe v16

This directory contains the first MMOS application scaffold for a standalone
Frappe v16 deployment. The intent is:

- use Frappe for login, users, roles, sessions, and audit
- keep the AI control plane on `ai-mmos-core`
- expose MMOS actions inside Frappe as a real app

## Current Scope

- Python app package: `mmos_core`
- Frappe hooks and desktop module registration
- whitelisted proxy methods that talk to the existing MMOS control plane
- a lightweight Desk page: `mmos-lite`
- a full Desk page: `mmos-console`
- provider-ready routing for Codex, Ollama models, and optional terminal coders such as Aider

## Official Upstream Base

- Frappe source pinned locally at `/opt/frappe-v16-src`
- checked out tag: `v16.0.0-rc.2`
- Frappe Docker upstream cloned at `/opt/frappe_docker`

## Important Note

Frappe `v16.0.0-rc.2` currently declares `requires-python = ">=3.14,<3.15"` in
its `pyproject.toml`. That makes the v16 path viable in containers, but not a
good idea to force directly onto the host runtime here.

## Next Steps

1. bring up a standalone Frappe v16 stack in containers
2. install `mmos_core` as a custom app
3. migrate the current MMOS console into Frappe assets/routes
4. switch `ai.onekeyco.com` to authenticated Frappe-backed access
