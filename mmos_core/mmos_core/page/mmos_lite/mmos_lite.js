frappe.pages["mmos-lite"].on_page_load = function (wrapper) {
  const page = frappe.ui.make_app_page({
    parent: wrapper,
    title: "MMOS Lite",
    single_column: true,
  })

  function ensureLiteStyles() {
    if (document.getElementById("mmos-lite-runtime-style")) return
    const style = document.createElement("style")
    style.id = "mmos-lite-runtime-style"
    style.textContent = `
.layout-main-section .layout-main .page-body {
  background:
    radial-gradient(circle at top left, rgba(15, 23, 42, 0.08), transparent 28%),
    radial-gradient(circle at top right, rgba(71, 85, 105, 0.08), transparent 26%),
    linear-gradient(180deg, #f5f7fb 0%, #eef2f8 100%);
}
.mmos-lite-shell {
  min-height: calc(100vh - 8rem);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  max-width: 980px;
  margin: 0 auto;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 28px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
}
.mmos-lite-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem 0.6rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  background: linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.86) 100%);
}
.mmos-lite-head h2 {
  margin: 0;
  font-size: 1.35rem;
  color: #0f172a;
}
.mmos-lite-head-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.mmos-lite-statusbar {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  padding: 0.85rem 0 0.25rem;
}
.mmos-lite-pill {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.95);
  background: rgba(248, 250, 252, 0.95);
  color: #334155;
  font-size: 0.84rem;
}
.mmos-lite-pill strong {
  color: #0f172a;
  font-weight: 700;
}
.mmos-lite-toolbar {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.35rem 0 0.5rem;
}
.mmos-lite-launchpad {
  padding: 1rem 1.25rem 0.9rem;
}
.mmos-lite-launchpad-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 0.9rem;
}
.mmos-lite-launchpad-card {
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
  padding: 1rem 1rem 1.05rem;
}
.mmos-lite-launchpad-card.primary {
  background:
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.14), transparent 32%),
    linear-gradient(180deg, #f8fbff 0%, #eff6ff 100%);
  border-color: rgba(147, 197, 253, 0.95);
}
.mmos-lite-launchpad-title {
  margin: 0;
  color: #0f172a;
  font-size: 1.02rem;
}
.mmos-lite-launchpad-subtitle {
  margin-top: 0.32rem;
  color: #64748b;
  font-size: 0.84rem;
  line-height: 1.5;
}
.mmos-lite-launchpad-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.95rem;
}
.mmos-lite-nav-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin-top: 0.95rem;
}
.mmos-lite-nav-tile {
  text-align: left;
  border: 1px solid rgba(203, 213, 225, 0.92);
  border-radius: 16px;
  background: #fff;
  padding: 0.8rem 0.85rem;
  color: #0f172a;
  cursor: pointer;
}
.mmos-lite-nav-tile:hover {
  border-color: rgba(59, 130, 246, 0.45);
  background: #f8fbff;
}
.mmos-lite-nav-tile strong {
  display: block;
  font-size: 0.88rem;
}
.mmos-lite-nav-tile span {
  display: block;
  margin-top: 0.18rem;
  font-size: 0.76rem;
  color: #64748b;
}
.mmos-lite-recent {
  padding: 0 1.25rem 0.9rem;
}
.mmos-lite-recent-box {
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
  padding: 0.95rem 1rem;
}
.mmos-lite-recent-head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}
.mmos-lite-recent-title {
  margin: 0;
  color: #0f172a;
  font-size: 0.96rem;
}
.mmos-lite-recent-subtitle {
  margin-top: 0.18rem;
  color: #64748b;
  font-size: 0.8rem;
}
.mmos-lite-recent-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.mmos-lite-recent-item {
  border: 1px solid rgba(203, 213, 225, 0.92);
  border-radius: 999px;
  background: #fff;
  color: #334155;
  padding: 0.48rem 0.8rem;
  font-size: 0.8rem;
  line-height: 1.2;
  cursor: pointer;
  max-width: 100%;
}
.mmos-lite-recent-item:hover {
  border-color: rgba(59, 130, 246, 0.55);
  background: #eff6ff;
  color: #0f172a;
}
.mmos-lite-recent-item small {
  display: block;
  color: #64748b;
  font-size: 0.7rem;
  margin-top: 0.18rem;
}
.mmos-lite-ops {
  margin: 0 1.25rem 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}
.mmos-lite-controls {
  margin: 0 1.25rem 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.94);
  overflow: hidden;
}
.mmos-lite-controls > summary {
  cursor: pointer;
  list-style: none;
  padding: 0.8rem 1rem;
  font-weight: 600;
  color: #475569;
}
.mmos-lite-controls > summary::-webkit-details-marker {
  display: none;
}
.mmos-lite-controls-body {
  padding: 0 1rem 0.8rem;
}
.mmos-lite-ops > summary {
  cursor: pointer;
  list-style: none;
  padding: 0.95rem 1rem;
  font-weight: 700;
  color: #0f172a;
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%);
}
.mmos-lite-ops > summary::-webkit-details-marker {
  display: none;
}
.mmos-lite-ops-subtitle {
  display: block;
  margin-top: 0.2rem;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
}
.mmos-lite-provider {
  width: 220px;
  border-radius: 14px;
}
.mmos-lite-chip-row {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}
.mmos-lite-chip {
  border: 1px solid rgba(203, 213, 225, 0.92);
  border-radius: 999px;
  background: #fff;
  color: #334155;
  padding: 0.48rem 0.8rem;
  font-size: 0.84rem;
  line-height: 1;
}
.mmos-lite-merge {
  margin: 0 1.25rem 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
}
.mmos-lite-merge-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1rem 0.75rem;
  align-items: center;
}
.mmos-lite-merge-title {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
}
.mmos-lite-merge-subtitle {
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.82rem;
}
.mmos-lite-merge-controls {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto auto;
  gap: 0.75rem;
  padding: 0 1rem 1rem;
  align-items: end;
}
.mmos-lite-merge-field label {
  display: block;
  font-size: 0.76rem;
  color: #64748b;
  margin-bottom: 0.35rem;
  font-weight: 600;
}
.mmos-lite-merge-body {
  border-top: 1px solid rgba(226, 232, 240, 0.92);
  padding: 0.95rem 1rem 1rem;
  display: grid;
  gap: 0.8rem;
}
.mmos-lite-merge-grid {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
}
.mmos-lite-merge-note {
  color: #64748b;
  font-size: 0.82rem;
}
.mmos-lite-merge-list {
  display: grid;
  gap: 0.55rem;
}
.mmos-lite-merge-item {
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.92);
  padding: 0.8rem;
}
.mmos-lite-merge-path {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.3rem;
}
.mmos-lite-merge-snippet {
  white-space: pre-wrap;
  font-size: 0.8rem;
  color: #475569;
}
.mmos-lite-conflicts {
  margin: 0 1.25rem 0.75rem;
  border: 1px solid rgba(252, 165, 165, 0.75);
  border-radius: 20px;
  background: linear-gradient(180deg, #fff8f8 0%, #fff1f2 100%);
  box-shadow: 0 10px 26px rgba(127, 29, 29, 0.04);
}
.mmos-lite-conflict {
  border: 1px solid rgba(252, 165, 165, 0.8);
  background: rgba(255, 255, 255, 0.96);
  border-radius: 14px;
  padding: 0.8rem;
}
.mmos-lite-conflict.low {
  border-left: 4px solid #16a34a;
}
.mmos-lite-conflict.medium {
  border-left: 4px solid #f59e0b;
}
.mmos-lite-conflict.high {
  border-left: 4px solid #dc2626;
}
.mmos-lite-conflict-head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgba(255, 255, 255, 0.97);
  padding-bottom: 0.35rem;
}
.mmos-lite-conflict-meta {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  flex-wrap: wrap;
}
.mmos-lite-conflict-tools {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-wrap: wrap;
}
.mmos-lite-conflict-stats {
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 600;
}
.mmos-lite-conflict-diff {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  margin-top: 0.55rem;
}
.mmos-lite-conflict-col {
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 12px;
  padding: 0.65rem;
}
.mmos-lite-conflict-col strong {
  display: block;
  color: #7f1d1d;
  font-size: 0.76rem;
  margin-bottom: 0.4rem;
}
.mmos-lite-diff {
  display: grid;
  gap: 0.35rem;
}
.mmos-lite-diff-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
.mmos-lite-diff-cell {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 0.76rem;
  line-height: 1.45;
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 1.8rem;
}
.mmos-lite-diff-context {
  background: #f8fafc;
  color: #334155;
}
.mmos-lite-diff-add {
  background: #dcfce7;
  color: #166534;
}
.mmos-lite-diff-remove {
  background: #fee2e2;
  color: #7f1d1d;
}
.mmos-inline-add {
  background: #bbf7d0;
  color: #14532d;
  border-radius: 4px;
  padding: 0 2px;
}
.mmos-inline-remove {
  background: #fecaca;
  color: #7f1d1d;
  border-radius: 4px;
  padding: 0 2px;
}
.mmos-lite-diff-hunk {
  grid-column: 1 / -1;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 0.72rem;
  color: #64748b;
  background: rgba(226, 232, 240, 0.55);
  border-radius: 8px;
  padding: 0.28rem 0.45rem;
  border-left: 3px solid #94a3b8;
}
.mmos-lite-diff-hunk.active {
  outline: 2px solid #2563eb;
  background: #eff6ff;
  color: #1e3a8a;
}
.mmos-lite-hunk-index {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
  margin-top: 0.55rem;
}
.mmos-lite-hunk-index .btn {
  min-width: 2rem;
}
.mmos-lite-resolve-history {
  margin: 0 1.25rem 0.75rem;
  border: 1px solid rgba(203, 213, 225, 0.95);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
}
.mmos-lite-conflict-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.6rem;
}
.mmos-lite-conflict-toggle {
  color: #475569;
  font-size: 0.76rem;
}
.mmos-lite-high-risk {
  margin-left: auto;
}
.mmos-lite-conflict-actions .btn.active {
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.25);
}
.mmos-lite-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-right: 0.4rem;
}
.mmos-lite-badge.source { background: #dcfce7; color: #166534; }
.mmos-lite-badge.target { background: #dbeafe; color: #1e3a8a; }
.mmos-lite-badge.clear { background: #f1f5f9; color: #334155; }
.mmos-lite-badge.current { background: #dbeafe; color: #1d4ed8; }
.mmos-lite-risk {
  display: inline-block;
  font-size: 0.68rem;
  padding: 2px 6px;
  border-radius: 8px;
  font-weight: 600;
  margin-left: 0.4rem;
}
.mmos-lite-risk.low { background: #dcfce7; color: #166534; }
.mmos-lite-risk.medium { background: #fef3c7; color: #92400e; }
.mmos-lite-risk.high { background: #fee2e2; color: #7f1d1d; }
.mmos-lite-thread {
  overflow: auto;
  padding: 0.4rem 0 1.5rem;
  display: grid;
  gap: 1.2rem;
  align-content: start;
}
.mmos-lite-empty {
  width: min(100%, 760px);
  margin: 2rem auto 0;
  padding: 1.8rem;
  text-align: center;
  color: #64748b;
}
.mmos-lite-empty h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
}
.mmos-lite-empty p {
  margin: 0.5rem auto 0;
  max-width: 34rem;
}
.mmos-lite-row {
  width: min(100%, 760px);
  margin: 0 auto;
  display: grid;
  gap: 0.4rem;
}
.mmos-lite-row.user {
  justify-items: end;
}
.mmos-lite-row.assistant,
.mmos-lite-row.system {
  justify-items: start;
}
.mmos-lite-meta {
  color: #64748b;
  font-size: 0.78rem;
  padding: 0 0.15rem;
}
.mmos-lite-bubble {
  width: min(100%, 760px);
  border-radius: 22px;
  padding: 1rem 1.05rem;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: #ffffff;
  color: #0f172a;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}
.mmos-lite-row.user .mmos-lite-bubble {
  width: min(100%, 680px);
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: #f8fafc;
  border-color: rgba(15, 23, 42, 0.9);
}
.mmos-lite-row.system .mmos-lite-bubble {
  background: linear-gradient(180deg, #fff8eb 0%, #fffbf4 100%);
  border-color: rgba(251, 191, 36, 0.45);
}
.mmos-lite-bubble-title {
  font-weight: 700;
  margin-bottom: 0.45rem;
}
.mmos-lite-decision {
  margin-top: 0.8rem;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  padding-top: 0.75rem;
  display: grid;
  gap: 0.45rem;
}
.mmos-lite-decision-row {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}
.mmos-lite-decision-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  border: 1px solid rgba(203, 213, 225, 0.95);
  background: #fff;
  color: #334155;
}
.mmos-lite-decision-pill.safe {
  background: #dcfce7;
  border-color: #bbf7d0;
  color: #166534;
}
.mmos-lite-decision-pill.check {
  background: #fef3c7;
  border-color: #fde68a;
  color: #92400e;
}
.mmos-lite-decision-pill.investigate {
  background: #fee2e2;
  border-color: #fecaca;
  color: #991b1b;
}
.mmos-lite-decision-line {
  color: #334155;
  font-size: 0.86rem;
}
.mmos-lite-decision-line strong {
  color: #0f172a;
  margin-right: 0.35rem;
}
.mmos-lite-bubble-actions {
  display: flex;
  gap: 0.45rem;
  margin-top: 0.7rem;
  flex-wrap: wrap;
}
.mmos-lite-handoff-card {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid rgba(37, 99, 235, 0.28);
  border-radius: 14px;
  background: linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%);
}
.mmos-lite-handoff-header {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.3rem;
}
.mmos-lite-handoff-sub {
  font-size: 0.78rem;
  color: #64748b;
  margin-bottom: 0.7rem;
}
.mmos-lite-bubble pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font: inherit;
  background: transparent;
  border: 0;
  padding: 0;
}
.mmos-lite-answer {
  margin: 0;
  color: #0f172a;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.98rem;
  line-height: 1.6;
}
.mmos-lite-erp-summary {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}
.mmos-lite-erp-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.mmos-lite-erp-stat {
  padding: 12px 14px;
}
.mmos-lite-erp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.mmos-lite-erp-table th,
.mmos-lite-erp-table td {
  padding: 8px 10px;
  border-top: 1px solid rgba(203, 213, 225, 0.92);
  text-align: left;
  vertical-align: top;
}
.mmos-lite-erp-table th {
  color: #64748b;
  font-weight: 700;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.mmos-lite-erp-warning {
  border-color: rgba(180, 83, 9, 0.24);
  background: rgba(245, 158, 11, 0.08);
}
.mmos-lite-compose {
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%);
  padding: 1rem 1.25rem 1.2rem;
}
.mmos-lite-compose-box {
  border: 1px solid rgba(203, 213, 225, 0.95);
  border-radius: 24px;
  background: #fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
}
.mmos-lite-compose textarea {
  min-height: 110px;
  border: 0;
  box-shadow: none;
  resize: none;
  padding: 1rem 1rem 0.75rem;
  border-radius: 24px 24px 0 0;
  font-size: 0.98rem;
  line-height: 1.6;
}
.mmos-lite-compose textarea:focus {
  box-shadow: none;
}
.mmos-lite-compose-bar {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  padding: 0.8rem 1rem 0.95rem;
}
.mmos-lite-hint {
  color: #64748b;
  font-size: 0.82rem;
}
.mmos-lite-compose-actions {
  display: flex;
  gap: 0.55rem;
}
.mmos-lite-raw {
  padding: 0 1.25rem 0.8rem;
}
.mmos-lite-raw details {
  border: 1px solid rgba(226, 232, 240, 0.92);
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.9);
}
.mmos-lite-raw summary {
  cursor: pointer;
  list-style: none;
  padding: 0.85rem 1rem;
  color: #475569;
  font-weight: 600;
}
.mmos-lite-raw summary::-webkit-details-marker {
  display: none;
}
.mmos-lite-raw pre {
  margin: 0;
  padding: 0 1rem 1rem;
  white-space: pre-wrap;
  font-size: 0.83rem;
  color: #334155;
}
.mmos-lite-context {
  padding: 0 1.25rem 0.8rem;
}
.mmos-lite-context details {
  border: 1px solid rgba(226, 232, 240, 0.92);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
}
.mmos-lite-context summary {
  cursor: pointer;
  list-style: none;
  padding: 0.85rem 1rem;
  color: #475569;
  font-weight: 600;
}
.mmos-lite-context summary::-webkit-details-marker {
  display: none;
}
.mmos-lite-context-list {
  display: grid;
  gap: 0.55rem;
  padding: 0 1rem 1rem;
}
.mmos-lite-context-item {
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 14px;
  padding: 0.75rem 0.8rem;
  background: rgba(248, 250, 252, 0.9);
}
.mmos-lite-context-path {
  font-size: 0.8rem;
  color: #0f172a;
  font-weight: 700;
  margin-bottom: 0.2rem;
}
.mmos-lite-context-snippet {
  font-size: 0.82rem;
  color: #475569;
  white-space: pre-wrap;
}
@media (max-width: 768px) {
  .mmos-lite-shell {
    min-height: calc(100vh - 6rem);
    border-radius: 22px;
  }
  .mmos-lite-head,
  .mmos-lite-statusbar,
  .mmos-lite-toolbar,
  .mmos-lite-compose,
  .mmos-lite-raw {
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }
  .mmos-lite-head {
    padding-top: 1rem;
  }
  .mmos-lite-provider {
    width: 100%;
  }
  .mmos-lite-merge {
    margin-left: 0.9rem;
    margin-right: 0.9rem;
  }
  .mmos-lite-recent {
    padding-left: 0.9rem;
    padding-right: 0.9rem;
  }
  .mmos-lite-controls {
    margin-left: 0.9rem;
    margin-right: 0.9rem;
  }
  .mmos-lite-ops {
    margin-left: 0.9rem;
    margin-right: 0.9rem;
  }
  .mmos-lite-conflicts {
    margin-left: 0.9rem;
    margin-right: 0.9rem;
  }
  .mmos-lite-resolve-history {
    margin-left: 0.9rem;
    margin-right: 0.9rem;
  }
  .mmos-lite-merge-controls {
    grid-template-columns: 1fr;
  }
  .mmos-lite-conflict-diff {
    grid-template-columns: 1fr;
  }
  .mmos-lite-diff-row {
    grid-template-columns: 1fr;
  }
  .mmos-lite-conflict-head {
    flex-direction: column;
  }
  .mmos-lite-conflict-actions .btn {
    flex: 1;
  }
.mmos-lite-compose-bar {
    align-items: stretch;
    flex-direction: column;
  }
  .mmos-lite-compose-actions .btn {
    flex: 1;
  }
  .mmos-lite-launchpad-grid,
  .mmos-lite-nav-grid {
    grid-template-columns: 1fr;
  }
}
`
    document.head.appendChild(style)
  }

  ensureLiteStyles()

  $(page.body).html(`
    <div class="mmos-lite-shell">
      <header class="mmos-lite-head">
        <div class="mmos-surface-header">
          <h2 class="mmos-title">MMOS Lite</h2>
          <div class="mmos-sub">Portale operativo unico: workspace AI in Dify, controllo piattaforma in MMOS.</div>
        </div>
        <div class="mmos-lite-head-actions">
          <button class="btn btn-primary btn-sm" data-action="refresh">Aggiorna</button>
        </div>
      </header>

      <section class="mmos-lite-launchpad">
        <div class="mmos-lite-launchpad-grid">
          <div class="mmos-lite-launchpad-card primary">
            <h3 class="mmos-lite-launchpad-title">AI Workspace</h3>
            <div class="mmos-lite-launchpad-subtitle">Apri Dify come workspace principale per agenti, workflow, knowledge e app AI senza passare dal terminale.</div>
            <div class="mmos-lite-launchpad-actions">
              <button class="btn btn-primary btn-sm" data-action="open-workspace">Open AI Workspace</button>
              <button class="btn btn-default btn-sm" data-action="open-agents">Open Agents</button>
            </div>
          </div>
          <div class="mmos-lite-launchpad-card">
            <h3 class="mmos-lite-launchpad-title">Control Plane</h3>
            <div class="mmos-lite-launchpad-subtitle">Le operazioni tecniche restano qui: risorse, monitoraggio, segreti, aggiornamenti e app MMOS.</div>
            <div class="mmos-lite-nav-grid">
              <button class="mmos-lite-nav-tile" data-action="open-resources"><strong>Resources</strong><span>Nodi, servizi, storage, stack</span></button>
              <button class="mmos-lite-nav-tile" data-action="open-monitor"><strong>Monitor</strong><span>Health, segnali, problemi reali</span></button>
              <button class="mmos-lite-nav-tile" data-action="open-secrets"><strong>Secrets</strong><span>Provider, token, chiavi</span></button>
              <button class="mmos-lite-nav-tile" data-action="open-updates"><strong>Updates</strong><span>Cambi recenti e storico operativo</span></button>
            </div>
          </div>
        </div>
      </section>

      <details class="mmos-lite-controls">
        <summary>Workspace controls</summary>
        <div class="mmos-lite-controls-body">
          <section class="mmos-lite-statusbar">
            <div class="mmos-lite-pill"><span>Provider</span><strong data-role="provider-label">Auto</strong></div>
            <div class="mmos-lite-pill"><span>Workers</span><strong data-role="workers">-</strong></div>
            <div class="mmos-lite-pill"><span>Servers</span><strong data-role="servers">-</strong></div>
            <div class="mmos-lite-pill"><span>Sites</span><strong data-role="sites">-</strong></div>
            <div class="mmos-lite-pill"><span>Storage</span><strong data-role="storage">-</strong></div>
          </section>

          <section class="mmos-lite-toolbar">
            <select class="form-control mmos-lite-provider" data-role="provider"></select>
            <div class="mmos-lite-chip-row">
              <button class="mmos-lite-chip" data-prompt="analizza lo stato di tutti i nodi e dimmi solo i problemi reali">Problemi reali</button>
              <button class="mmos-lite-chip" data-prompt="a che punto siamo">Stato progetto</button>
              <button class="mmos-lite-chip" data-prompt="controlla press servizi e stack">Press</button>
              <button class="mmos-lite-chip" data-prompt="controlla storage e backup">Storage</button>
              <button class="mmos-lite-chip" data-prompt="stato agenti">Agenti</button>
            </div>
          </section>
        </div>
      </details>

      <section class="mmos-lite-recent">
        <div class="mmos-lite-recent-box mmos-card">
          <div class="mmos-lite-recent-head">
            <div>
              <h3 class="mmos-lite-recent-title">Recent</h3>
              <div class="mmos-lite-recent-subtitle">Domande recenti pronte da riusare o riaprire nel pannello completo.</div>
            </div>
            <button class="btn btn-default btn-sm" data-action="refresh-recent">Aggiorna</button>
          </div>
          <div class="mmos-lite-recent-list" data-role="recent-list">
            <div class="mmos-lite-merge-note">Nessuna run recente.</div>
          </div>
        </div>
      </section>

      <details class="mmos-lite-ops">
        <summary>Operator tools<span class="mmos-lite-ops-subtitle">Merge preview, conflict viewer e resolve history restano disponibili, ma fuori dal flusso chat.</span></summary>

      <section class="mmos-lite-merge">
        <div class="mmos-lite-merge-head">
          <div>
            <h3 class="mmos-lite-merge-title">Merge Preview</h3>
            <div class="mmos-lite-merge-subtitle">Preview deterministico del merge via control plane, senza scritture.</div>
          </div>
        </div>
        <div class="mmos-lite-merge-controls">
          <div class="mmos-lite-merge-field">
            <label>Source branch</label>
            <select class="form-control" data-role="merge-source"></select>
          </div>
          <div class="mmos-lite-merge-field">
            <label>Target branch</label>
            <select class="form-control" data-role="merge-target"></select>
          </div>
          <button class="btn btn-default btn-sm" data-action="merge-preview">Preview</button>
          <button class="btn btn-primary btn-sm" data-action="merge-execute" disabled>Approve merge</button>
        </div>
        <div class="mmos-lite-merge-body">
          <div class="mmos-lite-merge-grid" data-role="merge-pills">
            <div class="mmos-lite-pill"><span>State</span><strong>Idle</strong></div>
          </div>
          <div class="mmos-lite-merge-note" data-role="merge-note">Seleziona un branch source e genera una preview prima di eseguire il merge.</div>
          <div class="mmos-lite-merge-list" data-role="merge-list">
            <div class="mmos-lite-merge-item">
              <div class="mmos-lite-merge-path">No preview</div>
              <div class="mmos-lite-merge-snippet">Nessun diff disponibile.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="mmos-lite-conflicts">
        <div class="mmos-lite-merge-head">
          <div>
            <h3 class="mmos-lite-merge-title">Conflict Viewer</h3>
            <div class="mmos-lite-merge-subtitle">Confronto read-only fra diff source e target quando il merge è bloccato.</div>
          </div>
          <button class="btn btn-default btn-sm mmos-lite-high-risk" data-action="jump-high-risk">Jump High Risk</button>
        </div>
        <div class="mmos-lite-merge-body">
          <div class="mmos-lite-merge-note" data-role="conflict-note">Nessun conflitto caricato.</div>
          <div data-role="conflict-list">
            <div class="mmos-lite-merge-item">
              <div class="mmos-lite-merge-path">No conflicts</div>
              <div class="mmos-lite-merge-snippet">Il viewer mostra i conflitti dopo una merge preview.</div>
            </div>
          </div>
        </div>
      </section>

      <section class="mmos-lite-resolve-history">
        <div class="mmos-lite-merge-head">
          <div>
            <h3 class="mmos-lite-merge-title">Resolve History</h3>
            <div class="mmos-lite-merge-subtitle">Timeline delle decisioni manuali sui conflitti.</div>
          </div>
        </div>
        <div class="mmos-lite-merge-body">
          <div class="mmos-lite-merge-note" data-role="resolve-history-note">Nessuna history disponibile.</div>
          <div data-role="resolve-history-list">
            <div class="mmos-lite-merge-item">
              <div class="mmos-lite-merge-path">No history</div>
              <div class="mmos-lite-merge-snippet">Le decisioni appariranno qui.</div>
            </div>
          </div>
        </div>
      </section>
      </details>

      <section class="mmos-lite-thread" data-role="history"></section>

      <section class="mmos-lite-compose">
        <div class="mmos-lite-compose-box">
          <textarea class="form-control" rows="3" placeholder="Scrivi come in ChatGPT. Esempio: controlla tutti i nodi e dimmi solo i problemi reali."></textarea>
          <div class="mmos-lite-compose-bar">
            <div class="mmos-lite-hint" data-role="hint">Provider automatico attivo. Codex viene usato solo quando serve davvero.</div>
            <div class="mmos-lite-compose-actions">
              <button class="btn btn-default btn-sm" data-action="reset">Reset</button>
              <button class="btn btn-primary btn-sm" data-action="send">Invia</button>
            </div>
          </div>
        </div>
      </section>

      <section class="mmos-lite-raw">
        <details data-role="raw-panel">
          <summary>Dettaglio tecnico</summary>
          <pre data-role="raw-output">Ready.</pre>
        </details>
      </section>

      <section class="mmos-lite-context">
        <details data-role="context-panel">
          <summary>Context used</summary>
          <div class="mmos-lite-context-list" data-role="context-list">
            <div class="mmos-lite-context-item">
              <div class="mmos-lite-context-path">RAG</div>
              <div class="mmos-lite-context-snippet">Nessun contesto recuperato.</div>
            </div>
          </div>
        </details>
      </section>
    </div>
  `)

  const $root = $(page.body)
  const $history = $root.find("[data-role='history']")
  const $textarea = $root.find("textarea")
  const $raw = $root.find("[data-role='raw-output']")
  const STORAGE_KEY = "mmos_lite_thread_v1"
  let running = false
  let thread = []
  let providers = []
  let bootstrap = null
  let branches = []
  let mergePreview = null
  let conflictPreview = []
  let resolveHistoryPreview = []
  let collapsedConflicts = {}
  let hunkCursor = {}
  let activeConflictPath = ""
  let recentRuns = []

  function escapeHtml(value) {
    return frappe.utils.escape_html(String(value ?? ""))
  }

  function unwrap(payload) {
    return payload?.result ?? payload
  }

  function pretty(payload) {
    return JSON.stringify(payload, null, 2)
  }

  function describeError(error) {
    if (!error) return "Errore sconosciuto"
    if (typeof error === "string") return error
    if (error.message && typeof error.message === "string") return error.message
    if (error.exc && typeof error.exc === "string") return error.exc
    if (error.responseJSON) return pretty(error.responseJSON)
    if (error.responseText) return String(error.responseText)
    return pretty(error)
  }

  function contextItems(payload) {
    if (Array.isArray(payload?.context_used)) return payload.context_used
    const direct = payload?.context?.combined
    if (Array.isArray(direct)) return direct
    const nested = payload?.result?.context?.combined
    if (Array.isArray(nested)) return nested
    const execution = payload?.execution?.context?.combined
    if (Array.isArray(execution)) return execution
    return []
  }

  function currentProvider() {
    return $root.find("[data-role='provider']").val() || "auto"
  }

  function providerLabel(key) {
    const match = providers.find((item) => item.key === key)
    return match ? match.label : key
  }

  function mergeSelections() {
    return {
      source: $root.find("[data-role='merge-source']").val() || "",
      target: $root.find("[data-role='merge-target']").val() || "main",
    }
  }

  function saveThread() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(thread))
  }

  function loadThread() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")
      if (Array.isArray(saved)) thread = saved
    } catch (e) {
      thread = []
    }
  }

  function renderThread() {
    if (!thread.length) {
      $history.html(`
        <div class="mmos-lite-empty">
          <h3>Chat operativa pronta.</h3>
          <p>Usa la barra in basso per ottenere una risposta chiara, una decisione operativa e, solo se serve, il dettaglio tecnico completo.</p>
        </div>
      `)
      return
    }

    $history.html(thread.map((entry) => `
      <article class="mmos-lite-row ${escapeHtml(entry.kind)}">
        <div class="mmos-lite-meta">${escapeHtml(entry.meta || "")}</div>
        <div class="mmos-lite-bubble">
          <div class="mmos-lite-bubble-title">${escapeHtml(entry.title)}</div>
          ${renderEntryBody(entry)}
          ${entry.decision ? renderDecision(entry.decision, entry.runId, entry.prompt) : ""}
          ${renderHandoff(entry)}
        </div>
      </article>
    `).join(""))

    const node = $history.get(0)
    if (node) node.scrollTop = node.scrollHeight
  }

  function push(kind, title, body, meta = "", extra = {}) {
    thread.push({
      kind,
      title,
      body: typeof body === "string" ? body : pretty(body),
      meta,
      runId: extra.runId || "",
      decision: extra.decision || null,
      prompt: extra.prompt || "",
      human: extra.human || "",
      data: extra.data || null,
      actions: Array.isArray(extra.actions) ? extra.actions : [],
      uiSchema: extra.uiSchema || null,
      retrievalTopic: extra.retrievalTopic || "",
    })
    saveThread()
    renderThread()
  }

  function truncate(text, limit = 72) {
    const value = String(text || "").trim()
    if (value.length <= limit) return value
    return `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}…`
  }

  function summarize(message) {
    if (message?.human) return message.human
    if (message?.final) return message.final
    const result = message?.result || {}
    if (result.result) return summarize(result)
    if (result.reply) return result.reply
    if (result.raw?.response) return result.raw.response
    if (result.codex_result?.stdout) return result.codex_result.stdout
    if (result.aider_result?.stdout) return result.aider_result.stdout
    if (result.claude_result?.stdout) return result.claude_result.stdout
    if (message?.resolved_provider && result?.provider && result?.result) return summarize(result)
    const execution = message?.execution?.result || {}
    if (execution.reply) return execution.reply
    if (execution.summary) return typeof execution.summary === "string" ? execution.summary : pretty(execution.summary)
    if (message?.plan?.reason) return message.plan.reason
    return pretty(message)
  }

  function deriveDecision(message) {
    if (window.MMOSDecision && typeof window.MMOSDecision.deriveDecision === "function") {
      return window.MMOSDecision.deriveDecision(message)
    }
    return null
  }

  function formatMoney(value, currency) {
    const amount = Number(value || 0)
    const formatted = amount.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return currency ? `${formatted} ${currency}` : formatted
  }

  function renderAdaptiveBlocks(entry) {
    const data = entry?.data
    if (!data || !Array.isArray(data.unpaid_invoices)) return ""
    const invoices = data.unpaid_invoices
    const currency = data.currency || ""
    const totalDue = Number(data.total_due || 0)
    const warning = entry?.decision?.state === "investigate" || String(data.decision || "") === "critical"
    return `
      <div class="mmos-lite-erp-summary">
        <div class="mmos-lite-erp-grid">
          <div class="mmos-card mmos-lite-erp-stat">
            <div class="mmos-sub">Esposizione totale</div>
            <div class="mmos-title">${escapeHtml(formatMoney(totalDue, currency))}</div>
          </div>
          <div class="mmos-card mmos-lite-erp-stat">
            <div class="mmos-sub">Fatture aperte</div>
            <div class="mmos-title">${escapeHtml(String(invoices.length))}</div>
          </div>
        </div>
        ${warning ? `<div class="mmos-card mmos-lite-erp-warning"><div class="mmos-title">Attenzione</div><div class="mmos-sub">Questa esposizione richiede una verifica operativa più attenta.</div></div>` : ""}
        ${invoices.length ? `
          <div class="mmos-card">
            <div class="mmos-title">Fatture aperte</div>
            <table class="mmos-lite-erp-table">
              <thead><tr><th>Fattura</th><th>Scadenza</th><th>Scoperto</th></tr></thead>
              <tbody>
                ${invoices.slice(0, 8).map((item) => `
                  <tr>
                    <td>${escapeHtml(item.name || "")}</td>
                    <td>${escapeHtml(item.due_date || "-")}</td>
                    <td>${escapeHtml(formatMoney(item.outstanding_amount || 0, item.currency || currency))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : ""}
      </div>
    `
  }

  function renderAdaptiveForm(entry) {
    let schema = entry?.uiSchema
    if ((!schema || schema.type !== "form") && (
      entry?.retrievalTopic === "integration"
      || String(entry?.human || "").toLowerCase().includes("per collegare")
      || Array.isArray(entry?.data?.required_details)
    )) {
      const target = String(entry?.data?.target || "questa integrazione")
      schema = {
        type: "form",
        title: `Dettagli per collegare ${target}`,
        submit_label: "Continua",
        fields: [
          { id: "host", label: "Dove e' installato", type: "text", placeholder: "host, NAS o servizio" },
          { id: "access", label: "Tipo accesso", type: "select", options: ["api", "filesystem"] },
          { id: "usage", label: "Uso", type: "select", options: ["backup", "ai", "file"] },
        ],
      }
    }
    if (!schema || schema.type !== "form" || !Array.isArray(schema.fields) || !schema.fields.length) return ""
    return `
      <div class="mmos-card mmos-adaptive-form" data-role="adaptive-form" data-base-prompt="${escapeHtml(entry.prompt || "")}">
        <div class="mmos-title">${escapeHtml(schema.title || "Dettagli richiesti")}</div>
        <div class="mmos-adaptive-form-grid">
          ${schema.fields.map((field) => `
            <label class="mmos-adaptive-field">
              <span class="mmos-adaptive-label">${escapeHtml(field.label || field.id || "Campo")}</span>
              ${field.type === "select"
                ? `<select class="mmos-adaptive-select" name="${escapeHtml(field.id || "")}">
                    ${(Array.isArray(field.options) ? field.options : []).map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
                  </select>`
                : `<input class="mmos-adaptive-input" type="text" name="${escapeHtml(field.id || "")}" placeholder="${escapeHtml(field.placeholder || "")}" />`
              }
            </label>
          `).join("")}
        </div>
        <div class="mmos-inline-actions">
          <button class="mmos-btn-primary" type="button" data-action="submit-adaptive-form">${escapeHtml(schema.submit_label || "Continua")}</button>
        </div>
      </div>
    `
  }

  function renderEntryBody(entry) {
    const text = entry.kind === "assistant" ? (entry.human || entry.body) : entry.body
    if (entry.kind !== "assistant") {
      return `<pre>${escapeHtml(text)}</pre>`
    }
    return `
      <div class="mmos-lite-answer">${escapeHtml(text)}</div>
      ${renderAdaptiveBlocks(entry)}
      ${renderAdaptiveForm(entry)}
      ${renderSmartActions(entry)}
    `
  }

  function renderSmartActions(entry) {
    const actions = Array.isArray(entry?.actions) ? entry.actions : []
    if (!actions.length) return ""
    return `
      <div class="mmos-inline-actions">
        <div class="mmos-actions-wrapper">
          <button class="mmos-btn-primary" data-action="toggle-actions">Azioni ▾</button>
          <div class="mmos-actions-menu" hidden>
            ${actions.map((action) => `
              <div
                class="mmos-action-item"
                data-action="smart-action"
                data-action-id="${escapeHtml(action.id || "")}"
                data-run-id="${escapeHtml(entry.runId || "")}"
              >
                ${escapeHtml(action.label || "Azione")}
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `
  }

  function renderDecisionActions(decision, runId, prompt) {
    const cta = Array.isArray(decision?.cta) ? decision.cta : []
    const buttons = []
    if ((cta.includes("open_ai") || cta.includes("open_ai_optional")) && runId) {
      buttons.push(`<button class="mmos-btn-primary" data-action="open-agent-run" data-run-id="${escapeHtml(runId)}">Continua in MMOS AI</button>`)
    }
    if (cta.includes("rerun") && prompt) {
      buttons.push(`<button class="btn btn-warning btn-xs" data-action="rerun-decision" data-prompt="${escapeHtml(prompt)}">Rilancia run</button>`)
    }
    if (!buttons.length) return ""
    return `<div class="mmos-lite-bubble-actions">${buttons.join("")}</div>`
  }

  function renderHandoff(entry) {
    if (!entry?.runId || entry?.decision) return ""
    return `
      <div class="mmos-lite-handoff-card mmos-card">
        <div class="mmos-lite-handoff-header mmos-title">Analisi completa disponibile</div>
        <div class="mmos-lite-handoff-sub mmos-sub">Stream, decisione e dettagli esecuzione della stessa run.</div>
        <div class="mmos-inline-actions">
          <button class="mmos-btn-primary" data-action="open-agent-run" data-run-id="${escapeHtml(entry.runId)}">Continua in MMOS AI</button>
        </div>
      </div>
    `
  }

  function renderDecision(decision, runId, prompt) {
    if (!decision) return ""
    if (window.MMOSTelemetry && typeof window.MMOSTelemetry.send === "function") {
      window.MMOSTelemetry.send("decision_rendered", {
        state: decision.state,
        rischio: decision.rischio,
        confidenza: decision.confidenza,
        surface: "mmos_lite",
        run_id: runId || "",
      })
    }
    return `
      <div class="mmos-lite-decision mmos-card">
        <div class="mmos-lite-decision-row">
          <span class="mmos-status mmos-status-${escapeHtml(decision.state || "safe")}">${escapeHtml(decision.esito || "Esito")}</span>
          <span class="mmos-lite-decision-pill">${escapeHtml(`Rischio ${decision.rischio || "-"}`)}</span>
          <span class="mmos-lite-decision-pill">${escapeHtml(`Confidenza ${decision.confidenza || "media"}`)}</span>
        </div>
        <div class="mmos-lite-decision-line"><strong>Decisione</strong>${escapeHtml(decision.decisione || "")}</div>
        <div class="mmos-lite-decision-line"><strong>Prossima azione</strong>${escapeHtml(decision.prossimaAzione || "")}</div>
        ${renderDecisionActions(decision, runId, prompt)}
      </div>
    `
  }

  function renderContext(payload) {
    const items = contextItems(payload)
    const $panel = $root.find("[data-role='context-panel']")
    const $list = $root.find("[data-role='context-list']")
    if (!items.length) {
      $list.html(`
        <div class="mmos-lite-context-item">
          <div class="mmos-lite-context-path">RAG</div>
          <div class="mmos-lite-context-snippet">Nessun contesto recuperato.</div>
        </div>
      `)
      return
    }
    $panel.attr("open", true)
    $list.html(items.map((item) => `
      <div class="mmos-lite-context-item">
        <div class="mmos-lite-context-path">${escapeHtml(item.label || item.path || item.absolute_path || item.source || "entry")}</div>
        <div class="mmos-lite-context-snippet">${escapeHtml(String(item.text || item.path || "").slice(0, 280))}</div>
      </div>
    `).join(""))
  }

  async function run(method, args = {}) {
    const response = await frappe.call({ method, args })
    const message = unwrap(response.message)
    $raw.text(pretty(message))
    renderContext(message)
    if (message?.detail || message?.error || message?.result?.stderr) {
      $root.find("[data-role='raw-panel']").attr("open", true)
    }
    return message
  }

  function updateHint() {
    const provider = currentProvider()
    const text = provider === "auto"
      ? "Provider automatico attivo. Codex e Aider entrano solo quando servono davvero."
      : `Provider selezionato: ${providerLabel(provider)}.`
    $root.find("[data-role='hint']").text(text)
    $root.find("[data-role='provider-label']").text(providerLabel(provider))
  }

  function renderProviders() {
    const html = providers.map((item) => {
      const disabled = item.available ? "" : " disabled"
      const note = item.available ? "" : " [setup]"
      return `<option value="${escapeHtml(item.key)}"${disabled}>${escapeHtml(item.label + note)}</option>`
    }).join("")
    $root.find("[data-role='provider']").html(html || "<option value='auto'>Auto</option>")
    $root.find("[data-role='provider']").val("auto")
    updateHint()
  }

  function renderBranches() {
    const names = branches.map((item) => item.name).filter(Boolean)
    const options = names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")
    const current = mergeSelections()
    const $source = $root.find("[data-role='merge-source']")
    const $target = $root.find("[data-role='merge-target']")
    $source.html(options || "<option value=''>No branches</option>")
    $target.html(options || "<option value=''>No branches</option>")

    if (names.includes(current.source)) {
      $source.val(current.source)
    } else {
      $source.val(names.find((name) => name !== "main") || names[0] || "")
    }

    if (names.includes(current.target)) {
      $target.val(current.target)
    } else {
      $target.val(names.includes("main") ? "main" : (names[0] || ""))
    }
  }

  async function refreshProviders() {
    const message = await run("mmos_core.api.coder_providers")
    providers = message.providers || []
    renderProviders()
    return message
  }

  async function refreshBranches() {
    const message = await run("mmos_core.api.branches_list")
    branches = message.items || []
    renderBranches()
    return message
  }

  async function refreshLite() {
    const message = await run("mmos_core.api.console_lite_bootstrap")
    bootstrap = message
    const summary = message.summary || {}
    const workers = message.workers || {}
    $root.find("[data-role='workers']").text(String(workers.active || 0))
    $root.find("[data-role='servers']").text(String(summary.servers || 0))
    $root.find("[data-role='sites']").text(String(summary.sites || 0))
    $root.find("[data-role='storage']").text(summary.storage_mounted ? (summary.storage_node || "OK") : "OFF")
    return message
  }

  function renderRecent(items) {
    recentRuns = Array.isArray(items) ? items : []
    const $list = $root.find("[data-role='recent-list']")
    if (!recentRuns.length) {
      $list.html(`<div class="mmos-lite-merge-note">Nessuna run recente.</div>`)
      return
    }
    $list.html(recentRuns.slice(0, 5).map((item) => `
      <button class="mmos-lite-recent-item" data-action="use-recent" data-prompt="${escapeHtml(item.prompt || "")}" title="${escapeHtml(item.prompt || "")}">
        ${escapeHtml(truncate(item.prompt || "Run"))}
        <small>${escapeHtml(item.retrieval_topic || "run")}</small>
      </button>
    `).join(""))
  }

  async function refreshRecent() {
    const message = await run("mmos_core.api.agent_runs_recent", { limit: 5 })
    renderRecent(message.items || [])
    return message
  }

  async function sendPrompt(prompt) {
    const clean = String(prompt || "").trim()
    if (!clean || running) return
    running = true
    const chosenProvider = currentProvider()
    push("user", "Prompt", clean, providerLabel(chosenProvider))
    $textarea.val("")

    try {
      const message = chosenProvider === "auto"
        ? await run("mmos_core.api.agent_run", { prompt: clean })
        : chosenProvider === "system-lite"
          ? await run("mmos_core.api.ai_command", { prompt: clean, cheap_first: 1 })
          : await run("mmos_core.api.coder_execute", { provider: chosenProvider, prompt: clean, workdir: "/root" })
      const resolved = message?.resolved_provider ? `via ${providerLabel(message.resolved_provider)}` : providerLabel(chosenProvider)
      push("assistant", "Esito operativo", summarize(message), resolved, {
        runId: message?.run_id || "",
        decision: chosenProvider === "auto" ? deriveDecision(message) : null,
        prompt: clean,
        human: chosenProvider === "auto" ? (message?.human || summarize(message)) : "",
        data: chosenProvider === "auto" ? (message?.data || null) : null,
        actions: chosenProvider === "auto" ? (message?.actions_suggested || []) : [],
        uiSchema: chosenProvider === "auto" ? (message?.ui_schema || null) : null,
        retrievalTopic: chosenProvider === "auto" ? (message?.retrieval_topic || "") : "",
      })
      if (chosenProvider === "auto") {
        refreshRecent().catch(() => {})
      }
    } catch (error) {
      push("system", "Errore", describeError(error), "runtime")
      throw error
    } finally {
      running = false
      $textarea.trigger("focus")
    }
  }

  function parseDiffWithIndex(diffText) {
    const rows = []
    const hunks = []
    let rowIndex = 0
    for (const line of String(diffText || "").split("\n")) {
      if (line.startsWith("@@")) {
        hunks.push({ index: rowIndex, label: line })
        rows.push({ type: "hunk", text: line, rowIndex, hunkIndex: hunks.length - 1 })
      } else if (line.startsWith("+") && !line.startsWith("+++")) {
        rows.push({ type: "add", text: line.slice(1), rowIndex })
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        rows.push({ type: "remove", text: line.slice(1), rowIndex })
      } else {
        rows.push({ type: "context", text: line, rowIndex })
      }
      rowIndex += 1
    }
    return { rows, hunks }
  }

  function buildDiffRows(diffText) {
    return parseDiffWithIndex(diffText).rows.map((line) => {
      if (line.type === "hunk") {
        return { hunk: line.text, rowIndex: line.rowIndex }
      }
      if (line.type === "remove") {
        return { left: { type: "remove", text: line.text }, right: null }
      }
      if (line.type === "add") {
        return { left: null, right: { type: "add", text: line.text } }
      }
      return {
        left: { type: "context", text: line.text },
        right: { type: "context", text: line.text },
      }
    })
  }

  function diffStats(diffText) {
    let add = 0
    let remove = 0
    for (const line of String(diffText || "").split("\n")) {
      if (line.startsWith("+") && !line.startsWith("+++")) add += 1
      if (line.startsWith("-") && !line.startsWith("---")) remove += 1
    }
    return { add, remove }
  }

  function highlightInlineDiff(oldText, newText) {
    if (!oldText || !newText) {
      return {
        left: escapeHtml(oldText || ""),
        right: escapeHtml(newText || ""),
      }
    }

    let start = 0
    let endOld = oldText.length - 1
    let endNew = newText.length - 1

    while (start <= endOld && start <= endNew && oldText[start] === newText[start]) {
      start += 1
    }

    while (endOld >= start && endNew >= start && oldText[endOld] === newText[endNew]) {
      endOld -= 1
      endNew -= 1
    }

    const left = escapeHtml(oldText.slice(0, start))
      + `<span class="mmos-inline-remove">`
      + escapeHtml(oldText.slice(start, endOld + 1))
      + `</span>`
      + escapeHtml(oldText.slice(endOld + 1))

    const right = escapeHtml(newText.slice(0, start))
      + `<span class="mmos-inline-add">`
      + escapeHtml(newText.slice(start, endNew + 1))
      + `</span>`
      + escapeHtml(newText.slice(endNew + 1))

    return { left, right }
  }

  function hunkDomId(path, rowIndex) {
    return `mmos-hunk-${encodeURIComponent(path)}-${rowIndex}`
  }

  function renderHunkIndex(path, hunks) {
    if (!hunks.length) return ""
    return `
      <div class="mmos-lite-hunk-index">
        <button class="btn btn-default btn-xs" data-action="prev-hunk" data-path="${escapeHtml(path)}">Prev</button>
        ${hunks.map((hunk, index) => `
          <button class="btn btn-default btn-xs" data-action="jump-hunk" data-path="${escapeHtml(path)}" data-index="${index}">${index + 1}</button>
        `).join("")}
        <button class="btn btn-default btn-xs" data-action="next-hunk" data-path="${escapeHtml(path)}">Next</button>
      </div>
    `
  }

  function renderDiffTable(diffText, path) {
    const rows = buildDiffRows(diffText)
    const { hunks } = parseDiffWithIndex(diffText)
    return `
      <div class="mmos-lite-diff" data-path="${escapeHtml(path)}">
        ${renderHunkIndex(path, hunks)}
        ${rows.map((row) => {
          if (row.hunk) {
            return `<div class="mmos-lite-diff-hunk" id="${escapeHtml(hunkDomId(path, row.rowIndex))}">${escapeHtml(row.hunk)}</div>`
          }
          const leftType = row.left?.type === "remove" ? "mmos-lite-diff-remove" : "mmos-lite-diff-context"
          const rightType = row.right?.type === "add" ? "mmos-lite-diff-add" : "mmos-lite-diff-context"
          let leftContent = escapeHtml(row.left?.text || "")
          let rightContent = escapeHtml(row.right?.text || "")
          if (row.left && row.right && row.left.type === "context" && row.right.type === "context" && row.left.text !== row.right.text) {
            const inline = highlightInlineDiff(row.left.text, row.right.text)
            leftContent = inline.left
            rightContent = inline.right
          }
          return `
            <div class="mmos-lite-diff-row">
              <div class="mmos-lite-diff-cell ${leftType}">${leftContent}</div>
              <div class="mmos-lite-diff-cell ${rightType}">${rightContent}</div>
            </div>
          `
        }).join("")}
      </div>
    `
  }

  function toggleConflict(path) {
    collapsedConflicts[path] = !collapsedConflicts[path]
    renderConflicts(conflictPreview)
  }

  function getConflictByPath(path) {
    return conflictPreview.find((item) => item.path === path) || null
  }

  function scrollToHunk(path, rowIndex) {
    setActiveHunk(path, rowIndex)
    const element = document.getElementById(hunkDomId(path, rowIndex))
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  function setActiveHunk(path, rowIndex) {
    document
      .querySelectorAll(".mmos-lite-diff-hunk")
      .forEach((element) => element.classList.remove("active"))
    const element = document.getElementById(hunkDomId(path, rowIndex))
    if (element) {
      element.classList.add("active")
    }
  }

  function jumpToHunk(path, index) {
    const conflict = getConflictByPath(path)
    if (!conflict) return
    const { hunks } = parseDiffWithIndex(conflict.source_diff)
    if (!hunks.length || index < 0 || index >= hunks.length) return
    activeConflictPath = path
    hunkCursor[path] = index
    scrollToHunk(path, hunks[index].index)
  }

  function nextHunk(path) {
    const conflict = getConflictByPath(path)
    if (!conflict) return
    const { hunks } = parseDiffWithIndex(conflict.source_diff)
    if (!hunks.length) return
    const current = hunkCursor[path] ?? -1
    const next = Math.min(current + 1, hunks.length - 1)
    activeConflictPath = path
    hunkCursor[path] = next
    scrollToHunk(path, hunks[next].index)
  }

  function prevHunk(path) {
    const conflict = getConflictByPath(path)
    if (!conflict) return
    const { hunks } = parseDiffWithIndex(conflict.source_diff)
    if (!hunks.length) return
    const current = hunkCursor[path] ?? 0
    const prev = Math.max(current - 1, 0)
    activeConflictPath = path
    hunkCursor[path] = prev
    scrollToHunk(path, hunks[prev].index)
  }

  function jumpToFirstHighRisk() {
    const high = conflictPreview.find((item) => item.risk === "high")
    if (!high) return
    activeConflictPath = high.path
    const escapedPath = window.CSS && CSS.escape ? CSS.escape(high.path) : high.path.replace(/"/g, '\\"')
    const element = document.querySelector(`[data-conflict-path="${escapedPath}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  function defaultConflictPath() {
    return activeConflictPath || conflictPreview.find((item) => !collapsedConflicts[item.path])?.path || conflictPreview[0]?.path || ""
  }

  function scrollToConflict(path) {
    if (!path) return
    activeConflictPath = path
    const escapedPath = window.CSS && CSS.escape ? CSS.escape(path) : path.replace(/"/g, '\\"')
    const element = document.querySelector(`[data-conflict-path="${escapedPath}"]`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    renderConflicts(conflictPreview)
  }

  function nextConflict() {
    if (!conflictPreview.length) return
    const currentPath = defaultConflictPath()
    const currentIndex = Math.max(0, conflictPreview.findIndex((item) => item.path === currentPath))
    const nextIndex = Math.min(currentIndex + 1, conflictPreview.length - 1)
    scrollToConflict(conflictPreview[nextIndex]?.path || "")
  }

  function prevConflict() {
    if (!conflictPreview.length) return
    const currentPath = defaultConflictPath()
    const currentIndex = Math.max(0, conflictPreview.findIndex((item) => item.path === currentPath))
    const prevIndex = Math.max(currentIndex - 1, 0)
    scrollToConflict(conflictPreview[prevIndex]?.path || "")
  }

  function nextHighRisk() {
    if (!conflictPreview.length) return
    const currentPath = defaultConflictPath()
    const currentIndex = conflictPreview.findIndex((item) => item.path === currentPath)
    const next = conflictPreview.find((item, index) => index > currentIndex && item.risk === "high")
    if (next) {
      scrollToConflict(next.path)
    }
  }

  function prevHighRisk() {
    if (!conflictPreview.length) return
    const currentPath = defaultConflictPath()
    const currentIndex = conflictPreview.findIndex((item) => item.path === currentPath)
    const reversed = [...conflictPreview].reverse()
    const prev = reversed.find((item, index) => {
      const realIndex = conflictPreview.length - 1 - index
      return realIndex < currentIndex && item.risk === "high"
    })
    if (prev) {
      scrollToConflict(prev.path)
    }
  }

  function isUnresolved(item) {
    return !item.resolution || item.resolution === null
  }

  function nextUnresolved() {
    if (!conflictPreview.length) return
    const currentPath = defaultConflictPath()
    const currentIndex = conflictPreview.findIndex((item) => item.path === currentPath)
    let next = conflictPreview.find((item, index) => index > currentIndex && isUnresolved(item))
    if (!next) {
      next = conflictPreview.find((item) => isUnresolved(item))
    }
    if (next) {
      scrollToConflict(next.path)
    }
  }

  function prevUnresolved() {
    if (!conflictPreview.length) return
    const currentPath = defaultConflictPath()
    const currentIndex = conflictPreview.findIndex((item) => item.path === currentPath)
    const reversed = [...conflictPreview].reverse()
    let prev = reversed.find((item, index) => {
      const realIndex = conflictPreview.length - 1 - index
      return realIndex < currentIndex && isUnresolved(item)
    })
    if (!prev) {
      prev = reversed.find((item) => isUnresolved(item))
    }
    if (prev) {
      scrollToConflict(prev.path)
    }
  }

  function renderConflicts(conflicts) {
    conflictPreview = Array.isArray(conflicts) ? conflicts : []
    conflictPreview.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return (order[a.risk] ?? 2) - (order[b.risk] ?? 2)
    })
    if (!activeConflictPath) {
      const firstHigh = conflictPreview.find((item) => item.risk === "high")
      if (firstHigh) {
        activeConflictPath = firstHigh.path
        setTimeout(() => {
          const escapedPath = window.CSS && CSS.escape ? CSS.escape(firstHigh.path) : firstHigh.path.replace(/"/g, '\\"')
          const element = document.querySelector(`[data-conflict-path="${escapedPath}"]`)
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }, 50)
      }
    }
    const $note = $root.find("[data-role='conflict-note']")
    const $list = $root.find("[data-role='conflict-list']")

    if (!conflictPreview.length) {
      $note.text("Nessun conflitto per la preview corrente.")
      $list.html(`
        <div class="mmos-lite-merge-item">
          <div class="mmos-lite-merge-path">No conflicts</div>
          <div class="mmos-lite-merge-snippet">Il viewer mostra i conflitti dopo una merge preview.</div>
        </div>
      `)
      return
    }

    $note.text(`Conflitti rilevati: ${conflictPreview.length}. Risoluzione manuale richiesta.`)
    $list.html(conflictPreview.map((item) => `
      <div class="mmos-lite-conflict ${escapeHtml(item.risk || "low")}" data-conflict-path="${escapeHtml(item.path)}">
        <div class="mmos-lite-conflict-head">
          <div class="mmos-lite-merge-path">${escapeHtml(item.path)}</div>
          <div class="mmos-lite-conflict-tools">
            <span class="mmos-lite-risk ${escapeHtml(item.risk || "low")}">${escapeHtml(item.risk || "low")}</span>
            ${activeConflictPath === item.path ? `<span class="mmos-lite-badge current">current</span>` : ""}
            ${item.resolution ? `<span class="mmos-lite-pill"><span>Resolution</span><strong>${escapeHtml(item.resolution)}</strong></span>` : ""}
            <span class="mmos-lite-conflict-stats">+${diffStats(item.source_diff).add} / -${diffStats(item.source_diff).remove}</span>
            <button class="btn btn-default btn-xs mmos-lite-conflict-toggle" data-action="toggle-conflict" data-path="${escapeHtml(item.path)}">${collapsedConflicts[item.path] ? "Expand" : "Collapse"}</button>
          </div>
        </div>
        ${collapsedConflicts[item.path] ? "" : `
        <div class="mmos-lite-conflict-diff">
          <div class="mmos-lite-conflict-col">
            <strong>SOURCE</strong>
            ${renderDiffTable(item.source_diff, item.path)}
          </div>
          <div class="mmos-lite-conflict-col">
            <strong>TARGET</strong>
            ${renderDiffTable(item.target_diff, `${item.path}::target`)}
          </div>
        </div>`}
        <div class="mmos-lite-conflict-actions">
          <button class="btn btn-default btn-xs ${item.resolution === "source" ? "active" : ""}" data-action="resolve-conflict" data-resolution="source" data-path="${escapeHtml(item.path)}">Use source</button>
          <button class="btn btn-default btn-xs ${item.resolution === "target" ? "active" : ""}" data-action="resolve-conflict" data-resolution="target" data-path="${escapeHtml(item.path)}">Use target</button>
          <button class="btn btn-default btn-xs" data-action="resolve-conflict" data-resolution="clear" data-path="${escapeHtml(item.path)}">Clear</button>
        </div>
      </div>
    `).join(""))
  }

  function renderResolveHistory(items) {
    resolveHistoryPreview = Array.isArray(items) ? items : []
    const $note = $root.find("[data-role='resolve-history-note']")
    const $list = $root.find("[data-role='resolve-history-list']")

    if (!resolveHistoryPreview.length) {
      $note.text("Nessuna history disponibile.")
      $list.html(`
        <div class="mmos-lite-merge-item">
          <div class="mmos-lite-merge-path">No history</div>
          <div class="mmos-lite-merge-snippet">Nessuna decisione registrata.</div>
        </div>
      `)
      return
    }

    $note.text("Ultime decisioni sui conflitti.")
    $list.html(resolveHistoryPreview.map((item) => {
      const events = (item.history || []).slice(0, 3)
      return `
        <div class="mmos-lite-merge-item">
          <div class="mmos-lite-merge-path">${escapeHtml(item.path)}</div>
          <div class="mmos-lite-merge-snippet">
            ${events.map((ev) => {
              const badgeClass = ev.choice || "clear"
              const label = ev.choice || "clear"
              return `
                <div>
                  <span class="mmos-lite-badge ${escapeHtml(badgeClass)}">${escapeHtml(label)}</span>
                  ${escapeHtml(ev.timestamp || "")}
                </div>
              `
            }).join("")}
          </div>
        </div>
      `
    }).join(""))
  }

  function renderMergePreview(payload) {
    mergePreview = payload || null
    const $pills = $root.find("[data-role='merge-pills']")
    const $note = $root.find("[data-role='merge-note']")
    const $list = $root.find("[data-role='merge-list']")
    const $execute = $root.find("[data-action='merge-execute']")

    if (!mergePreview) {
      $pills.html(`<div class="mmos-lite-pill"><span>State</span><strong>Idle</strong></div>`)
      $note.text("Seleziona un branch source e genera una preview prima di eseguire il merge.")
      $list.html(`
        <div class="mmos-lite-merge-item">
          <div class="mmos-lite-merge-path">No preview</div>
          <div class="mmos-lite-merge-snippet">Nessun diff disponibile.</div>
        </div>
      `)
      $execute.prop("disabled", true)
      renderConflicts([])
      return
    }

    const conflicts = Array.isArray(mergePreview.conflicts) ? mergePreview.conflicts : []
    const blocked = Array.isArray(mergePreview.blocked_paths) ? mergePreview.blocked_paths : []
    const diffEntries = Object.entries(mergePreview.diffs || {})
    const canExecute = !conflicts.length && !blocked.length && !!mergePreview.would_change

    $pills.html([
      `<div class="mmos-lite-pill"><span>Mode</span><strong>${escapeHtml(mergePreview.mode || "merge_preview")}</strong></div>`,
      `<div class="mmos-lite-pill"><span>Would change</span><strong>${mergePreview.would_change ? "Yes" : "No"}</strong></div>`,
      `<div class="mmos-lite-pill"><span>Conflicts</span><strong>${String(conflicts.length)}</strong></div>`,
      `<div class="mmos-lite-pill"><span>Blocked</span><strong>${String(blocked.length)}</strong></div>`,
      `<div class="mmos-lite-pill"><span>Confidence</span><strong>${String(mergePreview.confidence ?? "-")}</strong></div>`,
    ].join(""))

    if (conflicts.length) {
      $note.text(`Merge bloccato: ${conflicts.length} file in conflitto.`)
      $list.html(conflicts.map((path) => `
        <div class="mmos-lite-merge-item">
          <div class="mmos-lite-merge-path">${escapeHtml(path)}</div>
          <div class="mmos-lite-merge-snippet">Conflict detected a livello file.</div>
        </div>
      `).join(""))
    } else if (blocked.length) {
      $note.text(`Merge bloccato: ${blocked.length} path fuori guardrail.`)
      $list.html(blocked.map((path) => `
        <div class="mmos-lite-merge-item">
          <div class="mmos-lite-merge-path">${escapeHtml(path)}</div>
          <div class="mmos-lite-merge-snippet">Path bloccato dai guardrail del control plane.</div>
        </div>
      `).join(""))
    } else if (diffEntries.length) {
      $note.text("Preview pronta. Puoi eseguire il merge dal viewer.")
      $list.html(diffEntries.map(([path, diff]) => `
        <div class="mmos-lite-merge-item">
          <div class="mmos-lite-merge-path">${escapeHtml(path)}</div>
          <div class="mmos-lite-merge-snippet">${escapeHtml(String(diff).slice(0, 360))}</div>
        </div>
      `).join(""))
    } else {
      $note.text("La preview non produce cambiamenti materiali.")
      $list.html(`
        <div class="mmos-lite-merge-item">
          <div class="mmos-lite-merge-path">No diff</div>
          <div class="mmos-lite-merge-snippet">La preview non espone file modificati.</div>
        </div>
      `)
    }

    $execute.prop("disabled", !canExecute)
  }

  async function runMergePreview() {
    const { source, target } = mergeSelections()
    if (!source || !target) {
      frappe.show_alert({ message: "Seleziona source e target branch.", indicator: "orange" })
      return
    }
    const payload = await run("mmos_core.api.branch_merge_preview", {
      source_branch: source,
      target_branch: target,
    })
    const conflictsData = await run("mmos_core.api.branch_conflicts", {
      source_branch: source,
      target_branch: target,
    })
    const historyData = await run("mmos_core.api.branch_resolve_history", {
      source_branch: source,
      target_branch: target,
    })
    payload.conflicts = (conflictsData && conflictsData.conflicts) || payload.conflicts || []
    renderMergePreview(payload)
    renderConflicts(payload.conflicts || [])
    renderResolveHistory(historyData.items || [])
    push("system", "Merge Preview", payload, `${source} -> ${target}`)
  }

  async function runMergeExecute() {
    const { source, target } = mergeSelections()
    if (!mergePreview || !mergePreview.would_change) {
      frappe.show_alert({ message: "Genera prima una preview valida.", indicator: "orange" })
      return
    }
    if ((mergePreview.conflicts || []).length || (mergePreview.blocked_paths || []).length) {
      frappe.show_alert({ message: "Merge bloccato da conflitti o guardrail.", indicator: "red" })
      return
    }
    frappe.confirm(`Eseguire il merge di ${source} in ${target}?`, async () => {
      const payload = await run("mmos_core.api.branch_merge_execute", {
        source_branch: source,
        target_branch: target,
      })
      push("assistant", "Merge Execute", payload, `${source} -> ${target}`)
      renderMergePreview(null)
      await refreshBranches()
    })
  }

  async function resolveConflict(path, resolution) {
    const { source, target } = mergeSelections()
    if (!source || !target || !path) return
    await run("mmos_core.api.branch_resolve_conflict", {
      source_branch: source,
      target_branch: target,
      path,
      resolution,
    })
    await runMergePreview()
  }

  $root.on("click", "[data-action='send']", () => sendPrompt($textarea.val()))
  $root.on("click", "[data-action='reset']", () => {
    thread = []
    saveThread()
    renderThread()
    $raw.text("Ready.")
    renderContext({})
    renderMergePreview(null)
  })
  $root.on("click", "[data-action='refresh']", () => {
    Promise.all([refreshLite(), refreshBranches(), refreshRecent()]).then(([message]) => push("system", "Bootstrap", message, "refresh"))
  })
  $root.on("click", "[data-action='refresh-recent']", () => refreshRecent())
  $root.on("click", "[data-action='use-recent']", function () {
    const prompt = $(this).attr("data-prompt") || ""
    $textarea.val(prompt).trigger("focus")
  })
  $root.on("click", "[data-action='open-agent-run']", function () {
    const runId = $(this).attr("data-run-id") || ""
    const isDecisionCTA = $(this).closest(".mmos-lite-decision").length > 0
    if (window.MMOSTelemetry && typeof window.MMOSTelemetry.send === "function") {
      if (isDecisionCTA) {
        window.MMOSTelemetry.send("cta_clicked", {
          type: "open_ai",
          surface: "mmos_lite",
          run_id: runId,
        })
      } else {
        window.MMOSTelemetry.send("debug_opened_without_cta", {
          surface: "mmos_lite",
          run_id: runId,
        })
      }
    }
    if (!runId) return
    window.open(`/app/mmos-ai?run_id=${encodeURIComponent(runId)}`, "_blank")
  })
  $root.on("click", "[data-action='rerun-decision']", function () {
    const prompt = String($(this).attr("data-prompt") || "").trim()
    if (!prompt) return
    if (window.MMOSTelemetry && typeof window.MMOSTelemetry.send === "function") {
      window.MMOSTelemetry.send("rerun_clicked", {
        surface: "mmos_lite",
      })
    }
    $textarea.val(prompt)
    sendPrompt(prompt).catch(() => {})
  })
  $root.on("click", "[data-action='toggle-actions']", function (e) {
    e.stopPropagation()
    const $menu = $(this).siblings(".mmos-actions-menu")
    $(".mmos-actions-menu").not($menu).attr("hidden", true)
    if ($menu.attr("hidden")) {
      $menu.removeAttr("hidden")
    } else {
      $menu.attr("hidden", true)
    }
  })
  $root.on("click", "[data-action='smart-action']", function () {
    const $menu = $(this).closest(".mmos-actions-menu")
    if ($menu.length) $menu.attr("hidden", true)
    const actionId = String($(this).attr("data-action-id") || "")
    const runId = String($(this).attr("data-run-id") || "")
    if (!actionId) return
    if (window.MMOSTelemetry && typeof window.MMOSTelemetry.send === "function") {
      window.MMOSTelemetry.send("cta_clicked", {
        type: actionId,
        surface: "mmos_lite",
        run_id: runId,
      })
    }
    if (actionId === "open_ai") {
      if (!runId) return
      window.open(`/app/mmos-ai?run_id=${encodeURIComponent(runId)}`, "_blank")
      return
    }
    if (actionId === "send_reminder") {
      frappe.msgprint("Promemoria pronto da inviare. Collego questa azione al workflow ERP nel prossimo step.")
      return
    }
    if (actionId === "send_payment_reminder") {
      frappe.msgprint("Sollecito pagamento pronto. Collego questa azione a ERP o email reale nel prossimo step.")
      return
    }
    if (actionId === "start_collection") {
      frappe.msgprint("Procedura di recupero pronta da avviare. Collego questa azione al workflow reale nel prossimo step.")
    }
  })
  $root.on("click", "[data-action='submit-adaptive-form']", function () {
    const $form = $(this).closest("[data-role='adaptive-form']")
    const basePrompt = String($form.attr("data-base-prompt") || "").trim()
    const values = {}
    $form.find("input[name], select[name], textarea[name]").each(function () {
      values[$(this).attr("name")] = $(this).val()
    })
    const details = []
    if (values.host) details.push(`installato su ${values.host}`)
    if (values.access) details.push(`accesso ${values.access}`)
    if (values.usage) details.push(`uso ${values.usage}`)
    const nextPrompt = `${basePrompt}${details.length ? `. Dettagli: ${details.join(", ")}.` : ""}`.trim()
    if (!nextPrompt) return
    sendPrompt(nextPrompt).catch(() => {})
  })
  $(document).on("click.mmosLiteActions", function () {
    $(".mmos-actions-menu").attr("hidden", true)
  })
  $root.on("click", "[data-action='merge-preview']", () => runMergePreview())
  $root.on("click", "[data-action='merge-execute']", () => runMergeExecute())
  $root.on("click", "[data-action='resolve-conflict']", function () {
    const path = $(this).attr("data-path") || ""
    const resolution = $(this).attr("data-resolution") || ""
    resolveConflict(path, resolution)
  })
  $root.on("click", "[data-action='toggle-conflict']", function () {
    const path = $(this).attr("data-path") || ""
    if (path) toggleConflict(path)
  })
  $root.on("click", "[data-action='jump-hunk']", function () {
    const path = $(this).attr("data-path") || ""
    const index = Number($(this).attr("data-index"))
    if (path) jumpToHunk(path, index)
  })
  $root.on("click", "[data-action='next-hunk']", function () {
    const path = $(this).attr("data-path") || ""
    if (path) nextHunk(path)
  })
  $root.on("click", "[data-action='prev-hunk']", function () {
    const path = $(this).attr("data-path") || ""
    if (path) prevHunk(path)
  })
  $root.on("click", "[data-action='jump-high-risk']", () => jumpToFirstHighRisk())
  $root.on("click", "[data-action='open-console']", () => frappe.set_route("mmos-console"))
  $root.on("click", "[data-action='open-workspace']", () => window.open("https://ai-dify.onekeyco.com/apps", "_blank", "noopener"))
  $root.on("click", "[data-action='open-agents']", () => frappe.set_route("mmos-agents"))
  $root.on("click", "[data-action='open-monitor']", () => frappe.set_route("mmos-monitor"))
  $root.on("click", "[data-action='open-resources']", () => frappe.set_route("mmos-resources"))
  $root.on("click", "[data-action='open-secrets']", () => frappe.set_route("mmos-secrets"))
  $root.on("click", "[data-action='open-updates']", () => frappe.set_route("mmos-updates"))
  $root.on("click", "[data-prompt]", function () {
    const prompt = $(this).attr("data-prompt") || ""
    $textarea.val(prompt)
    sendPrompt(prompt)
  })
  $root.on("change", "[data-role='provider']", updateHint)
  $textarea.on("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendPrompt($textarea.val())
    }
  })

  $(document).on("keydown", (event) => {
    const tag = String(event.target?.tagName || "").toLowerCase()
    if (tag === "textarea" || tag === "input") return
    if (event.shiftKey && (event.key === "U" || event.key === "u")) {
      event.preventDefault()
      nextUnresolved()
      return
    }
    if (event.shiftKey && (event.key === "I" || event.key === "i")) {
      event.preventDefault()
      prevUnresolved()
      return
    }
    if (event.shiftKey && (event.key === "H" || event.key === "h")) {
      event.preventDefault()
      nextHighRisk()
      return
    }
    if (event.shiftKey && (event.key === "L" || event.key === "l")) {
      event.preventDefault()
      prevHighRisk()
      return
    }
    if (event.shiftKey && (event.key === "J" || event.key === "j")) {
      event.preventDefault()
      nextConflict()
      return
    }
    if (event.shiftKey && (event.key === "K" || event.key === "k")) {
      event.preventDefault()
      prevConflict()
      return
    }
    if (event.key === "j" || event.key === "J") {
      const path = defaultConflictPath()
      if (!path) return
      event.preventDefault()
      nextHunk(path)
    }
    if (event.key === "k" || event.key === "K") {
      const path = defaultConflictPath()
      if (!path) return
      event.preventDefault()
      prevHunk(path)
    }
  })

  loadThread()
  renderThread()
  renderMergePreview(null)
  Promise.all([refreshLite(), refreshProviders(), refreshBranches(), refreshRecent()]).then(([bootstrap]) => {
    if (!thread.length) {
      push("system", "Bootstrap", bootstrap, "system")
      const ragPaths = bootstrap?.rag?.paths || []
      if (ragPaths.length) {
        push("system", "RAG", `Indicizzazione pronta per:\n${ragPaths.join("\n")}`, "context")
      }
    }
  })
}
