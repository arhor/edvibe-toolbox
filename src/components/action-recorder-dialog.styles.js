import { css } from 'lit';

export const actionRecorderDialogStyles = css`
:host {
    color: #172033;
    font: 13px/1.45 Inter, "Segoe UI", system-ui, sans-serif;
}

* {
    box-sizing: border-box;
}

button,
textarea,
input {
    font: inherit;
}

.recorder-overlay {
    position: fixed;
    z-index: 2147483646;
    inset: 0;
    padding: 28px;
    background: rgba(19, 27, 45, 0.52);
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
    overflow: hidden;
    flex-direction: column;
    border: 1px solid #dce2ec;
    border-radius: 14px;
    background: #f5f7fb;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.3);
}

.recorder-header,
.recorder-toolbar {
    display: flex;
    gap: 18px;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    border-bottom: 1px solid #e0e5ee;
    background: #fff;
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
    color: #687386;
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
    width: 31px;
    height: 31px;
    border: 1px solid #d9dfe9;
    border-radius: 7px;
    color: #4e596b;
    background: #fff;
    cursor: pointer;
}

.recorder-toolbar {
    padding-block: 11px;
    background: #fbfcfe;
}

.state-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #9da5b4;
}

.recorder-state[data-status="recording"] .state-dot {
    background: #df3636;
    box-shadow: 0 0 0 4px #fde4e4;
}

.recorder-state[data-status="limit-reached"] .state-dot {
    background: #d58a14;
}

.elapsed {
    min-width: 34px;
    color: #687386;
    font-variant-numeric: tabular-nums;
}

.button {
    padding: 7px 10px;
    border: 1px solid #d5dbe6;
    border-radius: 7px;
    color: #263248;
    background: #fff;
    cursor: pointer;
}

.button.primary {
    border-color: #4055d3;
    color: #fff;
    background: #4055d3;
}

.button.danger {
    border-color: #c93a3a;
    color: #fff;
    background: #c93a3a;
}

.button:disabled {
    color: #9299a7;
    background: #edf0f4;
    cursor: not-allowed;
}

.recorder-body {
    overflow: auto;
    padding: 16px 18px 20px;
}

.privacy-warning {
    padding: 10px 12px;
    border: 1px solid #ecd292;
    border-radius: 8px;
    color: #765313;
    background: #fff8e6;
}

.recorder-summary {
    margin: 13px 0;
    flex-wrap: wrap;
    color: #596579;
}

.recorder-summary > span {
    padding-right: 10px;
    border-right: 1px solid #d9dfe8;
}

.recorder-summary label {
    margin-left: auto;
}

.recorder-notice {
    margin-bottom: 12px;
    padding: 9px 10px;
    border-radius: 7px;
    color: #34503e;
    background: #e6f4eb;
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
    border: 1px solid #dbe1eb;
    border-radius: 9px;
    background: #fff;
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
    color: #778195;
    font-variant-numeric: tabular-nums;
}

.operation-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.operation-result {
    text-align: right;
    color: #28805a;
}

.operation-result.is-error {
    color: #b42f2f;
}

.operation-content {
    padding: 0 12px 12px;
    border-top: 1px solid #e6eaf1;
}

.operation-content > p {
    color: #697487;
    word-break: break-all;
}

.operation-content strong {
    display: block;
    margin: 10px 0 4px;
}

pre,
textarea {
    width: 100%;
    overflow: auto;
    padding: 10px;
    border: 1px solid #dce2eb;
    border-radius: 7px;
    color: #233048;
    background: #f7f9fc;
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    white-space: pre-wrap;
    word-break: break-word;
}

.empty-operations {
    padding: 28px;
    border: 1px dashed #ccd3df;
    border-radius: 9px;
    color: #788397;
    text-align: center;
    background: #fafbfc;
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
    color: #596579;
    cursor: pointer;
}

.copy-fallback {
    display: block;
    margin-top: 14px;
    color: #765313;
}

.copy-fallback textarea {
    min-height: 150px;
    margin-top: 5px;
}

.recorder-indicator {
    position: fixed;
    z-index: 2147483646;
    right: 20px;
    bottom: 20px;
    display: flex;
    gap: 7px;
    align-items: center;
    padding: 9px 12px;
    border: 1px solid #ccd3df;
    border-radius: 999px;
    color: #38445a;
    background: #fff;
    box-shadow: 0 8px 28px rgba(23, 32, 51, 0.2);
    cursor: pointer;
}

.recorder-indicator > span:first-child {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #9da5b4;
}

.recorder-indicator.is-recording > span:first-child {
    background: #df3636;
    box-shadow: 0 0 0 3px #fde4e4;
}

@media (max-width: 720px) {
    .recorder-overlay {
        padding: 8px;
    }

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
