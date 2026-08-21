import assert from 'node:assert/strict';
import test from 'node:test';

import { createResetLessonsFeatureV2 } from '#src/content/main/features/reset-lessons/reset-lessons.js';
import { OperationGuard } from '#src/content/main/infrastructure/operation-guard.js';

function installBrowserGlobals(dialog) {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: { alert() {}, confirm: () => true }
    });
    Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: {
            body: { appendChild() {} },
            createElement: () => dialog,
            getElementById: () => null
        }
    });
    return () => {
        if (previousWindow) {
            Object.defineProperty(globalThis, 'window', previousWindow);
        } else {
            delete globalThis.window;
        }
        if (previousDocument) {
            Object.defineProperty(globalThis, 'document', previousDocument);
        } else {
            delete globalThis.document;
        }
    };
}

test('reset initialization failure should release the guard while keeping the error dialog closable', async (t) => {
    // Given
    const listeners = new Map();
    let shownError = null;
    let removeCount = 0;
    const dialog = {
        addEventListener(type, listener) {
            listeners.set(type, listener);
        },
        configure() {},
        remove() {
            removeCount += 1;
        },
        setLoading() {},
        showError(message) {
            shownError = message;
        }
    };
    t.after(installBrowserGlobals(dialog));
    const operationGuard = new OperationGuard();
    const feature = createResetLessonsFeatureV2({
        transport: {
            sendRequest: async () => {
                throw new Error('initial load failed');
            },
            sendWithoutResponse() {}
        },
        operationGuard,
        pageContext: { marathonId: 123 },
        logger: { createChildLogger: () => ({ log() {} }) }
    });

    // When
    await feature.open();

    // Then
    assert.equal(shownError, 'initial load failed');
    assert.equal(operationGuard.canStart(), true);
    assert.equal(removeCount, 0);

    // When the retained error dialog closes
    listeners.get('edvibe-dialog-close')();

    // Then
    assert.equal(removeCount, 1);
    assert.equal(operationGuard.canStart(), true);
});
