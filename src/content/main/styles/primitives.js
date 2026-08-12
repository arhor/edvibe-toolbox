import { css } from 'lit';

export const dialogShellStyles = css`
    [data-part="overlay"] {
        position: fixed;
        inset: 0;
        z-index: var(--edvibe-z-dialog);
        display: grid;
        place-items: center;
        padding: 16px;
        background: var(--edvibe-overlay);
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
        border: 1px solid var(--edvibe-border-subtle);
        border-radius: var(--edvibe-radius-dialog);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
        box-shadow: var(--edvibe-shadow-dialog);
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
        border: 1px solid var(--edvibe-primary);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-surface);
        background: var(--edvibe-primary);
        cursor: pointer;
        font: inherit;
        font-weight: 700;
    }

    [data-control="secondary"] {
        border-color: var(--edvibe-border);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
    }

    [data-control="danger"] {
        border-color: var(--edvibe-danger-border);
        color: var(--edvibe-danger);
        background: var(--edvibe-surface);
    }

    [data-control]:focus-visible,
    [data-field] :is(input, textarea, select):focus-visible {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px var(--edvibe-focus-halo);
    }

    [data-control]:disabled,
    [data-field] :is(input, textarea, select):disabled {
        color: var(--edvibe-text-muted);
        background: var(--edvibe-surface-subtle);
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
        color: var(--edvibe-text);
        font-size: 13px;
        font-weight: 650;
    }

    [data-field] :is(input, textarea, select) {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        padding: 9px 10px;
        border: 1px solid var(--edvibe-border);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
        font: inherit;
    }

    [data-part="help"] { color: var(--edvibe-text-muted); font-size: 11px; }
`;

export const noticeStyles = css`
    [data-notice] {
        padding: 10px 12px;
        border: 1px solid var(--edvibe-info-border);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-info);
        background: var(--edvibe-info-surface);
        font-size: 12px;
        line-height: 1.45;
    }

    [data-notice="success"] { border-color: var(--edvibe-success-border); color: var(--edvibe-success); background: var(--edvibe-success-surface); }
    [data-notice="warning"] { border-color: var(--edvibe-warning-border); color: var(--edvibe-warning); background: var(--edvibe-warning-surface); }
    [data-notice="danger"] { border-color: var(--edvibe-danger-border); color: var(--edvibe-danger); background: var(--edvibe-danger-surface); }
`;

export const progressStyles = css`
    [data-part="progress"] { accent-color: var(--edvibe-primary); }
    [data-part="status"] { color: var(--edvibe-text-muted); font-size: 12px; }
`;

export const emptyStateStyles = css`
    [data-part="empty-state"] {
        padding: 24px;
        border: 1px dashed var(--edvibe-border);
        border-radius: var(--edvibe-radius-panel);
        color: var(--edvibe-text-muted);
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
