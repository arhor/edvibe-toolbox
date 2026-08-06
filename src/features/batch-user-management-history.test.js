const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createExecutionRecord,
    persistTerminalRecord
} = require('./batch-user-management-history');

function matchedRow(overrides = {}) {
    return {
        email: 'User@Example.com',
        normalizedEmail: 'user@example.com',
        status: 'matched',
        message: '',
        hasCurator: true,
        marathonPupilId: 42,
        pupil: {
            Email: 'user@example.com',
            FirstName: 'Ada',
            LastName: 'Lovelace',
            PupilId: 7,
            MarathonPupilId: 42
        },
        unassignSelected: true,
        deleteSelected: true,
        unassign: { status: 'success', attempts: 1 },
        delete: { status: 'success', attempts: 1 },
        ...overrides
    };
}

function recordFor(rows, overrides = {}) {
    return createExecutionRecord({
        executionId: 'execution-1',
        startedAt: '2026-08-06T04:00:00.000Z',
        completedAt: '2026-08-06T04:01:00.000Z',
        marathonId: 123,
        marathonName: 'History marathon',
        rows,
        ...overrides
    });
}

test('serializes mixed operation selections independently', () => {
    const record = recordFor([
        matchedRow({ deleteSelected: false, delete: null }),
        matchedRow({
            email: 'delete@example.com',
            normalizedEmail: 'delete@example.com',
            unassignSelected: false,
            unassign: null
        })
    ]);

    assert.deepEqual(record.items[0].selectedOperations, ['unassign_curator']);
    assert.deepEqual(record.items[1].selectedOperations, ['delete_user']);
    assert.equal(record.summary.users.requested, 2);
    assert.equal(record.summary.operations.selected, 2);
    assert.equal(record.summary.operations.successful, 2);
});

test('records successful curator removal and deletion with identity data', () => {
    const record = recordFor([matchedRow()]);
    const [item] = record.items;

    assert.equal(item.user.email, 'user@example.com');
    assert.equal(item.user.pupilId, 7);
    assert.equal(item.user.marathonPupilId, 42);
    assert.equal(item.operations.unassign_curator.status, 'success');
    assert.equal(item.operations.delete_user.status, 'success');
    assert.equal(item.outcome, 'success');
});

test('records no-op curator removal without counting an attempt', () => {
    const record = recordFor([matchedRow({
        hasCurator: false,
        deleteSelected: false,
        delete: null,
        unassign: { status: 'noop', attempts: 0, message: 'No curator was assigned.' }
    })]);

    assert.equal(record.items[0].operations.unassign_curator.status, 'noop');
    assert.equal(record.summary.operations.attempted, 1);
    assert.equal(record.summary.operations.noop, 1);
});

test('keeps dependency-blocked deletion distinct from curator failure', () => {
    const record = recordFor([matchedRow({
        unassign: {
            status: 'failed',
            attempts: 3,
            code: 'REQUEST_TIMEOUT',
            message: 'Timed out.'
        },
        delete: {
            status: 'skipped',
            attempts: 0,
            message: 'Skipped because curator removal failed.'
        }
    })]);
    const operations = record.items[0].operations;

    assert.equal(operations.unassign_curator.status, 'failed');
    assert.equal(operations.unassign_curator.attemptCount, 3);
    assert.equal(operations.delete_user.status, 'skipped');
    assert.equal(operations.delete_user.code, 'DEPENDENCY_FAILED');
    assert.equal(operations.delete_user.blockedBy, 'unassign_curator');
    assert.equal(record.terminalStatus, 'completed_with_failures');
});

test('records deletion failure after successful curator removal', () => {
    const record = recordFor([matchedRow({
        delete: {
            status: 'failed',
            attempts: 2,
            code: 'INVALID_RESPONSE',
            message: 'Deletion was not confirmed.'
        }
    })]);

    assert.equal(record.items[0].operations.unassign_curator.status, 'success');
    assert.equal(record.items[0].operations.delete_user.status, 'failed');
    assert.equal(record.summary.operations.failed, 1);
    assert.equal(record.summary.users.failed, 1);
});

test('preserves malformed, missing, and ambiguous inputs in order', () => {
    const record = recordFor([
        {
            email: 'not-an-email',
            normalizedEmail: 'not-an-email',
            status: 'malformed',
            message: 'Invalid email address.',
            unassignSelected: false,
            deleteSelected: false
        },
        {
            email: 'missing@example.com',
            normalizedEmail: 'missing@example.com',
            status: 'missing',
            message: 'No marathon pupil found.',
            unassignSelected: false,
            deleteSelected: false
        },
        {
            email: 'duplicate@example.com',
            normalizedEmail: 'duplicate@example.com',
            status: 'ambiguous',
            message: 'Multiple marathon pupils found.',
            unassignSelected: false,
            deleteSelected: false
        }
    ]);

    assert.deepEqual(record.items.map((item) => item.resolution), [
        'malformed',
        'missing',
        'ambiguous'
    ]);
    assert.equal(record.summary.users.requested, 3);
    assert.equal(record.summary.users.rejected, 3);
});

test('marks selected but unfinished operations as not attempted', () => {
    const record = recordFor([matchedRow({
        unassign: { status: 'success', attempts: 1 },
        delete: null
    })], {
        terminalStatus: 'interrupted',
        interruption: { code: 'WS_UNAVAILABLE', message: 'Connection lost.' }
    });

    assert.equal(record.items[0].operations.delete_user.status, 'not_attempted');
    assert.equal(record.items[0].operations.delete_user.code, 'NOT_ATTEMPTED');
    assert.equal(record.summary.operations.notAttempted, 1);
    assert.equal(record.terminalStatus, 'interrupted');
});

test('does not serialize raw transport or session data', () => {
    const record = recordFor([matchedRow({
        rawResponse: { token: 'secret' },
        session: { id: 'session-secret' },
        pupil: {
            Email: 'user@example.com',
            PupilId: 7,
            MarathonPupilId: 42,
            AccessToken: 'secret',
            UnrelatedProfile: { private: true }
        }
    })]);
    const json = JSON.stringify(record);

    assert.equal(json.includes('secret'), false);
    assert.equal(json.includes('rawResponse'), false);
    assert.equal(json.includes('session'), false);
});

test('reports persistence failure without replacing the record', async () => {
    const record = recordFor([matchedRow()]);
    const seen = [];
    const error = new Error('quota exceeded');
    const result = await persistTerminalRecord({
        record,
        persist: async () => { throw error; },
        onPersistenceError: (received, receivedRecord) => {
            seen.push(received, receivedRecord);
        }
    });

    assert.equal(result.record, record);
    assert.equal(result.persisted, false);
    assert.equal(result.persistenceError, error);
    assert.deepEqual(seen, [error, record]);
});