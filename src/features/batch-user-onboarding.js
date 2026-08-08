import * as baseApi from './batch-user-management.js';

const DIALOG_TAG = 'edvibe-toolbox-batch-user-onboarding-dialog';
const OPERATION_TYPE = 'batch_user_onboarding';
const EXPECTED_WRITE_CODES = new Set([
    'SERVER_REJECTED',
    'INVALID_RESPONSE',
    'REQUEST_TIMEOUT',
    'SEND_FAILED'
]);

function featureError(code, message, details = {}) {
    return baseApi.createFeatureError(code, message, details);
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
    return value;
}

function normalizeModerator(item) {
    const id = Number(item?.Id);
    const teacherId = Number(item?.TeacherId);
    if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(teacherId) || teacherId <= 0) {
        throw featureError('INVALID_MODERATOR_RESPONSE', 'The moderator catalogue contained an invalid identifier.');
    }
    return Object.freeze({
        id,
        teacherId,
        name: String(item?.Name || '').trim() || null,
        email: String(item?.Email || '').trim() || null
    });
}

function normalizeModeratorCatalogue(items) {
    if (!Array.isArray(items)) {
        throw featureError('INVALID_MODERATOR_RESPONSE', 'The moderator catalogue was not an array.');
    }
    const moderators = items.map(normalizeModerator);
    const ids = new Set();
    const teacherIds = new Set();
    for (const moderator of moderators) {
        if (ids.has(moderator.id) || teacherIds.has(moderator.teacherId)) {
            throw featureError('INVALID_MODERATOR_RESPONSE', 'The moderator catalogue contained ambiguous identifiers.');
        }
        ids.add(moderator.id);
        teacherIds.add(moderator.teacherId);
    }
    return Object.freeze(moderators);
}

async function loadModerators({ sendRequest, marathonId }) {
    const response = await sendRequest(
        'MarathonModeratorWsController',
        'GetMarathonModerators',
        'Marathons',
        { MarathonId: marathonId }
    );
    return normalizeModeratorCatalogue(response?.Value?.Items);
}

function buildModeratorIndex(moderators) {
    return new Map((moderators || []).map((moderator) => [moderator.teacherId, moderator]));
}

function resolvePupilModerators(pupilModerators, moderators) {
    if (!Array.isArray(pupilModerators)) {
        return Object.freeze({
            safe: false,
            moderators: Object.freeze([]),
            code: 'UNSAFE_MODERATOR_REPLACEMENT',
            message: 'Current curator assignments could not be interpreted safely.'
        });
    }
    const byTeacherId = buildModeratorIndex(moderators);
    const resolved = [];
    const seen = new Set();
    for (const current of pupilModerators) {
        const teacherId = Number(current?.TeacherId);
        const moderator = byTeacherId.get(teacherId);
        if (!Number.isSafeInteger(teacherId) || !moderator || seen.has(moderator.id)) {
            return Object.freeze({
                safe: false,
                moderators: Object.freeze([]),
                code: 'UNSAFE_MODERATOR_REPLACEMENT',
                message: 'Existing curator assignments cannot be preserved without guessing.'
            });
        }
        seen.add(moderator.id);
        resolved.push(moderator);
    }
    return Object.freeze({
        safe: true,
        moderators: Object.freeze(resolved),
        code: null,
        message: null
    });
}

function serializePupil(pupil) {
    if (!pupil) return null;
    return Object.freeze({
        email: String(pupil.Email || '').trim() || null,
        name: String(pupil.Name || pupil.DisplayName || pupil.FullName || '').trim() || null,
        pupilId: Number.isSafeInteger(Number(pupil.PupilId)) ? Number(pupil.PupilId) : null,
        marathonPupilId: Number.isSafeInteger(Number(pupil.MarathonPupilId))
            ? Number(pupil.MarathonPupilId)
            : null
    });
}

function buildPupilEmailIndex(pupils) {
    const index = new Map();
    for (const pupil of Array.isArray(pupils) ? pupils : []) {
        const email = String(pupil?.Email || '').trim().toLowerCase();
        if (!email) continue;
        const values = index.get(email) || [];
        values.push(pupil);
        index.set(email, values);
    }
    return index;
}

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

function findTargetModerator(moderators, targetModeratorId) {
    const targetId = Number(targetModeratorId);
    return (moderators || []).find((moderator) => moderator.id === targetId) || null;
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

function operationResult(status, code, message, attempts = 0, dependency = null) {
    return { status, code, message, attempts, dependency };
}

function initializeExecutionRows(plan) {
    const fromPreview = (preview, label) => preview
        ? operationResult(
            preview.status === 'pending' ? 'not_attempted' : preview.status,
            preview.status === 'pending' ? 'NOT_ATTEMPTED' : preview.code,
            preview.status === 'pending' ? `${label} has not been attempted yet.` : preview.message,
            0,
            preview.dependency
        )
        : null;
    return plan.rows.map((row) => ({
        ...row,
        currentModerators: row.currentModerators.map((moderator) => ({ ...moderator })),
        runtimePupil: row.user ? { ...row.user } : null,
        addResult: fromPreview(row.add, 'The addition'),
        assignResult: fromPreview(row.assign, 'The curator assignment')
    }));
}

function isPending(result) {
    return result?.status === 'not_attempted';
}

function isRevalidatable(result) {
    return result && !['rejected', 'failed', 'skipped'].includes(result.status);
}

function moderatorTeacherIds(values) {
    return (values || []).map((moderator) => moderator.teacherId).sort((a, b) => a - b);
}

function sameNumbers(left, right) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
}

function rejectSelectedState(row, code, message) {
    if (row.addSelected && isRevalidatable(row.addResult)) {
        row.addResult = operationResult('rejected', code, message);
    }
    if (row.assignSelected && isRevalidatable(row.assignResult)) {
        row.assignResult = operationResult('rejected', code, message);
    }
}

function revalidateRows({ rows, pupils, moderators, targetModerator }) {
    const pupilIndex = buildPupilEmailIndex(pupils);
    for (const row of rows) {
        if (!row.actionable || row.selectedOperations.length === 0) continue;
        const candidates = pupilIndex.get(row.normalizedEmail) || [];
        if (candidates.length > 1) {
            rejectSelectedState(row, 'USER_AMBIGUOUS', 'The user became ambiguous before execution.');
            continue;
        }

        if (row.membership === 'in_marathon') {
            if (
                candidates.length !== 1
                || Number(candidates[0].MarathonPupilId) !== Number(row.user?.marathonPupilId)
            ) {
                rejectSelectedState(row, 'STATE_CHANGED', 'Marathon membership changed after preflight.');
                continue;
            }

            const currentPupil = candidates[0];
            row.runtimePupil = serializePupil(currentPupil);
            if (row.addSelected && isRevalidatable(row.addResult)) {
                row.addResult = operationResult('noop', 'USER_ALREADY_IN_MARATHON', 'User is already in the marathon.');
            }
            if (!row.assignSelected || !isRevalidatable(row.assignResult)) continue;

            const current = resolvePupilModerators(currentPupil.Moderators, moderators);
            if (!current.safe) {
                row.assignResult = operationResult('rejected', current.code, current.message);
                continue;
            }
            if (!sameNumbers(
                moderatorTeacherIds(row.currentModerators),
                moderatorTeacherIds(current.moderators)
            )) {
                row.assignResult = operationResult(
                    'rejected',
                    'STATE_CHANGED',
                    'Current curator assignments changed after preflight.'
                );
                continue;
            }
            row.currentModerators = current.moderators.map((moderator) => ({ ...moderator }));
            row.assignResult = current.moderators.some((moderator) =>
                moderator.teacherId === targetModerator?.teacherId
            )
                ? operationResult('noop', 'CURATOR_ALREADY_ASSIGNED', 'Target curator is already assigned.')
                : operationResult('not_attempted', 'NOT_ATTEMPTED', 'The curator assignment has not been attempted yet.');
            continue;
        }

        if (row.membership !== 'not_in_marathon' || candidates.length === 0) continue;
        const currentPupil = candidates[0];
        row.runtimePupil = serializePupil(currentPupil);
        if (row.addSelected && isRevalidatable(row.addResult)) {
            row.addResult = operationResult(
                'noop',
                'USER_ALREADY_IN_MARATHON',
                'User entered the marathon after preflight; no duplicate add was sent.'
            );
        }
        if (row.assignSelected && isRevalidatable(row.assignResult)) {
            const current = resolvePupilModerators(currentPupil.Moderators, moderators);
            row.assignResult = current.safe && current.moderators.some((moderator) =>
                moderator.teacherId === targetModerator?.teacherId
            )
                ? operationResult('noop', 'CURATOR_ALREADY_ASSIGNED', 'Target curator was assigned after preflight.')
                : operationResult(
                    'rejected',
                    'STATE_CHANGED',
                    'The user entered the marathon after preflight; curator state was not part of the confirmed plan.'
                );
        }
    }
    return rows;
}

function isOperationWide(error, getConnectionState) {
    if (!error?.code) return true;
    if (error.code === 'WS_UNAVAILABLE') return true;
    if (error.code === 'SEND_FAILED' && !getConnectionState().isOpen) return true;
    return !EXPECTED_WRITE_CODES.has(error.code);
}

function countTerminalOperations(rows) {
    const results = rows.flatMap((row) => [row.addResult, row.assignResult]).filter(Boolean);
    return {
        completed: results.filter((result) => result.status !== 'not_attempted').length,
        total: results.length,
        successes: results.filter((result) => ['success', 'noop'].includes(result.status)).length,
        failures: results.filter((result) => ['failed', 'rejected', 'skipped'].includes(result.status)).length
    };
}

function emitProgress(onProgress, rows, current = null) {
    try {
        onProgress?.({ ...countTerminalOperations(rows), current });
    } catch (_) {
        // Rendering failures must not alter mutation bookkeeping.
    }
}

async function executeAddGroup({
    rows,
    marathonId,
    targetModerator,
    includeModerator,
    sendRequest,
    wait,
    getConnectionState,
    getRequestContext,
    now
}) {
    const targets = rows.filter((row) =>
        isPending(row.addResult)
        && row.membership === 'not_in_marathon'
        && Boolean(row.assignSelected) === includeModerator
    );
    if (targets.length === 0) return { targets, confirmed: false, fatalError: null };

    const context = getRequestContext?.() || {};
    const request = buildAddRequest({
        marathonId,
        emails: targets.map((row) => row.email),
        moderatorIds: includeModerator ? [targetModerator.id] : [],
        host: context.host,
        userId: context.userId,
        now: now()
    });

    try {
        const result = await baseApi.runWithRetry(async () => {
            const response = await sendRequest(
                request.controller,
                request.method,
                request.projectName,
                request.value
            );
            if (response?.Value?.IsSuccess !== true) {
                throw featureError('INVALID_RESPONSE', 'User addition was not positively confirmed.');
            }
            return response;
        }, { wait, getConnectionState });
        for (const row of targets) row.addRequestAttempts = result.attempts;
        return { targets, confirmed: true, fatalError: null };
    } catch (error) {
        for (const row of targets) {
            row.addResult = operationResult(
                'failed',
                error.code || 'USER_ADD_FAILED',
                error.message || 'User addition failed.',
                error.attempts || 1
            );
            if (isPending(row.assignResult)) {
                row.assignResult = operationResult(
                    'skipped',
                    'ASSIGNMENT_BLOCKED_BY_ADD_FAILURE',
                    'Curator assignment was skipped because user addition failed.',
                    0,
                    { blockedBy: 'add_user' }
                );
            }
        }
        return {
            targets,
            confirmed: false,
            fatalError: isOperationWide(error, getConnectionState) ? error : null
        };
    }
}

function reconcileAddedRows({ groups, pupils, targetModerator }) {
    const pupilIndex = buildPupilEmailIndex(pupils);
    for (const group of groups.filter((item) => item.confirmed)) {
        for (const row of group.targets) {
            const candidates = pupilIndex.get(row.normalizedEmail) || [];
            if (candidates.length !== 1) {
                row.addResult = operationResult(
                    'failed',
                    'INVALID_USER_RESPONSE',
                    candidates.length === 0
                        ? 'The add request succeeded, but the user was not found in the refreshed marathon roster.'
                        : 'The add request succeeded, but the refreshed user identity was ambiguous.',
                    row.addRequestAttempts || 1
                );
                if (isPending(row.assignResult)) {
                    row.assignResult = operationResult(
                        'skipped',
                        'ASSIGNMENT_BLOCKED_BY_ADD_FAILURE',
                        'Curator assignment was skipped because the added user could not be resolved safely.',
                        0,
                        { blockedBy: 'add_user' }
                    );
                }
                continue;
            }

            const currentPupil = candidates[0];
            row.runtimePupil = serializePupil(currentPupil);
            row.addResult = operationResult(
                'success',
                'USER_ADDED',
                'User was added to the marathon.',
                row.addRequestAttempts || 1
            );
            if (isPending(row.assignResult) && row.assignSelected) {
                const assigned = Array.isArray(currentPupil.Moderators)
                    && currentPupil.Moderators.some((moderator) =>
                        Number(moderator?.TeacherId) === Number(targetModerator?.teacherId)
                    );
                row.assignResult = assigned
                    ? operationResult(
                        'success',
                        'CURATOR_ASSIGNED',
                        'Target curator was assigned during user addition.',
                        row.addRequestAttempts || 1,
                        { blockedBy: 'add_user' }
                    )
                    : operationResult(
                        'failed',
                        'INVALID_MODERATOR_RESPONSE',
                        'The user was added, but the target curator was not confirmed on the refreshed roster.',
                        row.addRequestAttempts || 1,
                        { blockedBy: 'add_user' }
                    );
            }
        }
    }
}

function markConfirmedGroupsUnverified(groups, error) {
    for (const group of groups.filter((item) => item.confirmed)) {
        for (const row of group.targets) {
            if (!isPending(row.addResult)) continue;
            row.addResult = operationResult(
                'failed',
                'ADD_VERIFICATION_FAILED',
                `The add request was accepted, but per-user verification could not finish: ${error?.message || 'operation interrupted'}`,
                row.addRequestAttempts || 1
            );
            if (isPending(row.assignResult)) {
                row.assignResult = operationResult(
                    'skipped',
                    'ASSIGNMENT_BLOCKED_BY_ADD_FAILURE',
                    'Curator assignment could not be verified because the added user was not safely resolved.',
                    0,
                    { blockedBy: 'add_user' }
                );
            }
        }
    }
}

async function executeExistingAssignments({
    rows,
    marathonId,
    targetModerator,
    sendRequest,
    wait,
    getConnectionState,
    requestDelayMs,
    onProgress
}) {
    let fatalError = null;
    const targets = rows.filter((row) =>
        isPending(row.assignResult)
        && row.membership === 'in_marathon'
        && row.runtimePupil?.marathonPupilId
    );
    for (const [index, row] of targets.entries()) {
        if (fatalError) break;
        const request = buildAssignRequest({
            marathonId,
            marathonPupilId: row.runtimePupil.marathonPupilId,
            existingModeratorIds: row.currentModerators.map((moderator) => moderator.id),
            targetModeratorId: targetModerator.id
        });
        try {
            const result = await baseApi.runWithRetry(async () => {
                const response = await sendRequest(
                    request.controller,
                    request.method,
                    request.projectName,
                    request.value
                );
                if (response?.Value?.IsSuccess !== true) {
                    throw featureError('INVALID_RESPONSE', 'Curator assignment was not positively confirmed.');
                }
                return response;
            }, { wait, getConnectionState });
            row.assignResult = operationResult(
                'success',
                'CURATOR_ASSIGNED',
                'Target curator was assigned while preserving existing curators.',
                result.attempts
            );
        } catch (error) {
            row.assignResult = operationResult(
                'failed',
                error.code || 'CURATOR_ASSIGNMENT_FAILED',
                error.message || 'Curator assignment failed.',
                error.attempts || 1
            );
            if (isOperationWide(error, getConnectionState)) fatalError = error;
        }
        emitProgress(onProgress, rows, { email: row.email, operation: 'assign_curator' });
        if (index < targets.length - 1 && requestDelayMs > 0 && !fatalError) await wait(requestDelayMs);
    }
    return fatalError;
}

function markRemainingNotAttempted(rows, message = 'Not attempted because the operation stopped.') {
    for (const row of rows) {
        if (isPending(row.addResult)) {
            row.addResult = operationResult('not_attempted', 'NOT_ATTEMPTED', message);
        }
        if (isPending(row.assignResult)) {
            row.assignResult = operationResult('not_attempted', 'NOT_ATTEMPTED', message);
        }
    }
}

function rejectRevalidatableRows(rows, error) {
    for (const row of rows) {
        rejectSelectedState(
            row,
            error?.code || 'STATE_CHANGED',
            error?.message || 'The confirmed plan could not be revalidated.'
        );
    }
}

async function executePlan({
    plan,
    marathonId,
    sendRequest,
    wait,
    getConnectionState,
    getRequestContext = () => ({ host: 'edvibe.com' }),
    now = () => new Date(),
    requestDelayMs = 250,
    onProgress = () => {}
}) {
    const rows = initializeExecutionRows(plan);
    const groups = [];
    let fatalError = null;
    let writesStarted = false;

    try {
        const [latestPupils, latestModerators] = await Promise.all([
            baseApi.loadAllPupils({ sendRequest, marathonId }),
            loadModerators({ sendRequest, marathonId })
        ]);
        const target = plan.targetModerator
            ? findTargetModerator(latestModerators, plan.targetModerator.id)
            : null;
        if (plan.targetModerator && (!target || target.teacherId !== plan.targetModerator.teacherId)) {
            throw featureError('STATE_CHANGED', 'The selected curator changed or disappeared after preflight.');
        }
        revalidateRows({
            rows,
            pupils: latestPupils,
            moderators: latestModerators,
            targetModerator: target
        });
        emitProgress(onProgress, rows, { operation: 'revalidate' });

        for (const includeModerator of [false, true]) {
            const hasTargets = rows.some((row) =>
                isPending(row.addResult)
                && row.membership === 'not_in_marathon'
                && Boolean(row.assignSelected) === includeModerator
            );
            if (!hasTargets) continue;
            writesStarted = true;
            const group = await executeAddGroup({
                rows,
                marathonId,
                targetModerator: target,
                includeModerator,
                sendRequest,
                wait,
                getConnectionState,
                getRequestContext,
                now
            });
            groups.push(group);
            fatalError ||= group.fatalError;
            emitProgress(onProgress, rows, {
                operation: includeModerator ? 'add_user_with_curator' : 'add_user'
            });
            if (fatalError) break;
            if (requestDelayMs > 0) await wait(requestDelayMs);
        }

        if (!fatalError && groups.some((group) => group.confirmed)) {
            const refreshedPupils = await baseApi.loadAllPupils({ sendRequest, marathonId });
            reconcileAddedRows({ groups, pupils: refreshedPupils, targetModerator: target });
            emitProgress(onProgress, rows, { operation: 'verify_additions' });
        }

        if (!fatalError && target) {
            if (rows.some((row) => isPending(row.assignResult) && row.membership === 'in_marathon')) {
                writesStarted = true;
            }
            fatalError = await executeExistingAssignments({
                rows,
                marathonId,
                targetModerator: target,
                sendRequest,
                wait,
                getConnectionState,
                requestDelayMs,
                onProgress
            });
        }
    } catch (error) {
        fatalError = error;
    }

    if (fatalError && groups.some((group) => group.confirmed)) {
        markConfirmedGroupsUnverified(groups, fatalError);
    }
    if (fatalError && !writesStarted) {
        rejectRevalidatableRows(rows, fatalError);
    }
    markRemainingNotAttempted(
        rows,
        fatalError
            ? 'Not attempted because the operation stopped.'
            : 'The selected operation was not applicable after revalidation.'
    );
    emitProgress(onProgress, rows, null);

    return deepFreeze({
        plan,
        rows: rows.map((row) => ({
            itemId: row.itemId,
            email: row.email,
            normalizedEmail: row.normalizedEmail,
            resolution: row.resolution,
            membership: row.membership,
            user: row.runtimePupil ? { ...row.runtimePupil } : row.user ? { ...row.user } : null,
            currentModerators: row.currentModerators.map((moderator) => ({ ...moderator })),
            targetModerator: row.targetModerator ? { ...row.targetModerator } : null,
            selectedOperations: [...row.selectedOperations],
            addResult: row.addResult ? { ...row.addResult } : null,
            assignResult: row.assignResult ? { ...row.assignResult } : null,
            message: row.message
        })),
        fatalError: fatalError
            ? Object.freeze({
                code: fatalError.code || 'INTERNAL_ERROR',
                message: fatalError.message || 'The operation stopped unexpectedly.'
            })
            : null
    });
}

function inferRowStatus(row) {
    const results = [row.addResult, row.assignResult].filter(Boolean);
    if (row.resolution === 'invalid' || row.resolution === 'ambiguous') return 'rejected';
    if (results.length === 0) return 'skipped';
    if (results.some((result) => result.status === 'failed')) return 'failed';
    if (results.some((result) => result.status === 'not_attempted')) return 'not_attempted';
    if (results.some((result) => result.status === 'rejected')) return 'rejected';
    if (results.some((result) => result.status === 'skipped')) return 'skipped';
    if (results.every((result) => result.status === 'noop')) return 'noop';
    return 'success';
}

function formatReport(result) {
    const lines = [
        'Edvibe Toolbox: batch user onboarding',
        `Requested users: ${result.plan.counts.requested}`,
        `Selected additions: ${result.plan.counts.additions}`,
        `Selected assignments: ${result.plan.counts.assignments}`,
        result.plan.targetModerator
            ? `Target curator: ${result.plan.targetModerator.name || result.plan.targetModerator.email || result.plan.targetModerator.id}`
            : 'Target curator: not selected',
        ''
    ];
    for (const row of result.rows) {
        const label = row.user?.name ? `${row.user.name} <${row.email}>` : row.email;
        lines.push(`[${inferRowStatus(row)}] ${label}`);
        if (row.addResult) {
            lines.push(`  add_user: ${row.addResult.status} ${row.addResult.code} — ${row.addResult.message}`);
        }
        if (row.assignResult) {
            lines.push(`  assign_curator: ${row.assignResult.status} ${row.assignResult.code} — ${row.assignResult.message}`);
        }
        if (!row.addResult && !row.assignResult) {
            lines.push(`  discovery: ${row.resolution} — ${row.message || 'No operation selected.'}`);
        }
    }
    if (result.fatalError) {
        lines.push('', `Interrupted: ${result.fatalError.code} — ${result.fatalError.message}`);
    }
    return lines.join('\n');
}

function buildCounts(rows) {
    const statuses = rows.map(inferRowStatus);
    return Object.freeze({
        requested: rows.length,
        eligible: rows.filter((row) =>
            !['invalid', 'ambiguous'].includes(row.resolution)
            && row.selectedOperations.length > 0
        ).length,
        attempted: rows.filter((row) =>
            [row.addResult, row.assignResult]
                .filter(Boolean)
                .some((result) => !['not_attempted', 'rejected'].includes(result.status))
        ).length,
        successful: statuses.filter((status) => status === 'success').length,
        noOp: statuses.filter((status) => status === 'noop').length,
        skipped: statuses.filter((status) => status === 'skipped' || status === 'rejected').length,
        failed: statuses.filter((status) => status === 'failed').length,
        notAttempted: statuses.filter((status) => status === 'not_attempted').length
    });
}

function serializeHistoryOperation(name, result) {
    return result ? Object.freeze({
        name,
        status: result.status,
        attemptCount: Number(result.attempts) || 0,
        code: result.code || null,
        message: result.message || null,
        dependency: result.dependency ? Object.freeze({ ...result.dependency }) : null
    }) : null;
}

function buildExecutionHistoryInput({
    marathonId,
    marathonName = null,
    startedAt,
    completedAt,
    result
}) {
    const rows = result.rows || [];
    const counts = buildCounts(rows);
    const operationCounts = {
        selected: 0,
        attempted: 0,
        successful: 0,
        noOp: 0,
        skipped: 0,
        rejected: 0,
        failed: 0,
        notAttempted: 0
    };
    const historyRows = rows.map((row) => {
        const operations = [
            serializeHistoryOperation('add_user', row.addResult),
            serializeHistoryOperation('assign_curator', row.assignResult)
        ].filter(Boolean);
        for (const operation of operations) {
            operationCounts.selected += 1;
            if (!['not_attempted', 'rejected'].includes(operation.status)) operationCounts.attempted += 1;
            if (operation.status === 'success') operationCounts.successful += 1;
            if (operation.status === 'noop') operationCounts.noOp += 1;
            if (operation.status === 'skipped') operationCounts.skipped += 1;
            if (operation.status === 'rejected') operationCounts.rejected += 1;
            if (operation.status === 'failed') operationCounts.failed += 1;
            if (operation.status === 'not_attempted') operationCounts.notAttempted += 1;
        }
        const status = inferRowStatus(row);
        return Object.freeze({
            itemId: row.itemId,
            label: row.email,
            status,
            code: {
                success: 'USER_ONBOARDING_COMPLETED',
                noop: 'USER_ONBOARDING_NOOP',
                skipped: 'USER_ONBOARDING_SKIPPED',
                rejected: 'USER_ONBOARDING_REJECTED',
                failed: 'USER_ONBOARDING_FAILED',
                not_attempted: 'NOT_ATTEMPTED'
            }[status],
            message: operations.map((operation) => operation.message).filter(Boolean).join('; ')
                || row.message
                || 'No operation selected.',
            attempts: operations.reduce((sum, operation) => sum + operation.attemptCount, 0),
            data: Object.freeze({
                submittedInput: row.email,
                normalizedEmail: row.normalizedEmail,
                resolution: row.resolution,
                membershipPreflight: row.membership,
                user: row.user ? Object.freeze({ ...row.user }) : null,
                existingCurators: Object.freeze(
                    row.currentModerators.map((moderator) => Object.freeze({ ...moderator }))
                ),
                targetCurator: row.targetModerator ? Object.freeze({ ...row.targetModerator }) : null,
                selectedOperations: Object.freeze([...row.selectedOperations]),
                operations: Object.freeze(operations)
            })
        });
    });
    return deepFreeze({
        operationType: OPERATION_TYPE,
        startedAt,
        completedAt,
        status: result.fatalError
            ? 'interrupted'
            : counts.failed > 0 || counts.skipped > 0
                ? 'completed_with_failures'
                : 'completed',
        pageContext: { marathonId: String(marathonId), marathonName },
        counts,
        results: historyRows,
        message: JSON.stringify({ userCounts: counts, operationCounts })
    });
}

function createBatchUserOnboardingFeature({
    sendRequest,
    getConnectionState,
    wait,
    canStart,
    onActiveChange,
    createDialog = () => document.createElement(DIALOG_TAG),
    copyText = (text) => navigator.clipboard.writeText(text),
    persistExecution = async () => Object.freeze({ stored: false }),
    openHistory = () => {},
    getLocationHref = () => window.location.href,
    getMarathonName = () => document.querySelector('h1')?.textContent?.trim() || document.title || null,
    getRequestContext = () => ({ host: window.location.hostname }),
    now = () => new Date(),
    log = () => {}
}) {
    let active = false;
    function release() {
        if (!active) return;
        active = false;
        onActiveChange(false);
    }

    async function open() {
        if (active || !canStart()) {
            window.alert('Another Edvibe Toolbox operation is already running.');
            return;
        }
        const marathonId = baseApi.parseMarathonId(getLocationHref());
        if (!marathonId) {
            window.alert('Open an Edvibe marathon page before adding users.');
            return;
        }

        active = true;
        onActiveChange(true);
        const dialog = createDialog();
        (document.body || document.documentElement).appendChild(dialog);
        try {
            dialog.showLoading?.('Loading marathon users and curators…');
            const [pupils, moderators] = await Promise.all([
                baseApi.loadAllPupils({ sendRequest, marathonId }),
                loadModerators({ sendRequest, marathonId })
            ]);
            let discoveryRows = [];
            dialog.configure({
                moderators,
                parseEmailInput: baseApi.parseEmailInput,
                onDiscover({ emailInput }) {
                    const parsed = baseApi.parseEmailInput(emailInput);
                    if (parsed.items.length === 0) {
                        throw featureError('EMAILS_REQUIRED', 'Enter at least one email address.');
                    }
                    discoveryRows = resolveOnboardingRows(parsed, pupils, moderators);
                    return discoveryRows;
                },
                onPreflight({ rows, targetModeratorId }) {
                    const selections = new Map((rows || []).map((row) => [
                        row.normalizedEmail,
                        {
                            addSelected: Boolean(row.addSelected),
                            assignSelected: Boolean(row.assignSelected)
                        }
                    ]));
                    const selectedRows = discoveryRows.map((row) => ({
                        ...row,
                        ...(selections.get(row.normalizedEmail) || {
                            addSelected: false,
                            assignSelected: false
                        })
                    }));
                    const plan = buildExecutionPlan({
                        rows: selectedRows,
                        moderators,
                        targetModeratorId
                    });
                    if (plan.counts.selectedOperations === 0) {
                        throw featureError('OPERATIONS_REQUIRED', 'Select at least one add or curator-assignment operation.');
                    }
                    return plan;
                },
                async onExecute(plan, onProgress) {
                    const startedAt = now().toISOString();
                    const result = await executePlan({
                        plan,
                        marathonId,
                        sendRequest,
                        wait,
                        getConnectionState,
                        getRequestContext,
                        now,
                        onProgress
                    });
                    const report = formatReport(result);
                    const completedAt = now().toISOString();
                    let history;
                    try {
                        history = await persistExecution(buildExecutionHistoryInput({
                            marathonId,
                            marathonName: getMarathonName(),
                            startedAt,
                            completedAt,
                            result
                        }));
                    } catch (persistenceError) {
                        history = Object.freeze({ stored: false, persistenceError });
                        log('Batch user onboarding history persistence failed:', persistenceError);
                    }
                    return { ...result, report, history };
                },
                onCopy: copyText,
                onOpenHistory(executionId) {
                    dialog.remove();
                    release();
                    openHistory(executionId);
                },
                onClose() {
                    dialog.remove();
                    release();
                }
            });
            dialog.showConfigure?.();
            log(`Batch user onboarding initialized for MarathonId ${marathonId}.`);
        } catch (error) {
            log(`Batch user onboarding initialization failed (${error.code || 'UNKNOWN_ERROR'}).`);
            dialog.remove();
            release();
            window.alert(error.message || 'Could not initialize batch user onboarding.');
        }
    }

    return Object.freeze({ open });
}

export {
    DIALOG_TAG,
    OPERATION_TYPE,
    normalizeModeratorCatalogue,
    loadModerators,
    resolvePupilModerators,
    resolveOnboardingRows,
    buildExecutionPlan,
    formatClientTime,
    buildAddRequest,
    buildAssignRequest,
    revalidateRows,
    executePlan,
    inferRowStatus,
    formatReport,
    buildCounts,
    buildExecutionHistoryInput,
    createBatchUserOnboardingFeature
};

export {
    parseMarathonId,
    parseEmailInput,
    loadAllPupils
} from './batch-user-management.js';
