const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, 'batch-user-onboarding-dialog.js'), 'utf8');

test('batch user onboarding dialog is a guarded Lit component', () => {
    assert.match(source, /import \{ LitElement, html, nothing \} from 'lit';/);
    assert.match(source, /class BatchUserOnboardingDialog extends LitElement/);
    assert.match(source, /customElements\.get\(BATCH_USER_ONBOARDING_DIALOG_TAG\)/);
    assert.match(source, /customElements\.define\(BATCH_USER_ONBOARDING_DIALOG_TAG, BatchUserOnboardingDialog\)/);
    assert.doesNotMatch(source, /createElement\?\.\('template'\)/);
    assert.doesNotMatch(source, /replaceChildren\(/);
    assert.doesNotMatch(source, /module\.exports/);
});

test('onboarding keeps discovery, immutable preflight, and execution as separate states', () => {
    assert.match(source, /async discover\(\)/);
    assert.match(source, /addSelected: false, assignSelected: false/);
    assert.match(source, /async preparePlan\(\)/);
    assert.match(source, /this\.mode = 'preflight'/);
    assert.match(source, /async execute\(\)/);
    assert.match(source, /this\.mode = 'executing'/);
    assert.match(source, /Подготовить план/);
    assert.match(source, /Подтвердить и выполнить/);
});

test('onboarding preserves dependent operation selection, moderator, report, and history controls', () => {
    assert.match(source, /if \(field === 'addSelected' && !checked && row\.membership === 'not_in_marathon'\)/);
    assert.match(source, /next\.assignSelected = false;/);
    assert.match(source, /select-all-add/);
    assert.match(source, /select-all-assign/);
    assert.match(source, /class="curator"/);
    assert.match(source, /Скопировать отчёт/);
    assert.match(source, /Открыть в истории/);
    assert.match(source, /globalThis\.EdVibeBatchUserOnboardingDialog = batchUserOnboardingDialogApi;/);
});
