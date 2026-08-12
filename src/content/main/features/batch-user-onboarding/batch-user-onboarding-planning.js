import {
    buildPupilEmailIndex,
    deepFreeze,
    featureError,
    findTargetModerator,
    resolvePupilModerators,
    serializePupil
} from './batch-user-onboarding-domain.js';

function resolveOnboardingRows(parsed, pupils, moderators) {
    const pupilIndex = buildPupilEmailIndex(pupils);
    const rows = [];
    for (const item of parsed?.items || []) {
        if (!item.isValid) {
            rows.push(Object.freeze({
                email: item.input,
                normalizedEmail: item.normalized,
                resolution: 'invalid',
                membership: 'unknown',
                user: null,
                currentModerators: Object.freeze([]),
                moderatorStateSafe: false,
                actionable: false,
                message: `Invalid email address: ${item.input}.`,
                addSelected: false,
                assignSelected: false
            }));
            continue;
        }

        const candidates = pupilIndex.get(item.normalized) || [];
        if (candidates.length > 1) {
            rows.push(Object.freeze({
                email: item.input,
                normalizedEmail: item.normalized,
                resolution: 'ambiguous',
                membership: 'ambiguous',
                user: null,
                currentModerators: Object.freeze([]),
                moderatorStateSafe: false,
                actionable: false,
                message: `Multiple marathon users matched ${item.input}.`,
                addSelected: false,
                assignSelected: false
            }));
            continue;
        }

        if (candidates.length === 0) {
            rows.push(Object.freeze({
                email: item.input,
                normalizedEmail: item.normalized,
                resolution: 'resolvable_not_in_marathon',
                membership: 'not_in_marathon',
                user: null,
                currentModerators: Object.freeze([]),
                moderatorStateSafe: true,
                actionable: true,
                message: 'Not currently in the marathon; the recorded add-by-email workflow is available.',
                addSelected: false,
                assignSelected: false
            }));
            continue;
        }

        const current = resolvePupilModerators(candidates[0].Moderators, moderators);
        rows.push(Object.freeze({
            email: item.input,
            normalizedEmail: item.normalized,
            resolution: 'in_marathon',
            membership: 'in_marathon',
            user: serializePupil(candidates[0]),
            currentModerators: current.moderators,
            moderatorStateSafe: current.safe,
            actionable: true,
            message: current.safe ? 'Already in the marathon.' : current.message,
            addSelected: false,
            assignSelected: false
        }));
    }
    return Object.freeze(rows);
}

function operationPreview(status, code, message, dependency = null) {
    return Object.freeze({ status, code, message, dependency });
}

function buildExecutionPlan({ rows, moderators, targetModeratorId }) {
    const values = Array.isArray(rows) ? rows : [];
    const assignmentSelected = values.some((row) => Boolean(row.assignSelected));
    const target = assignmentSelected ? findTargetModerator(moderators, targetModeratorId) : null;
    if (assignmentSelected && !target) {
        throw featureError('CURATOR_REQUIRED', 'Select a curator before preparing the execution plan.');
    }

    const planRows = values.map((row) => {
        const addSelected = Boolean(row.addSelected);
        const assignSelected = Boolean(row.assignSelected);
        let add = null;
        let assign = null;

        if (addSelected) {
            add = !row.actionable
                ? operationPreview('rejected', 'INVALID_USER_INPUT', row.message || 'The user is not actionable.')
                : row.membership === 'in_marathon'
                    ? operationPreview('noop', 'USER_ALREADY_IN_MARATHON', 'User is already in the marathon.')
                    : operationPreview('pending', 'USER_ADD_PENDING', 'User will be added to the marathon.');
        }

        if (assignSelected) {
            if (!row.actionable) {
                assign = operationPreview('rejected', 'INVALID_USER_INPUT', row.message || 'The user is not actionable.');
            } else if (!row.moderatorStateSafe) {
                assign = operationPreview(
                    'rejected',
                    'UNSAFE_MODERATOR_REPLACEMENT',
                    'Existing curator assignments cannot be preserved safely.'
                );
            } else if (row.membership === 'not_in_marathon' && !addSelected) {
                assign = operationPreview(
                    'rejected',
                    'USER_NOT_IN_MARATHON',
                    'Curator assignment requires adding this user first.'
                );
            } else if (
                row.membership === 'in_marathon'
                && row.currentModerators.some((moderator) => moderator.teacherId === target.teacherId)
            ) {
                assign = operationPreview('noop', 'CURATOR_ALREADY_ASSIGNED', 'Target curator is already assigned.');
            } else {
                assign = operationPreview(
                    'pending',
                    'CURATOR_ASSIGNMENT_PENDING',
                    row.membership === 'not_in_marathon'
                        ? 'The curator will be assigned by the recorded add-user request.'
                        : 'The curator will be added while preserving all current curators.',
                    row.membership === 'not_in_marathon' ? Object.freeze({ blockedBy: 'add_user' }) : null
                );
            }
        }

        return deepFreeze({
            itemId: row.normalizedEmail || row.email,
            email: row.email,
            normalizedEmail: row.normalizedEmail,
            resolution: row.resolution,
            membership: row.membership,
            user: row.user ? { ...row.user } : null,
            currentModerators: (row.currentModerators || []).map((moderator) => ({ ...moderator })),
            moderatorStateSafe: Boolean(row.moderatorStateSafe),
            actionable: Boolean(row.actionable),
            message: row.message || '',
            selectedOperations: Object.freeze([
                ...(addSelected ? ['add_user'] : []),
                ...(assignSelected ? ['assign_curator'] : [])
            ]),
            addSelected,
            assignSelected,
            add,
            assign,
            targetModerator: target ? { ...target } : null
        });
    });

    const countStatus = (status) => planRows.reduce((sum, row) => sum
        + (row.add?.status === status ? 1 : 0)
        + (row.assign?.status === status ? 1 : 0), 0);
    return deepFreeze({
        rows: planRows,
        targetModerator: target ? { ...target } : null,
        counts: {
            requested: planRows.length,
            selectedOperations: planRows.reduce((sum, row) => sum + row.selectedOperations.length, 0),
            additions: planRows.filter((row) => row.addSelected).length,
            assignments: planRows.filter((row) => row.assignSelected).length,
            noOps: countStatus('noop'),
            rejectedOperations: countStatus('rejected'),
            dependentAssignments: planRows.filter((row) => row.assign?.dependency?.blockedBy === 'add_user').length
        }
    });
}

function pad(value, length = 2) {
    return String(value).padStart(length, '0');
}

function formatClientTime(value) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw featureError('INVALID_CLIENT_TIME', 'Could not build the Edvibe client timestamp.');
    }
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
        + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
        + `.${pad(date.getMilliseconds(), 3)}`;
}

function buildAddRequest({
    marathonId,
    emails,
    moderatorIds = [],
    host = 'edvibe.com',
    now = new Date(),
    userId = null
}) {
    const normalizedEmails = (emails || []).map((email) => String(email || '').trim()).filter(Boolean);
    if (normalizedEmails.length === 0) {
        throw featureError('EMAILS_REQUIRED', 'At least one email is required for addition.');
    }
    const hostname = String(host || '').trim() || 'edvibe.com';
    const value = {
        MarathonId: marathonId,
        Emails: normalizedEmails,
        MailMessageLanguageId: 0,
        ModeratorsIds: [...moderatorIds],
        AccessGroups: [],
        Domain: hostname,
        ApiHost: hostname,
        ClientTime: formatClientTime(now),
        DeviceType: 'desktop'
    };
    const numericUserId = Number(userId);
    if (Number.isSafeInteger(numericUserId) && numericUserId > 0) value.UserId = numericUserId;
    return deepFreeze({
        controller: 'MarathonPupilsWsController',
        method: 'AddMarathonPupil',
        projectName: 'Marathons',
        value
    });
}

function buildAssignRequest({ marathonId, marathonPupilId, existingModeratorIds, targetModeratorId }) {
    const selected = [...new Set([
        ...(existingModeratorIds || []).map(Number),
        Number(targetModeratorId)
    ])];
    if (selected.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
        throw featureError('UNSAFE_MODERATOR_REPLACEMENT', 'A safe complete curator list could not be constructed.');
    }
    return deepFreeze({
        controller: 'MarathonPupilsWsController',
        method: 'AddModeratorsToPupil',
        projectName: 'Marathons',
        value: {
            MarathonId: marathonId,
            MarathonPupilId: marathonPupilId,
            SelectedModeratorsIds: selected
        }
    });
}

export {
    buildAddRequest,
    buildAssignRequest,
    buildExecutionPlan,
    formatClientTime,
    resolveOnboardingRows
};
