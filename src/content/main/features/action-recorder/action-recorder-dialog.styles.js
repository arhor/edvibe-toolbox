import { css } from 'lit';

export const actionRecorderDialogStyles = css`
:host {
    color: var(--edvibe-text);
    font-size: 13px;
    line-height: 1.45;
}

.recorder-overlay[hidden],
.recorder-indicator[hidden] {
    display: none;
}

.recorder-panel {
    display: flex;
    width: min(920px, 100%);
    max-height: calc(100vh - 56px);
    margin: 0 auto;
    flex-direction: column;
    background: var(--edvibe-surface-app);
}

.recorder-header,
.recorder-toolbar {
    display: flex;
    gap: 18px;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    border-bottom: 1px solid var(--edvibe-border-subtle);
    background: var(--edvibe-surface);
}

.recorder-header h2,
.recorder-header p,
.recorder-body h3,
.recorder-notice {
    margin: 0;
}

.recorder-header h2 {
    font-size: 17px;
}

.recorder-subtitle {
    margin-top: 3px !important;
    color: var(--edvibe-text-muted);
    font-size: 12px;
}

.header-actions,
.toolbar-actions,
.recorder-state,
.recorder-summary {
    display: flex;
    gap: 8px;
    align-items: center;
}

.icon-button {
    width: 36px;
    height: 36px;
    padding: 0;
}

.recorder-toolbar {
    padding-block: 11px;
    background: var(--edvibe-surface-subtle);
}

.state-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--edvibe-text-muted);
}

.recorder-state[data-status="recording"] .state-dot {
    background: var(--edvibe-danger);
    box-shadow: 0 0 0 4px var(--edvibe-danger-border);
}

.recorder-state[data-status="limit-reached"] .state-dot {
    background: var(--edvibe-warning);
}

.elapsed {
    min-width: 34px;
    color: var(--edvibe-text-muted);
    font-variant-numeric: tabular-nums;
}

.recorder-body {
    overflow: auto;
    padding: 16px 18px 20px;
}

.recorder-summary {
    margin: 13px 0;
    flex-wrap: wrap;
    color: var(--edvibe-text-muted);
}

.recorder-summary > span {
    padding-right: 10px;
    border-right: 1px solid var(--edvibe-border-subtle);
}

.recorder-summary label {
    margin-left: auto;
}

.recorder-notice {
    margin-bottom: 12px;
}

.recorder-body h3 {
    margin-bottom: 8px;
    font-size: 13px;
}

.operation-list {
    display: grid;
    gap: 7px;
}

.operation {
    border: 1px solid var(--edvibe-border-subtle);
    border-radius: var(--edvibe-radius-panel);
    background: var(--edvibe-surface);
    box-shadow: var(--edvibe-shadow-card);
}

.operation > summary {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr) 76px 92px;
    gap: 9px;
    align-items: center;
    padding: 11px 12px;
    cursor: pointer;
}

.operation-sequence,
.operation-duration {
    color: var(--edvibe-text-muted);
    font-variant-numeric: tabular-nums;
}

.operation-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.operation-result {
    text-align: right;
    color: var(--edvibe-success);
}

.operation-result.is-error {
    color: var(--edvibe-danger);
}

.operation-content {
    padding: 0 12px 12px;
    border-top: 1px solid var(--edvibe-border-subtle);
}

.operation-content > p {
    color: var(--edvibe-text-muted);
    word-break: break-all;
}

.operation-content strong {
    display: block;
    margin: 10px 0 4px;
}

pre {
    width: 100%;
    overflow: auto;
    padding: 10px;
    border: 1px solid var(--edvibe-border-subtle);
    border-radius: var(--edvibe-radius-control);
    color: var(--edvibe-text);
    background: var(--edvibe-surface-subtle);
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    white-space: pre-wrap;
    word-break: break-word;
}

.empty-operations[hidden],
.copy-fallback[hidden],
.recorder-notice[hidden] {
    display: none;
}

.other-section {
    margin-top: 14px;
}

.other-section > summary {
    color: var(--edvibe-text-muted);
    cursor: pointer;
}

.copy-fallback {
    margin-top: 14px;
    color: var(--edvibe-warning);
}

.copy-fallback textarea {
    min-height: 150px;
    margin-top: 5px;
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    white-space: pre-wrap;
    word-break: break-word;
}

.recorder-indicator {
    position: fixed;
    z-index: var(--edvibe-z-dialog);
    right: 20px;
    bottom: 20px;
    display: flex;
    gap: 7px;
    align-items: center;
    padding: 9px 12px;
    border: 1px solid var(--edvibe-border);
    border-radius: var(--edvibe-radius-pill);
    color: var(--edvibe-text);
    background: var(--edvibe-surface);
    box-shadow: var(--edvibe-shadow-card);
    cursor: pointer;
}

.recorder-indicator > span:first-child {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--edvibe-text-muted);
}

.recorder-indicator.is-recording > span:first-child {
    background: var(--edvibe-danger);
    box-shadow: 0 0 0 3px var(--edvibe-danger-border);
}

@media (max-width: 720px) {
    .recorder-header,
    .recorder-toolbar {
        align-items: flex-start;
    }

    .recorder-toolbar,
    .toolbar-actions {
        flex-wrap: wrap;
    }

    .operation > summary {
        grid-template-columns: 28px minmax(0, 1fr);
    }

    .operation-duration,
    .operation-result {
        text-align: left;
    }
}

`;
