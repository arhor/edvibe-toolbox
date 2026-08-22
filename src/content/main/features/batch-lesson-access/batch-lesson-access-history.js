import { withExecutionHistory } from '#src/content/main/application/execution-history-operation.js';
import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import { BATCH_ACCESS_DIALOG_TAG } from '#src/content/main/features/batch-lesson-access/batch-lesson-access-dialog.js';
import * as recordApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';
import * as batchAccessApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';
import { wait } from '#src/shared/utils.js';

function clearHistoryButton(dialog) {
    dialog?.shadowRoot?.querySelector?.('.edvibe-batch-access-history')?.remove?.();
}

function appendStatus(dialog, message, isError = false) {
    const current = dialog?.elements?.status?.textContent || '';
    dialog?.setStatus?.(`${current}${current ? ' ' : ''}${message}`, isError ? 'error' : '');
}

function addHistoryButton(dialog, executionId, openHistory) {
    clearHistoryButton(dialog);
    const documentApi = dialog?.ownerDocument || globalThis.document;
    const button = documentApi?.createElement?.('button');
    if (!button) {
        return;
    }
    button.type = 'button';
    button.className = 'edvibe-batch-access-history';
    button.textContent = 'Открыть в истории';
    button.addEventListener('click', () => openHistory(executionId));
    dialog?.elements?.footer?.appendChild?.(button);
}

function buildConfirmedExecutionHistoryPlan(plan = {}) {
    const identitiesByEmail = new Map();
    const selectedLessons = new Map();

    function observeItem(item) {
        const email = String(item?.email || '').trim();
        const normalizedEmail = email.toLowerCase();
        if (!identitiesByEmail.has(normalizedEmail)) {
            identitiesByEmail.set(normalizedEmail, Object.freeze({
                submittedInput: email,
                normalizedEmail,
                resolution: 'matched'
            }));
        }
        const lessonId = Number(item?.marathonLessonId);
        if (!selectedLessons.has(lessonId)) {
            selectedLessons.set(lessonId, Object.freeze({
                marathonLessonId: lessonId,
                lessonNumber: item?.lessonNumber ?? null,
                lessonName: item?.lessonName || `Lesson ${lessonId}`
            }));
        }
    }

    for (const item of [...(plan.alreadyOpen || []), ...(plan.needsOpening || [])]) {
        observeItem(item);
    }
    for (const email of plan.requestedEmails || []) {
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!identitiesByEmail.has(normalizedEmail)) {
            identitiesByEmail.set(normalizedEmail, Object.freeze({
                submittedInput: String(email || '').trim(),
                normalizedEmail,
                resolution: 'matched'
            }));
        }
    }

    function matrixItem(item, plannedOutcome, preflightAccessState) {
        return Object.freeze({
            submittedInput: item.email,
            resolvedEmail: item.email,
            pupilId: item.pupilId,
            marathonPupilId: item.marathonPupilId,
            marathonLessonId: item.marathonLessonId,
            lessonNumber: item.lessonNumber,
            lessonName: item.lessonName,
            preflightAccessState,
            plannedOutcome
        });
    }

    return Object.freeze({
        identities: Object.freeze([...identitiesByEmail.values()]),
        selectedLessons: Object.freeze([...selectedLessons.values()]),
        matrix: Object.freeze([
            ...(plan.alreadyOpen || []).map((item) => matrixItem(item, 'already_open', 'open')),
            ...(plan.needsOpening || []).map((item) => matrixItem(item, 'open', 'closed'))
        ]),
        discoveryFailures: Object.freeze([]),
        operationFailures: Object.freeze([])
    });
}

function createBatchLessonAccessHistoryOperation({
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
            return recordApi.buildExecutionHistoryInput({
                plan: buildConfirmedExecutionHistoryPlan(input?.plan),
                summary: result || error?.partialResult || {},
                startedAt,
                completedAt,
                marathonId: batchAccessApi.parseMarathonId(getLocationHref()),
                marathonName: getMarathonName(),
                terminalStatus: error ? 'interrupted' : null
            });
        }
    });
}

export function createBatchLessonAccessFeatureV2({
    transport,
    operationGuard,
    logger,
    executionHistoryService,
    dispatch,
}) {
    let activeDialog = null;
    const openHistory = (executionId) => {
        activeDialog?.close?.();
        dispatch({
            type: WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
            executionId
        });
    };
    const executeWithHistory = createBatchLessonAccessHistoryOperation({
        execute: ({ marathonId, plan, onProgress }) => batchAccessApi.executeAccessPlan({
            marathonId,
            requestedEmails: plan.requestedEmails,
            matchedUsers: plan.matchedUsers,
            selectedLessons: plan.selectedLessonIds.length,
            alreadyOpen: plan.alreadyOpen,
            needsOpening: plan.needsOpening,
            sendRequest: transport.sendRequest,
            wait,
            getConnectionState: transport.getConnectionState,
            onProgress
        }),
        persistExecution: executionHistoryService.persistTerminal,
        getLocationHref: () => window.location.href,
        getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
            || document.title
            || null,
        onPersistence(outcome) {
            if (outcome?.stored) {
                appendStatus(activeDialog, 'Результат сохранён в истории.');
                if (outcome.record?.id) {
                    addHistoryButton(activeDialog, outcome.record.id, openHistory);
                }
                return;
            }
            appendStatus(
                activeDialog,
                'Экранный результат сохранён, но записать историю не удалось.',
                true
            );
        },
        logger: logger.createChildLogger('BatchAccessHistory')
    });

    return batchAccessApi.createBatchLessonAccessFeature({
        sendRequest: transport.sendRequest,
        getConnectionState: transport.getConnectionState,
        session: createFeatureSession({ operationGuard, operationName: 'batch-access' }),
        createDialog: () => {
            activeDialog = document.createElement(BATCH_ACCESS_DIALOG_TAG);
            return activeDialog;
        },
        copyText: (text) => navigator.clipboard.writeText(text),
        executeOperation: executeWithHistory,
        logger: logger.createChildLogger('BatchAccess')
    });
}

const batchLessonAccessFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_LESSON_ACCESS,
    create(context) {
        const feature = createBatchLessonAccessFeatureV2(context);
        return () => feature.open();
    }
});

export * from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-model.js';
export * from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history-record.js';
export {
    batchLessonAccessFeatureDefinition,
    buildConfirmedExecutionHistoryPlan,
    createBatchLessonAccessHistoryOperation
};
