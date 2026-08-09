const test = require('node:test');
const assert = require('node:assert/strict');

const protocol = require('./message-protocol.js');

test('command routes provide one authoritative popup-to-MAIN mapping', () => {
    const commands = Object.values(protocol.POPUP_COMMANDS);
    assert.equal(Object.keys(protocol.COMMAND_ROUTES).length, commands.length);
    for (const command of commands) {
        const route = protocol.getCommandRoute(command);
        assert.ok(route);
        assert.equal(typeof route.type, 'string');
        assert.equal(typeof route.info, 'string');
        assert.equal(protocol.isPopupCommandMessage({ action: command }), true);
        assert.equal(protocol.isMainCommandMessage(protocol.createMainCommandMessage(command)), true);
    }
    assert.equal(protocol.getCommandRoute('UNKNOWN'), null);
    assert.equal(protocol.isPopupCommandMessage({ action: 'UNKNOWN' }), false);
    assert.equal(protocol.isPopupCommandMessage({ action: commands[0], payload: {} }), false);
});

test('MAIN command validation rejects unknown and over-shared boundary data', () => {
    assert.equal(protocol.isMainCommandMessage({ type: protocol.WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET }), true);
    assert.equal(protocol.isMainCommandMessage({
        type: protocol.WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET,
        internalState: { secret: true }
    }), false);
    assert.equal(protocol.isMainCommandMessage({ type: 'EDVIBE_TOOLBOX_UNKNOWN' }), false);

    const history = protocol.createMainCommandMessage(
        protocol.POPUP_COMMANDS.OPEN_EXECUTION_HISTORY,
        { executionId: 'history-42' }
    );
    assert.deepEqual(history, {
        type: protocol.WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
        executionId: 'history-42'
    });
    assert.equal(protocol.isMainCommandMessage(history), true);
    assert.equal(protocol.isMainCommandMessage({
        type: protocol.WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
        executionId: 42
    }), false);
});

test('export status protocols validate both cross-world and runtime envelopes', () => {
    const pageMessage = protocol.createExportStatusMessage(protocol.EXPORT_STATES.STARTED);
    assert.equal(protocol.isExportStatusMessage(pageMessage), true);
    assert.equal(protocol.isExportStatusMessage({ ...pageMessage, state: 'maybe' }), false);
    assert.equal(protocol.isExportStatusMessage({ ...pageMessage, payload: 'extra' }), false);

    const runtimeMessage = protocol.createRuntimeExportStatusMessage(
        protocol.EXPORT_STATES.ERROR,
        'Export failed'
    );
    assert.equal(protocol.isRuntimeExportStatusMessage(runtimeMessage), true);
    assert.equal(protocol.isRuntimeExportStatusMessage({ ...runtimeMessage, message: 123 }), false);
});

test('storage protocol accepts only explicit operations, keys, and correlated envelopes', () => {
    const getRequest = protocol.createStorageRequest({
        requestId: 'get-1',
        action: protocol.STORAGE_ACTIONS.GET,
        key: protocol.STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES
    });
    assert.equal(protocol.isStorageRequestMessage(getRequest), true);
    assert.equal(Object.prototype.hasOwnProperty.call(getRequest, 'value'), false);

    const setRequest = protocol.createStorageRequest({
        requestId: 'set-1',
        action: protocol.STORAGE_ACTIONS.SET,
        key: protocol.STORAGE_KEYS.EXECUTION_HISTORY_PREFERENCES,
        value: { maxCount: 50 }
    });
    assert.equal(protocol.isStorageRequestMessage(setRequest), true);
    assert.equal(protocol.isStorageRequestMessage({ ...setRequest, key: 'arbitraryKey' }), false);
    assert.equal(protocol.isStorageRequestMessage({ ...setRequest, action: 'delete' }), false);
    assert.equal(protocol.isStorageRequestMessage({ ...setRequest, requestId: '' }), false);

    const success = protocol.createStorageResponse({ requestId: 'set-1', ok: true, value: { maxCount: 50 } });
    const failure = protocol.createStorageResponse({ requestId: 'set-1', ok: false, error: 'Denied' });
    assert.equal(protocol.isStorageResponseMessage(success), true);
    assert.equal(protocol.isStorageResponseMessage(failure), true);
    assert.equal(protocol.isStorageResponseMessage({ ...failure, value: 'leak' }), false);
});