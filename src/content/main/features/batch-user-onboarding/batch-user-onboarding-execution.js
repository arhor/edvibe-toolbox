import { loadAllPupils } from '../edvibe-marathon-api.js';
import { runWithRetry } from '../batch-workflow-primitives.js';
import {
    buildPupilEmailIndex,
    deepFreeze,
    featureError,
    findTargetModerator,
    loadModerators,
    resolvePupilModerators,
    serializePupil
} from './batch-user-onboarding-domain.js';
import {
    buildAddRequest,
    buildAssignRequest
} from './batch-user-onboarding-planning.js';
import {
    diagnosticAttempt,
    diagnosticEnvelope
} from './batch-user-onboarding-diagnostics.js';

const EXPECTED_WRITE_CODES = new Set([
    'SERVER_REJECTED',
    'INVALID_RESPONSE',
    'REQUEST_TIMEOUT',
    'SEND_FAILED'
]);

function operationResult(status, code, message, attempts = 0, dependency = null, diagnostics = null) {
    return { status, code, message, attempts, dependency, diagnostics };
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
    const diagnosticId = includeModerator ? 'add-group-with-curator' : 'add-group';
    for (const row of targets) row.addDiagnosticRef = diagnosticId;

    const context = getRequestContext?.() || {};
    const request = buildAddRequest({
        marathonId,
        emails: targets.map((row) => row.email),
        moderatorIds: includeModerator ? [targetModerator.id] : [],
        host: context.host,
        userId: context.userId,
        now: now()
    });

    const diagnosticAttempts = [];
    try {
        const result = await runWithRetry(async () => {
            try {
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
            } catch (error) {
                diagnosticAttempts.push(diagnosticAttempt(error, 'add_user', diagnosticAttempts.length + 1));
                throw error;
            }
        }, { wait, getConnectionState });
        for (const row of targets) row.addRequestAttempts = result.attempts;
        return {
            targets,
            confirmed: true,
            fatalError: null,
            diagnosticId,
            diagnostics: diagnosticEnvelope('add_user', diagnosticAttempts)
        };
    } catch (error) {
        const diagnostics = diagnosticEnvelope('add_user', diagnosticAttempts);
        for (const row of targets) {
            row.addResult = operationResult(
                'failed',
                error.code || 'USER_ADD_FAILED',
                error.message || 'User addition failed.',
                error.attempts || 1,
                null,
                { reference: diagnosticId }
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
            diagnosticId,
            fatalError: isOperationWide(error, getConnectionState) ? Object.assign(error, { diagnostics }) : null,
            diagnostics
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
                    row.addRequestAttempts || 1,
                    null,
                    { reference: row.addDiagnosticRef }
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
                row.addRequestAttempts || 1,
                null,
                { reference: row.addDiagnosticRef }
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
                row.addRequestAttempts || 1,
                null,
                { reference: row.addDiagnosticRef }
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
        const diagnosticAttempts = [];
        try {
            const result = await runWithRetry(async () => {
                try {
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
                } catch (error) {
                    diagnosticAttempts.push(diagnosticAttempt(error, 'assign_curator', diagnosticAttempts.length + 1));
                    throw error;
                }
            }, { wait, getConnectionState });
            row.assignResult = operationResult(
                'success',
                'CURATOR_ASSIGNED',
                'Target curator was assigned while preserving existing curators.',
                result.attempts,
                null,
                diagnosticEnvelope('assign_curator', diagnosticAttempts)
            );
        } catch (error) {
            row.assignResult = operationResult(
                'failed',
                error.code || 'CURATOR_ASSIGNMENT_FAILED',
                error.message || 'Curator assignment failed.',
                error.attempts || 1,
                null,
                diagnosticEnvelope('assign_curator', diagnosticAttempts)
            );
            if (isOperationWide(error, getConnectionState)) {
                fatalError = Object.assign(error, {
                    diagnostics: diagnosticEnvelope('assign_curator', diagnosticAttempts)
                });
            }
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
        const diagnostics = diagnosticEnvelope('revalidate', [diagnosticAttempt(error, 'revalidate', 1)]);
        if (row.addResult?.status === 'rejected') row.addResult.diagnostics = diagnostics;
        if (row.assignResult?.status === 'rejected') row.assignResult.diagnostics = diagnostics;
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
    let currentOperation = 'revalidate';

    try {
        const [latestPupils, latestModerators] = await Promise.all([
            loadAllPupils({ sendRequest, marathonId }),
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
            currentOperation = includeModerator ? 'add_user_with_curator' : 'add_user';
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
            currentOperation = 'verify_additions';
            const refreshedPupils = await loadAllPupils({ sendRequest, marathonId });
            reconcileAddedRows({ groups, pupils: refreshedPupils, targetModerator: target });
            emitProgress(onProgress, rows, { operation: 'verify_additions' });
        }

        if (!fatalError && target) {
            currentOperation = 'assign_curator';
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
        fatalError = Object.assign(error, {
            diagnostics: error?.diagnostics?.attempts
                ? error.diagnostics
                : diagnosticEnvelope(currentOperation, [diagnosticAttempt(error, currentOperation, 1)])
        });
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
        diagnostics: groups.map((group) => group.diagnostics ? ({
            id: group.diagnosticId,
            ...group.diagnostics
        }) : null).filter(Boolean),
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
                message: fatalError.message || 'The operation stopped unexpectedly.',
                diagnostics: fatalError.diagnostics
                    || diagnosticEnvelope('fatal', [diagnosticAttempt(fatalError, 'fatal', 1)])
            })
            : null
    });
}

export {
    executePlan,
    revalidateRows
};
