/* eslint-disable perfectionist/sort-imports */
import { createFeatureSession } from '#src/content/main/application/feature-session.js';
import {
    loadModerators,
    normalizeModeratorCatalogue,
    resolvePupilModerators
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-domain.js';
import {
    executePlan,
    revalidateRows
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-execution.js';
import { createRecordedExecution } from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-history.js';
import {
    buildAddRequest,
    buildAssignRequest,
    buildExecutionPlan,
    formatClientTime,
    resolveOnboardingRows
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-planning.js';
import {
    buildCounts,
    formatReport,
    inferRowStatus
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-reporting.js';
import {
    createFeatureError,
    parseEmailInput as parseSharedEmailInput,
    parseMarathonId
} from '#src/content/main/features/batch-workflow-primitives.js';
import { loadAllPupils } from '#src/content/main/infrastructure/edvibe-marathon-api.js';
import { WINDOW_MESSAGE_TYPES } from '#src/shared/messaging/index.js';
import { wait } from '#src/shared/utils.js';
import { BATCH_USER_ONBOARDING_DIALOG_TAG } from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-dialog.js';

const DIALOG_TAG = 'edvibe-toolbox-batch-user-onboarding-dialog';

function parseEmailInput(value) {
    return parseSharedEmailInput(value, { includeItems: true });
}

export function createBatchUserOnboardingFeatureV2({
    transport,
    operationGuard,
    logger,
    executionHistoryService,
    edvibeApi,
    pageContext,
}) {
    const historyLogger = logger.createChildLogger('BatchUserOnboardingHistory');
    return createBatchUserOnboardingFeature({
        sendRequest: transport.sendRequest,
        getConnectionState: transport.getConnectionState,
        session: createFeatureSession({
            operationGuard,
            operationName: 'batch-user-onboarding'
        }),
        createDialog: () => document.createElement(BATCH_USER_ONBOARDING_DIALOG_TAG),
        copyText: (text) => navigator.clipboard.writeText(text),
        executeOperation: createRecordedExecution({
            executePlan,
            persistExecution: executionHistoryService.persistTerminal,
            getMarathonName: () => pageContext.marathonName,
            now: () => new Date(),
            logger: historyLogger
        }),
        getMarathonId: () => pageContext.marathonId,
        getMarathonName: () => pageContext.marathonName,
        getRequestContext: () => ({ host: pageContext.hostname }),
        loadPupils: ({ marathonId }) => edvibeApi.loadAllPupils({ marathonId }),
        logger: logger.createChildLogger('BatchUserOnboarding')
    });
}

const batchUserOnboardingFeatureDefinition = Object.freeze({
    type: WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_ONBOARDING,
    create(context) {
        const feature = createBatchUserOnboardingFeatureV2(context);
        return () => feature.open();
    }
});

function createBatchUserOnboardingFeature({
    sendRequest,
    getConnectionState,
    session,
    executeOperation = executePlan,
    createDialog = () => document.createElement(DIALOG_TAG),
    copyText = (text) => navigator.clipboard.writeText(text),
    getLocationHref = () => window.location.href,
    getMarathonId = () => parseMarathonId(getLocationHref()),
    getRequestContext = () => ({ host: window.location.hostname }),
    loadPupils = ({ marathonId }) => loadAllPupils({ sendRequest, marathonId }),
    now = () => new Date(),
    logger = { log() {} }
}) {
    async function open() {
        if (session.isOpen() || !session.activate()) {
            window.alert('Another Edvibe Toolbox operation is already running.');
            return;
        }
        const marathonId = getMarathonId();
        if (!marathonId) {
            session.release();
            window.alert('Open an Edvibe marathon page before adding users.');
            return;
        }

        let dialog;
        try {
            dialog = session.ownDialog(createDialog());
            (document.body || document.documentElement).appendChild(dialog);
            dialog.showLoading?.('Loading marathon users and curators…');
            const [pupils, moderators] = await Promise.all([
                loadPupils({ marathonId }),
                loadModerators({ sendRequest, marathonId })
            ]);
            let discoveryRows = [];
            dialog.configure({
                moderators,
                parseEmailInput,
                onDiscover({ emailInput }) {
                    const parsed = parseEmailInput(emailInput);
                    if (parsed.items.length === 0) {
                        throw createFeatureError('EMAILS_REQUIRED', 'Enter at least one email address.');
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
                        throw createFeatureError(
                            'OPERATIONS_REQUIRED',
                            'Select at least one add or curator-assignment operation.'
                        );
                    }
                    return plan;
                },
                async onExecute(plan, onProgress) {
                    const result = await executeOperation({
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
                    return { ...result, report };
                },
                onCopy: copyText,
                onClose() {
                    session.close();
                }
            });
            dialog.showConfigure?.();
            logger.log(`Batch user onboarding initialized for MarathonId ${marathonId}.`);
        } catch (error) {
            logger.log(`Batch user onboarding initialization failed (${error.code || 'UNKNOWN_ERROR'}).`);
            session.close();
            window.alert(error.message || 'Could not initialize batch user onboarding.');
        }
    }

    return Object.freeze({ open });
}

export {
    DIALOG_TAG,
    buildAddRequest,
    buildAssignRequest,
    buildCounts,
    buildExecutionPlan,
    batchUserOnboardingFeatureDefinition,
    createBatchUserOnboardingFeature,
    executePlan,
    formatClientTime,
    formatReport,
    inferRowStatus,
    loadAllPupils,
    loadModerators,
    normalizeModeratorCatalogue,
    parseEmailInput,
    parseMarathonId,
    resolveOnboardingRows,
    resolvePupilModerators,
    revalidateRows
};
