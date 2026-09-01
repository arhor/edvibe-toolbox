import { css } from 'lit';

export const videoAttachmentDialogStyles = css`
    .dialog {
        display: flex;
        flex-direction: column;
        width: min(760px, 96vw);
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
    .dialog h3,
    .dialog p {
        margin: 0;
    }

    .dialog header p,
    .selection-header p {
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

    .selection-panel {
        overflow: hidden;
        border: 1px solid var(--toolfox-border-subtle);
        border-radius: var(--toolfox-radius-panel);
        background: var(--toolfox-surface);
    }

    .selection-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--toolfox-border-subtle);
    }

    .selection-header h3 {
        font-size: 14px;
    }

    .selection-header p {
        max-width: 560px;
        font-size: 12px;
        line-height: 1.4;
    }

    .selection-header strong {
        flex: none;
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }

    .lesson-tree,
    .section-list {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .lesson-tree {
        max-height: 420px;
        overflow: auto;
    }

    .lesson-node + .lesson-node {
        border-top: 1px solid var(--toolfox-border-subtle);
    }

    .lesson-row {
        display: grid;
        grid-template-columns: 32px minmax(0, 1fr) auto;
        align-items: center;
        min-height: 44px;
        padding: 4px 12px 4px 8px;
    }

    .expander {
        width: 28px;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: var(--toolfox-radius-control);
        color: var(--toolfox-text-muted);
        background: transparent;
        cursor: pointer;
        font: inherit;
        font-size: 20px;
        line-height: 1;
    }

    .expander:hover:not(:disabled) {
        background: var(--toolfox-surface-subtle);
    }

    .expander:focus-visible {
        outline: 2px solid var(--toolfox-focus-outline);
        outline-offset: 2px;
    }

    .lesson-check,
    .section-check {
        display: flex;
        align-items: center;
        gap: 9px;
        min-width: 0;
        cursor: pointer;
    }

    .lesson-check input,
    .section-check input {
        flex: none;
        margin: 0;
        accent-color: var(--toolfox-primary);
    }

    .lesson-title,
    .section-check span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .lesson-title {
        font-weight: 650;
    }

    .lesson-meta {
        margin-left: 12px;
        color: var(--toolfox-text-muted);
        font-size: 11px;
    }

    .lesson-children {
        padding: 0 12px 10px 40px;
    }

    .section-list {
        border-left: 1px solid var(--toolfox-border-subtle);
        padding-left: 14px;
    }

    .section-check {
        min-height: 34px;
        padding: 3px 0;
        color: var(--toolfox-text);
        font-size: 12px;
    }

    .tree-message {
        padding: 10px 12px;
        color: var(--toolfox-text-muted);
        font-size: 12px;
    }

    .tree-error {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
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

        .selection-header {
            display: grid;
        }

        .lesson-row {
            padding-right: 8px;
        }

        .lesson-children {
            padding-left: 32px;
        }
    }
`;
