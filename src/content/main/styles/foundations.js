import { css, unsafeCSS } from 'lit';
import {
    TOOLBOX_DESIGN_TOKENS,
    createDesignTokenDeclarations
} from '../../../shared/ui-design-tokens.js';

const tokenDeclarations = unsafeCSS(createDesignTokenDeclarations());

export const componentFoundationStyles = css`
    :host {
        ${tokenDeclarations}
        --edvibe-dialog-z-index: var(--edvibe-z-dialog);
        --edvibe-overlay-background: var(--edvibe-overlay);
        --edvibe-muted-text: var(--edvibe-text-muted);
        --edvibe-radius: var(--edvibe-radius-dialog);
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

export { TOOLBOX_DESIGN_TOKENS };
