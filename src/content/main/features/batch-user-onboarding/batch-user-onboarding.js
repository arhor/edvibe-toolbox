import {
    loadModerators,
    normalizeModeratorCatalogue,
    resolvePupilModerators
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-domain.js';
import {
    executePlan,
    revalidateRows
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-execution.js';
import {
    buildAddRequest,
    buildAssignRequest,
    buildExecutionPlan,
    formatClientTime,
    resolveOnboardingRows
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-planning.js';
import {
    OPERATION_TYPE,
    buildCounts,
    buildExecutionHistoryInput,
    formatReport,
    inferRowStatus
} from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-reporting.js';
import {
    createFeatureError,
    parseEmailInput as parseSharedEmailInput,
    parseMarathonId
} from '#src/content/main/features/batch-workflow-primitives.js';
import { loadAllPupils } from '#src/content/main/features/edvibe-marathon-api.js';

const DIALOG_TAG = 'edvibe-toolbox-batch-user-onboarding-dialog';

function parseEmailInput(value) {
    return parseSharedEmailInput(value, { includeItems: true });
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
        const marathonId = parseMarathonId(getLocationHref());
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
                loadAllPupils({ sendRequest, marathonId }),
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
    buildAddRequest,
    buildAssignRequest,
    buildCounts,
    buildExecutionHistoryInput,
    buildExecutionPlan,
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
