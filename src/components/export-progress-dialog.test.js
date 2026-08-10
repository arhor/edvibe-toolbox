import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(import.meta.dirname, 'export-progress-dialog.js');
const source = fs.readFileSync(componentPath, 'utf8');

test('export progress dialog is a Lit component with an ESM integration contract', () => {
    assert.match(source, /import \{ LitElement, html, nothing \} from 'lit';/);
    assert.match(source, /from '\.\/styles\/foundations\.js';/);
    assert.match(source, /from '\.\/export-progress-dialog\.styles\.js';/);
    assert.match(source, /class ExportProgressDialog extends LitElement/);
    assert.match(source, /static styles = \[componentFoundationStyles, dialogFoundationStyles, exportProgressDialogStyles\]/);
    assert.match(source, /setProgress\(options = \{\}\)/);
    assert.match(source, /complete\(statusText, totalSections\)/);
    assert.match(source, /error\(statusText\)/);
    assert.match(source, /dismissAfter\(ms\)/);
    assert.match(source, /export \{ EXPORT_PROGRESS_TAG, ExportProgressDialog \};/);
    assert.doesNotMatch(source, /globalThis\.EdVibe|stylesheetUrl/);
});

test('export progress dialog uses declarative Lit markup without legacy template cloning', () => {
    assert.match(source, /return html`/);
    assert.match(source, /<progress class="progress"/);
    assert.match(source, /@click=\$\{\(\) => this\.remove\(\)\}/);
    assert.doesNotMatch(source, /createElement\?\.\('template'\)/);
    assert.doesNotMatch(source, /content\.cloneNode\(true\)/);
    assert.doesNotMatch(source, /module\.exports/);
});