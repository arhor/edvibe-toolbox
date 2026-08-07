const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');

test('MAIN entry point loads the image picker and upload enhancer before main', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const mainEntrypoint = fs.readFileSync(path.join(root, 'src/entrypoints/main.js'), 'utf8');
    const imports = [...mainEntrypoint.matchAll(/^import ['"](.+?)['"];$/gm)]
        .map((match) => match[1]);

    const dialogIndex = imports.indexOf('../components/batch-section-creation-dialog.js');
    const pickerIndex = imports.indexOf('../components/batch-section-image-upload.js');
    const featureIndex = imports.indexOf('../features/batch-section-creation.js');
    const uploadIndex = imports.indexOf('../features/batch-section-image-upload.js');
    const mainIndex = imports.indexOf('../main.js');

    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.ok(dialogIndex >= 0 && pickerIndex > dialogIndex);
    assert.ok(featureIndex >= 0 && uploadIndex > featureIndex);
    assert.ok(mainIndex > uploadIndex);

    const resources = manifest.web_accessible_resources.flatMap((entry) => entry.resources || []);
    assert.ok(resources.includes('src/components/batch-section-image-upload.css'));
});
