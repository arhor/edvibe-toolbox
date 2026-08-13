import { css } from 'lit';

export const batchUserManagementDialogStyles = css`
    [hidden] {
        display: none !important;
    }

    .edvibe-batch-user-management-card {
        display: flex;
        flex-direction: column;
        width: min(980px, calc(100vw - 32px));
        max-height: min(820px, calc(100vh - 32px));
        padding: 24px;
    }

    .edvibe-batch-user-management-header,
    .edvibe-batch-user-management-email-state,
    .edvibe-batch-user-management-footer {
        display: flex;
        align-items: center;
    }

    .edvibe-batch-user-management-header {
        justify-content: space-between;
        gap: 16px;
    }

    .edvibe-batch-user-management-header h2 {
        margin: 0;
        color: var(--edvibe-text-strong);
        font-size: 21px;
        line-height: 1.3;
    }

    .edvibe-batch-user-management-description {
        margin: 5px 0 0;
        color: var(--edvibe-text-muted);
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-user-management-close {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .edvibe-batch-user-management-body {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        margin-top: 18px;
    }

    .edvibe-batch-user-management-email-field {
        font-size: 13px;
    }

    .edvibe-batch-user-management-emails {
        min-height: 112px;
        resize: vertical;
        line-height: 1.45;
    }

    .edvibe-batch-user-management-email-state {
        flex-wrap: wrap;
        gap: 8px 16px;
    }

    .edvibe-batch-user-management-email-error {
        flex-basis: 100%;
        color: var(--edvibe-danger);
    }

    .edvibe-batch-user-management-table-wrap {
        overflow: auto;
        max-height: 350px;
        margin-top: 18px;
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .edvibe-batch-user-management-table {
        width: 100%;
        border-collapse: collapse;
        color: var(--edvibe-text);
        font-size: 13px;
    }

    .edvibe-batch-user-management-table th,
    .edvibe-batch-user-management-table td {
        padding: 11px 12px;
        border-bottom: 1px solid var(--edvibe-border-subtle);
        text-align: left;
        vertical-align: top;
    }

    .edvibe-batch-user-management-table th {
        position: sticky;
        top: 0;
        z-index: 1;
        color: var(--edvibe-text);
        background: var(--edvibe-surface-subtle);
        font-size: 12px;
        font-weight: 700;
    }

    .edvibe-batch-user-management-table tr:last-child td {
        border-bottom: 0;
    }

    .edvibe-batch-user-management-table th:nth-child(2),
    .edvibe-batch-user-management-table th:nth-child(3),
    .edvibe-batch-user-management-table td:nth-child(2),
    .edvibe-batch-user-management-table td:nth-child(3) {
        width: 150px;
        text-align: center;
    }

    .edvibe-batch-user-management-table th button {
        display: block;
        min-height: 28px;
        margin: 5px auto 0;
        padding: 4px 8px;
        font-size: 11px;
    }

    .edvibe-batch-user-management-user {
        min-width: 220px;
        overflow-wrap: anywhere;
    }

    .edvibe-batch-user-management-result {
        min-width: 220px;
        color: var(--edvibe-text-muted);
        overflow-wrap: anywhere;
    }

    .edvibe-batch-user-management-errors {
        overflow: auto;
        max-height: 350px;
        margin-top: 18px;
    }

    .edvibe-batch-user-management-error {
        margin: 0;
        color: inherit;
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-user-management-error + .edvibe-batch-user-management-error {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid currentColor;
    }

    .edvibe-batch-user-management-live-region {
        flex: 0 0 auto;
        padding-top: 16px;
    }

    .edvibe-batch-user-management-status {
        min-height: 20px;
        margin: 0;
        font-size: 13px;
        line-height: 1.4;
    }

    .edvibe-batch-user-management-status.is-error {
        color: var(--edvibe-danger);
    }

    .edvibe-batch-user-management-progress {
        display: block;
        width: 100%;
        height: 11px;
        margin-top: 10px;
    }

    .edvibe-batch-user-management-footer {
        flex: 0 0 auto;
        margin-top: 18px;
    }

    @media (max-width: 680px) {
        .edvibe-batch-user-management-card {
            width: 100%;
            max-height: 100vh;
            padding: 18px;
        }

        .edvibe-batch-user-management-table {
            min-width: 760px;
        }
    }
`;
