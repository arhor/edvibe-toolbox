import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ESLint } from 'eslint';

const eslint = new ESLint({ fix: false });

async function lintRestrictedImport(filePath, importPath) {
    const [result] = await eslint.lintText(`import '${importPath}';\n`, { filePath });
    return result.messages.filter(({ ruleId }) => ruleId === 'no-restricted-imports');
}

test('shared runtime modules cannot import runtime-owned implementations', async () => {
    // Given / When
    const messages = await lintRestrictedImport(
        'src/shared/boundary-example.js',
        '#src/content/main/main-context.js'
    );

    // Then
    assert.equal(messages.length, 1);
    assert.match(messages[0].message, /Shared modules cannot depend/);
});

test('MAIN infrastructure cannot import feature-owned implementations', async () => {
    // Given / When
    const messages = await lintRestrictedImport(
        'src/content/main/infrastructure/boundary-example.js',
        '#src/content/main/features/example/example.js'
    );

    // Then
    assert.equal(messages.length, 1);
    assert.match(messages[0].message, /MAIN infrastructure cannot depend/);
});

test('MAIN application primitives cannot depend on higher-level MAIN layers', async () => {
    // Given / When
    const featureMessages = await lintRestrictedImport(
        'src/content/main/application/boundary-example.js',
        '#src/content/main/features/example/example.js'
    );
    const infrastructureMessages = await lintRestrictedImport(
        'src/content/main/application/boundary-example.js',
        '#src/content/main/infrastructure/example.js'
    );

    // Then
    assert.equal(featureMessages.length, 1);
    assert.equal(infrastructureMessages.length, 1);
    assert.match(featureMessages[0].message, /MAIN application primitives cannot depend/);
    assert.match(infrastructureMessages[0].message, /MAIN application primitives cannot depend/);
});

test('MAIN application primitives may depend on cross-runtime shared contracts', async () => {
    // Given / When
    const messages = await lintRestrictedImport(
        'src/content/main/application/boundary-example.js',
        '#src/shared/utils.js'
    );

    // Then
    assert.deepEqual(messages, []);
});
