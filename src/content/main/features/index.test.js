import assert from 'node:assert/strict';
import test from 'node:test';

import features from '#src/content/main/features/index.js';
import { OperationGuard } from '#src/content/main/infrastructure/operation-guard.js';

function createDialog(documentApi) {
    return {
        elements: {
            footer: { appendChild() { } },
            status: { textContent: '' }
        },
        ownerDocument: documentApi,
        shadowRoot: { querySelector() { return null; } },
        addEventListener() { },
        close() { },
        complete() { },
        completeRun() { },
        configure() { },
        dismissAfter() { },
        error() { },
        lock() { },
        mount() { },
        remove() { },
        restore() { },
        setEmailState() { },
        setLessons() { },
        setLoadError() { },
        setLoading() { },
        setProgress() { },
        setState() { },
        setStatus() { },
        showChecking() { },
        showComplete() { },
        showConfigure() { },
        showConfirmation() { },
        showDiscovery() { },
        showError() { },
        showExecution() { },
        showFatalError() { },
        showLoading() { },
        showProgress() { },
        showPupils() { },
        showReview() { },
        showStatus() { },
        showValidationErrors() { },
        unlockAfterRun() { }
    };
}

function installBrowserGlobals() {
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    const previousLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
    const createdElements = [];
    let documentApi;
    const body = {
        append(element) {
            return element;
        },
        appendChild(element) {
            return element;
        },
        removeChild(element) {
            return element;
        }
    };
    documentApi = {
        body,
        documentElement: body,
        title: 'Test marathon',
        createElement(tagName) {
            createdElements.push(tagName);
            return createDialog(documentApi);
        },
        getElementById() {
            return null;
        },
        querySelector() {
            return null;
        }
    };
    const location = {
        href: 'https://edvibe.com/marathon/123',
        hostname: 'edvibe.com',
        origin: 'https://edvibe.com',
        pathname: '/marathon/123'
    };
    const windowApi = {
        crypto: { randomUUID: () => 'smoke-id' },
        location,
        alert() { },
        confirm() {
            return true;
        },
        postMessage() { }
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
    Object.defineProperty(globalThis, 'location', {
        configurable: true,
        writable: true,
        value: location
    });
    return {
        createdElements,
        restore() {
            for (const [name, descriptor] of [
                ['window', previousWindow],
                ['document', previousDocument],
                ['location', previousLocation]
            ]) {
                if (descriptor) {
                    Object.defineProperty(globalThis, name, descriptor);
                } else {
                    delete globalThis[name];
                }
            }
        }
    };
}

function createLogger() {
    const logger = {
        createChildLogger() {
            return logger;
        },
        log() { }
    };
    return logger;
}

function createRuntimeContext() {
    const transportFailure = new Error('Smoke transport stopped at the adapter boundary.');
    transportFailure.code = 'WS_UNAVAILABLE';
    return {
        dispatch() {
            return true;
        },
        executionHistoryService: {
            clear: async () => { },
            delete: async () => { },
            exportFiltered: async () => { },
            exportRecord: async () => { },
            get: async () => null,
            getPreferences: async () => ({}),
            list: async () => [],
            persistTerminal: async () => Object.freeze({ stored: false }),
            setPreferences: async () => ({})
        },
        logger: createLogger(),
        operationGuard: new OperationGuard(),
        transport: {
            getConnectionState: () => ({ isOpen: true, ready: true }),
            getResponseDiagnostics: () => undefined,
            sendRequest: async () => {
                throw transportFailure;
            },
            sendWithoutResponse() { },
            subscribeFrames: () => () => { }
        }
    };
}

test('registered MAIN features construct lazily and cross their browser adapter boundary', async () => {
    const browser = installBrowserGlobals();
    try {
        assert.ok(features.length > 0);
        assert.equal(new Set(features.map(({ type }) => type)).size, features.length);

        for (const definition of features) {
            const beforeCreate = browser.createdElements.length;
            const handler = definition.create(createRuntimeContext());
            assert.equal(typeof handler, 'function', `${definition.type} must create a handler`);
            assert.equal(
                browser.createdElements.length,
                beforeCreate,
                `${definition.type} must not create browser UI during registration`
            );

            const result = handler({ type: definition.type });
            if (result && typeof result.then === 'function') {
                await result;
            }
            await Promise.resolve();

            assert.ok(
                browser.createdElements.length > beforeCreate,
                `${definition.type} must reach its browser UI adapter when opened`
            );
        }
    } finally {
        browser.restore();
    }
});
