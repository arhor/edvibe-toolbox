import type { StorageKey } from './message-protocol.types.js';

export type ExecutionHistoryPreferences = Readonly<{
    maxCount?: number;
    maxAgeDays?: number;
}>;

export interface ToolboxStorageSchema {
    executionHistoryPreferences: ExecutionHistoryPreferences;
}

export type StorageValue<K extends StorageKey> = K extends keyof ToolboxStorageSchema
    ? ToolboxStorageSchema[K]
    : never;

export interface ChromeStorageBridge {
    get<K extends StorageKey>(key: K): Promise<StorageValue<K> | undefined>;
    set<K extends StorageKey>(key: K, value: StorageValue<K>): Promise<StorageValue<K>>;
    dispose(): void;
}
