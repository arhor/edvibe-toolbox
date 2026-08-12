import * as coreApi from './batch-section-deletion.js';
import { historyDiagnostics } from '../content/main/infrastructure/history-diagnostics.js';

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
    if (!normalized) return fallback;
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
    if (entry.discoveryOutcome) return text(entry.discoveryOutcome, 'inspection_failed', 120);
    return {
        SECTION_NOT_FOUND: 'not_found',
        SECTION_NAME_AMBIGUOUS: 'ambiguous',
        UNSUPPORTED_SECTION_TYPE: 'unsupported_section_type',
        INVALID_LESSON_RESPONSE: 'invalid_lesson_response'
    }[entry.code] || (entry.sectionId ? 'matched' : 'inspection_failed');
}

function enrichPlan(plan = {}, selectedLessonIds = []) {
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
    if (entry.code) return text(entry.code, 'UNKNOWN_RESULT', 120);
    if (entry.status === 'deleted') return 'DELETED';
    if (entry.status === 'rejected') return 'PREFLIGHT_REJECTED';
    if (entry.status === 'failed') return 'DELETE_FAILED';
    return terminalStatus === 'cancelled' ? 'OPERATION_CANCELLED' : 'OPERATION_INTERRUPTED';
}

function resultMessage(entry, terminalStatus) {
    if (entry.message) return text(entry.message, 'No message was provided.');
    if (entry.status === 'deleted') return 'Section deleted.';
    if (entry.status === 'rejected') return 'The lesson was rejected during discovery.';
    if (entry.status === 'failed') return 'The validated deletion request failed.';
    return terminalStatus === 'cancelled'
        ? 'Not attempted because the confirmed run was cancelled.'
        : 'Not attempted because the confirmed run was interrupted.';
}

function materializeResults(plan = {}, execution = {}, terminalStatus = null) {
    const byId = new Map();
    for (const entry of plan.rejected || []) byId.set(lessonKey(entry), { ...entry, status: 'rejected', attempts: 0 });
    for (const entry of execution.results || []) byId.set(lessonKey(entry), { ...entry });
    const eligible = new Map((plan.eligible || []).map((entry) => [lessonKey(entry), entry]));
    const ordered = [];
    const included = new Set();

    for (const id of plan.selectedLessonIds || []) {
        const key = String(id);
        let entry = byId.get(key);
        if (!entry && eligible.has(key)) entry = { ...eligible.get(key), status: 'not_attempted', attempts: 0 };
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
        if (key !== null && included.has(key)) continue;
        ordered.push(byId.get(key) || { ...entry, status: 'not_attempted', attempts: 0 });
        if (key !== null) included.add(key);
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
    if (Number.isSafeInteger(entry.matchCount) && entry.matchCount >= 0) return entry.matchCount;
    if (entry.sectionId) return 1;
    if (entry.code === 'SECTION_NOT_FOUND') return 0;
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
    if (TERMINAL_STATUSES.has(explicitStatus)) return explicitStatus;
    if (fatalError) return 'interrupted';
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

function appendStatus(dialog, message) {
    const status = dialog.shadowRoot?.querySelector?.('.status');
    const current = status?.textContent || '';
    dialog.showStatus?.(`${current}${current ? ' ' : ''}${message}`);
}

function addHistoryButton(dialog, executionId, openHistory) {
    const documentApi = dialog.ownerDocument || globalThis.document;
    const button = documentApi?.createElement?.('button');
    if (!button) return;
    button.type = 'button';
    button.className = 'edvibe-batch-section-deletion-history';
    button.textContent = 'Open in history';
    button.addEventListener('click', () => openHistory?.(executionId));
    dialog.shadowRoot?.querySelector?.('footer')?.appendChild?.(button);
}

function createHistoryAwareFeature(options = {}) {
    const {
        createFeature = coreApi.createBatchSectionDeletionFeature,
        createDialog,
        persistExecution,
        getLocationHref = () => '',
        getMarathonName = () => null,
        now = () => new Date(),
        log = () => {},
        ...featureOptions
    } = options;
    if (typeof createDialog !== 'function') throw new TypeError('createDialog is required');
    if (typeof persistExecution !== 'function') throw new TypeError('persistExecution is required');

    function createTrackedDialog() {
        const dialog = createDialog();
        const originalConfigure = dialog.configure.bind(dialog);
        let plan = null;
        let latestResult = null;
        let startedAt = null;
        let terminal = false;
        let sequence = 0;

        async function persist(result, terminalStatus = null, fatalError = null) {
            const currentSequence = sequence;
            try {
                const completedAt = now().toISOString();
                const input = buildExecutionHistoryInput({
                    plan,
                    result: result || latestResult || {},
                    startedAt: startedAt || completedAt,
                    completedAt,
                    marathonId: parseMarathonId(getLocationHref()),
                    marathonName: getMarathonName(),
                    terminalStatus,
                    fatalError
                });
                const history = await persistExecution(input);
                return currentSequence === sequence
                    ? history
                    : Object.freeze({ stored: false, stale: true });
            } catch (persistenceError) {
                log('Batch section deletion history persistence failed:', persistenceError);
                return Object.freeze({ stored: false, persistenceError });
            }
        }

        dialog.configure = (config = {}) => {
            const originalInspect = config.onInspect;
            const originalExecute = config.onExecute;
            const originalClose = config.onClose;
            const originalOpenHistory = config.onOpenHistory;
            return originalConfigure({
                ...config,
                async onInspect(input) {
                    const inspected = await originalInspect(input);
                    sequence += 1;
                    plan = enrichPlan(inspected, input?.selectedLessonIds || []);
                    latestResult = { plan, results: [] };
                    startedAt = now().toISOString();
                    terminal = false;
                    if (!plan.eligible.length) {
                        terminal = true;
                        void persist(latestResult).then((history) => {
                            if (history?.stored) {
                                appendStatus(dialog, 'Result saved to execution history.');
                                if (history.record?.id) addHistoryButton(dialog, history.record.id, originalOpenHistory);
                            } else if (history?.persistenceError) {
                                appendStatus(dialog, 'The visible preflight is intact, but history could not be saved.');
                            }
                        });
                    }
                    return plan;
                },
                async onExecute(confirmedPlan, onProgress) {
                    plan = enrichPlan(confirmedPlan, confirmedPlan.selectedLessonIds || []);
                    startedAt = startedAt || now().toISOString();
                    terminal = false;
                    try {
                        const result = await originalExecute(plan, (progress = {}) => {
                            if (Array.isArray(progress.results)) {
                                latestResult = {
                                    plan,
                                    results: [...progress.results],
                                    fatalError: progress.fatalError || null
                                };
                            }
                            onProgress?.(progress);
                        });
                        latestResult = result;
                        terminal = true;
                        const history = await persist(
                            result,
                            result.fatalError ? 'interrupted' : null,
                            result.fatalError || null
                        );
                        return { ...result, history };
                    } catch (error) {
                        terminal = true;
                        await persist(latestResult, 'interrupted', error);
                        throw error;
                    }
                },
                onOpenHistory: originalOpenHistory,
                onClose() {
                    if (plan && !terminal) {
                        terminal = true;
                        void persist(latestResult, 'cancelled');
                    }
                    originalClose?.();
                }
            });
        };
        return dialog;
    }

    return createFeature({ ...featureOptions, createDialog: createTrackedDialog, log });
}

function installHistoryAwareFeature(baseApi = coreApi) {
    return Object.freeze({
        ...baseApi,
        createBatchSectionDeletionFeature(options = {}) {
            return createHistoryAwareFeature({
                ...options,
                createFeature: baseApi.createBatchSectionDeletionFeature,
                getLocationHref: options.getLocationHref || (() => globalThis.location?.href || ''),
                getMarathonName: options.getMarathonName || (() => (
                    globalThis.document?.querySelector?.('h1')?.textContent?.trim()
                    || globalThis.document?.title
                    || null
                ))
            });
        }
    });
}

function createBatchSectionDeletionFeature(options = {}) {
    return installHistoryAwareFeature(coreApi).createBatchSectionDeletionFeature(options);
}

export {
    OPERATION_TYPE,
    parseMarathonId,
    discoveryOutcome,
    enrichPlan,
    materializeResults,
    serializeResult,
    buildExecutionHistoryInput,
    createHistoryAwareFeature,
    installHistoryAwareFeature,
    createBatchSectionDeletionFeature
};
