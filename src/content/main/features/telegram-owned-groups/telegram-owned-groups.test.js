import assert from 'node:assert/strict';
import test from 'node:test';

import { isolateDialogKeyboardEvents } from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups.js';

function createDialog() {
    const listeners = new Map();
    const handledKeys = [];
    return {
        handledKeys,
        addEventListener(type, listener) {
            listeners.set(type, listener);
        },
        dispatch(type, event) {
            listeners.get(type)?.(event);
        },
        handleKeydownBound(event) {
            handledKeys.push(event.key);
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
