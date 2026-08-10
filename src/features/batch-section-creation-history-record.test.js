import test from 'node:test';
import assert from 'node:assert/strict';
import * as history from './batch-section-creation-history.js';
import { lessons, plan, build } from './batch-section-creation-history-test-fixtures.js';

test('preserves same-name preflight rejection as a distinct lesson outcome', () => {
    const collision = {
        ...lessons()[1],
        code: 'SECTION_NAME_COLLISION',
        message: 'A section named "Summer promotion" already exists.'
    };
    const input = build(history, {
        plan: plan({ eligible: [lessons()[0], lessons()[2]], rejected: [collision] }),
        result: {
            results: [
                { ...lessons()[0], lessonNumber: 1, lessonName: 'Welcome', status: 'created' },
                { ...collision, lessonNumber: 2, lessonName: 'Practice', status: 'rejected' },
                { ...lessons()[2], lessonNumber: 3, lessonName: 'Review', status: 'created' }
            ]
        }
    });

    assert.equal(input.status, 'completed_with_failures');
    assert.equal(input.results[1].status, 'rejected');
    assert.equal(input.results[1].code, 'SECTION_NAME_COLLISION');
    assert.equal(input.results[1].attempts, 0);
    assert.equal(input.results[1].data.preflight.status, 'rejected');
    assert.equal(input.counts.skipped, 1);
});

test('records per-lesson creation failure with stable code, message, and attempts', () => {
    const input = build(history, {
        plan: plan({ eligible: [lessons()[0]], selectedLessonIds: [101] }),
        result: {
            results: [{
                ...lessons()[0],
                lessonNumber: 1,
                lessonName: 'Welcome',
                status: 'failed',
                code: 'REQUEST_TIMEOUT',
                message: 'Creation timed out.',
                attempts: 3
            }]
        }
    });

    assert.equal(input.status, 'completed_with_failures');
    assert.equal(input.results[0].attempts, 3);
    assert.deepEqual(input.results[0].data.creationFailure, {
        code: 'REQUEST_TIMEOUT',
        message: 'Creation timed out.',
        attemptCount: 3
    });
});

test('keeps partial creation distinct when cleanup succeeds', () => {
    const input = build(history, {
        plan: plan({ eligible: [lessons()[0]], selectedLessonIds: [101] }),
        result: {
            results: [{
                ...lessons()[0],
                lessonNumber: 1,
                lessonName: 'Welcome',
                status: 'partially_created',
                code: 'SERVER_REJECTED',
                message: 'A block could not be created.',
                captured: { sectionId: 501 },
                cleanup: { attempted: true, status: 'success' }
            }]
        }
    });

    assert.equal(input.results[0].status, 'partially_created');
    assert.equal(input.results[0].data.cleanup.status, 'success');
    assert.equal(input.results[0].data.cleanup.code, 'CLEANUP_SUCCEEDED');
    assert.equal(input.results[0].data.creationFailure.code, 'SERVER_REJECTED');
    assert.equal(input.counts.failed, 1);
});

test('preserves failed and unavailable cleanup outcomes', () => {
    const input = build(history, {
        plan: plan({ eligible: lessons().slice(0, 2), selectedLessonIds: [101, 102] }),
        result: {
            results: [
                {
                    ...lessons()[0],
                    status: 'partially_created',
                    code: 'SERVER_REJECTED',
                    message: 'Block failed.',
                    cleanup: {
                        attempted: true,
                        status: 'failed',
                        code: 'CLEANUP_TIMEOUT',
                        message: 'Cleanup timed out.'
                    }
                },
                {
                    ...lessons()[1],
                    status: 'partially_created',
                    code: 'WS_UNAVAILABLE',
                    message: 'Connection disappeared.'
                }
            ]
        },
        terminalStatus: 'interrupted'
    });

    assert.equal(input.results[0].data.cleanup.status, 'failed');
    assert.equal(input.results[0].data.cleanup.code, 'CLEANUP_TIMEOUT');
    assert.equal(input.results[1].data.cleanup.status, 'unavailable');
    assert.equal(input.results[1].data.cleanup.code, 'CLEANUP_UNAVAILABLE_AFTER_INTERRUPTION');
});

test('fills unfinished confirmed lessons as not attempted after fatal interruption', () => {
    const fatalError = Object.assign(new Error('Connection disappeared.'), { code: 'WS_UNAVAILABLE' });
    const input = build(history, {
        result: {
            results: [
                { ...lessons()[0], status: 'created', captured: { sectionId: 601 } },
                {
                    ...lessons()[1],
                    status: 'failed',
                    code: 'WS_UNAVAILABLE',
                    message: 'Connection disappeared.'
                }
            ],
            fatalError
        },
        fatalError
    });

    assert.equal(input.status, 'interrupted');
    assert.deepEqual(input.results.map((result) => result.status), [
        'created', 'failed', 'not_attempted'
    ]);
    assert.equal(input.results[2].code, 'OPERATION_INTERRUPTED');
    assert.equal(input.results[2].attempts, 0);
    assert.equal(input.counts.notAttempted, 1);
});

test('marks the entire remaining confirmed plan not attempted after cancellation', () => {
    const input = build(history, { terminalStatus: 'cancelled' });

    assert.equal(input.status, 'cancelled');
    assert.deepEqual(input.results.map((result) => result.status), [
        'not_attempted', 'not_attempted', 'not_attempted'
    ]);
    assert.ok(input.results.every((result) => result.code === 'OPERATION_CANCELLED'));
    assert.equal(input.counts.notAttempted, 3);
});