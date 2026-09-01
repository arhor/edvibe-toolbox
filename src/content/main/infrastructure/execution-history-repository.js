import * as recordApi from '#src/content/main/infrastructure/execution-history-record.js';
import * as indexedDbApi from '#src/content/main/infrastructure/indexeddb.js';

const HISTORY_DATABASE_NAME = 'toolfox';
const LEGACY_HISTORY_DATABASE_NAME = 'edvibe-toolbox';
const HISTORY_DATABASE_VERSION = 1;
const HISTORY_STORE_NAME = 'executionHistory';

const HISTORY_DB_DEFINITION = Object.freeze({
    name: HISTORY_DATABASE_NAME,
    version: HISTORY_DATABASE_VERSION,
    migrations: Object.freeze([Object.freeze({
        version: 1,
        migrate({ db }) {
            if (db.objectStoreNames.contains(HISTORY_STORE_NAME)) {
                return;
            }
            const store = db.createObjectStore(HISTORY_STORE_NAME, { keyPath: 'id' });
            store.createIndex('completedAt', 'completedAt', { unique: false });
            store.createIndex('operationType', 'operationType', { unique: false });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('marathonId', 'pageContext.marathonId', { unique: false });
        }
    })])
});

function normalizeDateBoundary(value, path, endOfDay = false) {
    if (!value) {
        return null;
    }
    const serialized = String(value);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(serialized)
        ? new Date(`${serialized}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}`)
        : new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new TypeError(`Invalid ${path}`);
    }
    return date.getTime();
}

function matchesFilters(record, filters = {}) {
    if (filters.operationType && record.operationType !== filters.operationType) {
        return false;
    }
    if (filters.status && record.status !== filters.status) {
        return false;
    }
    if (filters.marathonId && String(record.pageContext?.marathonId || '') !== String(filters.marathonId)) {
        return false;
    }
    const completed = new Date(record.completedAt).getTime();
    const from = normalizeDateBoundary(filters.from, 'from');
    const to = normalizeDateBoundary(filters.to, 'to', true);
    if (from !== null && completed < from) {
        return false;
    }
    if (to !== null && completed > to) {
        return false;
    }
    return true;
}

function createLegacyHistoryDatabaseApi(indexedDBFactory) {
    if (!indexedDBFactory?.open || !indexedDBFactory?.deleteDatabase) {
        throw new TypeError('IndexedDB factory is required for legacy history migration');
    }

    async function legacyDatabaseExists() {
        if (typeof indexedDBFactory.databases !== 'function') {
            return true;
        }
        const databases = await indexedDBFactory.databases();
        return databases.some(({ name }) => name === LEGACY_HISTORY_DATABASE_NAME);
    }

    async function readAll() {
        if (!await legacyDatabaseExists()) {
            return null;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDBFactory.open(LEGACY_HISTORY_DATABASE_NAME);
            let createdDuringProbe = false;

            request.onupgradeneeded = (event) => {
                if (event.oldVersion === 0) {
                    createdDuringProbe = true;
                    request.transaction?.abort();
                }
            };
            request.onerror = () => {
                if (createdDuringProbe && request.error?.name === 'AbortError') {
                    resolve(null);
                    return;
                }
                reject(request.error || new Error('Failed to open legacy execution history database'));
            };
            request.onsuccess = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(HISTORY_STORE_NAME)) {
                    db.close();
                    resolve([]);
                    return;
                }

                const transaction = db.transaction(HISTORY_STORE_NAME, 'readonly');
                const getAllRequest = transaction.objectStore(HISTORY_STORE_NAME).getAll();
                const fail = () => {
                    db.close();
                    reject(transaction.error || getAllRequest.error || new Error('Failed to read legacy execution history'));
                };

                getAllRequest.onerror = fail;
                transaction.onerror = fail;
                transaction.onabort = fail;
                transaction.oncomplete = () => {
                    const records = Array.from(getAllRequest.result || []);
                    db.close();
                    resolve(records);
                };
            };
        });
    }

    function deleteDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDBFactory.deleteDatabase(LEGACY_HISTORY_DATABASE_NAME);
            let settled = false;
            const settle = (value) => {
                if (!settled) {
                    settled = true;
                    resolve(value);
                }
            };
            request.onsuccess = () => settle(true);
            request.onblocked = () => settle(false);
            request.onerror = () => {
                if (!settled) {
                    settled = true;
                    reject(request.error || new Error('Failed to delete legacy execution history database'));
                }
            };
        });
    }

    return Object.freeze({ readAll, deleteDatabase });
}

async function migrateLegacyExecutionHistory({
    legacyDatabaseApi,
    repository,
    validateRecord = recordApi.validateExecutionRecord
}) {
    const records = await legacyDatabaseApi.readAll();
    if (records === null) {
        return Object.freeze({ found: false, copied: 0, deleted: false });
    }

    let copied = 0;
    for (const record of records) {
        validateRecord(record);
        const executionId = String(record.id);
        if (await repository.get(executionId)) {
            continue;
        }
        await repository.put(record);
        copied += 1;
    }

    const deleted = await legacyDatabaseApi.deleteDatabase();
    return Object.freeze({ found: true, copied, deleted });
}

function createExecutionHistoryRepository(options = {}) {
    const api = options.indexedDbApi || indexedDbApi;
    if (!api?.createIndexedDb) {
        throw new TypeError('IndexedDB API is required');
    }
    const indexedDBFactory = options.indexedDB || globalThis.indexedDB;
    const db = api.createIndexedDb(HISTORY_DB_DEFINITION, { indexedDB: indexedDBFactory });
    const repository = db.repository(HISTORY_STORE_NAME);
    const canMigrateLegacy = typeof indexedDBFactory?.open === 'function'
        && typeof indexedDBFactory?.deleteDatabase === 'function';
    const legacyDatabaseApi = options.legacyDatabaseApi
        || (canMigrateLegacy ? createLegacyHistoryDatabaseApi(indexedDBFactory) : null);
    let migrationPromise = null;

    function ensureLegacyMigration() {
        if (!legacyDatabaseApi) {
            return Promise.resolve();
        }
        if (!migrationPromise) {
            migrationPromise = migrateLegacyExecutionHistory({
                legacyDatabaseApi,
                repository
            });
        }
        return migrationPromise;
    }

    return Object.freeze({
        async persist(record) {
            await ensureLegacyMigration();
            recordApi.validateExecutionRecord(record);
            await repository.put(record);
            return recordApi.cloneExecutionRecord(record);
        },
        async get(executionId) {
            await ensureLegacyMigration();
            const record = await repository.get(String(executionId));
            return record ? recordApi.cloneExecutionRecord(record) : null;
        },
        async list(filters = {}) {
            await ensureLegacyMigration();
            const records = await repository.newest('completedAt');
            return records.filter((record) => matchesFilters(record, filters)).map(recordApi.cloneExecutionRecord);
        },
        async delete(executionId) {
            await ensureLegacyMigration();
            await repository.delete(String(executionId));
        },
        async clear() {
            await ensureLegacyMigration();
            await repository.clear();
        },
        async count() {
            await ensureLegacyMigration();
            return repository.count();
        },
        close() {
            db.close();
        }
    });
}

export {
    HISTORY_DATABASE_NAME,
    LEGACY_HISTORY_DATABASE_NAME,
    HISTORY_DATABASE_VERSION,
    HISTORY_STORE_NAME,
    HISTORY_DB_DEFINITION,
    matchesFilters,
    createLegacyHistoryDatabaseApi,
    migrateLegacyExecutionHistory,
    createExecutionHistoryRepository
};
