async function runHarnessSmokeTest(harness) {
    const {
        assert,
        cleanup,
        click,
        elementUpdated,
        equal,
        fixture,
        keydown,
        shadowQuery
    } = harness;

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

    const { runPopupToolListTests } = await import('./popup-tool-list-tests.js');
    await runPopupToolListTests();

    const { runExportProgressDialogTests } = await import('./export-progress-dialog-tests.js');
    await runExportProgressDialogTests();

    const { runResetLessonsDialogTests } = await import('./reset-lessons-dialog-tests.js');
    await runResetLessonsDialogTests();

    const { runExecutionHistoryDialogTests } = await import('./execution-history-dialog-tests.js');
    await runExecutionHistoryDialogTests();
}

async function report(status, message) {
    document.documentElement.dataset.testStatus = status;
    document.querySelector('#test-result').textContent = message;
    await fetch('/__component-test-result', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status, message})
    });
}

try {
    await run();
    await report('passed', 'PASS');
} catch (error) {
    const message = error?.stack || String(error);
    console.error(error);
    try {
        await report('failed', message);
    } catch (reportError) {
        console.error('Unable to report component test failure:', reportError);
    }
}
