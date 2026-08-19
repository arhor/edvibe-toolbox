import { css } from 'lit';

export const popupToolCardStyles = css`
    :host {
        display: block;
    }

    button {
        display: block;
        width: 100%;
        margin: 0;
        padding: 13px;
        border: 1px solid var(--edvibe-border);
        border-radius: var(--edvibe-radius-panel);
        color: var(--edvibe-text);
        background: var(--edvibe-surface);
        box-shadow: var(--edvibe-shadow-card);
        cursor: pointer;
        font: inherit;
        text-align: left;
        transition: border-color 120ms ease, background 120ms ease,
            box-shadow 120ms ease, transform 120ms ease;
    }

    button:hover:not(:disabled) {
        border-color: color-mix(in srgb, var(--edvibe-brand) 45%, var(--edvibe-border));
        box-shadow: 0 4px 12px color-mix(in srgb, var(--edvibe-text-strong) 9%, transparent);
        transform: translateY(-1px);
    }

    button:focus-visible {
        outline: 2px solid var(--edvibe-focus-outline);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px var(--edvibe-focus-halo);
    }

    button:disabled {
        color: var(--edvibe-text-muted);
        background: var(--edvibe-surface-subtle);
        box-shadow: none;
        cursor: default;
        opacity: .72;
    }

    button:disabled .tool-title {
        color: var(--edvibe-text-muted);
    }

    button[data-danger="true"]:not(:disabled) {
        border-color: var(--edvibe-danger-border);
    }

    button[data-danger="true"]:not(:disabled) .tool-title {
        color: var(--edvibe-danger);
    }

    button[data-danger="true"]:hover:not(:disabled) {
        border-color: var(--edvibe-danger);
        background: var(--edvibe-danger-surface);
    }

    .tool-card-header {
        display: flex;
        gap: 12px;
        justify-content: space-between;
        align-items: flex-start;
    }

    .tool-copy {
        display: block;
        min-width: 0;
    }

    .tool-title {
        margin: 0;
        color: var(--edvibe-text-strong);
        font-size: 13px;
        line-height: 1.35;
    }

    .tool-description,
    .tool-requirement {
        display: block;
        margin-top: 4px;
        color: var(--edvibe-text-muted);
        font-size: 11px;
        line-height: 1.4;
    }

    .tool-requirement {
        color: var(--edvibe-warning);
    }

    .tool-busy {
        display: block;
        margin-top: 5px;
        color: var(--edvibe-brand);
        font-size: 11px;
        font-weight: 650;
        line-height: 1.4;
    }
`;
