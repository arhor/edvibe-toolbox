const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.resolve(__dirname, 'batch-section-image-upload.js'), 'utf8');

test('section image upload exposes an explicit ESM integration controller', () => {
    assert.match(source, /class BatchSectionImageUploadController/);
    assert.match(source, /selectFile\(block, file\)/);
    assert.match(source, /clearFile\(block\)/);
    assert.match(source, /releaseBlock\(block\)/);
    assert.match(source, /releaseAll\(blocks = \[\]\)/);
    assert.match(source, /canSubmit\(blocks = \[\]\)/);
    assert.match(source, /export \{[\s\S]*BatchSectionImageUploadController,[\s\S]*registry,[\s\S]*controller[\s\S]*\};/);
    assert.doesNotMatch(source, /globalThis\.EdVibe/);
});

test('section image upload no longer patches dialog prototypes or DOM rendering hooks', () => {
    assert.doesNotMatch(source, /BatchSectionCreationDialog\.prototype/);
    assert.doesNotMatch(source, /\.prototype\[/);
    assert.doesNotMatch(source, /enhanceDialog/);
    assert.doesNotMatch(source, /createElement\(/);
    assert.doesNotMatch(source, /replaceChildren\(/);
    assert.doesNotMatch(source, /querySelector\(/);
});

test('section image upload keeps placeholder and file metadata helpers for feature compatibility', () => {
    assert.match(source, /IMAGE_PLACEHOLDER_PREFIX/);
    assert.match(source, /createPlaceholderUrl\(clientId\)/);
    assert.match(source, /parseClientId\(value\)/);
    assert.match(source, /formatFileSize\(value\)/);
    assert.match(source, /createRegistry\(\)/);
    assert.match(source, /enhanceImageBlock\(block/);
});
