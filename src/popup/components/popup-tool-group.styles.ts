import { css } from 'lit';

export const popupToolGroupStyles = css`
    :host {
        display: block;
    }

    .tool-group-title {
        margin: 0 0 7px 2px;
        color: var(--toolfox-text-muted);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
    }

    .tool-list {
        display: grid;
        gap: 8px;
    }
`;
