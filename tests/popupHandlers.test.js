const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const popupHtml = fs.readFileSync(path.join(projectRoot, 'popup.html'), 'utf8');
const popupScript = fs.readFileSync(path.join(projectRoot, 'popup.js'), 'utf8');
const popupStyles = fs.readFileSync(path.join(projectRoot, 'popup.css'), 'utf8');

test('popup uses a CSP-safe, data-driven tool catalog', () => {
    assert.doesNotMatch(popupHtml, /\sonclick=/);
    assert.match(popupScript, /const TOOL_DEFINITIONS = Object\.freeze\(\[/);
    assert.match(popupScript, /id: 'marathon-export'/);
    assert.match(popupScript, /id: 'lesson-reset'/);
    assert.match(popupScript, /button\.addEventListener\('click'/);
    assert.doesNotMatch(popupScript, /window\.startAutomation\s*=/);
    assert.doesNotMatch(popupScript, /window\.openLessonReset\s*=/);
});

test('popup presents export and management as separate tool groups', () => {
    assert.match(popupScript, /export: 'Экспорт'/);
    assert.match(popupScript, /management: 'Управление'/);
    assert.match(popupScript, /title: 'Экспорт марафона'/);
    assert.match(popupScript, /title: 'Сброс прогресса учеников'/);
    assert.doesNotMatch(popupHtml, /Резервное копирование/);
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
        /<script src="src\/shared\/logger\.js"><\/script>\s*<script src="popup\.js"><\/script>/
    );
    assert.match(popupScript, /createLoggerFactory\('POPUP'\)/);
    assert.match(popupStyles, /\.tool-card/);
    assert.match(popupStyles, /\.tool-action\.is-danger/);
});
