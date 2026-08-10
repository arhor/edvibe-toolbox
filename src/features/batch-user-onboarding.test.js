import test from 'node:test';
import assert from 'node:assert/strict';

import * as onboarding from './batch-user-onboarding.js';

function rawModerator(id, teacherId, name = `Moderator ${id}`) {
    return { Id: id, TeacherId: teacherId, Name: name, Email: `${id}@example.com` };
}

function pupil(id, email, moderators = [], name = `User ${id}`) {
    return {
        MarathonPupilId: id,
        PupilId: id + 1000,
        Email: email,
        Name: name,
        Moderators: moderators.map((teacherId) => ({ TeacherId: teacherId }))
    };
}

function connection() {
    return { isOpen: true };
}

test('reuses ordered case-insensitive email parsing from batch user management', () => {
    assert.deepEqual(
        onboarding.parseEmailInput(' First@Example.com; bad value\nfirst@example.com, second@example.com'),
        {
            entries: [
                { input: 'First@Example.com', normalized: 'first@example.com' },
                { input: 'second@example.com', normalized: 'second@example.com' }
            ],
            malformed: ['bad value'],
            items: [
                { input: 'First@Example.com', normalized: 'first@example.com', isValid: true },
                { input: 'bad value', normalized: 'bad value', isValid: false },
                { input: 'second@example.com', normalized: 'second@example.com', isValid: true }
            ]
        }
    );
});

test('loads and validates the marathon moderator catalogue from the recorded request', async () => {
    const calls = [];
    const moderators = await onboarding.loadModerators({
        marathonId: 90691,
        sendRequest: async (controller, method, projectName, value) => {
            calls.push({ controller, method, projectName, value });
            return { Value: { Items: [rawModerator(45803, 1101311, 'Tatiana')] } };
        }
    });

    assert.deepEqual(calls, [{
        controller: 'MarathonModeratorWsController',
        method: 'GetMarathonModerators',
        projectName: 'Marathons',
        value: { MarathonId: 90691 }
    }]);
    assert.deepEqual(moderators, [{
        id: 45803,
        teacherId: 1101311,
        name: 'Tatiana',
        email: '45803@example.com'
    }]);

    await assert.rejects(
        onboarding.loadModerators({
            marathonId: 90691,
            sendRequest: async () => ({ Value: { Items: [rawModerator(1, 7), rawModerator(2, 7)] } })
        }),
        (error) => error.code === 'INVALID_MODERATOR_RESPONSE'
    );
});

test('resolves inputs as in-marathon, addable-by-email, ambiguous, and invalid', () => {
    const moderators = onboarding.normalizeModeratorCatalogue([
        rawModerator(10, 100, 'Existing curator')
    ]);
    const parsed = onboarding.parseEmailInput(
        'inside@example.com; outside@example.com; duplicate@example.com; invalid'
    );
    const rows = onboarding.resolveOnboardingRows(parsed, [
        pupil(1, 'INSIDE@example.com', [100], 'Inside'),
        pupil(2, 'duplicate@example.com'),
        pupil(3, 'DUPLICATE@example.com')
    ], moderators);

    assert.deepEqual(rows.map((row) => row.resolution), [
        'in_marathon',
        'resolvable_not_in_marathon',
        'ambiguous',
        'invalid'
    ]);
    assert.equal(rows[0].currentModerators[0].id, 10);
    assert.equal(rows[1].actionable, true);
    assert.equal(rows[2].actionable, false);
    assert.equal(rows[3].actionable, false);
});

test('current curator IDs are preserved only through unique TeacherId catalogue mappings', () => {
    const moderators = onboarding.normalizeModeratorCatalogue([
        rawModerator(10, 100),
        rawModerator(20, 200)
    ]);
    assert.deepEqual(
        onboarding.resolvePupilModerators([{ TeacherId: 100 }, { TeacherId: 200 }], moderators),
        {
            safe: true,
            moderators,
            code: null,
            message: null
        }
    );

    const unsafe = onboarding.resolvePupilModerators([{ TeacherId: 999 }], moderators);
    assert.equal(unsafe.safe, false);
    assert.equal(unsafe.code, 'UNSAFE_MODERATOR_REPLACEMENT');
});

test('immutable preflight records no-ops, dependencies, and unsafe assignment rejection', () => {
    const moderators = onboarding.normalizeModeratorCatalogue([
        rawModerator(10, 100, 'Existing'),
        rawModerator(20, 200, 'Target')
    ]);
    const parsed = onboarding.parseEmailInput('inside@example.com; outside@example.com');
    const rows = onboarding.resolveOnboardingRows(parsed, [
        pupil(1, 'inside@example.com', [200], 'Inside')
    ], moderators).map((row) => ({
        ...row,
        addSelected: true,
        assignSelected: true
    }));
    const plan = onboarding.buildExecutionPlan({
        rows,
        moderators,
        targetModeratorId: 20
    });

    assert.equal(Object.isFrozen(plan), true);
    assert.equal(Object.isFrozen(plan.rows[0]), true);
    assert.equal(plan.rows[0].add.code, 'USER_ALREADY_IN_MARATHON');
    assert.equal(plan.rows[0].assign.code, 'CURATOR_ALREADY_ASSIGNED');
    assert.equal(plan.rows[1].add.status, 'pending');
    assert.deepEqual(plan.rows[1].assign.dependency, { blockedBy: 'add_user' });
});

test('recorded add request supports many emails without reusing the captured session user ID', () => {
    const request = onboarding.buildAddRequest({
        marathonId: 90691,
        emails: ['one@example.com', 'two@example.com', 'three@example.com'],
        moderatorIds: [45803],
        host: 'edvibe.com',
        now: new Date(2026, 7, 6, 6, 46, 0, 521)
    });

    assert.equal(request.controller, 'MarathonPupilsWsController');
    assert.equal(request.method, 'AddMarathonPupil');
    assert.equal(request.projectName, 'Marathons');
    assert.deepEqual(request.value.Emails, [
        'one@example.com',
        'two@example.com',
        'three@example.com'
    ]);
    assert.deepEqual(request.value.ModeratorsIds, [45803]);
    assert.equal(request.value.MailMessageLanguageId, 0);
    assert.deepEqual(request.value.AccessGroups, []);
    assert.equal(request.value.Domain, 'edvibe.com');
    assert.equal(request.value.ApiHost, 'edvibe.com');
    assert.equal(request.value.DeviceType, 'desktop');
    assert.equal('UserId' in request.value, false);
});

test('assignment request preserves every existing moderator ID and adds the target', () => {
    const request = onboarding.buildAssignRequest({
        marathonId: 90691,
        marathonPupilId: 77,
        existingModeratorIds: [10, 30],
        targetModeratorId: 20
    });
    assert.deepEqual(request.value, {
        MarathonId: 90691,
        MarathonPupilId: 77,
        SelectedModeratorsIds: [10, 30, 20]
    });
});

test('executePlan batches additions by curator requirement and verifies every row from one refreshed roster', async () => {
    const moderators = onboarding.normalizeModeratorCatalogue([
        rawModerator(20, 200, 'Target')
    ]);
    const emails = [
        'add-a@example.com',
        'add-b@example.com',
        'assign-a@example.com',
        'assign-b@example.com'
    ];
    const rows = onboarding.resolveOnboardingRows(
        onboarding.parseEmailInput(emails.join('\n')),
        [],
        moderators
    ).map((row, index) => ({
        ...row,
        addSelected: true,
        assignSelected: index >= 2
    }));
    const plan = onboarding.buildExecutionPlan({ rows, moderators, targetModeratorId: 20 });
    const addCalls = [];
    let addWrites = 0;
    let pupilLoads = 0;

    const result = await onboarding.executePlan({
        plan,
        marathonId: 90691,
        getConnectionState: connection,
        wait: async () => {},
        getRequestContext: () => ({ host: 'edvibe.com' }),
        now: () => new Date(2026, 7, 6, 6, 46, 0, 521),
        sendRequest: async (controller, method, _project, value) => {
            if (method === 'GetMarathonModerators') {
                return { Value: { Items: [rawModerator(20, 200, 'Target')] } };
            }
            if (method === 'GetMarathonPupils') {
                pupilLoads += 1;
                if (addWrites < 2) {
                    return { Value: { Items: [], Page: { Count: 0 } } };
                }
                return {
                    Value: {
                        Items: [
                            pupil(101, emails[0]),
                            pupil(102, emails[1]),
                            pupil(103, emails[2], [200]),
                            pupil(104, emails[3], [200])
                        ],
                        Page: { Count: 4 }
                    }
                };
            }
            if (method === 'AddMarathonPupil') {
                addWrites += 1;
                addCalls.push({ controller, value });
                return { Value: { IsSuccess: true, IsReturnDeleted: false } };
            }
            throw new Error(`Unexpected method ${method}`);
        }
    });

    assert.equal(pupilLoads, 2);
    assert.equal(addCalls.length, 2);
    assert.deepEqual(addCalls[0].value.Emails, emails.slice(0, 2));
    assert.deepEqual(addCalls[0].value.ModeratorsIds, []);
    assert.deepEqual(addCalls[1].value.Emails, emails.slice(2));
    assert.deepEqual(addCalls[1].value.ModeratorsIds, [20]);
    assert.deepEqual(result.rows.map((row) => row.addResult.code), [
        'USER_ADDED', 'USER_ADDED', 'USER_ADDED', 'USER_ADDED'
    ]);
    assert.equal(result.rows[2].assignResult.code, 'CURATOR_ASSIGNED');
    assert.equal(result.rows[3].assignResult.code, 'CURATOR_ASSIGNED');
});

test('existing-user assignment uses the complete preserved moderator list', async () => {
    const moderators = onboarding.normalizeModeratorCatalogue([
        rawModerator(10, 100, 'Existing'),
        rawModerator(20, 200, 'Target')
    ]);
    const sourcePupil = pupil(7, 'inside@example.com', [100], 'Inside');
    const [row] = onboarding.resolveOnboardingRows(
        onboarding.parseEmailInput('inside@example.com'),
        [sourcePupil],
        moderators
    );
    const plan = onboarding.buildExecutionPlan({
        rows: [{ ...row, assignSelected: true }],
        moderators,
        targetModeratorId: 20
    });
    const writes = [];

    const result = await onboarding.executePlan({
        plan,
        marathonId: 90691,
        getConnectionState: connection,
        wait: async () => {},
        sendRequest: async (_controller, method, _project, value) => {
            if (method === 'GetMarathonModerators') {
                return { Value: { Items: [rawModerator(10, 100, 'Existing'), rawModerator(20, 200, 'Target')] } };
            }
            if (method === 'GetMarathonPupils') {
                return { Value: { Items: [sourcePupil], Page: { Count: 1 } } };
            }
            if (method === 'AddModeratorsToPupil') {
                writes.push(value);
                return { Value: { IsSuccess: true } };
            }
            throw new Error(`Unexpected method ${method}`);
        }
    });

    assert.deepEqual(writes, [{
        MarathonId: 90691,
        MarathonPupilId: 7,
        SelectedModeratorsIds: [10, 20]
    }]);
    assert.equal(result.rows[0].assignResult.code, 'CURATOR_ASSIGNED');
});

test('failed bulk addition blocks only dependent curator assignment', async () => {
    const moderators = onboarding.normalizeModeratorCatalogue([rawModerator(20, 200, 'Target')]);
    const [row] = onboarding.resolveOnboardingRows(
        onboarding.parseEmailInput('outside@example.com'),
        [],
        moderators
    );
    const plan = onboarding.buildExecutionPlan({
        rows: [{ ...row, addSelected: true, assignSelected: true }],
        moderators,
        targetModeratorId: 20
    });

    const result = await onboarding.executePlan({
        plan,
        marathonId: 90691,
        getConnectionState: connection,
        wait: async () => {},
        sendRequest: async (_controller, method) => {
            if (method === 'GetMarathonModerators') {
                return { Value: { Items: [rawModerator(20, 200, 'Target')] } };
            }
            if (method === 'GetMarathonPupils') {
                return { Value: { Items: [], Page: { Count: 0 } } };
            }
            if (method === 'AddMarathonPupil') {
                const error = new Error('server rejected add');
                error.code = 'SERVER_REJECTED';
                throw error;
            }
            throw new Error(`Unexpected method ${method}`);
        }
    });

    assert.equal(result.rows[0].addResult.status, 'failed');
    assert.equal(result.rows[0].assignResult.status, 'skipped');
    assert.equal(result.rows[0].assignResult.code, 'ASSIGNMENT_BLOCKED_BY_ADD_FAILURE');
    assert.deepEqual(result.rows[0].assignResult.dependency, { blockedBy: 'add_user' });
});

test('history keeps independent operation outcomes without transport payloads', () => {
    const result = {
        plan: { counts: { requested: 1 } },
        fatalError: null,
        rows: [{
            itemId: 'user@example.com',
            email: 'user@example.com',
            normalizedEmail: 'user@example.com',
            resolution: 'resolvable_not_in_marathon',
            membership: 'not_in_marathon',
            user: { email: 'user@example.com', name: 'User', pupilId: 3, marathonPupilId: 4 },
            currentModerators: [],
            targetModerator: { id: 20, teacherId: 200, name: 'Target', email: 'target@example.com' },
            selectedOperations: ['add_user', 'assign_curator'],
            addResult: { status: 'success', code: 'USER_ADDED', message: 'Added', attempts: 1 },
            assignResult: {
                status: 'success',
                code: 'CURATOR_ASSIGNED',
                message: 'Assigned',
                attempts: 1,
                dependency: { blockedBy: 'add_user' }
            },
            message: ''
        }]
    };

    const history = onboarding.buildExecutionHistoryInput({
        marathonId: 90691,
        marathonName: 'A2',
        startedAt: '2026-08-07T08:00:00.000Z',
        completedAt: '2026-08-07T08:01:00.000Z',
        result
    });

    assert.equal(history.operationType, 'batch_user_onboarding');
    assert.deepEqual(
        history.results[0].data.operations.map((operation) => operation.name),
        ['add_user', 'assign_curator']
    );
    assert.equal(history.results[0].data.operations[1].dependency.blockedBy, 'add_user');
    assert.equal(JSON.stringify(history).includes('RequestId'), false);
    assert.equal(JSON.stringify(history).includes('ConnectionId'), false);
});
