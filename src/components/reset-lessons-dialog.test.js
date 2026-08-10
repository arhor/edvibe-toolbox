import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(import.meta.dirname, 'reset-lessons-dialog.js');
const source = fs.readFileSync(componentPath, 'utf8');

test('reset lessons dialog is implemented as a Lit component', () => {
    assert.match(source, /import \{ LitElement, html, nothing \} from 'lit';/);
    assert.match(source, /class ResetLessonsDialog extends LitElement/);
    assert.match(source, /return html`/);
    assert.match(source, /static properties = \{/);
    assert.doesNotMatch(source, /createElement\?\.\('template'\)/);
    assert.doesNotMatch(source, /content\.cloneNode\(true\)/);
    assert.doesNotMatch(source, /module\.exports/);
});

test('reset lessons dialog preserves the feature integration surface through ESM', () => {
    for (const method of [
        'configure',
        'showPupils',
        'showLessons',
        'setLoading',
        'lock',
        'completeRun',
        'unlockAfterRun',
        'showDiscovery',
        'showProgress',
        'showComplete',
        'showError'
    ]) {
        assert.match(source, new RegExp(`${method}\\(`));
    }
    assert.match(source, /new CustomEvent\('edvibe-reset-request'/);
    assert.match(source, /new CustomEvent\('edvibe-dialog-close'/);
    assert.match(source, /export \{ RESET_DIALOG_TAG, RESET_OVERLAY_ID, ResetLessonsDialog \};/);
    assert.doesNotMatch(source, /globalThis\.EdVibe/);
});

test('reset lessons dialog owns declarative pupil and lesson rendering', () => {
    assert.match(source, /renderPupilRows\(\)/);
    assert.match(source, /renderLessonRows\(inputsBlocked\)/);
    assert.match(source, /\.map\(\(pupil\) =>/);
    assert.match(source, /this\.lessons\.map\(\(lesson\) => html`/);
    assert.match(source, /@input=\$\{this\.handleSearchInput\}/);
    assert.match(source, /@change=\$\{this\.handleSelectAll\}/);
});
