import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve(import.meta.dirname, 'batch-lesson-access-dialog.js'), 'utf8');

test('batch lesson access dialog is a declarative Lit component', () => {
    assert.match(source, /import \{ LitElement, html, nothing \} from 'lit';/);
    assert.match(source, /class BatchLessonAccessDialog extends LitElement/);
    assert.match(source, /renderLesson\(lesson, locked\)/);
    assert.match(source, /renderFailure\(failure\)/);
    assert.doesNotMatch(source, /createElement\?\.\('template'\)/);
    assert.doesNotMatch(source, /replaceChildren\(/);
    assert.doesNotMatch(source, /module\.exports/);
});

test('batch lesson access preserves workflow modes and host events', () => {
    for (const method of [
        'showConfigure', 'showLoading', 'showValidation', 'showValidationErrors',
        'showConfirmation', 'showExecution', 'showComplete', 'showFatalError'
    ]) assert.match(source, new RegExp(`${method}\\(`));
    for (const event of [
        'edvibe-batch-access-input-change', 'edvibe-batch-access-submit',
        'edvibe-batch-access-confirm', 'edvibe-batch-access-copy-report',
        'edvibe-batch-access-restart', 'edvibe-dialog-close'
    ]) assert.match(source, new RegExp(event));
    assert.match(source, /globalThis\.EdVibeBatchAccessDialogComponent = batchAccessDialogApi;/);
});
