const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const popup = fs.readFileSync(path.join(root, 'popup.js'), 'utf8');
const isolated = fs.readFileSync(path.join(root, 'src/isolated.js'), 'utf8');
const main = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const mainEntrypoint = fs.readFileSync(path.join(root, 'src/entrypoints/main.js'), 'utf8');
const mainImports = [...mainEntrypoint.matchAll(/^import ['"](.+?)['"];$/gm)]
    .map((match) => match[1]);

test('popup exposes batch section creation only on marathon pages', () => {
    assert.match(
        popup,
        /id: 'batch-section-creation',[\s\S]*?command: 'OPEN_BATCH_SECTION_CREATION',[\s\S]*?requirement: 'marathon'/
    );
    assert.match(popup, /title: 'Создать раздел в уроках'/);
});

test('popup command crosses the isolated and main worlds', () => {
    assert.match(isolated, /OPEN_BATCH_SECTION_CREATION:\s*\[/);
    assert.match(isolated, /EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION/);
    assert.match(isolated, /batch-section-creation-dialog\.css/);
    assert.match(main, /batchSectionCreationFeature\.open/);
    assert.match(main, /guardedActiveChange\('batch-section-creation'\)/);
    assert.match(main, /operationGuard\.activate\('recording'\)/);
    assert.match(main, /operationGuard\.release\('recording'\)/);
});

test('MAIN entry point loads the component before the feature and main coordinator', () => {
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const componentIndex = mainImports.indexOf('../components/batch-section-creation-dialog.js');
    const featureIndex = mainImports.indexOf('../features/batch-section-creation.js');
    const mainIndex = mainImports.indexOf('../main.js');

    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.ok(componentIndex >= 0);
    assert.ok(featureIndex > componentIndex);
    assert.ok(mainIndex > featureIndex);
    assert.ok(manifest.web_accessible_resources[0].resources.includes(
        'src/components/batch-section-creation-dialog.css'
    ));
});
