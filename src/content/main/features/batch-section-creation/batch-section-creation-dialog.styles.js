import { css } from 'lit';

export const batchSectionCreationDialogStyles = css`
    [hidden] {
        display: none !important;
    }

    .edvibe-batch-section-card {
        display: flex;
        flex-direction: column;
        width: min(1120px, calc(100vw - 36px));
        max-height: min(900px, calc(100vh - 36px));
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
        border-bottom: 1px solid var(--edvibe-border-subtle);
        background: var(--edvibe-surface-subtle);
    }

    .edvibe-batch-section-eyebrow {
        margin: 0 0 4px;
        color: var(--edvibe-primary);
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
        color: var(--edvibe-text-strong);
    }

    .edvibe-batch-section-header h2 {
        font-size: 22px;
        line-height: 1.25;
    }

    .edvibe-batch-section-description,
    .edvibe-batch-section-heading-row p {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
        line-height: 1.45;
    }

    .edvibe-batch-section-close {
        flex: 0 0 auto;
        min-width: 36px;
        padding: 0;
        font-size: 25px;
        line-height: 1;
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
        font-size: 13px;
    }

    .edvibe-batch-section-field textarea {
        resize: vertical;
        min-height: 92px;
    }

    .edvibe-batch-section-lesson:focus-within {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: -2px;
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
        gap: 8px;
    }

    .edvibe-batch-section-selection-actions {
        justify-content: flex-end;
    }

    .edvibe-batch-section-add-actions {
        justify-content: flex-start;
        margin-bottom: 10px;
    }

    .edvibe-batch-section-selection-actions button,
    .edvibe-batch-section-add-actions button {
        min-height: 34px;
        padding: 7px 10px;
        font-size: 12px;
    }

    .edvibe-batch-section-lessons {
        overflow: auto;
        max-height: 390px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .edvibe-batch-section-lesson {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 11px 12px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        color: var(--edvibe-text);
        font-size: 13px;
        line-height: 1.4;
        cursor: pointer;
    }

    .edvibe-batch-section-lesson:last-child {
        border-bottom: 0;
    }

    .edvibe-batch-section-lesson:hover {
        background: var(--edvibe-surface-subtle);
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
        border: 1px solid var(--edvibe-info-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-info-surface);
    }

    .edvibe-batch-section-block header {
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 11px;
    }

    .edvibe-batch-section-block strong {
        color: var(--edvibe-info);
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
        min-height: 31px;
        padding: 5px 8px;
        font-size: 12px;
    }

    .edvibe-batch-section-preview {
        margin-top: 14px;
        padding: 14px;
        border: 1px dashed var(--edvibe-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface-subtle);
    }

    .edvibe-batch-section-preview-name {
        margin: 8px 0;
        color: var(--edvibe-text-strong);
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
    .edvibe-batch-section-summary {
        margin-top: 18px;
    }

    .edvibe-batch-section-protocol p {
        margin: 5px 0 0;
    }

    .edvibe-batch-section-summary-group {
        margin-top: 13px;
        padding-top: 11px;
        border-top: 1px solid currentColor;
    }

    .edvibe-batch-section-summary-group h4 {
        margin: 0;
        color: inherit;
        font-size: 13px;
    }

    .edvibe-batch-section-results {
        margin-top: 18px;
        padding: 14px 16px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        font-size: 13px;
        line-height: 1.48;
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
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .edvibe-batch-section-result strong {
        color: var(--edvibe-text-strong);
    }

    .edvibe-batch-section-result > span {
        color: var(--edvibe-text-muted);
        font-weight: 700;
    }

    .edvibe-batch-section-result p,
    .edvibe-batch-section-result small {
        grid-column: 1 / -1;
        margin: 0;
        color: var(--edvibe-text-muted);
        overflow-wrap: anywhere;
    }

    .edvibe-batch-section-result.is-created {
        border-color: var(--edvibe-success-border);
        background: var(--edvibe-success-surface);
    }

    .edvibe-batch-section-result.is-failed,
    .edvibe-batch-section-result.is-partially_created {
        border-color: var(--edvibe-warning-border);
        background: var(--edvibe-warning-surface);
    }

    .edvibe-batch-section-result.is-rejected,
    .edvibe-batch-section-result.is-not_attempted {
        background: var(--edvibe-surface-subtle);
    }

    .edvibe-batch-section-fatal-note {
        margin: 12px 0 0;
        font-weight: 650;
    }

    .edvibe-batch-section-empty {
        margin: 0;
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
        border: 2px solid var(--edvibe-info-border);
        border-top-color: var(--edvibe-primary);
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
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-section-status[data-state="error"] {
        color: var(--edvibe-danger);
    }

    .edvibe-batch-section-status[data-state="warning"] {
        color: var(--edvibe-warning);
    }

    .edvibe-batch-section-progress {
        display: block;
        width: 100%;
        height: 10px;
        margin-top: 9px;
    }

    .edvibe-batch-section-footer {
        flex: 0 0 auto;
        padding: 18px 24px 22px;
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
        .edvibe-batch-section-card {
            width: 100%;
            max-height: 100vh;
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
