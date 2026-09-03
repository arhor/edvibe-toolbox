import assert from 'node:assert/strict';
import test from 'node:test';

import {
    createTelegramOwnedGroupsFeature,
    isolateDialogKeyboardEvents
} from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups.js';

function createDialog() {
    const listeners = new Map();
    const handledKeys = [];
    return {
        handledKeys,
        isConnected: false,
        addEventListener(type, listener) {
            listeners.set(type, listener);
        },
        configure(options) {
            this.options = options;
        },
        connect() {
            this.isConnected = true;
        },
        dispatch(type, event) {
            listeners.get(type)?.(event);
        },
        handleKeydownBound(event) {
            handledKeys.push(event.key);
        },
        remove() {
            this.isConnected = false;
        }
    };
}

test('owned-group dialog keyboard events should not bubble into Telegram', () => {
    const dialog = createDialog();
    let propagationStopped = false;
    const event = {
        key: 'a',
        stopPropagation() {
            propagationStopped = true;
        }
    };

    isolateDialogKeyboardEvents(dialog);
    dialog.dispatch('keydown', event);

    assert.equal(propagationStopped, true);
    assert.deepEqual(dialog.handledKeys, ['a']);
});

test('owned-group dialog keyboard isolation should preserve dialog Escape handling', () => {
    const dialog = createDialog();
    let propagationStopped = false;
    const event = {
        key: 'Escape',
        stopPropagation() {
            propagationStopped = true;
        }
    };

    isolateDialogKeyboardEvents(dialog);
    dialog.dispatch('keydown', event);

    assert.equal(propagationStopped, true);
    assert.deepEqual(dialog.handledKeys, ['Escape']);
});

test('owned-group feature should suppress Telegram Escape only while dialog is open', () => {
    let escapeHandler = null;
    let unregisterCalls = 0;
    const dialog = createDialog();
    const adapter = {
        globalObject: {
            appNavigationController: {
                registerEscapeHandler(handler) {
                    escapeHandler = handler;
                    return () => {
                        unregisterCalls += 1;
                    };
                }
            }
        }
    };
    const documentApi = {
        body: {
            append(element) {
                element.connect();
            }
        },
        createElement() {
            return dialog;
        }
    };
    const feature = createTelegramOwnedGroupsFeature({ adapter, documentApi });

    feature.open();

    assert.equal(escapeHandler(), false);
    assert.equal(unregisterCalls, 0);
    assert.equal(dialog.isConnected, true);

    dialog.options.onClose();

    assert.equal(unregisterCalls, 1);
    assert.equal(dialog.isConnected, false);
});
