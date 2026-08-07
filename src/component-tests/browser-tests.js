import './browser-fixture-element.js';
import {
    assert,
    cleanup,
    click,
    elementUpdated,
    equal,
    fixture,
    keydown,
    shadowQuery
} from './component-test-harness.js';

async function run() {
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

try {
    await run();
    document.documentElement.dataset.testStatus = 'passed';
    document.querySelector('#test-result').textContent = 'PASS';
} catch (error) {
    document.documentElement.dataset.testStatus = 'failed';
    document.querySelector('#test-result').textContent = error?.stack || String(error);
    console.error(error);
}
