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

    .group-list {
        display: grid;
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .group-card {
        display: grid;
        gap: 9px;
        padding: 14px 16px;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-panel);
        background: var(--toolfox-surface-subtle);
    }

    .group-heading {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
    }

    .group-heading strong {
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
        margin: 0 0 12px;
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }

    @media (max-width: 640px) {
        .dialog {
            width: 100vw;
            height: 100vh;
        }

        .content {
            max-height: none;
        }
    }
`;
