const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, 'batch-section-creation-dialog.js'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, 'batch-section-creation-dialog.css'), 'utf8');

const imageUploadSource = fs.readFileSync(path.join(__dirname, 'batch-section-image-upload.js'), 'utf8');

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

test('image blocks render through the Lit component and explicit upload controller', () => {
    assert.match(source, /from '\.\/batch-section-image-upload\.js';/);
    assert.match(source, /this\.imageController = defaultImageController;/);
    assert.match(source, /return this\.imageController\.createBlock/);
    assert.match(source, /renderImageFields\(block, configurable\)/);
    assert.match(source, /class="edvibe-batch-section-file-input" type="file" accept="image\/\*"/);
    assert.match(source, /class="edvibe-batch-section-image-preview"/);
    assert.match(source, /this\.imageController\.selectFile\(block, file\)/);
    assert.match(source, /this\.imageController\.clearFile\(block\)/);
    assert.match(source, /this\.imageController\.releaseBlock\(removed\)/);
    assert.match(source, /this\.imageController\.releaseAll\(this\.blocks\)/);
    assert.match(source, /this\.imageController\.canSubmit\(this\.blocks\)/);
    assert.doesNotMatch(imageUploadSource, /BatchSectionCreationDialog\.prototype/);
});

test('section creation dialog keeps presentation in dedicated stylesheets', () => {
    assert.doesNotMatch(source, /cssText|\.style\.|<style/);
    assert.match(source, /edvibe-batch-section-image-stylesheet/);
    assert.match(styles, /\.edvibe-batch-section-overlay/);
    assert.match(styles, /\.edvibe-batch-section-grid/);
    assert.match(styles, /\.edvibe-batch-section-block/);
    assert.match(styles, /\.edvibe-batch-section-result\.is-partially_created/);
    assert.match(styles, /@media \(max-width: 820px\)/);
});
