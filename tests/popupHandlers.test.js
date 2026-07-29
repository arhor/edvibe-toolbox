const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const popupHtml = fs.readFileSync(path.join(projectRoot, 'popup.html'), 'utf8');
const popupScript = fs.readFileSync(path.join(projectRoot, 'popup.js'), 'utf8');
const popupStyles = fs.readFileSync(path.join(projectRoot, 'popup.css'), 'utf8');
const popupComponents = fs.readFileSync(
    path.join(projectRoot, 'src/components/popup-tool-list.js'),
    'utf8'
);

test('popup uses a CSP-safe, data-driven tool catalog', () => {
    assert.doesNotMatch(popupHtml, /\sonclick=/);
    assert.match(popupScript, /const TOOL_DEFINITIONS = Object\.freeze\(\[/);
    assert.match(popupScript, /id: 'marathon-export'/);
    assert.match(popupScript, /id: 'lesson-reset'/);
    assert.match(popupScript, /id: 'action-recorder'/);
    assert.match(popupScript, /createElement\('popup-tool-group'\)/);
    assert.match(popupComponents, /button\?\.addEventListener\('click'/);
    assert.match(popupComponents, /customElements\.define\('popup-tool-card'/);
    assert.match(popupComponents, /createElement\?\.\('template'\)/);
    assert.match(popupComponents, /content\.cloneNode\(true\)/);
    assert.doesNotMatch(popupScript, /window\.startAutomation\s*=/);
    assert.doesNotMatch(popupScript, /window\.openLessonReset\s*=/);
});

test('popup custom-element constructors do not mutate or inspect light DOM', () => {
    const constructors = [
        popupComponents.match(
            /class PopupToolCard[\s\S]*?constructor\(\) \{([\s\S]*?)\n        \}\n\n        connectedCallback/
        )?.[1],
        popupComponents.match(
            /class PopupToolGroup[\s\S]*?constructor\(\) \{([\s\S]*?)\n        \}\n\n        connectedCallback/
        )?.[1]
    ];

    assert.equal(constructors.every(Boolean), true);
    for (const constructorBody of constructors) {
        assert.doesNotMatch(
            constructorBody,
            /(?:append|querySelector|setAttribute|dataset|classList)/
        );
    }
    assert.match(
        popupComponents,
        /connectedCallback\(\)[\s\S]*?content\.cloneNode\(true\)/
    );
    assert.match(popupComponents, /this\.pendingOptions = options/);
});

test('popup presents export and management as separate tool groups', () => {
    assert.match(popupScript, /export: 'Экспорт'/);
    assert.match(popupScript, /management: 'Управление'/);
    assert.match(popupScript, /development: 'Разработка'/);
    assert.match(popupScript, /title: 'Экспорт марафона'/);
    assert.match(popupScript, /title: 'Сброс прогресса учеников'/);
    assert.doesNotMatch(popupHtml, /Резервное копирование/);
});

test('popup exposes the recorder on every Edvibe page', () => {
    assert.match(
        popupScript,
        /command: 'OPEN_ACTION_RECORDER',\s*requirement: 'edvibe'/
    );
    assert.match(popupScript, /title: 'Запись действий WebSocket'/);
    assert.match(
        popupScript,
        /pageContext\.type === 'edvibe' \|\| pageContext\.type === 'marathon'/
    );
});

test('popup preserves commands and marathon requirements', () => {
    assert.match(
        popupScript,
        /command: 'START_FULL_AUTOMATION',\s*requirement: 'marathon'/
    );
    assert.match(
        popupScript,
        /command: 'OPEN_LESSON_RESET',\s*requirement: 'marathon'/
    );
    assert.match(popupScript, /chrome\.tabs\.sendMessage\(tabId, \{ action \}/);
});

test('popup exposes batch lesson access for marathon management', () => {
    assert.match(
        popupScript,
        /id: 'batch-lesson-access',\s*group: 'management',\s*title: 'Открыть доступ к урокам',\s*description: 'Открыть выбранные уроки для списка учеников\.',\s*command: 'OPEN_BATCH_LESSON_ACCESS',\s*requirement: 'marathon',\s*actionLabel: 'Открыть мастер',\s*busyLabel: 'Открывается…',\s*closeOnSuccess: true/
    );
});

test('popup restores and renders export progress', () => {
    assert.match(popupScript, /chrome\.storage\.local\.get\('exportInProgress'\)/);
    assert.match(popupScript, /message\?\.action !== 'EXPORT_STATUS'/);
    assert.match(popupScript, /exportInProgress = message\.state === 'started'/);
    assert.match(popupScript, /busyLabel: 'Экспортируется…'/);
});

test('popup loads its stylesheet and scripts in the required order', () => {
    assert.match(popupHtml, /<link rel="stylesheet" href="popup\.css">/);
    assert.match(
        popupHtml,
        /<script src="src\/shared\/logger\.js"><\/script>\s*<script src="src\/components\/popup-tool-list\.js"><\/script>\s*<script src="popup\.js"><\/script>/
    );
    assert.match(popupScript, /createLoggerFactory\('POPUP'\)/);
    assert.match(popupStyles, /popup-tool-card/);
    assert.match(popupStyles, /\.tool-action\.is-danger/);
});
