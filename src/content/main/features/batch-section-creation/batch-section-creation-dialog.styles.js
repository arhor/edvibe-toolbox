import { css } from 'lit';

export const batchSectionCreationDialogStyles = css`
:host {
    all: initial;
}

.edvibe-batch-section-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    box-sizing: border-box;
    background: rgba(15, 23, 42, .68);
    color: #1f2937;
    font-family: "Segoe UI", Arial, sans-serif;
}

.edvibe-batch-section-overlay *,
.edvibe-batch-section-overlay *::before,
.edvibe-batch-section-overlay *::after {
    box-sizing: border-box;
}

[hidden] {
    display: none !important;
}

.edvibe-batch-section-card {
    display: flex;
    flex-direction: column;
    width: min(1120px, calc(100vw - 36px));
    max-height: min(900px, calc(100vh - 36px));
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, .32);
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 30px 100px rgba(15, 23, 42, .46);
}

.edvibe-batch-section-header,
.edvibe-batch-section-footer,
.edvibe-batch-section-heading-row,
.edvibe-batch-section-selection-actions,
.edvibe-batch-section-block header,
.edvibe-batch-section-block-actions,
.edvibe-batch-section-add-actions {
    display: flex;
    align-items: center;
}

.edvibe-batch-section-header {
    flex: 0 0 auto;
    justify-content: space-between;
    gap: 22px;
    padding: 22px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #f8fafc, #eff6ff);
}

.edvibe-batch-section-eyebrow {
    margin: 0 0 4px;
    color: #2563eb;
    font-size: 11px;
    font-weight: 750;
    letter-spacing: .09em;
    text-transform: uppercase;
}

.edvibe-batch-section-header h2,
.edvibe-batch-section-heading-row h3,
.edvibe-batch-section-preview h3,
.edvibe-batch-section-summary h3,
.edvibe-batch-section-results h3,
.edvibe-batch-section-errors h3 {
    margin: 0;
    color: #111827;
}

.edvibe-batch-section-header h2 {
    font-size: 22px;
    line-height: 1.25;
}

.edvibe-batch-section-description,
.edvibe-batch-section-heading-row p {
    margin: 5px 0 0;
    color: #64748b;
    font-size: 13px;
    line-height: 1.45;
}

.edvibe-batch-section-close {
    flex: 0 0 auto;
    padding: 4px 9px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: #64748b;
    font-size: 25px;
    line-height: 1;
    cursor: pointer;
}

.edvibe-batch-section-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    padding: 22px 24px 0;
}

.edvibe-batch-section-grid {
    display: grid;
    grid-template-columns: minmax(280px, .82fr) minmax(380px, 1.18fr);
    gap: 22px;
}

.edvibe-batch-section-column {
    min-width: 0;
}

.edvibe-batch-section-field {
    display: grid;
    gap: 7px;
    color: #374151;
    font-size: 13px;
    font-weight: 650;
}

.edvibe-batch-section-field input,
.edvibe-batch-section-field textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 9px;
    background: #fff;
    color: #111827;
    font: 400 14px/1.45 "Segoe UI", Arial, sans-serif;
    outline: none;
}

.edvibe-batch-section-field textarea {
    resize: vertical;
    min-height: 92px;
}

.edvibe-batch-section-field input:focus,
.edvibe-batch-section-field textarea:focus,
.edvibe-batch-section-lesson:focus-within,
.edvibe-batch-section-overlay button:focus-visible {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .14);
    outline: none;
}

.edvibe-batch-section-heading-row {
    justify-content: space-between;
    gap: 14px;
    margin: 20px 0 10px;
}

.edvibe-batch-section-heading-row h3,
.edvibe-batch-section-preview h3 {
    font-size: 14px;
}

.edvibe-batch-section-selection-actions,
.edvibe-batch-section-add-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
}

.edvibe-batch-section-selection-actions button,
.edvibe-batch-section-add-actions button,
.edvibe-batch-section-block-actions button {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    color: #334155;
    font: 650 12px/1.2 "Segoe UI", Arial, sans-serif;
    cursor: pointer;
}

.edvibe-batch-section-selection-actions button,
.edvibe-batch-section-add-actions button {
    padding: 8px 10px;
}

.edvibe-batch-section-add-actions {
    justify-content: flex-start;
    margin-bottom: 10px;
}

.edvibe-batch-section-add-actions button {
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1d4ed8;
}

.edvibe-batch-section-lessons {
    overflow: auto;
    max-height: 390px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #fff;
}

.edvibe-batch-section-lesson {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 12px;
    border-bottom: 1px solid #f1f5f9;
    color: #1f2937;
    font-size: 13px;
    line-height: 1.4;
    cursor: pointer;
}

.edvibe-batch-section-lesson:last-child {
    border-bottom: 0;
}

.edvibe-batch-section-lesson:hover {
    background: #f8fafc;
}

.edvibe-batch-section-lesson input {
    flex: 0 0 auto;
    margin-top: 2px;
}

.edvibe-batch-section-blocks {
    display: grid;
    gap: 10px;
}

.edvibe-batch-section-block {
    padding: 13px;
    border: 1px solid #dbeafe;
    border-radius: 12px;
    background: #f8fbff;
}

.edvibe-batch-section-block header {
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 11px;
}

.edvibe-batch-section-block strong {
    color: #1e3a8a;
    font-size: 13px;
}

.edvibe-batch-section-block > .edvibe-batch-section-field + .edvibe-batch-section-field {
    margin-top: 10px;
}

.edvibe-batch-section-block-actions {
    gap: 5px;
}

.edvibe-batch-section-block-actions button {
    min-width: 31px;
    padding: 6px 8px;
}

.edvibe-batch-section-block-actions button[data-block-action="remove"] {
    border-color: #fecaca;
    color: #b91c1c;
}

.edvibe-batch-section-preview {
    margin-top: 14px;
    padding: 14px;
    border: 1px dashed #94a3b8;
    border-radius: 12px;
    background: #f8fafc;
}

.edvibe-batch-section-preview-name {
    margin: 8px 0;
    color: #0f172a;
    font-size: 14px;
    font-weight: 700;
}

.edvibe-batch-section-preview ol,
.edvibe-batch-section-summary ul,
.edvibe-batch-section-errors ul {
    margin: 8px 0 0;
    padding-left: 20px;
}

.edvibe-batch-section-preview li,
.edvibe-batch-section-summary li,
.edvibe-batch-section-errors li {
    margin: 4px 0;
    overflow-wrap: anywhere;
}

.edvibe-batch-section-protocol,
.edvibe-batch-section-errors,
.edvibe-batch-section-summary,
.edvibe-batch-section-results {
    margin-top: 18px;
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.48;
}

.edvibe-batch-section-protocol {
    border-color: #fcd34d;
    background: #fffbeb;
    color: #92400e;
}

.edvibe-batch-section-protocol p {
    margin: 5px 0 0;
}

.edvibe-batch-section-errors {
    border-color: #fecaca;
    background: #fef2f2;
    color: #991b1b;
}

.edvibe-batch-section-summary {
    border-color: #bfdbfe;
    background: #eff6ff;
    color: #1e3a8a;
}

.edvibe-batch-section-summary-group {
    margin-top: 13px;
    padding-top: 11px;
    border-top: 1px solid rgba(37, 99, 235, .18);
}

.edvibe-batch-section-summary-group h4 {
    margin: 0;
    color: #1e3a8a;
    font-size: 13px;
}

.edvibe-batch-section-result-list {
    display: grid;
    gap: 8px;
    margin-top: 12px;
}

.edvibe-batch-section-result {
    display: grid;
    grid-template-columns: minmax(160px, 1fr) auto;
    gap: 4px 12px;
    padding: 11px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #fff;
}

.edvibe-batch-section-result strong {
    color: #111827;
}

.edvibe-batch-section-result > span {
    color: #475569;
    font-weight: 700;
}

.edvibe-batch-section-result p,
.edvibe-batch-section-result small {
    grid-column: 1 / -1;
    margin: 0;
    color: #64748b;
    overflow-wrap: anywhere;
}

.edvibe-batch-section-result.is-created {
    border-color: #bbf7d0;
    background: #f0fdf4;
}

.edvibe-batch-section-result.is-failed,
.edvibe-batch-section-result.is-partially_created {
    border-color: #fed7aa;
    background: #fff7ed;
}

.edvibe-batch-section-result.is-rejected,
.edvibe-batch-section-result.is-not_attempted {
    background: #f8fafc;
}

.edvibe-batch-section-fatal-note {
    margin: 12px 0 0;
    padding: 10px 12px;
    border-radius: 9px;
    background: #fef2f2;
    color: #991b1b;
    font-weight: 650;
}

.edvibe-batch-section-empty {
    margin: 0;
    padding: 14px;
    color: #64748b;
    font-size: 13px;
    text-align: center;
}

.edvibe-batch-section-live-region {
    flex: 0 0 auto;
    padding: 14px 24px 0;
}

.edvibe-batch-section-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 7px;
    border: 2px solid #bfdbfe;
    border-top-color: #2563eb;
    border-radius: 50%;
    vertical-align: -3px;
    animation: edvibe-batch-section-spin .8s linear infinite;
}

@keyframes edvibe-batch-section-spin {
    to {
        transform: rotate(360deg);
    }
}

.edvibe-batch-section-status {
    min-height: 19px;
    margin: 0;
    color: #475569;
    font-size: 13px;
    line-height: 1.4;
}

.edvibe-batch-section-status[data-state="error"] {
    color: #b91c1c;
}

.edvibe-batch-section-status[data-state="warning"] {
    color: #a16207;
}

.edvibe-batch-section-progress {
    display: block;
    width: 100%;
    height: 10px;
    margin-top: 9px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    background: #e5e7eb;
    appearance: none;
}

.edvibe-batch-section-progress::-webkit-progress-bar {
    background: #e5e7eb;
}

.edvibe-batch-section-progress::-webkit-progress-value {
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb, #16a34a);
}

.edvibe-batch-section-footer {
    flex: 0 0 auto;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
    padding: 18px 24px 22px;
}

.edvibe-batch-section-footer button {
    padding: 10px 16px;
    border: 1px solid #cbd5e1;
    border-radius: 9px;
    background: #fff;
    color: #334155;
    font: 650 13px/1.2 "Segoe UI", Arial, sans-serif;
    cursor: pointer;
}

.edvibe-batch-section-preflight,
.edvibe-batch-section-confirm {
    border-color: #2563eb !important;
    background: #2563eb !important;
    color: #fff !important;
}

.edvibe-batch-section-overlay button:hover:not(:disabled) {
    filter: brightness(.97);
}

.edvibe-batch-section-overlay button:disabled,
.edvibe-batch-section-overlay input:disabled,
.edvibe-batch-section-overlay textarea:disabled {
    cursor: not-allowed;
    opacity: .56;
}

@media (max-width: 820px) {
    .edvibe-batch-section-grid {
        grid-template-columns: 1fr;
    }

    .edvibe-batch-section-lessons {
        max-height: 260px;
    }
}

@media (max-width: 560px) {
    .edvibe-batch-section-overlay {
        padding: 8px;
    }

    .edvibe-batch-section-card {
        width: 100%;
        max-height: calc(100vh - 16px);
        border-radius: 13px;
    }

    .edvibe-batch-section-header,
    .edvibe-batch-section-body,
    .edvibe-batch-section-live-region,
    .edvibe-batch-section-footer {
        padding-left: 16px;
        padding-right: 16px;
    }

    .edvibe-batch-section-heading-row {
        align-items: flex-start;
        flex-direction: column;
    }

    .edvibe-batch-section-selection-actions {
        justify-content: flex-start;
    }

    .edvibe-batch-section-footer button {
        flex: 1 1 170px;
    }

    .edvibe-batch-section-result {
        grid-template-columns: 1fr;
    }
}

`;
