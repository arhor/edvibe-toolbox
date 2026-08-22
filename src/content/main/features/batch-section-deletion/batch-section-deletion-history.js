import { withExecutionHistory } from '#src/content/main/application/execution-history-operation.js';
import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import { BATCH_SECTION_DELETION_DIALOG_TAG } from '#src/content/main/features/batch-section-deletion/batch-section-deletion-dialog.js';
import * as coreApi from '#src/content/main/features/batch-section-deletion/batch-section-deletion.js';
import { historyDiagnostics } from '#src/content/main/infrastructure/history-diagnostics.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';
import { wait } from '#src/shared/utils.js';

const OPERATION_TYPE = 'batch-section-deletion';
const TERMINAL_STATUSES = new Set([
    'completed',
    'completed_with_failures',
    'cancelled',
    'interrupted'
]);
const ATTEMPTED_STATUSES = new Set(['deleted', 'failed']);

function text(value, fallback = '', maxLength = 1000) {
    const normalized = String(value ?? '').trim();
    if (!normalized) {
        return fallback;
    }
    return normalized.length <= maxLength
        ? normalized
        : `${normalized.slice(0, maxLength - 1)}…`;
}

function parseMarathonId(url) {
    const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
    return match ? String(match[1]) : null;
}

function lessonKey(value) {
    const id = value?.lessonId ?? value?.LessonId;
    return id === undefined || id === null ? null : String(id);
}

function discoveryOutcome(entry = {}) {
    if (entry.discoveryOutcome) {
        return text(entry.discoveryOutcome, 'inspection_failed', 120);
    }
    return {
        SECTION_NOT_FOUND: 'not_found',
        SECTION_NAME_AMBIGUOUS: 'ambiguous',
        UNSUPPORTED_SECTION_TYPE: 'unsupported_section_type',
        INVALID_LESSON_RESPONSE: 'invalid_lesson_response'
    }[entry.code] || (entry.sectionId ? 'matched' : 'inspection_failed');
}

function enrichPlan(plan = {}, selectedLessonIds = plan?.selectedLessonIds || []) {
    const sectionName = text(plan.sectionName, 'Unnamed section', 500);
    const eligible = (plan.eligible || []).map((entry) => Object.freeze({
        ...entry,
        sectionName,
        sectionType: 'normal',
        discoveryOutcome: 'matched',
        matchCount: 1
    }));
    const rejected = (plan.rejected || []).map((entry) => Object.freeze({
        ...entry,
        sectionName,
        sectionId: null,
        sectionType: null,
        discoveryOutcome: discoveryOutcome(entry),
        matchCount: entry.code === 'SECTION_NOT_FOUND' ? 0 : null,
        attempts: 0
    }));
    return Object.freeze({
        ...plan,
        sectionName,
        selectedLessonIds: Object.freeze([...selectedLessonIds]),
        selectedCount: Number.isSafeInteger(plan.selectedCount)
            ? plan.selectedCount
            : selectedLessonIds.length,
        eligible: Object.freeze(eligible),
        rejected: Object.freeze(rejected)
    });
}

function resultCode(entry, terminalStatus) {
    if (entry.code) {
        return text(entry.code, 'UNKNOWN_RESULT', 120);
    }
    if (entry.status === 'deleted') {
        return 'DELETED';
    }
    if (entry.status === 'rejected') {
        return 'PREFLIGHT_REJECTED';
    }
    if (entry.status === 'failed') {
        return 'DELETE_FAILED';
    }
    return terminalStatus === 'cancelled' ? 'OPERATION_CANCELLED' : 'OPERATION_INTERRUPTED';
}

function resultMessage(entry, terminalStatus) {
    if (entry.message) {
        return text(entry.message, 'No message was provided.');
    }
    if (entry.status === 'deleted') {
        return 'Section deleted.';
    }
    if (entry.status === 'rejected') {
        return 'The lesson was rejected during discovery.';
    }
    if (entry.status === 'failed') {
        return 'The validated deletion request failed.';
    }
    return terminalStatus === 'cancelled'
        ? 'Not attempted because the confirmed run was cancelled.'
        : 'Not attempted because the confirmed run was interrupted.';
}

function materializeResults(plan = {}, execution = {}, terminalStatus = null) {
    const byId = new Map();
    for (const entry of plan.rejected || []) {
        byId.set(lessonKey(entry), { ...entry, status: 'rejected', attempts: 0 });
    }
    for (const entry of execution.results || []) {
        byId.set(lessonKey(entry), { ...entry });
    }
    const eligible = new Map((plan.eligible || []).map((entry) => [lessonKey(entry), entry]));
    const ordered = [];
    const included = new Set();

    for (const id of plan.selectedLessonIds || []) {
        const key = String(id);
        let entry = byId.get(key);
        if (!entry && eligible.has(key)) {
            entry = { ...eligible.get(key), status: 'not_attempted', attempts: 0 };
        }
        if (!entry) {
            entry = {
                lessonId: id,
                name: `Lesson ${id}`,
                status: 'not_attempted',
                attempts: 0,
                sectionName: plan.sectionName
            };
        }
        ordered.push(entry);
        included.add(key);
    }

    for (const entry of [...byId.values(), ...eligible.values()]) {
        const key = lessonKey(entry);
        if (key !== null && included.has(key)) {
            continue;
        }
        ordered.push(byId.get(key) || { ...entry, status: 'not_attempted', attempts: 0 });
        if (key !== null) {
            included.add(key);
        }
    }

    return ordered.map((entry) => {
        const status = text(entry.status, 'not_attempted', 80);
        return {
            ...entry,
            status,
            attempts: Number.isSafeInteger(entry.attempts) && entry.attempts >= 0
                ? entry.attempts
                : ATTEMPTED_STATUSES.has(status) ? 1 : 0,
            terminalStatus
        };
    });
}

function matchCount(entry) {
    if (Number.isSafeInteger(entry.matchCount) && entry.matchCount >= 0) {
        return entry.matchCount;
    }
    if (entry.sectionId) {
        return 1;
    }
    if (entry.code === 'SECTION_NOT_FOUND') {
        return 0;
    }
    const match = String(entry.message || '').match(/Found (\d+) sections/);
    return match ? Number(match[1]) : null;
}

function serializeResult(entry, plan, terminalStatus) {
    const status = entry.status;
    const code = resultCode(entry, terminalStatus);
    const message = resultMessage(entry, terminalStatus);
    const outcome = discoveryOutcome(entry);
    const lesson = Object.freeze({
        lessonId: entry.lessonId ?? null,
        marathonLessonId: entry.marathonLessonId ?? null,
        number: entry.number ?? null,
        name: text(entry.name, 'Unnamed lesson', 500)
    });
    return Object.freeze({
        itemId: lesson.lessonId === null ? null : `lesson-${lesson.lessonId}`,
        label: `${lesson.number ?? '?'}. ${lesson.name}`,
        status,
        code,
        message,
        attempts: entry.attempts,
        ...(historyDiagnostics(entry) ? { diagnostics: historyDiagnostics(entry) } : {}),
        data: Object.freeze({
            lesson,
            section: Object.freeze({
                requestedName: text(entry.sectionName || plan.sectionName, 'Unnamed section', 500),
                matchedId: entry.sectionId ?? null,
                supportedType: entry.sectionId ? 'normal' : null
            }),
            discovery: Object.freeze({
                outcome,
                code: outcome === 'matched' ? 'DISCOVERY_MATCHED' : code,
                message: outcome === 'matched'
                    ? 'Exactly one supported normal lesson section matched the requested name.'
                    : message,
                matchCount: matchCount(entry)
            }),
            finalOutcome: status,
            deletionFailure: status === 'failed'
                ? Object.freeze({ code, message, attemptCount: entry.attempts })
                : null
        })
    });
}

function inferTerminalStatus(explicitStatus, fatalError, results) {
    if (TERMINAL_STATUSES.has(explicitStatus)) {
        return explicitStatus;
    }
    if (fatalError) {
        return 'interrupted';
    }
    return results.some((entry) => ['rejected', 'failed', 'not_attempted'].includes(entry.status))
        ? 'completed_with_failures'
        : 'completed';
}

function buildExecutionHistoryInput({
    plan,
    result = {},
    startedAt,
    completedAt,
    marathonId,
    marathonName = null,
    terminalStatus = null,
    fatalError = null
}) {
    const materializationStatus = TERMINAL_STATUSES.has(terminalStatus)
        ? terminalStatus
        : fatalError || result.fatalError ? 'interrupted' : null;
    const materialized = materializeResults(plan, result, materializationStatus);
    const results = materialized.map((entry) => serializeResult(entry, plan, materializationStatus));
    const status = inferTerminalStatus(terminalStatus, fatalError || result.fatalError, results);
    const attempted = results.filter((entry) => ATTEMPTED_STATUSES.has(entry.status)).length;
    const notAttempted = results.filter((entry) => entry.status === 'not_attempted').length;
    const counts = Object.freeze({
        requested: results.length,
        eligible: Math.max(plan.eligible?.length || 0, attempted + notAttempted),
        attempted,
        successful: results.filter((entry) => entry.status === 'deleted').length,
        noOp: 0,
        skipped: results.filter((entry) => entry.status === 'rejected').length,
        failed: results.filter((entry) => entry.status === 'failed').length,
        notAttempted
    });
    return Object.freeze({
        operationType: OPERATION_TYPE,
        startedAt,
        completedAt,
        status,
        pageContext: Object.freeze({ marathonId, marathonName }),
        counts,
        results: Object.freeze(results),
        message: JSON.stringify({ sectionName: plan.sectionName, counts })
    });
}

function createBatchSectionDeletionHistoryOperation({
    execute,
    persistExecution,
    onPersistence = () => {},
    getLocationHref = () => '',
    getMarathonName = () => null,
    now = () => new Date(),
    logger = { log() {} }
} = {}) {
    return withExecutionHistory({
        execute,
        persistExecution,
        onPersistence,
        now,
        logger,
        buildHistoryInput({ input, result, error, startedAt, completedAt }) {
            const plan = enrichPlan(input?.plan);
            const executionResult = result || error?.partialResult || {};
            const fatalError = error || executionResult?.fatalError || null;
            return buildExecutionHistoryInput({
                plan,
                result: executionResult,
                startedAt,
                completedAt,
                marathonId: parseMarathonId(getLocationHref()),
                marathonName: getMarathonName(),
                terminalStatus: fatalError ? 'interrupted' : null,
                fatalError
            });
        }
    });
}

export function createBatchSectionDeletionFeatureV2({
    transport,
    operationGuard,
    logger,
    executionHistoryService,
    dispatch,
}) {
    let latestHistory = null;
    const openHistory = (executionId) => dispatch({
        type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
        executionId
    });
    const executeWithHistory = createBatchSectionDeletionHistoryOperation({
        execute: ({ plan, onProgress }) => coreApi.executePlan({
            plan,
            sendRequest: transport.sendRequest,
            wait,
            onProgress
        }),
        persistExecution: executionHistoryService.persistTerminal,
        getLocationHref: () => window.location.href,
        getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
            || document.title
            || null,
        onPersistence(history) {
            latestHistory = history;
        },
        logger: logger.createChildLogger('BatchSectionDeletionHistory')
    });

    return coreApi.createBatchSectionDeletionFeature({
        sendRequest: transport.sendRequest,
        getConnectionState: transport.getConnectionState,
        session: createFeatureSession({
            operationGuard,
            operationName: 'batch-section-deletion'
        }),
        createDialog: () => document.createElement(BATCH_SECTION_DELETION_DIALOG_TAG),
        copyText: (text) => navigator.clipboard.writeText(text),
        async executeOperation(input) {
            latestHistory = null;
            const result = await executeWithHistory(input);
            return Object.freeze({ ...result, history: latestHistory });
        },
        openHistory,
        logger: logger.createChildLogger('BatchSectionDeletion')
    });
}

const batchSectionDeletionFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_DELETION,
    create(context) {
        const feature = createBatchSectionDeletionFeatureV2(context);
        return () => feature.open();
    }
});

export {
    batchSectionDeletionFeatureDefinition,
    OPERATION_TYPE,
    parseMarathonId,
    discoveryOutcome,
    enrichPlan,
    materializeResults,
    serializeResult,
    buildExecutionHistoryInput,
    createBatchSectionDeletionHistoryOperation
};
