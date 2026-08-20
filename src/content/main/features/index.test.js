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

test('registered MAIN features should expose unique command types when definitions are loaded', () => {
    // Given
    const registeredTypes = features.map(({ type }) => type);

    // When
    const uniqueTypes = new Set(registeredTypes);

    // Then
    assert.ok(registeredTypes.length > 0);
    assert.equal(uniqueTypes.size, registeredTypes.length);
});

test('registered MAIN features should reach browser UI adapter when opened with representative runtime dependencies', async (t) => {
    // Given
    const browser = installBrowserGlobals();
    t.after(browser.restore);
    const outcomes = [];

    // When
    for (const definition of features) {
        const createdBeforeOpen = browser.createdElements.length;
        let handler;
        let error = null;
        try {
            handler = definition.create(createRuntimeContext());
            if (typeof handler === 'function') {
                const result = handler({ type: definition.type });
                if (result && typeof result.then === 'function') {
                    await result;
                }
                await Promise.resolve();
            }
        } catch (cause) {
            error = cause;
        }
        outcomes.push({
            type: definition.type,
            handlerType: typeof handler,
            error,
            createdElements: browser.createdElements.length - createdBeforeOpen
        });
    }

    // Then
    for (const outcome of outcomes) {
        assert.equal(outcome.handlerType, 'function', `${outcome.type} must create a handler`);
        assert.equal(outcome.error, null, `${outcome.type} must open without adapter contract errors`);
        assert.ok(outcome.createdElements > 0, `${outcome.type} must reach its browser UI adapter`);
    }
});
