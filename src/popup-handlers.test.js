const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '..');
const popupHtml = fs.readFileSync(path.join(projectRoot, 'popup.html'), 'utf8');
const popupEntrypoint = fs.readFileSync(path.join(projectRoot, 'src/entrypoints/popup.js'), 'utf8');
const popupScript = fs.readFileSync(path.join(projectRoot, 'popup.js'), 'utf8');
const popupStyles = fs.readFileSync(path.join(projectRoot, 'popup.css'), 'utf8');
const popupComponents = fs.readFileSync(path.join(projectRoot, 'src/components/popup-tool-list.js'), 'utf8');
const isolatedScript = fs.readFileSync(path.join(projectRoot, 'src/isolated.js'), 'utf8');

test('isolated page initialization clears stale export progress', () => {
    const storedValues = [];
    const context = {
        EdVibeLogger: { createLoggerFactory: () => () => () => {} },
        window: { addEventListener() {} },
        chrome: {
            runtime: {
                onMessage: { addListener() {} },
                sendMessage() {},
                getURL: (value) => value
            },
            storage: {
                local: {
                    set(value, callback) {
                        storedValues.push(value);
                        callback?.();
                    }
                }
            }
        }
    };

    vm.runInNewContext(isolatedScript, context);
    assert.equal(
        JSON.stringify(storedValues),
        JSON.stringify([{ exportInProgress: false }])
    );
});

test('popup uses a CSP-safe data-driven tool catalog', () => {
    assert.doesNotMatch(popupHtml, /\sonclick=/);
    assert.match(popupScript, /const TOOL_DEFINITIONS = Object\.freeze\(\[/);
    for (const id of [
        'marathon-export',
        'lesson-reset',
        'action-recorder',
        'batch-lesson-access',
        'batch-user-onboarding',
        'batch-section-creation',
        'batch-section-deletion',
        'batch-user-management'
    ]) {
        assert.match(popupScript, new RegExp(`id: '${id}'`));
    }
    assert.match(popupScript, /createElement\('popup-tool-group'\)/);
    assert.match(popupComponents, /customElements\.define\('popup-tool-card'/);
    assert.doesNotMatch(popupScript, /window\.startAutomation\s*=/);
});

test('isolated bridge exposes management commands with stylesheet-only metadata', () => {
    const expectedCommands = [
        ['OPEN_BATCH_LESSON_ACCESS', 'EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS', 'batch-lesson-access-dialog.css'],
        ['OPEN_BATCH_USER_ONBOARDING', 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_ONBOARDING', 'batch-user-onboarding-dialog.css'],
        ['OPEN_BATCH_USER_MANAGEMENT', 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT', 'batch-user-management-dialog.css'],
        ['OPEN_BATCH_SECTION_CREATION', 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION', 'batch-section-creation-dialog.css'],
        ['OPEN_BATCH_SECTION_DELETION', 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION', 'batch-section-deletion-dialog.css']
    ];

    for (const [command, messageType, stylesheet] of expectedCommands) {
        assert.match(isolatedScript, new RegExp(`${command}: \\['${messageType}'`));
        assert.match(isolatedScript, new RegExp(stylesheet.replace('.', '\\.')));
    }
    assert.match(isolatedScript, /window\.postMessage\(\{ type, stylesheetUrl:/);
});

test('popup presents separate groups and preserves command requirements', () => {
    assert.match(popupScript, /export: 'Экспорт'/);
    assert.match(popupScript, /management: 'Управление'/);
    assert.match(popupScript, /development: 'Разработка'/);
    assert.match(popupScript, /command: 'OPEN_ACTION_RECORDER',\s*requirement: 'edvibe'/);
    assert.match(popupScript, /command: 'START_FULL_AUTOMATION',\s*requirement: 'marathon'/);
    assert.match(popupScript, /command: 'OPEN_LESSON_RESET',\s*requirement: 'marathon'/);
    assert.match(popupScript, /command: 'OPEN_BATCH_USER_ONBOARDING',\s*requirement: 'marathon'/);
    assert.match(popupScript, /chrome\.tabs\.sendMessage\(tabId, \{ action \}\)/);
});

test('popup styling and script loading remain component-oriented', () => {
    assert.match(popupHtml, /<link rel="stylesheet" href="popup\.css">/);
    assert.match(popupHtml, /<script type="module" src="src\/entrypoints\/popup\.js"><\/script>/);
    assert.doesNotMatch(popupHtml, /src\/components\/popup-tool-list\.js/);
    assert.match(popupEntrypoint, /import '\.\.\/components\/popup-tool-list\.js';/);
    assert.match(popupStyles, /popup-tool-card:focus-visible/);
    assert.match(popupStyles, /popup-tool-card\.is-danger/);
    assert.doesNotMatch(popupStyles, /\.tool-action/);
    assert.match(popupComponents, /import \{ LitElement, html \} from 'lit';/);
    assert.match(popupComponents, /class PopupToolCard extends LitElement/);
    assert.match(popupComponents, /class PopupToolGroup extends LitElement/);
    assert.doesNotMatch(popupComponents, /content\.cloneNode\(true\)/);
});

test('popup restores and renders export progress', () => {
    assert.match(popupScript, /chrome\.storage\.local\.get\('exportInProgress'\)/);
    assert.match(popupScript, /message\?\.action !== 'EXPORT_STATUS'/);
    assert.match(popupScript, /exportInProgress = message\.state === 'started'/);
    assert.match(popupScript, /busyLabel: 'Экспортируется…'/);
});
