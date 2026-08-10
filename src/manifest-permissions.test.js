const test = require('node:test');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');

const manifestPromise = import(pathToFileURL(
    require('node:path').resolve(__dirname, '..', 'manifest.config.mjs')
).href).then(({ default: manifest }) => manifest);

test('manifest requests only Chrome capabilities consumed by the current runtime', async () => {
    const manifest = await manifestPromise;
    assert.deepEqual(manifest.permissions, ['storage', 'activeTab']);
    assert.equal(Object.prototype.hasOwnProperty.call(manifest, 'host_permissions'), false);
    assert.equal(manifest.permissions.includes('scripting'), false);
});

test('Edvibe page access is limited to the static content-script match pattern', async () => {
    const manifest = await manifestPromise;
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
