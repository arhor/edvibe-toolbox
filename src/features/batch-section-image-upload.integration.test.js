const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');

test('manifest loads the image picker and upload enhancer before main', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const scripts = mainWorld.js;

    const dialogIndex = scripts.indexOf('src/components/batch-section-creation-dialog.js');
    const pickerIndex = scripts.indexOf('src/components/batch-section-image-upload.js');
    const featureIndex = scripts.indexOf('src/features/batch-section-creation.js');
    const uploadIndex = scripts.indexOf('src/features/batch-section-image-upload.js');
    const mainIndex = scripts.indexOf('src/main.js');

    assert.ok(dialogIndex >= 0 && pickerIndex > dialogIndex);
    assert.ok(featureIndex >= 0 && uploadIndex > featureIndex);
    assert.ok(mainIndex > uploadIndex);

    const resources = manifest.web_accessible_resources.flatMap((entry) => entry.resources || []);
    assert.ok(resources.includes('src/components/batch-section-image-upload.css'));
});
