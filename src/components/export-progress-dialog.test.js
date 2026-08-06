const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const componentPath = path.resolve(
    __dirname,
    '../src/components/export-progress-dialog.js'
);
const source = fs.readFileSync(componentPath, 'utf8');
const { ExportProgressDialog } = require(componentPath);

test('uses one cached template and clones it for export dialog instances', () => {
    assert.match(source, /createElement\?\.\('template'\)/);
    assert.match(source, /content\.cloneNode\(true\)/);
    assert.doesNotMatch(source, /shadowRoot\.innerHTML/);
    assert.doesNotMatch(source, /throw new Error/);
});

test('stays inert for unavailable DOM and unexpected public inputs', () => {
    const dialog = new ExportProgressDialog();
    assert.doesNotThrow(() => dialog.connectedCallback());
    assert.doesNotThrow(() => dialog.configure(null));
    assert.doesNotThrow(() => dialog.update(null));
    assert.equal(dialog.update(), dialog);
});
