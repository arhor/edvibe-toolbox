const fixtures = new Set();

export async function fixture(markup) {
    const template = document.createElement('template');
    template.innerHTML = markup.trim();
    const element = template.content.firstElementChild;
    if (!element) {
        throw new Error('fixture() requires markup with a root element.');
    }

    document.body.append(element);
    fixtures.add(element);
    await elementUpdated(element);
    return element;
}

export async function elementUpdated(element) {
    if (element?.updateComplete && typeof element.updateComplete.then === 'function') {
        await element.updateComplete;
    } else {
        await Promise.resolve();
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
}

export function shadowQuery(element, selector) {
    const match = element?.shadowRoot?.querySelector(selector);
    if (!match) {
        throw new Error(`Expected ${selector} in the component shadow root.`);
    }
    return match;
}

export function click(element) {
    element.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        composed: true,
        cancelable: true
    }));
}

export function keydown(element, key) {
    element.dispatchEvent(new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        composed: true,
        cancelable: true
    }));
}

export async function cleanup() {
    for (const element of fixtures) {
        element.remove();
    }
    fixtures.clear();
    await Promise.resolve();
}

export function assert(condition, message = 'Expected condition to be truthy.') {
    if (!condition) {
        throw new Error(message);
    }
}

export function equal(actual, expected, message) {
    if (!Object.is(actual, expected)) {
        throw new Error(message || `Expected ${String(actual)} to equal ${String(expected)}.`);
    }
}
