const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const componentPath = path.resolve(__dirname, 'export-progress-dialog.js');
const source = fs.readFileSync(componentPath, 'utf8');

test('export progress dialog is a Lit component with the legacy integration contract', () => {
    assert.match(source, /import \{ LitElement, html, nothing \} from 'lit';/);
    assert.match(source, /class ExportProgressDialog extends LitElement/);
    assert.match(source, /configure\(options = \{\}\)/);
    assert.match(source, /update\(options = new Map\(\)\)/);
    assert.match(source, /complete\(statusText, totalSections\)/);
    assert.match(source, /error\(statusText\)/);
    assert.match(source, /dismissAfter\(ms\)/);
    assert.match(source, /globalThis\.EdVibeExportProgressDialog = exportProgressDialogApi;/);
});

test('export progress dialog uses declarative Lit markup without legacy template cloning', () => {
    assert.match(source, /return html`/);
    assert.match(source, /<progress class="progress"/);
    assert.match(source, /@click=\$\{\(\) => this\.remove\(\)\}/);
    assert.doesNotMatch(source, /createElement\?\.\('template'\)/);
    assert.doesNotMatch(source, /content\.cloneNode\(true\)/);
    assert.doesNotMatch(source, /module\.exports/);
});
