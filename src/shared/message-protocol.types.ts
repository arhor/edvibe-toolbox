import {
    EXPORT_STATES,
    POPUP_COMMANDS,
    RUNTIME_MESSAGE_ACTIONS,
    STORAGE_ACTIONS,
    STORAGE_KEYS,
    WINDOW_MESSAGE_TYPES
} from './message-protocol.js';

type ValueOf<T> = T[keyof T];

export type PopupCommand = ValueOf<typeof POPUP_COMMANDS>;
export type ExportState = ValueOf<typeof EXPORT_STATES>;
export type StorageAction = ValueOf<typeof STORAGE_ACTIONS>;
export type StorageKey = ValueOf<typeof STORAGE_KEYS>;

export type MainCommandType =
    | typeof WINDOW_MESSAGE_TYPES.START_EXPORT
    | typeof WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET
    | typeof WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER
    | typeof WINDOW_MESSAGE_TYPES.OPEN_BATCH_LESSON_ACCESS
    | typeof WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_ONBOARDING
    | typeof WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_MANAGEMENT
    | typeof WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_CREATION
    | typeof WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_DELETION
    | typeof WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY;

export type MainCommandMessage =
    | {
        type: Exclude<MainCommandType, typeof WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY>;
      }
    | {
        type: typeof WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY;
        executionId?: string | null;
      };

export type ExportStatusMessage = {
    type: typeof WINDOW_MESSAGE_TYPES.EXPORT_STATUS;
    state: ExportState;
    message?: string;
};

export type RuntimeExportStatusMessage = {
    action: typeof RUNTIME_MESSAGE_ACTIONS.EXPORT_STATUS;
    state: ExportState;
    message?: string;
};

export type StorageRequestMessage =
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
      };

export type StorageResponseMessage =
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
      };
