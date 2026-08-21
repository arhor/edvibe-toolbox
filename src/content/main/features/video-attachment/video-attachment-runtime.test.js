import assert from 'node:assert/strict';
import test from 'node:test';

import { createVideoAttachmentFeatureV2 } from '#src/content/main/features/video-attachment/video-attachment.js';
import { OperationGuard } from '#src/content/main/infrastructure/operation-guard.js';

function createDialog() {
    return {
        configuration: null,
        configure(configuration) {
            this.configuration = configuration;
        },
        remove() { },
        setLessons() { },
        setLoadError() { }
    };
}

function installBrowserGlobals(createDialogElement) {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    const appended = [];
    const windowApi = {
        location: { href: 'https://edvibe.com/marathon/123' },
        alert() { }
    };
    const documentApi = {
        body: {
            append(dialog) {
                appended.push(dialog);
            }
        },
        createElement() {
            return createDialogElement();
        }
    };
    Object.defineProperty(globalThis, 'window', {
        configurable: true,
        writable: true,
        value: windowApi
    });
    Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: documentApi
    });
    return {
        appended,
        restore() {
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
        }
    };
}

test('createVideoAttachmentFeatureV2 should create fresh dialog when feature is reopened', (t) => {
    // Given
    const dialogs = [];
    const browser = installBrowserGlobals(() => {
        const dialog = createDialog();
        dialogs.push(dialog);
        return dialog;
    });
    t.after(browser.restore);
    const feature = createVideoAttachmentFeatureV2({
        transport: {
            sendRequest: () => new Promise(() => { }),
            getConnectionState: () => ({ isOpen: true })
        },
        operationGuard: new OperationGuard(),
        logger: {
            createChildLogger: () => ({ log() { } })
        }
    });

    // When
    feature.open();
    dialogs[0].configuration.onClose();
    feature.open();

    // Then
    assert.equal(dialogs.length, 2);
    assert.notEqual(dialogs[0], dialogs[1]);
    assert.deepEqual(browser.appended, dialogs);
});
