import assert from 'node:assert/strict';
import { test } from 'node:test';

import { migrateLegacyExecutionHistory } from '#src/content/main/infrastructure/execution-history-repository.js';

function createRepository(initialRecords = []) {
    const records = new Map(initialRecords.map((record) => [String(record.id), record]));
    return {
        records,
        repository: {
            get: (id) => Promise.resolve(records.get(String(id))),
            put: (record) => {
                records.set(String(record.id), record);
                return Promise.resolve();
            }
        }
    };
}

test('migrateLegacyExecutionHistory copies missing records without overwriting migrated data', async () => {
    // Given
    const existing = { id: 'existing', source: 'toolfox' };
    const legacyRecords = [
        { id: 'legacy-only', source: 'legacy' },
        { id: 'existing', source: 'legacy' }
    ];
    const { records, repository } = createRepository([existing]);
    let deleted = false;

    // When
    const result = await migrateLegacyExecutionHistory({
        legacyDatabaseApi: {
            readAll: () => Promise.resolve(legacyRecords),
            deleteDatabase: () => {
                deleted = true;
                return Promise.resolve(true);
            }
        },
        repository,
        validateRecord: () => {}
    });

    // Then
    assert.deepEqual(result, { found: true, copied: 1, deleted: true });
    assert.equal(deleted, true);
    assert.deepEqual(records.get('legacy-only'), legacyRecords[0]);
    assert.equal(records.get('existing'), existing);
});

test('migrateLegacyExecutionHistory is a no-op when the legacy database does not exist', async () => {
    // Given
    const { records, repository } = createRepository();
    let deleteCalls = 0;

    // When
    const result = await migrateLegacyExecutionHistory({
        legacyDatabaseApi: {
            readAll: () => Promise.resolve(null),
            deleteDatabase: () => {
                deleteCalls += 1;
                return Promise.resolve(true);
            }
        },
        repository,
        validateRecord: () => {}
    });

    // Then
    assert.deepEqual(result, { found: false, copied: 0, deleted: false });
    assert.equal(deleteCalls, 0);
    assert.equal(records.size, 0);
});

test('migrateLegacyExecutionHistory preserves the legacy database when copying fails', async () => {
    // Given
    let deleteCalls = 0;
    const repository = {
        get: () => Promise.resolve(undefined),
        put: () => Promise.reject(new Error('write failed'))
    };

    // When / Then
    await assert.rejects(
        migrateLegacyExecutionHistory({
            legacyDatabaseApi: {
                readAll: () => Promise.resolve([{ id: 'legacy-only' }]),
                deleteDatabase: () => {
                    deleteCalls += 1;
                    return Promise.resolve(true);
                }
            },
            repository,
            validateRecord: () => {}
        }),
        /write failed/
    );
    assert.equal(deleteCalls, 0);
});

test('migrateLegacyExecutionHistory tolerates a blocked legacy database deletion', async () => {
    // Given
    const legacyRecord = { id: 'legacy-only' };
    const { records, repository } = createRepository();

    // When
    const result = await migrateLegacyExecutionHistory({
        legacyDatabaseApi: {
            readAll: () => Promise.resolve([legacyRecord]),
            deleteDatabase: () => Promise.resolve(false)
        },
        repository,
        validateRecord: () => {}
    });

    // Then
    assert.deepEqual(result, { found: true, copied: 1, deleted: false });
    assert.equal(records.get('legacy-only'), legacyRecord);
});
