import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    COMMAND_ROUTES,
    EXPORT_STATES,
    POPUP_COMMANDS,
    STORAGE_ACTIONS,
    STORAGE_KEYS,
    WINDOW_MESSAGE_TYPES,
    createExportStatusMessage,
    createMainCommandMessage,
    createRuntimeExportStatusMessage,
    createStorageRequest,
    createStorageResponse,
    getCommandRoute,
    isExportStatusMessage,
    isMainCommandMessage,
    isPopupCommandMessage,
    isRuntimeExportStatusMessage,
    isStorageRequestMessage,
    isStorageResponseMessage
} from './message-protocol.js';

describe('popup to MAIN command protocol', () => {
    test('every supported popup command maps to a valid MAIN message', () => {
        for (const action of Object.values(POPUP_COMMANDS)) {
            const route = getCommandRoute(action);
            assert.equal(route, COMMAND_ROUTES[action]);
            assert.equal(isPopupCommandMessage({ action }), true);

            const message = createMainCommandMessage(action);
            assert.equal(message.type, route.type);
            assert.equal(isMainCommandMessage(message), true);
            assert.equal(Object.isFrozen(message), true);
        }
    });

    test('execution history preserves an optional execution id across the boundary', () => {
        const message = createMainCommandMessage(POPUP_COMMANDS.OPEN_EXECUTION_HISTORY, {
            executionId: 'execution-42'
        });

        assert.deepEqual(message, {
            type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
            executionId: 'execution-42'
        });
        assert.equal(isMainCommandMessage(message), true);
    });

    test('rejects unknown commands and unexpected message fields', () => {
        assert.equal(isPopupCommandMessage({ action: 'UNKNOWN' }), false);
        assert.equal(isPopupCommandMessage({ action: POPUP_COMMANDS.START_EXPORT, extra: true }), false);
        assert.equal(isMainCommandMessage({
            type: WINDOW_MESSAGE_TYPES.START_EXPORT,
            extra: true
        }), false);
        assert.throws(() => createMainCommandMessage('UNKNOWN'), TypeError);
        assert.throws(() => createMainCommandMessage(POPUP_COMMANDS.OPEN_EXECUTION_HISTORY, {
            executionId: ''
        }), TypeError);
    });
});

describe('MAIN to popup export status protocol', () => {
    test('window and runtime status messages accept the same observable states', () => {
        for (const state of Object.values(EXPORT_STATES)) {
            const windowMessage = createExportStatusMessage(state, `state:${state}`);
            const runtimeMessage = createRuntimeExportStatusMessage(state, `state:${state}`);

            assert.equal(isExportStatusMessage(windowMessage), true);
            assert.equal(isRuntimeExportStatusMessage(runtimeMessage), true);
            assert.equal(windowMessage.state, runtimeMessage.state);
            assert.equal(windowMessage.message, runtimeMessage.message);
        }
    });

    test('rejects invalid states, payload types, and extra fields', () => {
        assert.throws(() => createExportStatusMessage('unknown'), TypeError);
        assert.throws(() => createRuntimeExportStatusMessage(EXPORT_STATES.ERROR, {}), TypeError);
        assert.equal(isExportStatusMessage({
            type: WINDOW_MESSAGE_TYPES.EXPORT_STATUS,
            state: EXPORT_STATES.COMPLETE,
            message: '',
            extra: true
        }), false);
        assert.equal(isRuntimeExportStatusMessage({
            action: 'EXPORT_STATUS',
            state: 'unknown',
            message: ''
        }), false);
    });
});

describe('ISOLATED storage bridge protocol', () => {
    test('creates and validates GET requests without a value', () => {
        const request = createStorageRequest({
            requestId: 'request-get',
            action: STORAGE_ACTIONS.GET,
            key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES
        });

        assert.equal(isStorageRequestMessage(request), true);
        assert.equal(Object.hasOwn(request, 'value'), false);
        assert.equal(Object.isFrozen(request), true);
    });

    test('creates and validates SET requests with a defined value', () => {
        const value = { retentionDays: 30 };
        const request = createStorageRequest({
            requestId: 'request-set',
            action: STORAGE_ACTIONS.SET,
            key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES,
            value
        });

        assert.equal(isStorageRequestMessage(request), true);
        assert.equal(request.value, value);
    });

    test('rejects malformed requests before they cross the runtime boundary', () => {
        assert.equal(isStorageRequestMessage({
            type: WINDOW_MESSAGE_TYPES.STORAGE_REQUEST,
            requestId: '',
            action: STORAGE_ACTIONS.GET,
            key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES
        }), false);
        assert.equal(isStorageRequestMessage({
            type: WINDOW_MESSAGE_TYPES.STORAGE_REQUEST,
            requestId: 'request',
            action: STORAGE_ACTIONS.GET,
            key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES,
            value: 'unexpected'
        }), false);
        assert.throws(() => createStorageRequest({
            requestId: 'request',
            action: STORAGE_ACTIONS.SET,
            key: STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES,
            value: undefined
        }), TypeError);
    });

    test('distinguishes successful and failed storage responses', () => {
        const success = createStorageResponse({
            requestId: 'request-success',
            ok: true,
            value: { retentionDays: 7 }
        });
        const failure = createStorageResponse({
            requestId: 'request-failure',
            ok: false,
            error: 'Storage unavailable'
        });

        assert.equal(isStorageResponseMessage(success), true);
        assert.equal(Object.hasOwn(success, 'error'), false);
        assert.equal(isStorageResponseMessage(failure), true);
        assert.equal(Object.hasOwn(failure, 'value'), false);
        assert.equal(failure.error, 'Storage unavailable');
    });

    test('rejects response shapes that mix success and failure payloads', () => {
        assert.equal(isStorageResponseMessage({
            type: WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE,
            requestId: 'request',
            ok: true,
            value: {},
            error: 'unexpected'
        }), false);
        assert.equal(isStorageResponseMessage({
            type: WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE,
            requestId: 'request',
            ok: false,
            value: {},
            error: 'failed'
        }), false);
    });
});
