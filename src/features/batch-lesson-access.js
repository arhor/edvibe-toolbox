(function initializeBatchLessonAccess(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeBatchLessonAccess = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule() {
    'use strict';

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const TRANSIENT_CODES = new Set([
        'WS_UNAVAILABLE',
        'REQUEST_TIMEOUT',
        'SEND_FAILED'
    ]);
    const BATCH_ACCESS_DIALOG_TAG = 'edvibe-toolbox-batch-access-dialog';
    const BATCH_ACCESS_OVERLAY_ID = 'edvibe-toolbox-batch-access-overlay';

    function createFeatureError(code, message, details = {}) {
        const error = new Error(message);
        error.code = code;
        Object.assign(error, details);
        return error;
    }

    function getPupilId(pupil) {
        return pupil.PupilId === undefined ? pupil.Id : pupil.PupilId;
    }

    function getMarathonPupilId(pupil) {
        return pupil.MarathonPupilId === undefined ? pupil.Id : pupil.MarathonPupilId;
    }

    function isTransientError(error, getConnectionState) {
        if (!TRANSIENT_CODES.has(error?.code)) {
            return false;
        }
        if (error.code !== 'SEND_FAILED') {
            return true;
        }
        return Boolean(error.cause) && !getConnectionState().isOpen;
    }

    async function runWithRetry(operation, {
        wait,
        getConnectionState,
        retryDelays = [1000, 3000]
    }) {
        let attempts = 0;
        while (attempts <= retryDelays.length) {
            attempts += 1;
            try {
                if (attempts > 1 && !getConnectionState().isOpen) {
                    throw createFeatureError(
                        'WS_UNAVAILABLE',
                        'The Edvibe connection is unavailable.'
                    );
                }
                return { value: await operation(), attempts };
            } catch (error) {
                if (!isTransientError(error, getConnectionState) || attempts > retryDelays.length) {
                    error.attempts = attempts;
                    throw error;
                }
                await wait(retryDelays[attempts - 1]);
            }
        }
    }

    function parseMarathonId(url) {
        const match = String(url || '').match(/\/marathon\/(\d+)(?:\/|$)/);
        return match ? Number(match[1]) : null;
    }

    function parseEmailInput(value) {
        const entries = [];
        const malformed = [];
        const seen = new Set();
        for (const token of String(value || '').split(/[,;\r\n]+/)) {
            const input = token.trim();
            if (!input) {
                continue;
            }
            const normalized = input.toLowerCase();
            if (seen.has(normalized)) {
                continue;
            }
            seen.add(normalized);
            if (!EMAIL_PATTERN.test(input)) {
                malformed.push(input);
                continue;
            }
            entries.push({ input, normalized });
        }
        return { entries, malformed };
    }

    function appendPage(items, total, nextItems, nextTotal, label) {
        if (
            !Array.isArray(nextItems)
            || !Number.isInteger(nextTotal)
            || nextTotal < 0
            || (total !== null && nextTotal !== total)
            || (nextItems.length === 0 && items.length < nextTotal)
            || items.length + nextItems.length > nextTotal
        ) {
            const error = new Error(`${label} returned invalid pagination data.`);
            error.code = 'INVALID_RESPONSE';
            throw error;
        }
        return {
            items: items.concat(nextItems),
            total: nextTotal
        };
    }

    async function loadAllPupils({ sendRequest, marathonId, pageSize = 50 }) {
        let items = [];
        let total = null;

        while (total === null || items.length < total) {
            const response = await sendRequest(
                'MarathonPupilsWsController',
                'GetMarathonPupils',
                'Marathons',
                { MarathonId: marathonId, Skip: items.length, Take: pageSize }
            );
            const page = appendPage(
                items,
                total,
                response?.Value?.Items,
                response?.Value?.Page?.Count,
                'GetMarathonPupils'
            );
            items = page.items;
            total = page.total;
        }

        return items;
    }

    async function loadAllPupilLessons({ sendRequest, marathonId, pupilId, pageSize = 20 }) {
        let items = [];
        let total = null;

        while (total === null || items.length < total) {
            const response = await sendRequest(
                'MarathonLessonWsController',
                'GetMarathonLessonsForPupilPagination',
                'Marathons',
                {
                    PupilId: pupilId,
                    MarathonId: marathonId,
                    SearchTerm: '',
                    Page: { Skip: items.length, Take: pageSize }
                }
            );
            const page = appendPage(
                items,
                total,
                response?.Value?.Items,
                response?.Value?.Page?.Count,
                'GetMarathonLessonsForPupilPagination'
            );
            items = page.items;
            total = page.total;
        }

        return items;
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
                attempts += result.attempts;
                opened.push(item);
            } catch (error) {
                const itemAttempts = error.attempts || 1;
                attempts += itemAttempts;
                failures.push({
                    email: item.email,
                    lessonNumber: item.lessonNumber,
                    lessonName: item.lessonName,
                    marathonLessonId: item.marathonLessonId,
                    attempts: itemAttempts,
                    code: error.code || 'UNKNOWN_ERROR',
                    message: error.message
                });
            }
            onProgress(createProgressSnapshot({
                completed: index + 1,
                total: needsOpening.length,
                opened: opened.length,
                failures: failures.length,
                alreadyOpen: alreadyOpen.length,
                item
            }));
        }

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
                        readErrors.push(error);
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
            dialog.showExecution({
                completed: 0,
                total: executionPlan.needsOpening.length,
                opened: 0,
                failures: 0,
                alreadyOpen: executionPlan.alreadyOpen.length
            });

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

        async function open({ stylesheetUrl = '' } = {}) {
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

                dialog.configure({ stylesheetUrl });
                (document.body || document.documentElement).appendChild(dialog);

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
                    lessons: lessonCatalogue,
                    emailState: { validCount: 0, malformedCount: 0 }
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

    return {
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
});
