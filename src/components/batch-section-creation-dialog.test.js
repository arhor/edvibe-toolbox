const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, 'batch-section-creation-dialog.js'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, 'batch-section-creation-dialog.css'), 'utf8');

test('section creation dialog uses Lit for selection, block construction, preview, and reports', () => {
    assert.match(source, /import \{ LitElement, html, nothing \} from 'lit';/);
    assert.match(source, /class BatchSectionCreationDialog extends LitElement/);
    assert.match(source, /data-add-block=\$\{type\}/);
    assert.match(source, /renderBlock\(block, index, configurable\)/);
    assert.match(source, /edvibe-batch-section-preflight/);
    assert.match(source, /edvibe-batch-section-confirm/);
    assert.match(source, /edvibe-batch-section-copy/);
    assert.match(source, /edvibe-batch-section-restart/);
    assert.match(source, /recipeReady/);
    assert.match(source, /Отклонено проверкой/);
    assert.doesNotMatch(source, /replaceChildren\(/);
    assert.doesNotMatch(source, /module\.exports/);
});

test('section creation dialog keeps presentation in its dedicated stylesheet', () => {
    assert.doesNotMatch(source, /cssText|\.style\.|<style/);
    assert.match(styles, /\.edvibe-batch-section-overlay/);
    assert.match(styles, /\.edvibe-batch-section-grid/);
    assert.match(styles, /\.edvibe-batch-section-block/);
    assert.match(styles, /\.edvibe-batch-section-result\.is-partially_created/);
    assert.match(styles, /@media \(max-width: 820px\)/);
});
