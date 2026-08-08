async function runHarnessSmokeTest(harness) {
    const {assert, cleanup, click, elementUpdated, equal, fixture, keydown, shadowQuery} = harness;
    const element = await fixture('<browser-fixture-element label="Initial"></browser-fixture-element>');
    assert(element instanceof HTMLElement, 'Fixture should mount a real custom element.');
    assert(element.shadowRoot instanceof ShadowRoot, 'Fixture should expose a real ShadowRoot.');
    equal(shadowQuery(element, 'button').textContent, 'Initial');
    let clicks = 0;
    let lastKey = null;
    const button = shadowQuery(element, 'button');
    button.addEventListener('click', () => { clicks += 1; });
    button.addEventListener('keydown', (event) => { lastKey = event.key; });
    click(button);
    keydown(button, 'Enter');
    equal(clicks, 1, 'Mouse interaction helper should dispatch a browser click event.');
    equal(lastKey, 'Enter', 'Keyboard interaction helper should dispatch a browser keyboard event.');
    element.setAttribute('label', 'Updated');
    await elementUpdated(element);
    equal(shadowQuery(element, 'button').textContent, 'Updated');
    await cleanup();
    equal(element.isConnected, false, 'cleanup() should remove mounted fixtures.');
}

async function run() {
    const harness = await import('./component-test-harness.js');
    await import('./browser-fixture-element.js');
    await runHarnessSmokeTest(harness);
    for (const [modulePath, exportName] of [
        ['./popup-tool-list-tests.js', 'runPopupToolListTests'],
        ['./export-progress-dialog-tests.js', 'runExportProgressDialogTests'],
        ['./reset-lessons-dialog-tests.js', 'runResetLessonsDialogTests'],
        ['./execution-history-dialog-tests.js', 'runExecutionHistoryDialogTests'],
        ['./action-recorder-dialog-tests.js', 'runActionRecorderDialogTests'],
        ['./batch-lesson-access-dialog-tests.js', 'runBatchLessonAccessDialogTests'],
        ['./batch-section-creation-dialog-tests.js', 'runBatchSectionCreationDialogTests'],
        ['./batch-section-deletion-dialog-tests.js', 'runBatchSectionDeletionDialogTests'],
        ['./batch-user-management-dialog-tests.js', 'runBatchUserManagementDialogTests']
    ]) {
        const module = await import(modulePath);
        await module[exportName]();
    }
}

async function report(status, message) {
    document.documentElement.dataset.testStatus = status;
    document.querySelector('#test-result').textContent = message;
    await fetch('/__component-test-result', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status, message})});
}

try { await run(); await report('passed', 'PASS'); }
catch (error) {
    const message = error?.stack || String(error);
    console.error(error);
    try { await report('failed', message); }
    catch (reportError) { console.error('Unable to report component test failure:', reportError); }
}
