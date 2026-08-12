import assert from 'node:assert/strict';
import { test } from 'node:test';

import { DialogController } from './dialog-controller.js';

function createFixture(options = {}) {
    const listeners = new Map();
    let restored = 0;
    let focused = 0;
    const initial = { focus: () => { focused += 1; } };
    const document = {
        activeElement: { isConnected: true, focus: () => { restored += 1; } },
        addEventListener: (type, listener) => listeners.set(type, listener),
        removeEventListener: (type) => listeners.delete(type)
    };
    const host = {
        ownerDocument: document,
        renderRoot: { querySelector: () => initial },
        addController(controller) { this.controller = controller; }
    };
    const controller = new DialogController(host, options);
    return { controller, host, listeners, counts: () => ({ restored, focused }) };
}

test('registers symmetrically, focuses the dialog, and restores prior focus', () => {
    const fixture = createFixture();
    fixture.controller.hostConnected();
    fixture.controller.hostUpdated();
    fixture.controller.hostUpdated();
    assert.equal(fixture.counts().focused, 1);
    assert.equal(fixture.listeners.has('keydown'), true);

    fixture.controller.hostDisconnected();
    assert.deepEqual(fixture.counts(), { restored: 1, focused: 1 });
    assert.equal(fixture.listeners.has('keydown'), false);
});

test('closes on an unhandled Escape only when policy allows it', () => {
    let closeCount = 0;
    let prevented = 0;
    const fixture = createFixture({
        canClose: () => true,
        onClose: () => { closeCount += 1; }
    });
    fixture.controller.hostConnected();
    fixture.listeners.get('keydown')({
        key: 'Escape', defaultPrevented: false, preventDefault: () => { prevented += 1; }
    });
    fixture.listeners.get('keydown')({
        key: 'Enter', defaultPrevented: false, preventDefault: () => { prevented += 1; }
    });

    assert.equal(closeCount, 1);
    assert.equal(prevented, 1);
});

test('does not close when the feature policy blocks dismissal', () => {
    const fixture = createFixture({ canClose: () => false, onClose: assert.fail });
    fixture.controller.hostConnected();
    fixture.listeners.get('keydown')({ key: 'Escape', defaultPrevented: false });
});
