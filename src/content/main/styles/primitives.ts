import { css } from 'lit';

export const dialogShellStyles = css`
    [data-part="overlay"] {
        position: fixed;
        inset: 0;
        z-index: var(--toolfox-z-dialog);
        display: grid;
        place-items: center;
        padding: 16px;
        background: var(--toolfox-overlay);
        box-sizing: border-box;
    }

    [data-part="overlay"] *,
    [data-part="overlay"] *::before,
    [data-part="overlay"] *::after {
        box-sizing: border-box;
    }

    [data-part="dialog"] {
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
        overflow: hidden;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-dialog);
        color: var(--toolfox-text);
        background: var(--toolfox-surface);
        box-shadow: var(--toolfox-shadow-dialog);
    }

    @media (max-width: 640px) {
        [data-part="overlay"] { padding: 0; }
        [data-part="dialog"] {
            max-width: 100vw;
            max-height: 100vh;
            border-radius: 0;
        }
    }
`;

export const controlStyles = css`
    [data-control] {
        min-height: 36px;
        padding: 8px 12px;
        border: 1px solid var(--toolfox-primary);
        border-radius: var(--toolfox-radius-control);
        color: var(--toolfox-surface);
        background: var(--toolfox-primary);
        cursor: pointer;
        font: inherit;
        font-weight: 700;
    }

    [data-control="secondary"] {
        border-color: var(--toolfox-border);
        color: var(--toolfox-text);
        background: var(--toolfox-surface);
    }

    [data-control="danger"] {
        border-color: var(--toolfox-danger-border);
        color: var(--toolfox-danger);
        background: var(--toolfox-surface);
    }

    [data-control]:focus-visible,
    [data-field] :is(input, textarea, select):focus-visible {
        outline: 2px solid var(--toolfox-focus-outline);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px var(--toolfox-focus-halo);
    }

    [data-control]:disabled,
    [data-field] :is(input, textarea, select):disabled {
        color: var(--toolfox-text-muted);
        background: var(--toolfox-surface-subtle);
        cursor: default;
        opacity: .72;
    }

    [data-part="actions"] {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
    }
`;

export const fieldStyles = css`
    [data-field] {
        display: grid;
        gap: 4px;
        color: var(--toolfox-text);
        font-size: 13px;
        font-weight: 650;
    }

    [data-field] :is(input, textarea, select) {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        padding: 9px 10px;
        border: 1px solid var(--toolfox-border);
        border-radius: var(--toolfox-radius-control);
        color: var(--toolfox-text);
        background: var(--toolfox-surface);
        font: inherit;
    }

    [data-part="help"] {
        color: var(--toolfox-text-muted);
        font-size: 11px;
        line-height: 1.4;
    }
`;

export const noticeStyles = css`
    [data-notice] {
        padding: 10px 12px;
        border: 1px solid var(--toolfox-info-border);
        border-radius: var(--toolfox-radius-control);
        color: var(--toolfox-info);
        background: var(--toolfox-info-surface);
        font-size: 12px;
        line-height: 1.45;
    }

    [data-notice="success"] {
        border-color: var(--toolfox-success-border);
        color: var(--toolfox-success);
        background: var(--toolfox-success-surface);
    }

    [data-notice="warning"] {
        border-color: var(--toolfox-warning-border);
        color: var(--toolfox-warning);
        background: var(--toolfox-warning-surface);
    }

    [data-notice="danger"] {
        border-color: var(--toolfox-danger-border);
        color: var(--toolfox-danger);
        background: var(--toolfox-danger-surface);
    }
`;

export const progressStyles = css`
    [data-part="progress"] {
        accent-color: var(--toolfox-primary);
    }

    [data-part="status"] {
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }
`;

export const emptyStateStyles = css`
    [data-part="empty-state"] {
        padding: 24px;
        border: 1px dashed var(--toolfox-border);
        border-radius: var(--toolfox-radius-panel);
        color: var(--toolfox-text-muted);
        text-align: center;
    }
`;

export const toolboxPrimitiveStyles = [
    dialogShellStyles,
    controlStyles,
    fieldStyles,
    noticeStyles,
    progressStyles,
    emptyStateStyles
];
