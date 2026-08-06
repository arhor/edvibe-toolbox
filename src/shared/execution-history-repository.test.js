const test = require('node:test');
const assert = require('node:assert/strict');
const recordApi = require('./execution-history-record.js');
const repositoryApi = require('./execution-history-repository.js');

function record(id, completedAt, overrides = {}) {
    return recordApi.buildExecutionRecord({
        id,
        operationType: 'demo',
        startedAt: completedAt,
        completedAt,
        status: 'completed',
        pageContext: { marathonId: '12' },
        counts: {},
        results: [],
        ...overrides
    });
}

function createFakeIndexedDb(initial = []) {
    const values = [...initial];
    const storeRepository = {
        async put(value) { const index = values.findIndex((item) => item.id === value.id); if (index >= 0) values[index] = value; else values.push(value); },
        async get(id) { return values.find((item) => item.id === id); },
        async newest() { return [...values].sort((a, b) => b.completedAt.localeCompare(a.completedAt)); },
        async delete(id) { const index = values.findIndex((item) => item.id === id); if (index >= 0) values.splice(index, 1); },
        async clear() { values.splice(0); },
        async count() { return values.length; }
    };
    return {
        values,
        api: { createIndexedDb(definition) { return { repository: () => storeRepository, close() {}, definition }; } }
    };
}

test('migration creates the history store and query indexes', () => {
    const indexes = [];
    const store = { createIndex: (...args) => indexes.push(args) };
    const db = {
        objectStoreNames: { contains: () => false },
        createObjectStore(name, options) { assert.equal(name, 'executionHistory'); assert.deepEqual(options, { keyPath: 'id' }); return store; }
    };
    repositoryApi.HISTORY_DB_DEFINITION.migrations[0].migrate({ db });
    assert.deepEqual(indexes.map(([name]) => name), ['completedAt', 'operationType', 'status', 'marathonId']);
});

test('lists newest first and applies every supported filter', async () => {
    const fake = createFakeIndexedDb([
        record('1', '2026-08-01T10:00:00.000Z'),
        record('2', '2026-08-03T10:00:00.000Z', { status: 'interrupted', operationType: 'other', pageContext: { marathonId: '99' } }),
        record('3', '2026-08-02T10:00:00.000Z')
    ]);
    const repository = repositoryApi.createExecutionHistoryRepository({ indexedDbApi: fake.api });
    assert.deepEqual((await repository.list()).map((item) => item.id), ['2', '3', '1']);
    assert.deepEqual((await repository.list({ operationType: 'other', status: 'interrupted', marathonId: '99', from: '2026-08-03', to: '2026-08-03' })).map((item) => item.id), ['2']);
});

test('persists, retrieves, deletes, and clears records', async () => {
    const fake = createFakeIndexedDb();
    const repository = repositoryApi.createExecutionHistoryRepository({ indexedDbApi: fake.api });
    await repository.persist(record('1', '2026-08-01T10:00:00.000Z'));
    assert.equal((await repository.get('1')).id, '1');
    await repository.delete('1');
    assert.equal(await repository.get('1'), null);
    await repository.persist(record('2', '2026-08-02T10:00:00.000Z'));
    await repository.clear();
    assert.equal(await repository.count(), 0);
});
