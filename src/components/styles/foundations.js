import { css } from 'lit';

export const componentFoundationStyles = css`
    :host {
        --edvibe-font-family: "Segoe UI", Inter, Arial, system-ui, sans-serif;
        --edvibe-dialog-z-index: 2147483647;
        --edvibe-overlay-background: rgba(15, 23, 42, 0.6);
        --edvibe-surface: #fff;
        --edvibe-text: #1f2937;
        --edvibe-muted-text: #6b7280;
        --edvibe-border: #d9dfe9;
        --edvibe-primary: #4055d3;
        --edvibe-danger: #c93a3a;
        --edvibe-radius: 14px;
    }

    button,
    input,
    textarea,
    select {
        font: inherit;
    }
`;

export const dialogFoundationStyles = css`
    :host {
        font-family: var(--edvibe-font-family);
    }
`;
