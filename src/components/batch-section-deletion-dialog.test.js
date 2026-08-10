import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.join(import.meta.dirname, 'batch-section-deletion-dialog.js'), 'utf8');

test('batch section deletion dialog uses Lit and keeps async feature callbacks', () => {
    assert.match(source, /import \{ LitElement, html, nothing \} from 'lit';/);
    assert.match(source, /class BatchSectionDeletionDialog extends LitElement/);
    assert.match(source, /this\.options\.onInspect/);
    assert.match(source, /this\.options\.onExecute/);
    assert.match(source, /onOpenHistory/);
    assert.match(source, /onCopy/);
    assert.match(source, /onClose/);
    assert.doesNotMatch(source, /innerHTML\s*=/);
    assert.doesNotMatch(source, /module\.exports/);
});

test('batch section deletion preserves preflight and result states', () => {
    assert.match(source, /renderPlan\(\)/);
    assert.match(source, /Will delete/);
    assert.match(source, /Will not modify/);
    assert.match(source, /Confirm deletion/);
    assert.match(source, /Open in history/);
    assert.match(source, /globalThis\.EdVibeBatchSectionDeletionDialog = batchSectionDeletionDialogApi;/);
});
