import {
    RETENTION_STORAGE_KEY,
    normalizeRetentionPreferences
} from '#src/content/main/application/execution-history-retention.js';

function createExecutionHistoryPreferenceStore({ storage } = {}) {
    if (!storage || typeof storage.get !== 'function' || typeof storage.set !== 'function') {
        throw new TypeError('A storage adapter with get() and set() is required');
    }
    return Object.freeze({
        async get() {
            const stored = await storage.get(RETENTION_STORAGE_KEY);
            return normalizeRetentionPreferences(stored || {});
        },
        async set(preferences) {
            const normalized = normalizeRetentionPreferences(preferences);
            await storage.set(RETENTION_STORAGE_KEY, normalized);
            return normalized;
        }
    });
}

export { createExecutionHistoryPreferenceStore };
