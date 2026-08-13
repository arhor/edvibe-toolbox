import assert from 'node:assert/strict';
import test from 'node:test';

import { parseEmailInput } from './batch-user-onboarding.js';
import {
    buildExecutionPlan,
    resolveOnboardingRows
} from './batch-user-onboarding-planning.js';
import { executePlan } from './batch-user-onboarding-execution.js';
import {
    buildExecutionHistoryInput,
    formatReport
} from './batch-user-onboarding-reporting.js';

const moderators = [{ Id: 7, TeacherId: 70, Name: 'Curator' }];
const catalogueResponse = { Value: { Items: moderators } };
const page = (items) => ({ Value: { Items: items, Page: { Count: items.length } } });
const connection = () => ({ isOpen: true });
const noWait = async () => {};

function transportError(code, requestId, overrides = {}) {
    return Object.assign(new Error(`transport ${code}`), {
        code,
        controller: 'MarathonPupilsWsController',
        method: overrides.method || 'AddMarathonPupil',
        requestId,
        serverErrorCode: overrides.serverErrorCode,
        diagnostics: {
            request: {
                controller: 'MarathonPupilsWsController',
                method: overrides.method || 'AddMarathonPupil',
                requestId,
                startedAt: 100,
                value: { Emails: ['private@example.com'], token: 'do-not-store', note: 'x'.repeat(400) }
            },
            response: {
                errorCode: overrides.serverErrorCode,
                serverMessage: overrides.serverMessage,
                elapsedMs: 42,
                value: { password: 'do-not-store' }
            }
        }
    });
}

function additionPlan(emails) {
    const rows = resolveOnboardingRows({ items: emails.map((email) => ({
        input: email, normalized: email, isValid: true
    })) }, [], []);
    return buildExecutionPlan({
        rows: rows.map((row) => ({ ...row, addSelected: true })),
        moderators: [],
        targetModeratorId: null
    });
}

test('public email parser preserves onboarding item metadata', () => {
    const parsed = parseEmailInput(' First@Example.com ; invalid ');
    assert.deepEqual(parsed.entries, [{
        input: 'First@Example.com',
        normalized: 'first@example.com'
    }]);
    assert.deepEqual(parsed.malformed, ['invalid']);
    assert.deepEqual(parsed.items, [
        { input: 'First@Example.com', normalized: 'first@example.com', isValid: true },
        { input: 'invalid', normalized: 'invalid', isValid: false }
    ]);
});

test('server-rejected grouped additions retain full shared retry diagnostics', async () => {
    let addAttempts = 0;
    const sendRequest = async (_controller, method) => {
        if (method === 'GetMarathonPupils') return page([]);
        if (method === 'GetMarathonModerators') return catalogueResponse;
        if (method === 'AddMarathonPupil') {
            addAttempts += 1;
            if (addAttempts === 1) throw transportError('REQUEST_TIMEOUT', 'request-1');
            throw transportError('SERVER_REJECTED', 'request-2', {
                serverErrorCode: 'DUPLICATE', serverMessage: 'Already enrolled'
            });
        }
        throw new Error(`Unexpected method ${method}`);
    };

    const result = await executePlan({
        plan: additionPlan(['one@example.com', 'two@example.com']), marathonId: 1,
        sendRequest, wait: noWait, getConnectionState: connection, requestDelayMs: 0
    });

    assert.equal(result.diagnostics.length, 1);
    assert.deepEqual(result.diagnostics[0].attempts.map((attempt) => attempt.requestId),
        ['request-1', 'request-2']);
    assert.equal(result.rows[0].addResult.diagnostics.reference, 'add-group');
    assert.equal(result.rows[1].addResult.diagnostics.reference, 'add-group');
    assert.equal(result.rows[0].addResult.attempts, 2);
    assert.deepEqual(result.diagnostics[0].attempts[0].requestSummary.Emails, ['private@example.com']);
    assert.equal(result.diagnostics[0].attempts[0].requestSummary.token, 'do-not-store');
    assert.equal(result.diagnostics[0].attempts[0].requestSummary.note, 'x'.repeat(400));

    const history = buildExecutionHistoryInput({
        marathonId: 1, startedAt: 1, completedAt: 2, result
    });
    assert.equal(history.diagnostics.length, 1);
    assert.equal(history.results[0].data.operations[0].diagnostics.reference, 'add-group');
    assert.match(formatReport(result), /request request-2.*server DUPLICATE.*Already enrolled.*42ms/);
});

test('curator assignment and operation-wide failures preserve terminal diagnostics', async () => {
    const pupil = {
        Email: 'member@example.com', PupilId: 2, MarathonPupilId: 22, Moderators: []
    };
    const rows = resolveOnboardingRows({ items: [{
        input: pupil.Email, normalized: pupil.Email, isValid: true
    }] }, [pupil], moderators);
    const plan = buildExecutionPlan({
        rows: rows.map((row) => ({ ...row, assignSelected: true })),
        moderators: moderators.map((item) => ({ id: item.Id, teacherId: item.TeacherId, name: item.Name })),
        targetModeratorId: 7
    });
    const sendRequest = async (_controller, method) => {
        if (method === 'GetMarathonPupils') return page([pupil]);
        if (method === 'GetMarathonModerators') return catalogueResponse;
        if (method === 'AddModeratorsToPupil') {
            throw transportError('WS_UNAVAILABLE', 'assign-1', {
                method, serverErrorCode: 'OFFLINE', serverMessage: 'Connection lost'
            });
        }
        throw new Error(`Unexpected method ${method}`);
    };
    const result = await executePlan({
        plan, marathonId: 1, sendRequest, wait: noWait,
        getConnectionState: connection, requestDelayMs: 0
    });

    assert.equal(result.rows[0].assignResult.diagnostics.operation, 'assign_curator');
    assert.equal(result.rows[0].assignResult.diagnostics.attempts[0].requestId, 'assign-1');
    assert.equal(result.fatalError.diagnostics.attempts[0].requestId, 'assign-1');
    const history = buildExecutionHistoryInput({ marathonId: 1, startedAt: 1, completedAt: 2, result });
    assert.equal(history.fatalError.diagnostics.attempts[0].method, 'AddModeratorsToPupil');
});

test('revalidation failures attach diagnostics to rejected operations and fatal error', async () => {
    const error = transportError('SERVER_REJECTED', 'revalidate-1', {
        method: 'GetMarathonPupils', serverErrorCode: 'READ_DENIED'
    });
    const result = await executePlan({
        plan: additionPlan(['one@example.com']), marathonId: 1,
        sendRequest: async () => { throw error; }, wait: noWait,
        getConnectionState: connection, requestDelayMs: 0
    });
    assert.equal(result.rows[0].addResult.diagnostics.operation, 'revalidate');
    assert.equal(result.fatalError.diagnostics.attempts[0].requestId, 'revalidate-1');
});
