const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));

test('manifest requests only Chrome capabilities consumed by the current runtime', () => {
    assert.deepEqual(manifest.permissions, ['storage', 'activeTab']);
    assert.equal(Object.prototype.hasOwnProperty.call(manifest, 'host_permissions'), false);
    assert.equal(manifest.permissions.includes('scripting'), false);
});

test('Edvibe page access is limited to the static content-script match pattern', () => {
    assert.equal(manifest.content_scripts.length, 2);
    for (const entry of manifest.content_scripts) {
        assert.deepEqual(entry.matches, ['*://*.edvibe.com/*']);
        assert.equal(entry.run_at, 'document_start');
    }
    assert.deepEqual(
        new Set(manifest.content_scripts.map((entry) => entry.world)),
        new Set(['ISOLATED', 'MAIN'])
    );
});