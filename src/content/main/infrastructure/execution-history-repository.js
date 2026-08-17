import * as recordApi from '#src/content/main/infrastructure/execution-history-record.js';
import * as indexedDbApi from '#src/content/main/infrastructure/indexeddb.js';

const HISTORY_DATABASE_NAME = 'edvibe-toolbox';
const HISTORY_DATABASE_VERSION = 1;
const HISTORY_STORE_NAME = 'executionHistory';

const HISTORY_DB_DEFINITION = Object.freeze({
    name: HISTORY_DATABASE_NAME,
    version: HISTORY_DATABASE_VERSION,
    migrations: Object.freeze([Object.freeze({
        version: 1,
        migrate({ db }) {
            if (db.objectStoreNames.contains(HISTORY_STORE_NAME)) return;
            const store = db.createObjectStore(HISTORY_STORE_NAME, { keyPath: 'id' });
            store.createIndex('completedAt', 'completedAt', { unique: false });
            store.createIndex('operationType', 'operationType', { unique: false });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('marathonId', 'pageContext.marathonId', { unique: false });
        }
    })])
});

function normalizeDateBoundary(value, path, endOfDay = false) {
    if (!value) return null;
    const serialized = String(value);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(serialized)
        ? new Date(`${serialized}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}`)
        : new Date(value);
    if (Number.isNaN(date.getTime())) throw new TypeError(`Invalid ${path}`);
    return date.getTime();
}

function matchesFilters(record, filters = {}) {
    if (filters.operationType && record.operationType !== filters.operationType) return false;
    if (filters.status && record.status !== filters.status) return false;
    if (filters.marathonId && String(record.pageContext?.marathonId || '') !== String(filters.marathonId)) return false;
    const completed = new Date(record.completedAt).getTime();
    const from = normalizeDateBoundary(filters.from, 'from');
    const to = normalizeDateBoundary(filters.to, 'to', true);
    if (from !== null && completed < from) return false;
    if (to !== null && completed > to) return false;
    return true;
}

function createExecutionHistoryRepository(options = {}) {
    const api = options.indexedDbApi || indexedDbApi;
    if (!api?.createIndexedDb) throw new TypeError('IndexedDB API is required');
    const db = api.createIndexedDb(HISTORY_DB_DEFINITION, { indexedDB: options.indexedDB });
    const repository = db.repository(HISTORY_STORE_NAME);

    return Object.freeze({
        async persist(record) {
            recordApi.validateExecutionRecord(record);
            await repository.put(record);
            return recordApi.cloneExecutionRecord(record);
        },
        async get(executionId) {
            const record = await repository.get(String(executionId));
            return record ? recordApi.cloneExecutionRecord(record) : null;
        },
        async list(filters = {}) {
            const records = await repository.newest('completedAt');
            return records.filter((record) => matchesFilters(record, filters)).map(recordApi.cloneExecutionRecord);
        },
        async delete(executionId) {
            await repository.delete(String(executionId));
        },
        async clear() {
            await repository.clear();
        },
        count() {
            return repository.count();
        },
        close() {
            db.close();
        }
    });
}

export {
    HISTORY_DATABASE_NAME,
    HISTORY_DATABASE_VERSION,
    HISTORY_STORE_NAME,
    HISTORY_DB_DEFINITION,
    matchesFilters,
    createExecutionHistoryRepository
};
