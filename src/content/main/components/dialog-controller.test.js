import assert from 'node:assert/strict';
import { test } from 'node:test';

import { DialogController } from './dialog-controller.js';

function createFixture(options = {}) {
    const listeners = new Map();
    let restored = 0;
    let focused = 0;
    const renderRoot = {
        activeElement: null,
        querySelector: () => initial,
        querySelectorAll: () => [initial]
    };
    const initial = {
        closest: () => null,
        getRootNode: () => renderRoot,
        focus: () => {
            focused += 1;
            renderRoot.activeElement = initial;
        }
    };
    const document = {
        activeElement: { isConnected: true, focus: () => { restored += 1; } },
        addEventListener: (type, listener) => listeners.set(type, listener),
        removeEventListener: (type) => listeners.delete(type)
    };
    const host = {
        ownerDocument: document,
        renderRoot,
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
        canClose: (_host, reason) => reason === 'escape',
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

test('skips hidden candidates and retries when focus does not move', () => {
    const fixture = createFixture();
    const hidden = { closest: () => ({ hidden: true }) };
    let attempts = 0;
    const retryTarget = {
        closest: () => null,
        getRootNode: () => fixture.host.renderRoot,
        focus() {
            attempts += 1;
            if (attempts > 1) fixture.host.renderRoot.activeElement = retryTarget;
        }
    };
    fixture.host.renderRoot.querySelector = () => hidden;
    fixture.host.renderRoot.querySelectorAll = () => [hidden, retryTarget];

    fixture.controller.hostConnected();
    fixture.controller.hostUpdated();
    assert.equal(fixture.controller.initialFocusApplied, false);
    fixture.controller.hostUpdated();

    assert.equal(attempts, 2);
    assert.equal(fixture.controller.initialFocusApplied, true);
});

test('uses one close policy for backdrop and explicit close requests', () => {
    const reasons = [];
    const fixture = createFixture({
        canClose: (_host, reason) => reason !== 'blocked',
        onClose: (_host, reason) => reasons.push(reason)
    });
    const backdrop = {};
    const backdropEvent = {
        target: backdrop,
        currentTarget: backdrop,
        defaultPrevented: false,
        preventDefault() {}
    };

    assert.equal(fixture.controller.handleBackdropClick(backdropEvent), true);
    assert.equal(fixture.controller.handleBackdropClick({
        ...backdropEvent,
        target: {}
    }), false);
    assert.equal(fixture.controller.requestClose('close-button'), true);
    assert.equal(fixture.controller.requestClose('blocked'), false);
    assert.deepEqual(reasons, ['backdrop', 'close-button']);
});
