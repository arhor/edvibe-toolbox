const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const popup = fs.readFileSync(path.join(root, 'src/runtime/popup.js'), 'utf8');
const isolated = fs.readFileSync(path.join(root, 'src/runtime/isolated.js'), 'utf8');
const main = fs.readFileSync(path.join(root, 'src/runtime/main.js'), 'utf8');
const protocol = fs.readFileSync(path.join(root, 'src/shared/message-protocol.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const mainEntrypoint = fs.readFileSync(path.join(root, 'src/entrypoints/main.js'), 'utf8');
const dialog = fs.readFileSync(path.join(root, 'src/components/batch-section-creation-dialog.js'), 'utf8');

test('popup exposes batch section creation only on marathon pages', () => {
    assert.match(popup, /id: 'batch-section-creation',[\s\S]*?command: POPUP_COMMANDS\.OPEN_BATCH_SECTION_CREATION,[\s\S]*?requirement: 'marathon'/);
    assert.match(popup, /title: 'Создать раздел в уроках'/);
});

test('popup command crosses validated isolated and MAIN routing without presentation metadata', () => {
    assert.match(protocol, /OPEN_BATCH_SECTION_CREATION: 'OPEN_BATCH_SECTION_CREATION'/);
    assert.match(protocol, /OPEN_BATCH_SECTION_CREATION: 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION'/);
    assert.match(isolated, /createMainCommandMessage\(message\.action\)/);
    assert.doesNotMatch(isolated, /batch-section-creation-dialog\.css|stylesheetUrl/);
    assert.match(main, /\[WINDOW_MESSAGE_TYPES\.OPEN_BATCH_SECTION_CREATION, \(\) => batchSectionCreationFeature\.open\(\)\]/);
    assert.match(main, /guardedActiveChange\('batch-section-creation'\)/);
    assert.match(main, /operationGuard\.activate\('recording'\)/);
    assert.match(main, /operationGuard\.release\('recording'\)/);
});

test('MAIN composition imports section creation component and feature through ESM', () => {
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const resources = (manifest.web_accessible_resources ?? []).flatMap((entry) => entry.resources || []);

    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.equal(mainWorld.run_at, 'document_start');
    assert.match(mainEntrypoint, /import ['"]\.\.\/runtime\/main\.js['"];?/);
    assert.match(main, /from ['"]\.\.\/components\/batch-section-creation-dialog\.js['"]/);
    assert.match(main, /from ['"]\.\.\/features\/batch-section-creation\.js['"]/);
    assert.match(main, /document\.createElement\(batchSectionCreationDialogApi\.BATCH_SECTION_DIALOG_TAG\)/);
    assert.match(dialog, /from '\.\/batch-section-creation-dialog\.styles\.js';/);
    assert.equal(resources.includes('src/components/batch-section-creation-dialog.css'), false);
});