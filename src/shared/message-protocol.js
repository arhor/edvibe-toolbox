const POPUP_COMMANDS = Object.freeze({
    START_EXPORT: 'START_FULL_AUTOMATION',
    OPEN_LESSON_RESET: 'OPEN_LESSON_RESET',
    OPEN_ACTION_RECORDER: 'OPEN_ACTION_RECORDER',
    OPEN_BATCH_LESSON_ACCESS: 'OPEN_BATCH_LESSON_ACCESS',
    OPEN_BATCH_USER_ONBOARDING: 'OPEN_BATCH_USER_ONBOARDING',
    OPEN_BATCH_USER_MANAGEMENT: 'OPEN_BATCH_USER_MANAGEMENT',
    OPEN_BATCH_SECTION_CREATION: 'OPEN_BATCH_SECTION_CREATION',
    OPEN_BATCH_SECTION_DELETION: 'OPEN_BATCH_SECTION_DELETION',
    OPEN_EXECUTION_HISTORY: 'OPEN_EXECUTION_HISTORY'
});

const WINDOW_MESSAGE_TYPES = Object.freeze({
    START_EXPORT: 'EDVIBE_TOOLBOX_START_ALL',
    OPEN_LESSON_RESET: 'EDVIBE_TOOLBOX_OPEN_RESET',
    OPEN_ACTION_RECORDER: 'EDVIBE_TOOLBOX_OPEN_RECORDER',
    OPEN_BATCH_LESSON_ACCESS: 'EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS',
    OPEN_BATCH_USER_ONBOARDING: 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_ONBOARDING',
    OPEN_BATCH_USER_MANAGEMENT: 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT',
    OPEN_BATCH_SECTION_CREATION: 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION',
    OPEN_BATCH_SECTION_DELETION: 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION',
    OPEN_EXECUTION_HISTORY: 'EDVIBE_TOOLBOX_OPEN_EXECUTION_HISTORY',
    EXPORT_STATUS: 'EDVIBE_TOOLBOX_EXPORT_STATUS',
    STORAGE_REQUEST: 'EDVIBE_TOOLBOX_STORAGE_REQUEST',
    STORAGE_RESPONSE: 'EDVIBE_TOOLBOX_STORAGE_RESPONSE'
});

const RUNTIME_MESSAGE_ACTIONS = Object.freeze({
    EXPORT_STATUS: 'EXPORT_STATUS'
});

const EXPORT_STATES = Object.freeze({
    STARTED: 'started',
    COMPLETE: 'complete',
    ERROR: 'error'
});

const STORAGE_ACTIONS = Object.freeze({
    GET: 'get',
    SET: 'set'
});

const STORAGE_KEYS = Object.freeze({
    EXECUTION_HISTORY_PREFERENCES: 'executionHistoryPreferences'
});

const COMMAND_ROUTES = Object.freeze({
    [POPUP_COMMANDS.START_EXPORT]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.START_EXPORT,
        info: 'Automation sequence channeled to page engine.'
    }),
    [POPUP_COMMANDS.OPEN_LESSON_RESET]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET,
        info: 'Lesson reset workflow opened.'
    }),
    [POPUP_COMMANDS.OPEN_ACTION_RECORDER]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER,
        info: 'Action recorder opened.'
    }),
    [POPUP_COMMANDS.OPEN_BATCH_LESSON_ACCESS]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_LESSON_ACCESS,
        info: 'Batch lesson access opened.'
    }),
    [POPUP_COMMANDS.OPEN_BATCH_USER_ONBOARDING]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_ONBOARDING,
        info: 'Batch user onboarding opened.'
    }),
    [POPUP_COMMANDS.OPEN_BATCH_USER_MANAGEMENT]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_MANAGEMENT,
        info: 'Batch user management opened.'
    }),
    [POPUP_COMMANDS.OPEN_BATCH_SECTION_CREATION]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_CREATION,
        info: 'Batch section creation opened.'
    }),
    [POPUP_COMMANDS.OPEN_BATCH_SECTION_DELETION]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_DELETION,
        info: 'Batch section deletion opened.'
    }),
    [POPUP_COMMANDS.OPEN_EXECUTION_HISTORY]: Object.freeze({
        type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
        info: 'Execution history opened.'
    })
});

const MAIN_COMMAND_TYPES = new Set(Object.values(COMMAND_ROUTES).map(({ type }) => type));
const EXPORT_STATE_VALUES = new Set(Object.values(EXPORT_STATES));
const STORAGE_ACTION_VALUES = new Set(Object.values(STORAGE_ACTIONS));
const STORAGE_KEY_VALUES = new Set(Object.values(STORAGE_KEYS));

function isRecord(value) {
    return value !== null
       && typeof value === 'object'
       && !Array.isArray(value)
       && value !== undefined;
}

function hasOnlyKeys(value, allowedKeys) {
    return Object.keys(value).every((key) => allowedKeys.has(key));
}

function isNonEmptyString(value) {
    return typeof value === 'string'
        && value.length > 0;
}

function getCommandRoute(action) {
    return typeof action === 'string' && Object.prototype.hasOwnProperty.call(COMMAND_ROUTES, action)
        ? COMMAND_ROUTES[action]
        : null;
}

function isPopupCommandMessage(value) {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['action']))
        && getCommandRoute(value.action) !== null;
}

function createMainCommandMessage(action, payload = {}) {
    const route = getCommandRoute(action);
    if (!route) throw new TypeError(`Unsupported popup command: ${String(action)}`);
    const message = { type: route.type };
    if (route.type === WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY && payload.executionId != null) {
        if (!isNonEmptyString(payload.executionId)) throw new TypeError('executionId must be a non-empty string');
        message.executionId = payload.executionId;
    }
    return Object.freeze(message);
}

function isMainCommandMessage(value) {
    if (!isRecord(value) || !MAIN_COMMAND_TYPES.has(value.type)) {
        return false;
    }
    if (value.type === WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY) {
        return hasOnlyKeys(value, new Set(['type', 'executionId']))
            && (value.executionId === undefined || value.executionId === null || isNonEmptyString(value.executionId));
    }
    return hasOnlyKeys(value, new Set(['type']));
}

function createExportStatusMessage(state, message = '') {
    if (!EXPORT_STATE_VALUES.has(state)) {
        throw new TypeError(`Unsupported export state: ${String(state)}`);
    }
    if (typeof message !== 'string') {
        throw new TypeError('Export status message must be a string');
    }
    return Object.freeze({ type: WINDOW_MESSAGE_TYPES.EXPORT_STATUS, state, message });
}

function isExportStatusMessage(value) {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['type', 'state', 'message']))
        && value.type === WINDOW_MESSAGE_TYPES.EXPORT_STATUS
        && EXPORT_STATE_VALUES.has(value.state)
        && (value.message === undefined || typeof value.message === 'string');
}

function createRuntimeExportStatusMessage(state, message = '') {
    if (!EXPORT_STATE_VALUES.has(state)) throw new TypeError(`Unsupported export state: ${String(state)}`);
    if (typeof message !== 'string') throw new TypeError('Export status message must be a string');
    return Object.freeze({ action: RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS, state, message });
}

function isRuntimeExportStatusMessage(value) {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['action', 'state', 'message']))
        && value.action === RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS
        && EXPORT_STATE_VALUES.has(value.state)
        && (value.message === undefined || typeof value.message === 'string');
}

function createStorageRequest({ requestId, action, key, value }) {
    const candidate = {
        type: WINDOW_MESSAGE_TYPES.STORAGE_REQUEST,
        requestId,
        action,
        key
    };
    if (action === STORAGE_ACTIONS.SET) candidate.value = value;
    if (!isStorageRequestMessage(candidate)) throw new TypeError('Invalid storage request');
    return Object.freeze(candidate);
}

function isStorageRequestMessage(value) {
    if (!isRecord(value)
        || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_REQUEST
        || !isNonEmptyString(value.requestId)
        || !STORAGE_ACTION_VALUES.has(value.action)
        || !STORAGE_KEY_VALUES.has(value.key)
        || !hasOnlyKeys(value, new Set(['type', 'requestId', 'action', 'key', 'value']))) {
        return false;
    }
    if (value.action === STORAGE_ACTIONS.GET) return !Object.prototype.hasOwnProperty.call(value, 'value');
    return Object.prototype.hasOwnProperty.call(value, 'value') && value.value !== undefined;
}

function createStorageResponse({ requestId, ok, value, error }) {
    const candidate = {
        type: WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE,
        requestId,
        ok
    };
    if (ok) candidate.value = value;
    else candidate.error = error || 'Storage request failed';
    if (!isStorageResponseMessage(candidate)) throw new TypeError('Invalid storage response');
    return Object.freeze(candidate);
}

function isStorageResponseMessage(value) {
    if (!isRecord(value)
        || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE
        || !isNonEmptyString(value.requestId)
        || typeof value.ok !== 'boolean'
        || !hasOnlyKeys(value, new Set(['type', 'requestId', 'ok', 'value', 'error']))) {
        return false;
    }
    if (value.ok) return !Object.prototype.hasOwnProperty.call(value, 'error');
    return isNonEmptyString(value.error) && !Object.prototype.hasOwnProperty.call(value, 'value');
}

export {
    COMMAND_ROUTES,
    EXPORT_STATES,
    POPUP_COMMANDS,
    RUNTIME_MESSAGE_ACTIONS,
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
};