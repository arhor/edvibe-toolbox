const RETENTION_STORAGE_KEY = 'executionHistoryPreferences';
const DEFAULT_RETENTION_PREFERENCES = Object.freeze({
    mode: 'limits',
    maxCount: 100,
    maxAgeDays: 90,
    autoExport: false
});

function normalizePositiveInteger(value, fallback, path) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number <= 0) {
        if (value === undefined || value === null || value === '') {
            return fallback;
        }
        throw new TypeError(`${path} must be a positive integer`);
    }
    return number;
}

function normalizeRetentionPreferences(value = {}) {
    const mode = value.mode === 'indefinite' ? 'indefinite' : 'limits';
    return Object.freeze({
        mode,
        maxCount: normalizePositiveInteger(value.maxCount, DEFAULT_RETENTION_PREFERENCES.maxCount, 'maxCount'),
        maxAgeDays: normalizePositiveInteger(value.maxAgeDays, DEFAULT_RETENTION_PREFERENCES.maxAgeDays, 'maxAgeDays'),
        autoExport: Boolean(value.autoExport)
    });
}

async function applyRetention({ repository, preferences, now = new Date(), protectedExecutionId = null }) {
    const normalized = normalizeRetentionPreferences(preferences);
    if (normalized.mode === 'indefinite') {
        return Object.freeze({ deletedIds: Object.freeze([]) });
    }
    const records = await repository.list();
    const cutoff = now.getTime() - normalized.maxAgeDays * 24 * 60 * 60 * 1000;
    const deleteIds = new Set();
    records.forEach((record, index) => {
        if (record.id === protectedExecutionId) {
            return;
        }
        if (index >= normalized.maxCount || new Date(record.completedAt).getTime() < cutoff) {
            deleteIds.add(record.id);
        }
    });
    for (const executionId of deleteIds) {
        await repository.delete(executionId);
    }
    return Object.freeze({ deletedIds: Object.freeze([...deleteIds]) });
}

export {
    RETENTION_STORAGE_KEY,
    DEFAULT_RETENTION_PREFERENCES,
    normalizeRetentionPreferences,
    applyRetention
};
