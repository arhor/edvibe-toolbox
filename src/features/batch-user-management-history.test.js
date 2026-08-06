'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const history = require('./batch-user-management-history.js');
const recordApi = require('../shared/execution-history-record.js');

function matchedRow(overrides = {}) {
    return {
        email: 'User@Example.com',
        normalizedEmail: 'user@example.com',
        status: 'matched',
        message: '',
        actionable: true,
        hasCurator: true,
        marathonPupilId: 42,
        pupil: {
            Email: 'user@example.com',
            Name: 'Example User',
            PupilId: 7,
            MarathonPupilId: 42,
            Moderators: [{ Id: 3 }]
        },
        unassignSelected: true,
        deleteSelected: true,
        unassign: { status: 'success', attempts: 1 },
        delete: { status: 'success', attempts: 2 },
        result: { status: 'success', message: 'Curator removed; User deleted' },
        ...overrides
    };
}

test('builds a canonical record accepted by the shared history envelope', () => {
    const input = history.buildExecutionHistoryInput({
        rows: [matchedRow()],
        summary: { failures: 0 },
        startedAt: '2026-08-06T05:00:00.000Z',
        completedAt: '2026-08-06T05:00:03.000Z',
        marathonId: '123',
        marathonName: 'Demo marathon'
    });
    const record = recordApi.buildExecutionRecord(input, {
        cryptoApi: { randomUUID: () => 'execution-id' },
        now: new Date('2026-08-06T05:00:03.000Z')
    });
    assert.equal(record.id, 'execution-id');
    assert.equal(record.operationType, history.OPERATION_TYPE);
    assert.equal(record.status, 'completed');
    assert.equal(record.results[0].data.operations[0].name, 'unassign_curator');
    assert.equal(record.results[0].data.operations[1].attemptCount, 2);
});

test('preserves malformed, missing, and ambiguous inputs in order', () => {
    const rows = [
        { email: 'bad', normalizedEmail: 'bad', status: 'malformed', message: 'Invalid email.' },
        { email: 'none@example.com', normalizedEmail: 'none@example.com', status: 'missing', message: 'Not found.' },
        { email: 'many@example.com', normalizedEmail: 'many@example.com', status: 'ambiguous', message: 'Multiple users.' }
    ];
    const input = history.buildExecutionHistoryInput({
        rows,
        startedAt: '2026-08-06T05:00:00.000Z',
        completedAt: '2026-08-06T05:00:01.000Z',
        marathonId: '123'
    });
    assert.deepEqual(input.results.map((result) => result.data.resolution), [
        'malformed', 'missing', 'ambiguous'
    ]);
    assert.deepEqual(input.results.map((result) => result.code), [
        'USER_INPUT_MALFORMED', 'USER_NOT_FOUND', 'USER_AMBIGUOUS'
    ]);
    assert.equal(input.counts.requested, 3);
    assert.equal(input.counts.skipped, 3);
});

test('records noop curator removal independently', () => {
    const input = history.buildExecutionHistoryInput({
        rows: [matchedRow({
            hasCurator: false,
            deleteSelected: false,
            unassign: { status: 'noop', attempts: 0, message: 'No curator was assigned.' },
            delete: null
        })],
        startedAt: '2026-08-06T05:00:00.000Z',
        completedAt: '2026-08-06T05:00:01.000Z',
        marathonId: '123'
    });
    assert.equal(input.results[0].status, 'noop');
    assert.equal(input.results[0].data.operations[0].status, 'noop');
    assert.equal(input.counts.noOp, 1);
});

test('distinguishes dependency-blocked deletion from deletion failure', () => {
    const input = history.buildExecutionHistoryInput({
        rows: [matchedRow({
            unassign: { status: 'failed', attempts: 3, code: 'REQUEST_TIMEOUT', message: 'Timed out.' },
            delete: { status: 'skipped', attempts: 0, message: 'Skipped because curator removal failed.' }
        })],
        startedAt: '2026-08-06T05:00:00.000Z',
        completedAt: '2026-08-06T05:00:05.000Z',
        marathonId: '123'
    });
    const operations = input.results[0].data.operations;
    assert.equal(operations[0].status, 'failed');
    assert.equal(operations[0].attemptCount, 3);
    assert.equal(operations[1].status, 'skipped');
    assert.equal(operations[1].code, 'DEPENDENCY_FAILED');
    assert.equal(operations[1].dependency.blockedBy, 'unassign_curator');
    assert.equal(input.status, 'completed_with_failures');
});

test('marks unfinished selected operations not attempted after interruption', () => {
    const input = history.buildExecutionHistoryInput({
        rows: [matchedRow({ unassign: null, delete: null })],
        summary: { error: Object.assign(new Error('Stopped'), { code: 'WS_UNAVAILABLE' }) },
        startedAt: '2026-08-06T05:00:00.000Z',
        completedAt: '2026-08-06T05:00:02.000Z',
        marathonId: '123'
    });
    assert.equal(input.status, 'interrupted');
    assert.equal(input.results[0].status, 'not_attempted');
    assert.equal(input.results[0].data.operations[0].status, 'not_attempted');
    assert.equal(input.results[0].data.operations[1].status, 'not_attempted');
    assert.equal(input.counts.notAttempted, 1);
});

test('serializes only audit fields and excludes raw pupil transport data', () => {
    const input = history.buildExecutionHistoryInput({
        rows: [matchedRow({
            pupil: {
                Email: 'user@example.com',
                Name: 'Example User',
                PupilId: 7,
                MarathonPupilId: 42,
                Moderators: [{ Id: 3 }],
                Response: { Secret: true },
                SessionId: 'secret'
            }
        })],
        startedAt: '2026-08-06T05:00:00.000Z',
        completedAt: '2026-08-06T05:00:01.000Z',
        marathonId: '123'
    });
    const serialized = JSON.stringify(input);
    assert.equal(serialized.includes('Secret'), false);
    assert.equal(serialized.includes('SessionId'), false);
    assert.equal(serialized.includes('Moderators'), false);
    assert.equal(input.results[0].data.user.pupilId, 7);
});

test('history-aware dialog preserves visible completion when persistence rejects', async () => {
    const events = new Map();
    const status = { textContent: '' };
    const dialog = {
        rows: [matchedRow()],
        elements: { status },
        shadowRoot: { querySelector: () => null },
        ownerDocument: { createElement: () => null },
        configure() { return this; },
        showReview() { return this; },
        showConfigure() { return this; },
        showComplete() { status.textContent = 'Готово.'; return this; },
        setStatus(value) { status.textContent = value; },
        addEventListener(name, listener) { events.set(name, listener); }
    };
    const logs = [];
    const createDialog = history.createHistoryAwareDialog({
        createDialog: () => dialog,
        persistExecution: async () => { throw new Error('database unavailable'); },
        getLocationHref: () => 'https://app.edvibe.com/marathon/123',
        now: () => new Date('2026-08-06T05:00:00.000Z'),
        log: (...args) => logs.push(args)
    });
    const patched = createDialog();
    events.get('edvibe-batch-user-management-start')();
    patched.showComplete({ rows: dialog.rows, failures: 0 });
    await new Promise((resolve) => setImmediate(resolve));
    assert.match(status.textContent, /Готово\./);
    assert.match(status.textContent, /записать историю не удалось/);
    assert.equal(logs.length, 1);
});
