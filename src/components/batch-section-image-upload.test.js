const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createPlaceholderUrl,
    parseClientId,
    formatFileSize,
    createRegistry,
    enhanceImageBlock,
    resolveEnhancementStylesheet
} = require('./batch-section-image-upload.js');

test('image blocks receive stable upload placeholders without storing the file in the URL', () => {
    const block = enhanceImageBlock(
        { id: 'block-1', type: 'image', url: '', alt: '' },
        { randomUUID: () => 'client-image-1' }
    );

    assert.equal(block.clientId, 'client-image-1');
    assert.equal(block.url, createPlaceholderUrl('client-image-1'));
    assert.equal(parseClientId(block.url), 'client-image-1');
    assert.equal(block.fileName, '');
});

test('image registry keeps selected files only in memory', () => {
    const registry = createRegistry();
    const file = { name: 'banner.png', type: 'image/png', size: 2048 };

    registry.register('client-image-1', file);
    assert.equal(registry.get('client-image-1'), file);
    assert.equal(registry.size(), 1);

    registry.remove('client-image-1');
    assert.equal(registry.get('client-image-1'), null);
    assert.equal(registry.size(), 0);
});

test('file metadata and enhancement stylesheet are formatted for the dialog', () => {
    assert.equal(formatFileSize(512), '512 Б');
    assert.equal(formatFileSize(2048), '2.0 КБ');
    assert.equal(formatFileSize(2 * 1024 * 1024), '2.0 МБ');
    assert.equal(
        resolveEnhancementStylesheet('chrome-extension://toolbox/src/components/batch-section-creation-dialog.css'),
        'chrome-extension://toolbox/src/components/batch-section-image-upload.css'
    );
});
