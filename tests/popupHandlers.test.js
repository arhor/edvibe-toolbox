const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const popupHtml = fs.readFileSync(path.join(projectRoot, 'popup.html'), 'utf8');
const popupScript = fs.readFileSync(path.join(projectRoot, 'popup.js'), 'utf8');

test('popup buttons invoke their corresponding handlers inline', () => {
    assert.match(
        popupHtml,
        /id="startCaptureBtn"[^>]*onclick="startAutomation\(this\)"/,
    );
    assert.match(
        popupHtml,
        /id="resetLessonsBtn"[^>]*onclick="openLessonReset\(this\)"/,
    );
});

test('popup loads its logger before the popup script', () => {
    assert.match(
        popupHtml,
        /<script src="src\/shared\/logger\.js"><\/script>\s*<script src="popup\.js"><\/script>/
    );
    assert.match(popupScript, /createLoggerFactory\('POPUP'\)/);
});

test('popup script exposes handlers without registering button listeners', () => {
    assert.match(popupScript, /window\.startAutomation\s*=\s*startAutomation/);
    assert.match(popupScript, /window\.openLessonReset\s*=\s*openLessonReset/);
    assert.doesNotMatch(popupScript, /\.addEventListener\('click'/);
});
