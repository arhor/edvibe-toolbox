const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./execution-history-retention.js');

function repository(records) {
    const values = [...records];
    return {
        values,
        async list() { return [...values]; },
        async delete(id) { values.splice(values.findIndex((item) => item.id === id), 1); }
    };
}

test('applies combined age and count limits while protecting the new record', async () => {
    const repo = repository([
        { id: 'new', completedAt: '2026-08-06T10:00:00.000Z' },
        { id: 'recent', completedAt: '2026-08-05T10:00:00.000Z' },
        { id: 'old', completedAt: '2026-01-01T10:00:00.000Z' }
    ]);
    const result = await api.applyRetention({
        repository: repo,
        preferences: { mode: 'limits', maxCount: 1, maxAgeDays: 30 },
        now: new Date('2026-08-06T12:00:00.000Z'),
        protectedExecutionId: 'new'
    });
    assert.deepEqual([...result.deletedIds].sort(), ['old', 'recent']);
    assert.deepEqual(repo.values.map((item) => item.id), ['new']);
});

test('indefinite mode never deletes records', async () => {
    const repo = repository([{ id: 'old', completedAt: '2020-01-01T00:00:00.000Z' }]);
    await api.applyRetention({ repository: repo, preferences: { mode: 'indefinite' } });
    assert.equal(repo.values.length, 1);
});

test('preference store defaults are conservative and auto export is disabled', async () => {
    let stored;
    const store = api.createRetentionPreferenceStore({ async get() { return stored; }, async set(_key, value) { stored = value; } });
    const defaults = await store.get();
    assert.equal(defaults.maxCount, 100);
    assert.equal(defaults.maxAgeDays, 90);
    assert.equal(defaults.autoExport, false);
    await store.set({ mode: 'indefinite', autoExport: true });
    assert.equal((await store.get()).mode, 'indefinite');
});
