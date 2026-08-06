const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./execution-history-service.js');

function input() {
    return { operationType: 'demo', startedAt: '2026-08-06T04:00:00.000Z', completedAt: '2026-08-06T04:01:00.000Z', status: 'completed', pageContext: {}, counts: {}, results: [] };
}

function createService({ failPersist = false, autoExport = false, failDownload = false } = {}) {
    const records = [];
    const downloads = [];
    const repository = {
        async persist(record) { if (failPersist) throw new Error('db failed'); records.push(record); },
        async list() { return [...records]; }, async get(id) { return records.find((item) => item.id === id) || null; },
        async delete() {}, async clear() { records.splice(0); }
    };
    const preferenceStore = { async get() { return { mode: 'limits', maxCount: 100, maxAgeDays: 90, autoExport }; }, async set(value) { return value; } };
    const downloader = { download(payload) { if (failDownload) throw new Error('blocked'); downloads.push(payload); } };
    const service = api.createExecutionHistoryService({ repository, preferenceStore, downloader, cryptoApi: { randomUUID: () => 'id-1' }, now: () => new Date('2026-08-06T04:02:00.000Z') });
    return { service, records, downloads };
}

test('persists a terminal record and applies optional automatic export', async () => {
    const { service, records, downloads } = createService({ autoExport: true });
    const result = await service.persistTerminal(input());
    assert.equal(result.stored, true);
    assert.equal(records.length, 1);
    assert.equal(downloads.length, 1);
});

test('persistence and download failures remain separate from the visible result', async () => {
    const persistence = await createService({ failPersist: true }).service.persistTerminal(input());
    assert.equal(persistence.stored, false);
    assert.equal(persistence.record.id, 'id-1');
    assert.match(persistence.persistenceError.message, /db failed/);

    const download = await createService({ autoExport: true, failDownload: true }).service.persistTerminal(input());
    assert.equal(download.stored, true);
    assert.match(download.exportError.message, /blocked/);
});
