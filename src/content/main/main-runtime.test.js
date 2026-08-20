import assert from 'node:assert/strict';
import test from 'node:test';

import { createMainRuntime } from '#src/content/main/main-runtime.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';

class FakeWebSocket {
    static OPEN = 1;
}

function installBrowserGlobals() {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    const windowApi = {
        WebSocket: FakeWebSocket,
        Blob: class Blob { },
        URL: {},
        crypto: { randomUUID: () => 'test-id' },
        indexedDB: { open() { } },
        addEventListener() { },
        removeEventListener() { },
        postMessage() { },
        location: {
            href: 'https://edvibe.com/marathon/123',
            hostname: 'edvibe.com'
        }
    };
    const documentApi = {
        title: 'Fallback title',
        querySelector() {
            return { textContent: 'Runtime Marathon' };
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

function createLogger() {
    const logger = {
        entries: [],
        createChildLogger() {
            return logger;
        },
        log(...args) {
            this.entries.push(args);
        }
    };
    return logger;
}

test('createMainRuntime should compose shared dependencies and register features with one runtime context', (t) => {
    // Given
    const restore = installBrowserGlobals();
    t.after(restore);
    const logger = createLogger();
    let receivedContext = null;
    let calls = 0;
    const features = [{
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        create(context) {
            receivedContext = context;
            return () => {
                calls += 1;
            };
        }
    }];

    // When
    const runtime = createMainRuntime({ logger, features });
    const handled = runtime.dispatcher.dispatch({
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER
    });

    // Then
    assert.equal(receivedContext, runtime.runtimeContext);
    assert.equal(runtime.runtimeContext.logger, logger);
    assert.equal(runtime.runtimeContext.dispatch, runtime.dispatcher.dispatch);
    assert.equal(typeof runtime.runtimeContext.transport.sendRequest, 'function');
    assert.equal(typeof runtime.runtimeContext.operationGuard.canStart, 'function');
    assert.equal(
        typeof runtime.runtimeContext.executionHistoryService.persistTerminal,
        'function'
    );
    assert.equal(typeof runtime.runtimeContext.edvibeApi.loadAllPupils, 'function');
    assert.equal(runtime.runtimeContext.pageContext.marathonId, 123);
    assert.equal(runtime.runtimeContext.pageContext.marathonName, 'Runtime Marathon');
    assert.equal(Object.isFrozen(runtime.runtimeContext), true);
    assert.equal(handled, true);
    assert.equal(calls, 1);
});
