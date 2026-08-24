import { css } from 'lit';

export const exportProgressDialogStyles = css`
    .card {
        width: min(630px, calc(100vw - 32px));
        padding: 24px;
    }

    h2 {
        margin: 0 0 8px;
        color: var(--edvibe-text-strong);
        font-size: 20px;
        line-height: 1.3;
    }

    .status {
        min-height: 40px;
        margin: 0 0 16px;
        font-size: 14px;
        line-height: 1.4;
        white-space: pre-line;
    }

    .progress {
        height: 12px;
    }

    :host([error]) .progress {
        accent-color: var(--edvibe-danger);
    }

    .meta {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-top: 10px;
        color: var(--edvibe-text-muted);
        font-size: 12px;
    }

    .close {
        display: none;
        width: 100%;
        margin-top: 18px;
        font-size: 13px;
    }

    :host([complete]) .close,
    :host([error]) .close {
        display: block;
    }
`;
