import { css } from 'lit';

export const batchUserOnboardingDialogStyles = css`
    [hidden] {
        display: none !important;
    }

    .dialog {
        display: flex;
        flex-direction: column;
        width: min(1180px, calc(100vw - 32px));
        max-height: min(880px, calc(100vh - 32px));
        padding: 24px;
    }

    .header,
    .footer,
    .email-state,
    .review-toolbar,
    .result-actions {
        display: flex;
        align-items: center;
    }

    .header {
        justify-content: space-between;
        gap: 18px;
    }

    .eyebrow {
        margin: 0 0 4px;
        color: var(--edvibe-primary);
        font-size: 11px;
        font-weight: 750;
        letter-spacing: .08em;
        text-transform: uppercase;
    }

    .header h2 {
        margin: 0;
        color: var(--edvibe-text-strong);
        font-size: 21px;
        line-height: 1.3;
    }

    .description {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    .icon {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .body {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        margin-top: 18px;
    }

    .configure {
        display: grid;
        grid-template-columns: minmax(0, 2fr) minmax(240px, 1fr);
        gap: 14px 18px;
    }

    .field {
        font-size: 13px;
    }

    .emails,
    .report {
        resize: vertical;
    }

    .emails {
        min-height: 112px;
    }

    .report {
        min-height: 190px;
        white-space: pre;
    }

    .email-state {
        grid-column: 1;
        flex-wrap: wrap;
        gap: 8px 16px;
        margin-top: -8px;
    }

    .curator-field {
        grid-column: 2;
        grid-row: 1 / span 2;
    }

    .errors {
        margin-top: 14px;
    }

    .errors p {
        margin: 0;
    }

    .review {
        margin-top: 18px;
    }

    .review-toolbar {
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
        color: var(--edvibe-text-muted);
        font-size: 12px;
    }

    .review-toolbar strong {
        color: var(--edvibe-text);
    }

    .table-wrap {
        overflow: auto;
        max-height: 390px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    table {
        width: 100%;
        min-width: 1020px;
        border-collapse: collapse;
        color: var(--edvibe-text);
        font-size: 12px;
    }

    th,
    td {
        padding: 10px 11px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        text-align: left;
        vertical-align: top;
    }

    th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: var(--edvibe-surface-subtle);
        color: var(--edvibe-text);
        font-weight: 700;
    }

    th:nth-child(4),
    th:nth-child(5),
    td:nth-child(4),
    td:nth-child(5) {
        width: 110px;
        text-align: center;
    }

    th button {
        display: block;
        min-height: 28px;
        margin: 5px auto 0;
        padding: 4px 8px;
        font-size: 10px;
    }

    td strong,
    td small {
        display: block;
        overflow-wrap: anywhere;
    }

    td small {
        margin-top: 3px;
        color: var(--edvibe-text-muted);
    }

    .is-error,
    .row-status {
        overflow-wrap: anywhere;
    }

    .is-error {
        color: var(--edvibe-danger);
    }

    .row-status {
        min-width: 190px;
        color: var(--edvibe-text-muted);
    }

    .preflight,
    .result {
        margin-top: 18px;
        padding: 14px;
        border: 1px solid var(--edvibe-info-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-info-surface);
    }

    .preflight h3 {
        margin: 0 0 7px;
        color: var(--edvibe-text-strong);
        font-size: 15px;
    }

    .preflight p,
    .preflight ul {
        margin: 7px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 12px;
        line-height: 1.45;
    }

    .preflight ul {
        max-height: 190px;
        overflow: auto;
        padding-left: 20px;
    }

    .result-actions {
        margin-top: 10px;
    }

    .live-region {
        flex: 0 0 auto;
        padding-top: 14px;
    }

    .status {
        min-height: 20px;
        margin: 0;
        font-size: 13px;
        line-height: 1.4;
    }

    .progress {
        display: block;
        width: 100%;
        height: 10px;
        margin-top: 9px;
    }

    .footer {
        flex: 0 0 auto;
        margin-top: 18px;
    }

    @media (max-width: 760px) {
        .dialog {
            width: 100%;
            max-height: 100vh;
            padding: 18px;
        }

        .configure {
            grid-template-columns: 1fr;
        }

        .email-state,
        .curator-field {
            grid-column: 1;
            grid-row: auto;
        }
    }
`;
