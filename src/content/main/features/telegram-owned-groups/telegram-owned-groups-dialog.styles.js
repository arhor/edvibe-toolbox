import { css } from 'lit';

export const telegramOwnedGroupsDialogStyles = css`
    .dialog {
        width: min(720px, calc(100vw - 32px));
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
    }

    .dialog-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        padding: 20px 22px 16px;
        border-bottom: 1px solid var(--toolfox-border-subtle);
    }

    .dialog-header h2,
    .dialog-header p {
        margin: 0;
    }

    .eyebrow {
        margin-bottom: 4px !important;
        color: var(--toolfox-primary);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
    }

    .header-copy {
        margin-top: 6px !important;
        color: var(--toolfox-text-muted);
        font-size: 13px;
        line-height: 1.45;
    }

    .icon-button {
        width: 36px;
        min-width: 36px;
        padding: 0;
        font-size: 22px;
        line-height: 1;
    }

    .content {
        min-height: 220px;
        max-height: min(620px, calc(100vh - 150px));
        overflow: auto;
        padding: 18px 22px 22px;
    }

    .state-card {
        display: grid;
        place-items: center;
        gap: 10px;
        min-height: 180px;
        padding: 26px;
        border: 1px dashed var(--toolfox-border);
        border-radius: var(--toolfox-radius-panel);
        color: var(--toolfox-text-muted);
        text-align: center;
    }

    .state-card h3,
    .state-card p {
        margin: 0;
    }

    .state-card.is-error {
        border-color: var(--toolfox-danger-border);
        color: var(--toolfox-danger);
        background: var(--toolfox-danger-surface);
    }

    .filter-empty-state {
        min-height: 140px;
    }

    .group-browser {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr) auto;
        gap: 12px;
        min-height: 220px;
    }

    .toolbar {
        display: grid;
        gap: 8px;
    }

    .toolbar-controls {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: end;
        gap: 10px;
    }

    .sort-button {
        white-space: nowrap;
    }

    .group-list-region {
        min-height: 0;
    }

    .group-list,
    .result-list,
    .review-list {
        display: grid;
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .group-card {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 16px;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-panel);
        background: var(--toolfox-surface-subtle);
    }

    .group-card.is-selected {
        border-color: var(--toolfox-primary);
        background: var(--toolfox-primary-surface, var(--toolfox-surface-subtle));
    }

    .selection-control {
        display: grid;
        place-items: center;
        flex: 0 0 auto;
        min-width: 24px;
        min-height: 24px;
        cursor: pointer;
    }

    .selection-control input {
        width: 18px;
        height: 18px;
        margin: 0;
        accent-color: var(--toolfox-primary);
        cursor: pointer;
    }

    .group-body {
        display: grid;
        flex: 1 1 auto;
        gap: 9px;
        min-width: 0;
    }

    .group-heading,
    .result-heading {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
    }

    .group-heading strong,
    .result-heading strong {
        min-width: 0;
        overflow-wrap: anywhere;
        font-size: 14px;
    }

    .kind {
        flex: 0 0 auto;
        color: var(--toolfox-text-muted);
        font-size: 11px;
        font-weight: 700;
    }

    .metadata {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }

    .summary {
        margin: 0;
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }

    .group-actions,
    .selection-actions {
        margin-top: 0;
        padding-top: 14px;
        border-top: 1px solid var(--toolfox-border-subtle);
    }

    .group-actions {
        justify-content: flex-end;
    }

    .selection-actions {
        justify-content: space-between;
    }

    .operation-panel {
        display: grid;
        gap: 16px;
    }

    .operation-panel h3,
    .operation-copy {
        margin: 0;
    }

    .operation-copy {
        margin-top: 5px;
        color: var(--toolfox-text-muted);
        font-size: 12px;
        line-height: 1.45;
    }

    .review-list li,
    .result-card {
        display: grid;
        gap: 5px;
        padding: 11px 13px;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-control);
        background: var(--toolfox-surface-subtle);
    }

    .review-list li {
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: baseline;
    }

    .review-list span,
    .result-heading span {
        color: var(--toolfox-text-muted);
        font-size: 11px;
        font-weight: 700;
    }

    .result-deleted {
        border-color: var(--toolfox-success-border);
    }

    .result-failed {
        border-color: var(--toolfox-danger-border);
    }

    .result-not-attempted {
        border-color: var(--toolfox-warning-border);
    }

    .result-deleting {
        border-color: var(--toolfox-primary);
    }

    .result-error {
        margin: 0;
        color: var(--toolfox-text-muted);
        font-size: 11px;
        line-height: 1.4;
        overflow-wrap: anywhere;
    }

    @media (max-width: 640px) {
        .dialog {
            width: 100vw;
            height: 100vh;
        }

        .content {
            max-height: none;
        }

        .toolbar-controls {
            grid-template-columns: 1fr;
        }

        .sort-button {
            width: 100%;
        }
    }
`;
