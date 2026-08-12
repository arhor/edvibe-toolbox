import {
    TRANSIENT_CODES,
    appendPage,
    createFeatureError,
    parseEmailInput,
    parseMarathonId,
    runWithRetry
} from '../batch-workflow-primitives.js';
import { loadAllPupilLessons, loadAllPupils } from '../edvibe-marathon-api.js';

const OPERATIONAL_WRITE_CODES = new Set([
    ...TRANSIENT_CODES,
    'SERVER_REJECTED',
    'INVALID_RESPONSE'
]);
const BATCH_ACCESS_DIALOG_TAG = 'edvibe-toolbox-batch-access-dialog';
const BATCH_ACCESS_OVERLAY_ID = 'edvibe-toolbox-batch-access-overlay';

function getPupilId(pupil) {
    return pupil.PupilId === undefined ? pupil.Id : pupil.PupilId;
}

function getMarathonPupilId(pupil) {
    return pupil.MarathonPupilId === undefined ? pupil.Id : pupil.MarathonPupilId;
}

function resolvePupilsByEmail(entries, pupils) {
    const pupilsByEmail = new Map();
    for (const pupil of pupils) {
        const email = String(pupil.Email || '').trim().toLowerCase();
        const candidates = pupilsByEmail.get(email) || [];
        candidates.push(pupil);
        pupilsByEmail.set(email, candidates);
    }

    const matches = [];
    const errors = [];
    for (const entry of entries) {
        const candidates = pupilsByEmail.get(entry.normalized) || [];
        if (candidates.length === 1) {
            matches.push(candidates[0]);
        } else if (candidates.length === 0) {
            errors.push({
                type: 'missing',
                input: entry.input,
                message: `No marathon pupil found for ${entry.input}.`
            });
        } else {
            errors.push({
                type: 'ambiguous',
                input: entry.input,
                count: candidates.length,
                message: `Multiple marathon pupils found for ${entry.input}.`
            });
        }
    }
    return { matches, errors };
}

function buildAccessPlan({ pupils, selectedLessonIds, lessonsByPupilId }) {
    const alreadyOpen = [];
    const needsOpening = [];
    const errors = [];

    for (const pupil of pupils) {
        const pupilId = getPupilId(pupil);
        const lessons = lessonsByPupilId.get(pupilId) || [];
        const selectedLessons = new Map();
        const duplicateLessonIds = new Set();

        for (const lesson of lessons) {
            if (!selectedLessonIds.includes(lesson.MarathonLessonId)) {
                continue;
            }
            const existing = selectedLessons.get(lesson.MarathonLessonId);
            if (existing) {
                duplicateLessonIds.add(lesson.MarathonLessonId);
                errors.push(createFeatureError(
                    'INVALID_RESPONSE',
                    `Multiple lesson states were returned for lesson ${lesson.MarathonLessonId}.`,
                    {
                        email: pupil.Email,
                        pupilId,
                        marathonLessonId: lesson.MarathonLessonId
                    }
                ));
                continue;
            }
            selectedLessons.set(lesson.MarathonLessonId, lesson);
        }

        for (const marathonLessonId of selectedLessonIds) {
            const lesson = selectedLessons.get(marathonLessonId);
            if (duplicateLessonIds.has(marathonLessonId)) {
                continue;
            }
            if (!lesson) {
                errors.push(createFeatureError(
                    'INVALID_RESPONSE',
                    `Lesson ${marathonLessonId} was not returned for ${pupil.Email}.`,
                    { email: pupil.Email, pupilId, marathonLessonId }
                ));
                continue;
            }
            if (typeof lesson.IsOpen !== 'boolean') {
                errors.push(createFeatureError(
                    'INVALID_RESPONSE',
                    `Lesson ${marathonLessonId} returned an invalid access state.`,
                    { email: pupil.Email, pupilId, marathonLessonId }
                ));
                continue;
            }

            const item = {
                email: pupil.Email,
                pupilId,
                marathonPupilId: getMarathonPupilId(pupil),
                marathonLessonId,
                lessonNumber: lesson.Number + 1,
                lessonName: lesson.Name
            };
            if (lesson.IsOpen === true) {
                alreadyOpen.push(item);
            } else {
                needsOpening.push(item);
            }
        }
    }

    return { alreadyOpen, needsOpening, errors };
}

function createProgressSnapshot({ completed, total, opened, failures, alreadyOpen, item }) {
    return Object.freeze({
        completed,
        total,
        opened,
        failures,
        alreadyOpen,
        current: Object.freeze({ email: item.email, lessonName: item.lessonName })
    });
}

function createExecutionFailure(item, error, {
    code = error?.code || 'UNKNOWN_ERROR',
    message = error?.message || 'The lesson access change failed.',
    attempts = error?.attempts || 1
} = {}) {
    return {
        email: item.email,
        lessonNumber: item.lessonNumber,
        lessonName: item.lessonName,
        marathonLessonId: item.marathonLessonId,
        attempts,
        code,
        message
    };
}

function createExecutionResult({
    requestedEmails,
    matchedUsers,
    selectedLessons,
    opened,
    alreadyOpen,
    failures,
    attempts
}) {
    return {
        requestedEmails,
        matchedUsers,
        selectedLessons,
        opened,
        alreadyOpen: alreadyOpen.length,
        failures,
        attempts
    };
}

async function executeAccessPlan({
    marathonId,
    requestedEmails,
    matchedUsers,
    selectedLessons,
    alreadyOpen = [],
    needsOpening = [],
    sendRequest,
    wait,
    getConnectionState,
    onProgress = () => {}
}) {
    const opened = [];
    const failures = [];
    let attempts = 0;

    for (let index = 0; index < needsOpening.length; index += 1) {
        const item = needsOpening[index];
        let itemAttempts = 0;
        try {
            onProgress(createProgressSnapshot({
                completed: index,
                total: needsOpening.length,
                opened: opened.length,
                failures: failures.length,
                alreadyOpen: alreadyOpen.length,
                item
            }));
            await wait(300);

            try {
                const result = await runWithRetry(
                    async () => {
                        const response = await sendRequest(
                            'MarathonLessonWsController',
                            'ChangeIsOpenLessonForPupil',
                            'Marathons',
                            {
                                IsOpen: true,
                                MarathonLessonId: item.marathonLessonId,
                                MarathonPupilId: item.marathonPupilId,
                                MarathonId: marathonId
                            }
                        );
                        if (response?.Value !== true) {
                            throw createFeatureError(
                                'INVALID_RESPONSE',
                                'The lesson access change was not confirmed.'
                            );
                        }
                        return response;
                    },
                    { wait, getConnectionState }
                );
                itemAttempts = result.attempts;
                attempts += itemAttempts;
                opened.push(item);
            } catch (error) {
                itemAttempts = error.attempts || 1;
                attempts += itemAttempts;
                if (!OPERATIONAL_WRITE_CODES.has(error?.code)) {
                    throw error;
                }
                failures.push(createExecutionFailure(item, error, {
                    attempts: itemAttempts
                }));
            }

            onProgress(createProgressSnapshot({
                completed: index + 1,
                total: needsOpening.length,
                opened: opened.length,
                failures: failures.length,
                alreadyOpen: alreadyOpen.length,
                item
            }));
        } catch (error) {
            failures.push(createExecutionFailure(item, error, {
                code: 'INTERNAL_ERROR',
                message: 'An internal error stopped the batch operation.',
                attempts: itemAttempts
            }));
            throw createFeatureError(
                'INTERNAL_ERROR',
                'An internal error stopped the batch operation.',
                {
                    cause: error,
                    partialResult: createExecutionResult({
                        requestedEmails,
                        matchedUsers,
                        selectedLessons,
                        opened,
                        alreadyOpen,
                        failures,
                        attempts
                    })
                }
            );
        }
    }

    return createExecutionResult({
        requestedEmails,
        matchedUsers,
        selectedLessons,
        opened,
        alreadyOpen,
        failures,
        attempts
    });
}

function formatBatchReport(result) {
    const lines = [
        `Requested emails: ${result.requestedEmails.length}`,
        `Matched users: ${result.matchedUsers}`,
        `Selected lessons: ${result.selectedLessons}`,
        `Opened: ${result.opened.length}`,
        `Already open: ${result.alreadyOpen}`,
        `Failed: ${result.failures.length}`,
        `Attempts: ${result.attempts}`
    ];
    for (const failure of result.failures) {
        lines.push(
            `FAILED ${failure.email} — ${failure.lessonNumber}. ${failure.lessonName} `
            + `— ${failure.attempts} attempts — ${failure.code}: ${failure.message}`
        );
    }
    return lines.join('\n');
}

function freezeItems(items) {
    return Object.freeze(items.map((item) => Object.freeze({ ...item })));
}

function freezePlan({
    requestedEmails,
    matchedUsers,
    selectedLessonIds,
    alreadyOpen,
    needsOpening
}) {
    return Object.freeze({
        requestedEmails: Object.freeze([...requestedEmails]),
        matchedUsers,
        selectedLessonIds: Object.freeze([...selectedLessonIds]),
        alreadyOpen: freezeItems(alreadyOpen),
        needsOpening: freezeItems(needsOpening)
    });
}

function createBatchLessonAccessFeature({
    sendRequest,
    getConnectionState,
    wait,
    canStart,
    onActiveChange,
    createDialog = () => document.createElement(BATCH_ACCESS_DIALOG_TAG),
    copyText = async () => {},
    log = () => {}
}) {
    let active = false;
    let running = false;
    let pupils = [];
    let lessonCatalogue = [];
    let pendingPlan = null;
    let completedResult = null;
    let marathonId = null;
    let dialog = null;

    function releaseOperation() {
        if (!active) {
            return;
        }
        active = false;
        onActiveChange(false);
    }

    function handleClose() {
        running = false;
        pupils = [];
        lessonCatalogue = [];
        pendingPlan = null;
        completedResult = null;
        marathonId = null;
        dialog = null;
        releaseOperation();
    }

    function getErrorCode(error) {
        return typeof error?.code === 'string' ? error.code : 'UNKNOWN_ERROR';
    }

    function createReadError(error, pupil, pupilId) {
        const code = getErrorCode(error);
        const email = String(pupil?.Email || '').trim();
        return createFeatureError(
            code,
            `Could not load lesson access for ${email || 'the selected pupil'} (${code}).`,
            {
                email,
                pupilId,
                attempts: error?.attempts || 1
            }
        );
    }

    function createInputErrors(parsed, selectedLessonIds) {
        const errors = parsed.malformed.map((input) => createFeatureError(
            'INVALID_EMAIL',
            `Invalid email address: ${input}.`
        ));
        if (parsed.entries.length === 0 && parsed.malformed.length === 0) {
            errors.push(createFeatureError(
                'EMAILS_REQUIRED',
                'Enter at least one email address.'
            ));
        }
        if (selectedLessonIds.length === 0) {
            errors.push(createFeatureError(
                'LESSONS_REQUIRED',
                'Select at least one lesson.'
            ));
        }
        return errors;
    }

    function showCompletedPlan(plan) {
        completedResult = {
            requestedEmails: [...plan.requestedEmails],
            matchedUsers: plan.matchedUsers,
            selectedLessons: plan.selectedLessonIds.length,
            opened: [],
            alreadyOpen: plan.alreadyOpen.length,
            failures: [],
            attempts: 0
        };
        pendingPlan = null;
        dialog.showComplete(completedResult);
    }

    async function handleSubmit(event) {
        if (running) {
            return;
        }

        running = true;
        pendingPlan = null;
        completedResult = null;

        const submittedEmailInput = String(event?.detail?.emailInput || '');
        const selectedLessonIds = Object.freeze(
            Array.isArray(event?.detail?.selectedLessonIds)
                ? [...event.detail.selectedLessonIds]
                : []
        );

        try {
            dialog.showValidation();
            const parsed = parseEmailInput(submittedEmailInput);
            const inputErrors = createInputErrors(parsed, selectedLessonIds);
            const resolution = resolvePupilsByEmail(parsed.entries, pupils);
            const validationErrors = inputErrors.concat(resolution.errors);

            if (validationErrors.length > 0) {
                log(
                    `Batch access validation blocked for MarathonId ${marathonId}; `
                    + `${validationErrors.length} error(s).`
                );
                dialog.showValidationErrors(validationErrors);
                return;
            }

            const lessonsByPupilId = new Map();
            const pupilsWithLessons = [];
            const readErrors = [];

            for (const pupil of resolution.matches) {
                const pupilId = getPupilId(pupil);
                try {
                    log(
                        `Loading batch access state for PupilId ${pupilId} `
                        + `in MarathonId ${marathonId}.`
                    );
                    const result = await runWithRetry(
                        () => loadAllPupilLessons({
                            sendRequest,
                            marathonId,
                            pupilId
                        }),
                        { wait, getConnectionState }
                    );
                    lessonsByPupilId.set(pupilId, result.value);
                    pupilsWithLessons.push(pupil);
                    log(
                        `Loaded ${result.value.length} lesson state(s) for `
                        + `PupilId ${pupilId} after ${result.attempts} attempt(s).`
                    );
                } catch (error) {
                    readErrors.push(createReadError(error, pupil, pupilId));
                    log(
                        `Batch access state read failed for PupilId ${pupilId} `
                        + `in MarathonId ${marathonId} (${getErrorCode(error)}).`
                    );
                }
            }

            const plan = buildAccessPlan({
                pupils: pupilsWithLessons,
                selectedLessonIds,
                lessonsByPupilId
            });
            const preflightErrors = readErrors.concat(plan.errors);
            if (preflightErrors.length > 0) {
                log(
                    `Batch access preflight blocked for MarathonId ${marathonId}; `
                    + `${preflightErrors.length} error(s), zero writes issued.`
                );
                dialog.showValidationErrors(preflightErrors);
                return;
            }

            pendingPlan = freezePlan({
                requestedEmails: parsed.entries.map((entry) => entry.input),
                matchedUsers: resolution.matches.length,
                selectedLessonIds,
                alreadyOpen: plan.alreadyOpen,
                needsOpening: plan.needsOpening
            });

            log(
                `Batch access preflight complete for MarathonId ${marathonId}; `
                + `${pendingPlan.needsOpening.length} pending, `
                + `${pendingPlan.alreadyOpen.length} already open.`
            );

            if (pendingPlan.needsOpening.length === 0) {
                showCompletedPlan(pendingPlan);
                return;
            }

            dialog.showConfirmation(Object.freeze({
                matchedUsers: pendingPlan.matchedUsers,
                selectedLessons: pendingPlan.selectedLessonIds.length,
                needsOpening: pendingPlan.needsOpening,
                alreadyOpen: pendingPlan.alreadyOpen
            }));
        } catch (error) {
            log(
                `Batch access preflight failed for MarathonId ${marathonId} `
                + `(${getErrorCode(error)}).`
            );
            dialog.showValidationErrors([error]);
        } finally {
            running = false;
        }
    }

    async function handleConfirm() {
        if (running || !pendingPlan) {
            return;
        }

        running = true;
        const executionPlan = pendingPlan;
        pendingPlan = null;

        try {
            try {
                completedResult = await executeAccessPlan({
                    marathonId,
                    requestedEmails: executionPlan.requestedEmails,
                    matchedUsers: executionPlan.matchedUsers,
                    selectedLessons: executionPlan.selectedLessonIds.length,
                    alreadyOpen: executionPlan.alreadyOpen,
                    needsOpening: executionPlan.needsOpening,
                    sendRequest,
                    wait,
                    getConnectionState,
                    onProgress: (progress) => dialog.showExecution(progress)
                });
            } catch (error) {
                if (error?.code !== 'INTERNAL_ERROR' || !error.partialResult) {
                    throw error;
                }
                completedResult = error.partialResult;
                log(
                    `Batch access execution stopped for MarathonId ${marathonId}; `
                    + `${completedResult.opened.length} opened, `
                    + `${completedResult.failures.length} failed (INTERNAL_ERROR).`
                );
            }
            log(
                `Batch access execution complete for MarathonId ${marathonId}; `
                + `${completedResult.opened.length} opened, `
                + `${completedResult.alreadyOpen} already open, `
                + `${completedResult.failures.length} failed.`
            );
            for (const failure of completedResult.failures) {
                log(
                    `Batch access write failed for MarathonLessonId `
                    + `${failure.marathonLessonId} (${failure.code}).`
                );
            }
            dialog.showComplete(completedResult);
        } finally {
            running = false;
        }
    }

    async function handleCopyReport() {
        if (!completedResult) {
            return;
        }
        await copyText(formatBatchReport(completedResult));
    }

    function handleRestart() {
        pendingPlan = null;
        completedResult = null;
        running = false;
    }

    async function open() {
        if (
            active
            || document.getElementById(BATCH_ACCESS_OVERLAY_ID)
        ) {
            return;
        }
        if (!canStart()) {
            window.alert('Another Edvibe Toolbox operation is already running.');
            return;
        }

        marathonId = parseMarathonId(window.location.href);
        if (!marathonId) {
            window.alert('Open an Edvibe marathon page before opening batch lesson access.');
            return;
        }

        active = true;
        onActiveChange(true);

        try {
            dialog = createDialog();
            dialog.addEventListener('edvibe-dialog-close', handleClose);
            dialog.addEventListener('edvibe-batch-access-input-change', (event) => {
                const parsed = parseEmailInput(event?.detail?.emailInput);
                dialog.setEmailState({
                    validCount: parsed.entries.length,
                    malformedCount: parsed.malformed.length
                });
            });
            dialog.addEventListener('edvibe-batch-access-submit', handleSubmit);
            dialog.addEventListener('edvibe-batch-access-confirm', handleConfirm);
            dialog.addEventListener('edvibe-batch-access-copy-report', handleCopyReport);
            dialog.addEventListener('edvibe-batch-access-restart', handleRestart);

            dialog.configure();
            (document.body || document.documentElement).appendChild(dialog);
            dialog.showLoading();

            log(`Initializing batch access for MarathonId ${marathonId}.`);
            pupils = await loadAllPupils({ sendRequest, marathonId });
            if (pupils.length === 0) {
                throw createFeatureError(
                    'EMPTY_ROSTER',
                    'No pupils were found in this marathon.'
                );
            }

            const firstPupilId = getPupilId(pupils[0]);
            lessonCatalogue = await loadAllPupilLessons({
                sendRequest,
                marathonId,
                pupilId: firstPupilId
            });
            log(
                `Initialized batch access for MarathonId ${marathonId}; `
                + `${pupils.length} pupil(s), ${lessonCatalogue.length} lesson(s), `
                + `catalogue PupilId ${firstPupilId}.`
            );
            dialog.showConfigure({
                lessons: lessonCatalogue
            });
        } catch (error) {
            log(
                `Batch access initialization failed for MarathonId ${marathonId} `
                + `(${getErrorCode(error)}).`
            );
            try {
                if (typeof dialog?.showFatalError === 'function') {
                    dialog.showFatalError(error);
                } else {
                    throw error;
                }
            } finally {
                releaseOperation();
            }
        }
    }

    return { open, isRunning: () => running };
}

export {
    parseMarathonId,
    parseEmailInput,
    appendPage,
    loadAllPupils,
    loadAllPupilLessons,
    resolvePupilsByEmail,
    createFeatureError,
    runWithRetry,
    buildAccessPlan,
    executeAccessPlan,
    formatBatchReport,
    createBatchLessonAccessFeature
};
