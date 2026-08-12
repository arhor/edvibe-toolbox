import { css } from 'lit';

export const executionHistoryDialogStyles = css`
:host {
    --history-accent: var(--edvibe-primary);
    --history-text: var(--edvibe-text);
    --history-muted: var(--edvibe-text-muted);
    --history-border: var(--edvibe-border-subtle);
    --history-surface: var(--edvibe-surface);
    color: var(--history-text);
}

.overlay {
    backdrop-filter: blur(5px);
}

.dialog {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    width: min(1180px, 96vw);
    height: min(820px, 94vh);
    background: var(--edvibe-surface-app);
}

.dialog-header,
.dialog-footer {
    padding: 20px 24px;
    background: var(--history-surface);
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    border-bottom: 1px solid var(--history-border);
}

.eyebrow {
    margin: 0 0 4px;
    color: var(--history-accent);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
}

h2,
h3,
h4,
p {
    margin: 0;
}

h2 {
    font-size: 24px;
    letter-spacing: -.025em;
}

.header-copy {
    margin-top: 5px;
    color: var(--history-muted);
    font-size: 13px;
}

.icon-button {
    width: 38px;
    height: 38px;
    padding: 0;
    font-size: 25px;
    line-height: 1;
}

.workspace {
    display: grid;
    grid-template-columns: minmax(340px, 40%) minmax(0, 1fr);
    min-height: 0;
}

.browser-panel {
    display: flex;
    min-height: 0;
    flex-direction: column;
    padding: 18px;
    border-right: 1px solid var(--history-border);
}

.filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--history-border);
    border-radius: var(--edvibe-radius-panel);
    background: var(--history-surface);
}

.filters [data-field],
.settings-grid [data-field] {
    font-size: 11px;
}

.date-fields {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.filter-actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
}

button.compact {
    min-height: 32px;
    padding: 6px 9px;
    font-size: 11px;
}

.list-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 15px 2px 9px;
}

.list-toolbar strong {
    font-size: 12px;
}

.state-card {
    margin: 0;
}

.state-card.is-error {
    border-color: var(--edvibe-danger-border);
    color: var(--edvibe-danger);
    background: var(--edvibe-danger-surface);
}

.record-list {
    min-height: 0;
    overflow: auto;
    padding-right: 4px;
}

.record-card {
    display: grid;
    width: 100%;
    gap: 5px;
    margin-bottom: 8px;
    padding: 13px;
    border: 1px solid var(--history-border);
    border-radius: var(--edvibe-radius-card);
    color: var(--history-text);
    background: var(--history-surface);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.record-card:hover,
.record-card[aria-pressed="true"] {
    border-color: var(--edvibe-info-border);
    box-shadow: var(--edvibe-shadow-card);
}

.record-card:focus-visible,
summary:focus-visible {
    outline: 3px solid var(--edvibe-focus-outline);
    outline-offset: 2px;
}

.record-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.record-heading strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.status-chip {
    display: inline-flex;
    flex: none;
    padding: 3px 7px;
    border-radius: var(--edvibe-radius-pill);
    color: var(--history-muted);
    background: var(--edvibe-surface-subtle);
    font-size: 10px;
    font-weight: 800;
}

.record-card[data-status="completed"] .status-chip {
    color: var(--edvibe-success);
    background: var(--edvibe-success-surface);
}

.record-card[data-status="completed_with_failures"] .status-chip {
    color: var(--edvibe-warning);
    background: var(--edvibe-warning-surface);
}

.record-card[data-status="interrupted"] .status-chip,
.record-card[data-status="cancelled"] .status-chip {
    color: var(--edvibe-danger);
    background: var(--edvibe-danger-surface);
}

.record-context,
.record-outcome,
time {
    color: var(--history-muted);
    font-size: 11px;
}

time {
    margin-top: 2px;
}

.detail-panel {
    min-width: 0;
    overflow: auto;
    padding: 24px;
    background: var(--history-surface);
}

.detail-placeholder {
    display: grid;
    height: 100%;
    place-content: center;
    justify-items: center;
}

.detail-placeholder span {
    display: grid;
    width: 52px;
    height: 52px;
    place-items: center;
    margin-bottom: 12px;
    border-radius: var(--edvibe-radius-panel);
    color: var(--history-accent);
    background: var(--edvibe-info-surface);
    font-size: 24px;
}

.detail-placeholder h3 {
    color: var(--history-text);
}

.detail-placeholder p {
    margin-top: 5px;
    font-size: 12px;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
}

.detail-header h3 {
    font-size: 20px;
}

.detail-header p {
    margin-top: 4px;
    color: var(--history-muted);
    font-size: 12px;
}

.detail-actions {
    flex-wrap: nowrap;
}

.summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 20px 0;
}

.summary-grid div {
    min-width: 0;
    padding: 12px;
    border: 1px solid var(--history-border);
    border-radius: var(--edvibe-radius-panel);
    background: var(--edvibe-surface-subtle);
}

.summary-grid dt {
    color: var(--history-muted);
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
}

.summary-grid dd {
    overflow-wrap: anywhere;
    margin: 5px 0 0;
    font-size: 12px;
}

.counts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
}

.counts div {
    display: grid;
    gap: 2px;
    padding: 11px;
    border-radius: var(--edvibe-radius-panel);
    background: var(--edvibe-surface-subtle);
}

.counts strong {
    font-size: 18px;
}

.counts span {
    color: var(--history-muted);
    font-size: 10px;
    text-transform: capitalize;
}

.outcomes {
    margin-top: 22px;
}

.outcomes h4 {
    margin-bottom: 10px;
}

.outcome-card {
    margin-bottom: 8px;
    padding: 12px;
    border: 1px solid var(--history-border);
    border-radius: var(--edvibe-radius-panel);
}

.outcome-card > div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.outcome-card p {
    margin-top: 5px;
    color: var(--edvibe-text-muted);
    font-size: 12px;
    line-height: 1.45;
}

.outcome-card small {
    display: block;
    margin-top: 6px;
    color: var(--history-muted);
}

.outcome-card details {
    margin-top: 9px;
    color: var(--history-muted);
    font-size: 11px;
}

.outcome-card pre {
    overflow: auto;
    margin: 7px 0 0;
    padding: 10px;
    border-radius: var(--edvibe-radius-control);
    color: var(--history-text);
    background: var(--edvibe-surface-subtle);
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    white-space: pre-wrap;
}

.interruptions {
    margin-bottom: 22px;
    padding: 14px;
    border: 1px solid var(--edvibe-danger-border);
    border-radius: var(--edvibe-radius-panel);
    background: var(--edvibe-danger-surface);
}

.interruptions > .muted {
    margin: -4px 0 10px;
}

.diagnostics > summary {
    cursor: pointer;
    color: var(--edvibe-text-muted);
    font-weight: 800;
}

.diagnostic-attempts {
    display: grid;
    gap: 10px;
    margin-top: 9px;
}

.diagnostic-attempt {
    min-width: 0;
    padding: 11px;
    border: 1px solid var(--history-border);
    border-radius: var(--edvibe-radius-control);
    background: var(--edvibe-surface-subtle);
}

.diagnostic-metadata {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 0;
}

.diagnostic-metadata div {
    min-width: 0;
}

.diagnostic-metadata dt,
.diagnostic-message strong,
.diagnostic-summaries h5 {
    color: var(--history-muted);
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
}

.diagnostic-metadata dd {
    overflow-wrap: anywhere;
    margin: 2px 0 0;
    color: var(--history-text);
}

.diagnostic-message {
    margin-top: 10px;
}

.diagnostic-message p {
    overflow-wrap: anywhere;
    margin-top: 3px;
}

.diagnostic-summaries {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 10px;
}

.diagnostic-summaries section {
    min-width: 0;
}

.diagnostic-summaries h5 {
    margin: 0;
}

.diagnostic-summaries pre {
    max-width: 100%;
    max-height: 240px;
    overflow: auto;
    overflow-wrap: anywhere;
    word-break: break-word;
    white-space: pre-wrap;
}

.muted {
    color: var(--history-muted);
    font-size: 12px;
}

.dialog-footer {
    border-top: 1px solid var(--history-border);
}

.retention-settings summary {
    cursor: pointer;
    color: var(--edvibe-text-muted);
    font-size: 12px;
    font-weight: 800;
}

.settings-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr 1.5fr auto;
    gap: 10px;
    align-items: end;
    margin-top: 12px;
}

.settings-grid label.checkbox {
    display: flex;
    align-items: center;
    gap: 7px;
    padding-bottom: 9px;
    color: var(--history-muted);
    font-size: 11px;
    font-weight: 700;
}

.settings-grid label.checkbox input {
    width: auto;
}

.footer-actions {
    margin-top: 14px;
}

.toast {
    margin-top: 10px;
    font-size: 11px;
}

@media (max-width: 840px) {
    .dialog {
        width: 100vw;
        height: 100vh;
    }

    .workspace {
        grid-template-columns: 1fr;
        overflow: auto;
    }

    .browser-panel {
        min-height: 450px;
        border-right: 0;
        border-bottom: 1px solid var(--history-border);
    }

    .detail-panel {
        min-height: 500px;
    }

    .diagnostic-metadata,
    .diagnostic-summaries {
        grid-template-columns: 1fr;
    }

    .settings-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        transition: none !important;
    }
}

`;
