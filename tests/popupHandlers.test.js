const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const popupHtml = fs.readFileSync(path.join(projectRoot, 'popup.html'), 'utf8');
const popupScript = fs.readFileSync(path.join(projectRoot, 'popup.js'), 'utf8');

test('popup buttons are CSP-safe and have click listeners', () => {
    assert.doesNotMatch(popupHtml, /\sonclick=/);
    assert.match(
        popupScript,
        /startCaptureBtn\.addEventListener\('click',\s*\(\)\s*=>\s*startAutomation\(startCaptureBtn\)\)/,
    );
    assert.match(
        popupScript,
        /resetLessonsBtn\.addEventListener\('click',\s*\(\)\s*=>\s*openLessonReset\(resetLessonsBtn\)\)/,
    );
});

test('popup loads its logger before the popup script', () => {
    assert.match(
        popupHtml,
        /<script src="src\/shared\/logger\.js"><\/script>\s*<script src="popup\.js"><\/script>/
    );
    assert.match(popupScript, /createLoggerFactory\('POPUP'\)/);
});

test('popup script does not expose handlers globally', () => {
    assert.doesNotMatch(popupScript, /window\.startAutomation\s*=/);
    assert.doesNotMatch(popupScript, /window\.openLessonReset\s*=/);
});
