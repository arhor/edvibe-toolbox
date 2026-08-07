const test = require('node:test');
const assert = require('node:assert/strict');
const onboarding = require('./batch-user-onboarding');

const rawModerator = (id, teacherId) => ({
    Id: id,
    TeacherId: teacherId,
    Name: `Moderator ${id}`,
    Email: `${id}@example.com`
});

const pupil = (moderators = [200]) => ({
    MarathonPupilId: 7,
    PupilId: 70,
    Email: 'inside@example.com',
    Name: 'Inside',
    Moderators: moderators.map((TeacherId) => ({ TeacherId }))
});

const connection = () => ({ isOpen: true });

test('revalidation replaces stale already-in-marathon no-ops when membership disappears', async () => {
    const moderators = onboarding.normalizeModeratorCatalogue([rawModerator(20, 200)]);
    const [row] = onboarding.resolveOnboardingRows(
        onboarding.parseEmailInput('inside@example.com'),
        [pupil()],
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
                return { Value: { Items: [rawModerator(20, 200)] } };
            }
            if (method === 'GetMarathonPupils') {
                return { Value: { Items: [], Page: { Count: 0 } } };
            }
            throw new Error(`Unexpected mutation ${method}`);
        }
    });

    assert.equal(result.rows[0].addResult.status, 'rejected');
    assert.equal(result.rows[0].addResult.code, 'STATE_CHANGED');
    assert.equal(result.rows[0].assignResult.status, 'rejected');
    assert.equal(result.rows[0].assignResult.code, 'STATE_CHANGED');
});

test('revalidation rejects a stale already-assigned no-op when curators changed', async () => {
    const moderators = onboarding.normalizeModeratorCatalogue([rawModerator(20, 200)]);
    const [row] = onboarding.resolveOnboardingRows(
        onboarding.parseEmailInput('inside@example.com'),
        [pupil()],
        moderators
    );
    const plan = onboarding.buildExecutionPlan({
        rows: [{ ...row, assignSelected: true }],
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
                return { Value: { Items: [rawModerator(20, 200)] } };
            }
            if (method === 'GetMarathonPupils') {
                return { Value: { Items: [pupil([])], Page: { Count: 1 } } };
            }
            throw new Error(`Unexpected mutation ${method}`);
        }
    });

    assert.equal(result.rows[0].assignResult.status, 'rejected');
    assert.equal(result.rows[0].assignResult.code, 'STATE_CHANGED');
});