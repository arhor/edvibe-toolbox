const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
    path.join(__dirname, 'batch-section-creation-dialog.js'),
    'utf8'
);
const styles = fs.readFileSync(
    path.join(__dirname, 'batch-section-creation-dialog.css'),
    'utf8'
);

test('dialog is a dedicated Web Component with constructor, selection, preview, and report events', () => {
    assert.match(source, /customElements\.define\(BATCH_SECTION_DIALOG_TAG/);
    assert.match(source, /data-add-block="image"/);
    assert.match(source, /data-add-block="text"/);
    assert.match(source, /data-add-block="link"/);
    assert.match(source, /dataset\.blockAction = action/);
    assert.match(source, /edvibe-batch-section-preflight/);
    assert.match(source, /edvibe-batch-section-confirm/);
    assert.match(source, /edvibe-batch-section-copy/);
    assert.match(source, /edvibe-batch-section-restart/);
    assert.match(source, /recipeReady/);
    assert.match(source, /SECTION_NAME_COLLISION|Отклонено проверкой/);
});

test('dialog keeps presentation in its dedicated stylesheet', () => {
    assert.doesNotMatch(source, /cssText|\.style\.|<style/);
    assert.match(styles, /\.edvibe-batch-section-overlay/);
    assert.match(styles, /\.edvibe-batch-section-grid/);
    assert.match(styles, /\.edvibe-batch-section-block/);
    assert.match(styles, /\.edvibe-batch-section-result\.is-partially_created/);
    assert.match(styles, /@media \(max-width: 820px\)/);
});
