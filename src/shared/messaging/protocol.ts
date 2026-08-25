import {
    COMMAND_ROUTES,
    EXPORT_STATE_VALUES,
    MAIN_COMMAND_TYPES,
    RUNTIME_MESSAGE_ACTIONS,
    STORAGE_ACTIONS,
    STORAGE_ACTION_VALUES,
    STORAGE_KEY_VALUES,
    WINDOW_MESSAGE_TYPES,
    type CommandRoute,
    type ExportState,
    type MainCommandType,
    type PopupCommand,
    type StorageAction,
    type StorageKey
} from '#src/shared/messaging/model.js';
import { hasOnlyKeys, isNonEmptyString, isRecord } from '#src/shared/utils.js';

export interface PopupCommandMessage {
    action: PopupCommand;
}

export type MainCommandMessage = Readonly<
    | { type: Exclude<MainCommandType, typeof WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY> }
    | { type: typeof WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY; executionId?: string | null }
>;

export interface MainCommandPayload {
    executionId?: string | null;
}

export interface ExportStatusMessage {
    readonly type: typeof WINDOW_MESSAGE_TYPES.EXPORT_STATUS;
    readonly state: ExportState;
    readonly message?: string;
}

export interface RuntimeExportStatusMessage {
    readonly action: typeof RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS;
    readonly state: ExportState;
    readonly message?: string;
}

export type StorageRequestMessage = Readonly<
    | {
        type: typeof WINDOW_MESSAGE_TYPES.STORAGE_REQUEST;
        requestId: string;
        action: typeof STORAGE_ACTIONS.GET;
        key: StorageKey;
    }
    | {
        type: typeof WINDOW_MESSAGE_TYPES.STORAGE_REQUEST;
        requestId: string;
        action: typeof STORAGE_ACTIONS.SET;
        key: StorageKey;
        value: unknown;
    }
>;

export interface StorageRequestInput {
    requestId: string;
    action: StorageAction;
    key: StorageKey;
    value?: unknown;
}

export type StorageResponseMessage = Readonly<
    | {
        type: typeof WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE;
        requestId: string;
        ok: true;
        value?: unknown;
    }
    | {
        type: typeof WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE;
        requestId: string;
        ok: false;
        error: string;
    }
>;

export type StorageResponseInput =
    | { requestId: string; ok: true; value?: unknown; error?: never }
    | { requestId: string; ok: false; value?: never; error?: string };

function isPopupCommand(value: unknown): value is PopupCommand {
    return typeof value === 'string' && Object.hasOwn(COMMAND_ROUTES, value);
}

function isExportState(value: unknown): value is ExportState {
    return typeof value === 'string' && EXPORT_STATE_VALUES.has(value);
}

function isStorageAction(value: unknown): value is StorageAction {
    return typeof value === 'string' && STORAGE_ACTION_VALUES.has(value);
}

function isStorageKey(value: unknown): value is StorageKey {
    return typeof value === 'string' && STORAGE_KEY_VALUES.has(value);
}

export function getCommandRoute(action: unknown): CommandRoute | null {
    return isPopupCommand(action) ? COMMAND_ROUTES[action] : null;
}

export function isPopupCommandMessage(value: unknown): value is PopupCommandMessage {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['action']))
        && isPopupCommand(value.action);
}

export function createMainCommandMessage(action: unknown, payload: MainCommandPayload = {}): MainCommandMessage {
    const route = getCommandRoute(action);
    if (!route) {
        throw new TypeError(`Unsupported popup command: ${String(action)}`);
    }
    if (route.type === WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY && payload.executionId != null) {
        if (!isNonEmptyString(payload.executionId)) {
            throw new TypeError('executionId must be a non-empty string');
        }
        return Object.freeze({ type: route.type, executionId: payload.executionId });
    }
    return Object.freeze({ type: route.type });
}

export function isMainCommandMessage(value: unknown): value is MainCommandMessage {
    if (!isRecord(value) || typeof value.type !== 'string' || !MAIN_COMMAND_TYPES.has(value.type)) {
        return false;
    }
    if (value.type === WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY) {
        return hasOnlyKeys(value, new Set(['type', 'executionId']))
            && (value.executionId === undefined || value.executionId === null || isNonEmptyString(value.executionId));
    }
    return hasOnlyKeys(value, new Set(['type']));
}

export function createExportStatusMessage(state: unknown, message: unknown = ''): ExportStatusMessage {
    if (!isExportState(state)) {
        throw new TypeError(`Unsupported export state: ${String(state)}`);
    }
    if (typeof message !== 'string') {
        throw new TypeError('Export status message must be a string');
    }
    return Object.freeze({ type: WINDOW_MESSAGE_TYPES.EXPORT_STATUS, state, message });
}

export function isExportStatusMessage(value: unknown): value is ExportStatusMessage {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['type', 'state', 'message']))
        && value.type === WINDOW_MESSAGE_TYPES.EXPORT_STATUS
        && isExportState(value.state)
        && (value.message === undefined || typeof value.message === 'string');
}

export function createRuntimeExportStatusMessage(state: unknown, message: unknown = ''): RuntimeExportStatusMessage {
    if (!isExportState(state)) {
        throw new TypeError(`Unsupported export state: ${String(state)}`);
    }
    if (typeof message !== 'string') {
        throw new TypeError('Export status message must be a string');
    }
    return Object.freeze({ action: RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS, state, message });
}

export function isRuntimeExportStatusMessage(value: unknown): value is RuntimeExportStatusMessage {
    return isRecord(value)
        && hasOnlyKeys(value, new Set(['action', 'state', 'message']))
        && value.action === RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS
        && isExportState(value.state)
        && (value.message === undefined || typeof value.message === 'string');
}

export function createStorageRequest({ requestId, action, key, value }: StorageRequestInput): StorageRequestMessage {
    const candidate: Record<string, unknown> = {
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

export function isStorageRequestMessage(value: unknown): value is StorageRequestMessage {
    if (!isRecord(value)
        || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_REQUEST
        || !isNonEmptyString(value.requestId)
        || !isStorageAction(value.action)
        || !isStorageKey(value.key)
        || !hasOnlyKeys(value, new Set(['type', 'requestId', 'action', 'key', 'value']))) {
        return false;
    }
    if (value.action === STORAGE_ACTIONS.GET) {
        return !Object.hasOwn(value, 'value');
    }
    return Object.hasOwn(value, 'value') && value.value !== undefined;
}

export function createStorageResponse(input: StorageResponseInput): StorageResponseMessage {
    const candidate: Record<string, unknown> = {
        type: WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE,
        requestId: input.requestId,
        ok: input.ok
    };
    if (input.ok) {
        candidate.value = input.value;
    } else {
        candidate.error = input.error || 'Storage request failed';
    }
    if (!isStorageResponseMessage(candidate)) {
        throw new TypeError('Invalid storage response');
    }
    return Object.freeze(candidate);
}

export function isStorageResponseMessage(value: unknown): value is StorageResponseMessage {
    if (!isRecord(value)
        || value.type !== WINDOW_MESSAGE_TYPES.STORAGE_RESPONSE
        || !isNonEmptyString(value.requestId)
        || typeof value.ok !== 'boolean'
        || !hasOnlyKeys(value, new Set(['type', 'requestId', 'ok', 'value', 'error']))) {
        return false;
    }
    if (value.ok) {
        return !Object.hasOwn(value, 'error');
    }
    return isNonEmptyString(value.error) && !Object.hasOwn(value, 'value');
}
