import { css, unsafeCSS } from 'lit';

import {
    TOOLFOX_DESIGN_TOKENS,
    createDesignTokenDeclarations
} from '#src/shared/ui-design-tokens.js';

const tokenDeclarations = unsafeCSS(createDesignTokenDeclarations());

export const componentFoundationStyles = css`
    :host {
        ${tokenDeclarations}
        --toolfox-dialog-z-index: var(--toolfox-z-dialog);
        --toolfox-overlay-background: var(--toolfox-overlay);
        --toolfox-muted-text: var(--toolfox-text-muted);
        --toolfox-radius: var(--toolfox-radius-dialog);
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
        font-family: var(--toolfox-font-family);
    }
`;

export { TOOLFOX_DESIGN_TOKENS };
