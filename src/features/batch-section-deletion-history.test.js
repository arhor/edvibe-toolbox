const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./batch-section-deletion.js');
const recordApi = require('../shared/execution-history-record.js');

test('maps a representative batch result into the shared canonical contract', () => {
    const plan = { sectionName: 'Archive', selectedCount: 3, eligible: [{ lessonId: 1 }, { lessonId: 2 }], rejected: [{ lessonId: 3 }] };
    const input = api.buildExecutionHistoryInput({
        marathonId: 42,
        startedAt: '2026-08-06T04:00:00.000Z',
        completedAt: '2026-08-06T04:01:00.000Z',
        result: {
            plan,
            fatalError: null,
            results: [
                { lessonId: 3, marathonLessonId: 30, number: 3, name: 'Three', status: 'rejected', code: 'SECTION_NOT_FOUND', message: 'Missing.' },
                { lessonId: 1, marathonLessonId: 10, number: 1, name: 'One', sectionId: 100, status: 'deleted', code: 'DELETED', message: 'Deleted.' },
                { lessonId: 2, marathonLessonId: 20, number: 2, name: 'Two', sectionId: 200, status: 'failed', code: 'SERVER_REJECTED', message: 'Rejected.' }
            ]
        }
    });
    const record = recordApi.buildExecutionRecord(input, { cryptoApi: { randomUUID: () => 'history-1' } });
    assert.equal(record.status, 'completed_with_failures');
    assert.deepEqual(record.counts, { requested: 3, eligible: 2, attempted: 2, successful: 1, noOp: 0, skipped: 1, failed: 1, notAttempted: 0 });
    assert.deepEqual(record.results.map((item) => item.code), ['SECTION_NOT_FOUND', 'DELETED', 'SERVER_REJECTED']);
});
