import { css } from 'lit';

export const popupAppStyles = css`
    :host {
        display: block;
    }

    .app-header {
        display: flex;
        gap: 11px;
        align-items: center;
        padding: 18px 18px 15px;
        background: var(--edvibe-surface);
        border-bottom: 1px solid var(--edvibe-border-subtle);
    }

    .app-mark {
        display: grid;
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        place-items: center;
        border-radius: var(--edvibe-radius-panel);
        color: var(--edvibe-surface);
        background: linear-gradient(
            145deg,
            color-mix(in srgb, var(--edvibe-brand) 85%, var(--edvibe-surface)),
            color-mix(in srgb, var(--edvibe-brand) 85%, var(--edvibe-text-strong))
        );
        box-shadow: 0 5px 12px color-mix(in srgb, var(--edvibe-brand) 22%, transparent);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.04em;
    }

    h1,
    p {
        margin: 0;
    }

    .app-header h1 {
        color: var(--edvibe-text-strong);
        font-size: 16px;
        line-height: 1.25;
        letter-spacing: -0.01em;
    }

    .app-header p {
        margin-top: 2px;
        color: var(--edvibe-text-muted);
        font-size: 12px;
    }

    main {
        padding: 14px;
    }

    .page-context {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        min-height: 54px;
        padding: 11px 12px;
        border: 1px solid var(--edvibe-border);
        border-radius: var(--edvibe-radius-panel);
        background: var(--edvibe-surface);
    }

    .context-indicator {
        width: 8px;
        height: 8px;
        flex: 0 0 8px;
        margin-top: 5px;
        border-radius: 50%;
        background: var(--edvibe-text-muted);
        box-shadow: 0 0 0 3px var(--edvibe-surface-subtle);
    }

    .page-context.is-marathon .context-indicator {
        background: var(--edvibe-success);
        box-shadow: 0 0 0 3px var(--edvibe-success-surface);
    }

    .page-context.is-edvibe .context-indicator {
        background: var(--edvibe-warning);
        box-shadow: 0 0 0 3px var(--edvibe-warning-surface);
    }

    .page-context strong,
    .page-context span {
        display: block;
    }

    .page-context strong {
        color: var(--edvibe-text-strong);
        font-size: 13px;
        line-height: 1.35;
    }

    .page-context div > span {
        margin-top: 2px;
        color: var(--edvibe-text-muted);
        font-size: 11px;
        line-height: 1.35;
    }

    .tool-groups {
        display: grid;
        gap: 15px;
        margin-top: 17px;
    }

    .popup-status {
        margin-top: 12px;
        padding: 9px 10px;
        border: 1px solid var(--edvibe-success-border);
        border-radius: var(--edvibe-radius-control);
        color: var(--edvibe-success);
        background: var(--edvibe-success-surface);
        font-size: 11px;
        line-height: 1.4;
    }

    .popup-status.is-error {
        border-color: var(--edvibe-danger-border);
        color: var(--edvibe-danger);
        background: var(--edvibe-danger-surface);
    }
`;
