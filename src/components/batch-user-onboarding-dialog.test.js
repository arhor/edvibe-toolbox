const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dialogApi = require('./batch-user-onboarding-dialog');

const source = fs.readFileSync(path.join(__dirname, 'batch-user-onboarding-dialog.js'), 'utf8');

test('exports a guarded Web Component for the onboarding workflow', () => {
    assert.equal(
        dialogApi.BATCH_USER_ONBOARDING_DIALOG_TAG,
        'edvibe-toolbox-batch-user-onboarding-dialog'
    );
    assert.match(source, /customElements\.get\(BATCH_USER_ONBOARDING_DIALOG_TAG\)/);
    assert.match(source, /attachShadow\(\{ mode: 'open' \}\)/);
    assert.match(source, /disconnectedCallback\(\)/);
    assert.match(source, /AbortController/);
});

test('keeps confirmation separate from review and starts all mutations unchecked', () => {
    assert.match(source, /Подготовить план/);
    assert.match(source, /Подтвердить и выполнить/);
    assert.match(source, /addSelected: false, assignSelected: false/);
    assert.match(source, /this\.mode = 'preflight'/);
    assert.match(source, /this\.mode = 'executing'/);
});

test('provides independent bulk controls, curator selection, reports, and history entry point', () => {
    assert.match(source, /select-all-add/);
    assert.match(source, /select-all-assign/);
    assert.match(source, /class="curator"/);
    assert.match(source, /Скопировать отчёт/);
    assert.match(source, /Открыть в истории/);
});