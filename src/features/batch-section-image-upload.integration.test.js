import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '../..');
const manifestPromise = import(pathToFileURL(path.join(root, 'manifest.config.js')).href)
    .then(({ default: manifest }) => manifest);

test('MAIN coordinator composes the image picker and upload adapter through ESM', async () => {
    const manifest = await manifestPromise;
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const mainEntrypoint = fs.readFileSync(path.join(root, 'src/entrypoints/main.js'), 'utf8');
    const main = fs.readFileSync(path.join(root, 'src/runtime/main.js'), 'utf8');
    const dialog = fs.readFileSync(path.join(root, 'src/components/batch-section-creation-dialog.js'), 'utf8');
    const upload = fs.readFileSync(path.join(root, 'src/features/batch-section-image-upload.js'), 'utf8');

    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.equal(mainWorld.run_at, 'document_start');
    assert.match(mainEntrypoint, /import ['"]\.\.\/runtime\/main\.js['"];?/);
    assert.match(main, /from ['"]\.\.\/features\/batch-section-image-upload\.js['"]/);
    assert.match(main, /createImageUploadCreationAdapter\(\{/);
    assert.match(main, /recipe: dynamicImageRecipe/);
    assert.match(upload, /from ['"]\.\.\/components\/batch-section-image-upload\.js['"]/);
    assert.match(upload, /from ['"]\.\/batch-section-creation\.js['"]/);
    assert.doesNotMatch(upload, /globalThis\.EdVibeBatchSectionCreation\s*=/);
    assert.match(dialog, /from '\.\/batch-section-image-upload\.styles\.js';/);

    const resources = (manifest.web_accessible_resources ?? []).flatMap((entry) => entry.resources || []);
    assert.equal(resources.includes('src/components/batch-section-image-upload.css'), false);
});
