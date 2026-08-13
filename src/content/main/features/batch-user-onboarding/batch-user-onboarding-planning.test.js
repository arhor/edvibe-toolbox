import assert from 'node:assert/strict';
import test from 'node:test';

import {
    normalizeModeratorCatalogue,
    resolvePupilModerators
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-domain.js';
import {
    buildAddRequest,
    buildAssignRequest,
    buildExecutionPlan,
    resolveOnboardingRows
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-planning.js';
import {parseEmailInput} from '#src/content/main/features/batch-workflow-primitives.js';

test('row discovery preserves non-ASCII validation diagnostics', () => {
    // Given
    const parsed = parseEmailInput('test@gmail.cоm', {includeItems: true});

    // When
    const rows = resolveOnboardingRows(parsed, [], []);

    // Then
    assert.equal(rows[0].validationCode, 'EMAIL_NON_ASCII');
    assert.equal(rows[0].message, 'Недопустимые символы: «о» (кириллица).');
    assert.equal(rows[0].offendingCharacters[0].codePoint, 'U+043E');
    assert.equal(rows[0].offendingCharacters[0].index, 12);
    assert.equal(rows[0].actionable, false);
});

test('moderator catalogue normalization rejects ambiguous identities', () => {
    const catalogue = normalizeModeratorCatalogue([
        { Id: '7', TeacherId: '70', Name: ' Curator ', Email: ' curator@example.com ' }
    ]);
    assert.deepEqual(catalogue, [{
        id: 7,
        teacherId: 70,
        name: 'Curator',
        email: 'curator@example.com'
    }]);
    assert.equal(Object.isFrozen(catalogue), true);
    assert.throws(
        () => normalizeModeratorCatalogue([
            { Id: 7, TeacherId: 70 },
            { Id: 8, TeacherId: 70 }
        ]),
        (error) => error.code === 'INVALID_MODERATOR_RESPONSE'
    );
});

test('row discovery preserves resolvable moderator state without cross-feature helpers', () => {
    const moderators = normalizeModeratorCatalogue([
        { Id: 7, TeacherId: 70, Name: 'Curator' }
    ]);
    const pupil = {
        Email: 'member@example.com',
        PupilId: 2,
        MarathonPupilId: 22,
        Moderators: [{ TeacherId: 70 }]
    };
    const rows = resolveOnboardingRows({
        items: [{ input: pupil.Email, normalized: pupil.Email, isValid: true }]
    }, [pupil], moderators);

    assert.equal(rows[0].membership, 'in_marathon');
    assert.equal(rows[0].moderatorStateSafe, true);
    assert.deepEqual(rows[0].currentModerators, moderators);
    assert.deepEqual(resolvePupilModerators(pupil.Moderators, moderators).moderators, moderators);
});

test('execution planning models add-before-assignment dependency explicitly', () => {
    const moderators = normalizeModeratorCatalogue([
        { Id: 7, TeacherId: 70, Name: 'Curator' }
    ]);
    const rows = resolveOnboardingRows({
        items: [{ input: 'new@example.com', normalized: 'new@example.com', isValid: true }]
    }, [], moderators);
    const plan = buildExecutionPlan({
        rows: [{ ...rows[0], addSelected: true, assignSelected: true }],
        moderators,
        targetModeratorId: 7
    });

    assert.equal(plan.rows[0].add.status, 'pending');
    assert.equal(plan.rows[0].assign.status, 'pending');
    assert.deepEqual(plan.rows[0].assign.dependency, { blockedBy: 'add_user' });
    assert.equal(plan.counts.dependentAssignments, 1);
});

test('request builders preserve recorded Edvibe payload contracts', () => {
    const add = buildAddRequest({
        marathonId: 10,
        emails: [' user@example.com '],
        moderatorIds: [7],
        host: 'school.edvibe.com',
        userId: 99,
        now: new Date(2026, 7, 12, 9, 8, 7, 6)
    });
    assert.equal(add.controller, 'MarathonPupilsWsController');
    assert.equal(add.method, 'AddMarathonPupil');
    assert.deepEqual(add.value.Emails, ['user@example.com']);
    assert.deepEqual(add.value.ModeratorsIds, [7]);
    assert.equal(add.value.Domain, 'school.edvibe.com');
    assert.equal(add.value.UserId, 99);
    assert.equal(Object.isFrozen(add.value), true);

    const assign = buildAssignRequest({
        marathonId: 10,
        marathonPupilId: 22,
        existingModeratorIds: [7, 7, 8],
        targetModeratorId: 8
    });
    assert.deepEqual(assign.value.SelectedModeratorsIds, [7, 8]);
});
