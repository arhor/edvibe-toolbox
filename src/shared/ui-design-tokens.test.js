import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    TOOLFOX_DESIGN_TOKENS,
    applyDesignTokens,
    createDesignTokenDeclarations
} from '#src/shared/ui-design-tokens.js';

test('exposes the audited semantic token vocabulary as CSS custom properties', () => {
    assert.equal(TOOLFOX_DESIGN_TOKENS['--toolfox-primary'], '#2563eb');
    assert.equal(TOOLFOX_DESIGN_TOKENS['--toolfox-radius-dialog'], '16px');
    assert.match(createDesignTokenDeclarations(), /--toolfox-focus-outline: #2563eb;/);
});

test('applies the same authoritative token values to a light-DOM root', () => {
    const properties = new Map();
    applyDesignTokens({
        style: { setProperty: (name, value) => properties.set(name, value) }
    });

    assert.equal(properties.size, Object.keys(TOOLFOX_DESIGN_TOKENS).length);
    assert.equal(properties.get('--toolfox-surface-app'), '#f4f6fa');
});
