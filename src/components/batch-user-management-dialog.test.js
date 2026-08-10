import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve(import.meta.dirname, 'batch-user-management-dialog.js'), 'utf8');

test('batch user management dialog uses Lit for all workflow states', () => {
    assert.match(source, /import \{ LitElement, html \} from 'lit';/);
    assert.match(source, /class BatchUserManagementDialog extends LitElement/);
    for (const method of ['showConfigure', 'showChecking', 'showValidationErrors', 'showReview', 'showExecution', 'showComplete', 'showFatalError']) {
        assert.match(source, new RegExp(`${method}\\(`));
    }
    assert.doesNotMatch(source, /replaceChildren\(/);
    assert.doesNotMatch(source, /module\.exports/);
});

test('batch user management preserves operation-selection and feature events', () => {
    assert.match(source, /selectOperation\(row, operation, selected\)/);
    assert.match(source, /selectAll\(operation, selected\)/);
    for (const event of [
        'edvibe-batch-user-management-selection-change',
        'edvibe-batch-user-management-input-change',
        'edvibe-batch-user-management-check',
        'edvibe-batch-user-management-start',
        'edvibe-batch-user-management-restart',
        'edvibe-dialog-close'
    ]) assert.match(source, new RegExp(event));
    assert.match(source, /globalThis\.EdVibeBatchUserManagementDialog = batchUserManagementDialogApi;/);
});