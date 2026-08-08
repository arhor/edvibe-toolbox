const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');

test('MAIN coordinator composes the image picker and upload adapter through ESM', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const mainEntrypoint = fs.readFileSync(path.join(root, 'src/entrypoints/main.js'), 'utf8');
    const main = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
    const upload = fs.readFileSync(path.join(root, 'src/features/batch-section-image-upload.js'), 'utf8');

    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.equal(mainWorld.run_at, 'document_start');
    assert.match(mainEntrypoint, /import ['"]\.\.\/main\.js['"];?/);
    assert.match(main, /from ['"]\.\/features\/batch-section-image-upload\.js['"]/);
    assert.match(main, /createImageUploadCreationAdapter\(\{/);
    assert.match(main, /recipe: dynamicImageRecipe/);
    assert.match(upload, /from ['"]\.\.\/components\/batch-section-image-upload\.js['"]/);
    assert.match(upload, /from ['"]\.\/batch-section-creation\.js['"]/);
    assert.doesNotMatch(upload, /globalThis\.EdVibeBatchSectionCreation\s*=/);

    const resources = manifest.web_accessible_resources.flatMap((entry) => entry.resources || []);
    assert.ok(resources.includes('src/components/batch-section-image-upload.css'));
});
