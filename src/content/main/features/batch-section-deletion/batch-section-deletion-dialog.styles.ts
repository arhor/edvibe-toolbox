import { css } from 'lit';

export const batchSectionDeletionDialogStyles = css`
    .dialog {
        display: flex;
        flex-direction: column;
        width: min(900px, 96vw);
        max-height: 92vh;
    }

    .dialog header,
    .dialog footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 22px;
        border-bottom: 1px solid var(--toolfox-border-subtle);
    }

    .dialog footer {
        border-bottom: 0;
        border-top: 1px solid var(--toolfox-border-subtle);
    }

    .dialog h2,
    .dialog p {
        margin: 0;
    }

    .dialog header p {
        margin-top: 4px;
        color: var(--toolfox-text-muted);
    }

    .icon {
        min-width: 36px;
        padding: 0;
        font-size: 24px;
        line-height: 1;
    }

    .dialog main {
        display: grid;
        gap: 16px;
        overflow: auto;
        padding: 20px 22px;
    }

    .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .selection {
        margin-left: auto;
        color: var(--toolfox-text-muted);
    }

    .lessons {
        max-height: 280px;
        overflow: auto;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-panel);
        background: var(--toolfox-surface);
    }

    .lesson {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-bottom: 1px solid var(--toolfox-border-subtle);
        font-weight: 400;
    }

    .lesson:last-child {
        border-bottom: 0;
    }

    .preflight,
    .result {
        padding: 14px;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-panel);
    }

    .preflight {
        border: 0;
    }

    .preflight h3,
    .preflight h4 {
        margin: 0 0 8px;
    }

    .preflight dl {
        display: flex;
        gap: 20px;
        margin: 0 0 14px;
    }

    .preflight dl div {
        display: flex;
        gap: 6px;
    }

    .preflight dd {
        margin: 0;
        font-weight: 700;
    }

    .preflight ul {
        margin: 0 0 14px;
        padding-left: 20px;
    }

    .result textarea {
        min-height: 220px;
        resize: vertical;
        font: 12px/1.5 ui-monospace, monospace;
    }

    .result-actions {
        margin-top: 8px;
    }

    @media(max-width:640px) {
        .dialog {
            max-height: 100vh;
        }

        .dialog header,
        .dialog footer,
        .dialog main {
            padding: 14px;
        }

        .preflight dl {
            flex-wrap: wrap;
        }
    }
`;
