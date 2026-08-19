import { COMMAND_ROUTES, WINDOW_MESSAGE_TYPES, RUNTIME_MESSAGE_ACTIONS, STORAGE_ACTIONS, MAIN_COMMAND_TYPES, EXPORT_STATE_VALUES, STORAGE_KEY_VALUES } from '#src/shared/messaging/model.js';
import { isRecord, hasOnlyKeys, isNonEmptyString } from '#src/shared/utils.js';

export function getCommandRoute(action) {
    return typeof action === 'string' && Object.prototype.hasOwnProperty.call(COMMAND_ROUTES, action)
        ? COMMAND_ROUTES[action]
        : null;
}

export function isPopupCommandMessage(value) {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['action']))
        && getCommandRoute(value.action) !== null;
}

export function createMainCommandMessage(action, payload = {}) {
    const route = getCommandRoute(action);
    if (!route) {
        throw new TypeError(`Unsupported popup command: ${String(action)}`);
    }
    const message = { type: route.type };
    if (route.type === WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY && payload.executionId != null) {
        if (!isNonEmptyString(payload.executionId)) {
            throw new TypeError('executionId must be a non-empty string');
        }
        message.executionId = payload.executionId;
    }
    return Object.freeze(message);
}

export function isMainCommandMessage(value) {
    if ((value === undefined) || (value === null) || !isRecord(value) || !MAIN_COMMAND_TYPES.has(value.type)) {
        return false;
    }
    if (value.type === WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY) {
        return hasOnlyKeys(value, new Set(['type', 'executionId']))
            && (value.executionId === undefined || value.executionId === null || isNonEmptyString(value.executionId));
    }
    return hasOnlyKeys(value, new Set(['type']));
}

export function createExportStatusMessage(state, message = '') {
    if (!EXPORT_STATE_VALUES.has(state)) {
        throw new TypeError(`Unsupported export state: ${String(state)}`);
    }
    if (typeof message !== 'string') {
        throw new TypeError('Export status message must be a string');
    }
    return Object.freeze({ type: WINDOW_MESSAGE_TYPES.EXPORT_STATUS, state, message });
}

export function isExportStatusMessage(value) {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['type', 'state', 'message']))
        && value.type === WINDOW_MESSAGE_TYPES.EXPORT_STATUS
        && EXPORT_STATE_VALUES.has(value.state)
        && (value.message === undefined || typeof value.message === 'string');
}

export function createRuntimeExportStatusMessage(state, message = '') {
    if (!EXPORT_STATE_VALUES.has(state)) {
        throw new TypeError(`Unsupported export state: ${String(state)}`);
    }
    if (typeof message !== 'string') {
        throw new TypeError('Export status message must be a string');
    }
    return Object.freeze({ action: RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS, state, message });
}

export function isRuntimeExportStatusMessage(value) {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['action', 'state', 'message']))
        && value.action === RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS
        && EXPORT_STATE_VALUES.has(value.state)
        && (value.message === undefined || typeof value.message === 'string');
}

export function createStorageRequest({ requestId, action, key, value }) {
    const candidate = {
        type: WINDOW_MESSAGE_TYPES.STORAGE_REQUEST,
        requestId,
        action,
        key
    };
    if (action === STORAGE_ACTIONS.SET) {
        candidate.value = value;
    }
    if (!isStorageRequestMessage(candidate)) {
        throw new TypeError('Invalid storage request');
    }
    return Object.freeze(candidate);
}

export function isStorageRequestMessage(value) {
    if (!isRecord(value)
        || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_REQUEST
        || !isNonEmptyString(value.requestId)
        || !STORAGE_ACTION_VALUES.has(value.action)
        || !STORAGE_KEY_VALUES.has(value.key)
        || !hasOnlyKeys(value, new Set(['type', 'requestId', 'action', 'key', 'value']))) {
        return false;
    }
    if (value.action === STORAGE_ACTIONS.GET) {
        return !Object.prototype.hasOwnProperty.call(value, 'value');
    }
    return Object.prototype.hasOwnProperty.call(value, 'value') && value.value !== undefined;
}

export function createStorageResponse({ requestId, ok, value, error }) {
    const candidate = {
        type: WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE,
        requestId,
        ok
    };
    if (ok) {
        candidate.value = value;
    } else {
        candidate.error = error || 'Storage request failed';
    }
    if (!isStorageResponseMessage(candidate)) {
        throw new TypeError('Invalid storage response');
    }
    return Object.freeze(candidate);
}

export function isStorageResponseMessage(value) {
    if (!isRecord(value)
        || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE
        || !isNonEmptyString(value.requestId)
        || typeof value.ok !== 'boolean'
        || !hasOnlyKeys(value, new Set(['type', 'requestId', 'ok', 'value', 'error']))) {
        return false;
    }
    if (value.ok) {
        return !Object.prototype.hasOwnProperty.call(value, 'error');
    }
    return isNonEmptyString(value.error) && !Object.prototype.hasOwnProperty.call(value, 'value');
}
