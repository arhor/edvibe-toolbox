(function initializeResetLessons(root, factory) {
    const api = factory();
    root.EdVibeLessonReset = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createResetLessonsModule() {
    'use strict';

    function parseMarathonId(url) {
        const match = String(url || '').match(/marathon\/(\d+)/);
        return match ? Number(match[1]) : null;
    }

    function filterPupilsByEmail(pupils, query) {
        const normalizedQuery = String(query || '').trim().toLowerCase();
        if (!normalizedQuery) return pupils;

        return pupils.filter((pupil) =>
            String(pupil.Email || '').toLowerCase().includes(normalizedQuery)
        );
    }

    function collectLessonSections(lessonValue) {
        const sections = Array.isArray(lessonValue?.Sections)
            ? lessonValue.Sections.filter(Boolean)
            : [];

        if (lessonValue?.HomeworkSection) {
            sections.push(lessonValue.HomeworkSection);
        }

        return sections;
    }

    function shouldDeleteLastRequest(lesson) {
        const status = lesson?.LastRequest?.Status;
        return Boolean(lesson?.LastRequest?.Id && Number.isFinite(status) && status !== 0);
    }

    function buildLoadExercisesPayload({
        marathonId,
        pupilId,
        marathonLessonId,
        sectionId
    }) {
        return {
            MarathonId: marathonId,
            LessonId: marathonLessonId,
            SectionId: sectionId,
            PupilId: pupilId,
            IsTeacher: true,
            LessonSection: 0,
            Domain: 'edvibe.com'
        };
    }

    function buildResetAnswerPayload({
        marathonId,
        pupilId,
        lessonId,
        exercise
    }) {
        return {
            SelfSync: false,
            IsReset: true,
            ExerciseId: exercise.id,
            ExerciseType: exercise.type,
            SectionId: exercise.sectionId,
            PupilId: pupilId,
            MarathonId: marathonId,
            SingleAnswer: {},
            ManyAnswers: [],
            RepeatingManyAnswers: [],
            AnswerErrorsCount: [[]],
            StatisticsInfo: {
                CountAnswersTrue: 0,
                CountAnswersFalse: 0,
                CountAnswersPending: 0
            },
            LessonId: lessonId
        };
    }

    function createPupilPager(sendRequest, marathonId, pageSize = 50) {
        let pupils = [];
        let total = null;
        let inFlight = null;

        function snapshot() {
            return {
                pupils: [...pupils],
                total,
                hasMore: total === null || pupils.length < total
            };
        }

        async function requestNextPage() {
            if (total !== null && pupils.length >= total) return snapshot();

            const response = await sendRequest(
                'MarathonPupilsWsController',
                'GetMarathonPupils',
                'Marathons',
                { MarathonId: marathonId, Skip: pupils.length, Take: pageSize }
            );
            const items = response.Value?.Items;
            const nextTotal = response.Value?.Page?.Count;

            if (
                !Array.isArray(items)
                || typeof nextTotal !== 'number'
                || !Number.isInteger(nextTotal)
                || nextTotal < 0
            ) {
                throw new Error('GetMarathonPupils returned an invalid response.');
            }
            if (items.length === 0 && pupils.length < nextTotal) {
                throw new Error('GetMarathonPupils pagination stopped before all pupils were loaded.');
            }

            pupils = pupils.concat(items);
            total = nextTotal;
            return snapshot();
        }

        return {
            loadNext() {
                if (inFlight) return inFlight;
                inFlight = requestNextPage().finally(() => {
                    inFlight = null;
                });
                return inFlight;
            },
            getSnapshot: snapshot
        };
    }

    async function discoverResetWork({
        sendRequest,
        wait,
        marathonId,
        pupilId,
        lessons,
        onDiscovery = () => {}
    }) {
        const work = [];

        for (const lesson of lessons) {
            console.log(
                `[Edvibe Toolbox][Reset] Discovering lesson ${lesson.MarathonLessonId} `
                + `(LessonId: ${lesson.LessonId}).`
            );
            onDiscovery(`Loading sections for "${lesson.Name}"...`);
            const lessonResponse = await sendRequest(
                'LessonWsController',
                'GetLessonWithId',
                'Books',
                { LessonId: lesson.LessonId }
            );
            const sections = collectLessonSections(lessonResponse.Value);
            const exercises = [];
            console.log(
                `[Edvibe Toolbox][Reset] Lesson ${lesson.MarathonLessonId}: `
                + `${sections.length} section(s) found.`
            );

            for (const section of sections) {
                await wait(300);
                const exercisesResponse = await sendRequest(
                    'GetExerciseWsController',
                    'LoadExercises',
                    'Exercises',
                    buildLoadExercisesPayload({
                        marathonId,
                        pupilId,
                        marathonLessonId: lesson.MarathonLessonId,
                        sectionId: section.Id
                    })
                );
                const items = exercisesResponse.Value?.Items;
                if (!Array.isArray(items)) {
                    throw new Error(`LoadExercises returned invalid data for "${lesson.Name}".`);
                }
                exercises.push(...items
                    .filter((item) => Number.isFinite(item.Id))
                    .map((item) => ({
                        id: item.Id,
                        type: item.Type,
                        sectionId: section.Id
                    })));
                console.log(
                    `[Edvibe Toolbox][Reset] Lesson ${lesson.MarathonLessonId}, `
                    + `section ${section.Id}: ${items.length} exercise(s) found.`
                );
            }

            work.push({
                lesson,
                exercises,
                deleteRequestId: shouldDeleteLastRequest(lesson)
                    ? lesson.LastRequest.Id
                    : null
            });
            console.log(
                `[Edvibe Toolbox][Reset] Lesson ${lesson.MarathonLessonId}: `
                + `${exercises.length} exercise reset(s), `
                + `${shouldDeleteLastRequest(lesson) ? 'request deletion required' : 'no request deletion'}.`
            );
        }

        return work;
    }

    async function executeResetWork({
        sendRequest,
        sendWithoutResponse,
        wait,
        marathonId,
        pupilId,
        work,
        onProgress
    }) {
        const total = work.reduce((sum, item) => sum + item.exercises.length, 0);
        let completed = 0;
        console.log(
            `[Edvibe Toolbox][Reset] Starting ${total} operation(s) for PupilId ${pupilId} `
            + `across ${work.length} lesson(s).`
        );

        for (const item of work) {
            for (const exercise of item.exercises) {
                try {
                    console.log(
                        `[Edvibe Toolbox][Reset] Resetting exercise ${exercise.id} `
                        + `for lesson ${item.lesson.MarathonLessonId} (${completed + 1}/${total}).`
                    );
                    await wait(300);
                    await sendRequest(
                        'ExerciseAnswerSaveVersion1WsController',
                        'SaveAnswer',
                        'ExerciseAnswer',
                        buildResetAnswerPayload({
                            marathonId,
                            pupilId,
                            lessonId: item.lesson.LessonId,
                            exercise
                        })
                    );
                    const response = await sendRequest(
                        'MarathonStatisticService',
                        'DropMarathonExerciseStatistic',
                        'Statistic',
                        {
                            MarathondId: marathonId,
                            PupilId: pupilId,
                            ExerciseId: exercise.id
                        }
                    );
                    if (response.Value !== true) {
                        throw new Error('server did not confirm the reset');
                    }
                } catch (error) {
                    throw new Error(
                        `Failed in "${item.lesson.Name}", exercise ${exercise.id}: ${error.message}`
                    );
                }

                completed += 1;
                onProgress({ completed, total, lesson: item.lesson, exerciseId: exercise.id });
            }

            // Disabled for now: the consequences of removing a user's lesson request are unclear.
            /*
            if (item.deleteRequestId) {
                console.log(
                    `[Edvibe Toolbox][Reset] Deleting lesson request ${item.deleteRequestId} `
                    + `for lesson ${item.lesson.MarathonLessonId} (${completed + 1}/${total}).`
                );
                sendWithoutResponse(
                    'MarathonLessonWsController',
                    'DeleteMarathonLessonRequestPupil',
                    'Marathons',
                    { RequestId: item.deleteRequestId }
                );
                completed += 1;
                onProgress({ completed, total, lesson: item.lesson, exerciseId: null });
            }
            */
        }

        console.log(
            `[Edvibe Toolbox][Reset] Completed all ${total} operation(s) for PupilId ${pupilId}.`
        );
    }

    const RESET_OVERLAY_ID = 'edvibe-toolbox-reset-overlay';
    const RESET_STYLE_ID = 'edvibe-toolbox-reset-styles';

    function getResetRunningStyles() {
        return `
            #${RESET_OVERLAY_ID}.is-running .edvibe-reset-body {
                display: none;
            }
        `;
    }

    function setResetRunningState(overlay, isRunning) {
        overlay.classList.toggle('is-running', isRunning);
    }

    function getErrorType(error) {
        return typeof error?.name === 'string' ? error.name : 'Error';
    }

    function getResetWizardViewState({
        step,
        hasSelectedPupil,
        selectedLessonCount,
        loading,
        locked,
        finished
    }) {
        const blocked = loading || locked || finished;
        const showingUsers = step === 'user';

        return {
            userStepHidden: !showingUsers,
            lessonStepHidden: showingUsers,
            nextHidden: !showingUsers,
            nextDisabled: blocked || !hasSelectedPupil,
            backHidden: showingUsers,
            backDisabled: blocked,
            submitHidden: showingUsers,
            submitDisabled: blocked || !hasSelectedPupil || selectedLessonCount === 0,
            closeDisabled: loading || locked
        };
    }

    function hasLoadedLessonsForPupil(pupil, loadedPupilId) {
        return Boolean(pupil) && pupil.PupilId === loadedPupilId;
    }

    function getResetPupilSelectionState({
        pupil,
        loadedPupilId,
        lessons,
        selectedLessonIds
    }) {
        if (hasLoadedLessonsForPupil(pupil, loadedPupilId)) {
            return {
                selectedPupil: pupil,
                loadedPupilId,
                lessons,
                selectedLessonIds
            };
        }

        return {
            selectedPupil: pupil,
            loadedPupilId: null,
            lessons: [],
            selectedLessonIds: new Set()
        };
    }

    function ensureResetStyles() {
        if (document.getElementById(RESET_STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = RESET_STYLE_ID;
        style.textContent = `
            #${RESET_OVERLAY_ID} {
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                background: rgba(15, 23, 42, 0.6);
                box-sizing: border-box;
                font-family: "Segoe UI", Arial, sans-serif;
            }

            #${RESET_OVERLAY_ID} * {
                box-sizing: border-box;
            }

            #${RESET_OVERLAY_ID} [hidden] {
                display: none !important;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-card {
                display: flex;
                flex-direction: column;
                width: min(760px, calc(100vw - 32px));
                max-height: min(820px, calc(100vh - 32px));
                padding: 24px;
                border-radius: 16px;
                background: #ffffff;
                box-shadow: 0 24px 80px rgba(15, 23, 42, 0.38);
                color: #1f2937;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 16px;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-title {
                margin: 0;
                color: #111827;
                font-size: 21px;
                line-height: 1.3;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-subtitle {
                margin: 5px 0 0;
                color: #6b7280;
                font-size: 13px;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-step-indicator {
                margin-right: 8px;
                color: #2563eb;
                font-weight: 700;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-close {
                border: 0;
                padding: 4px 8px;
                background: transparent;
                color: #6b7280;
                font-size: 24px;
                line-height: 1;
                cursor: pointer;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-body {
                flex: 1 1 auto;
                overflow: auto;
                min-height: 0;
                margin-top: 18px;
            }

            ${getResetRunningStyles()}

            #${RESET_OVERLAY_ID} .edvibe-reset-label {
                display: block;
                margin-bottom: 7px;
                color: #374151;
                font-size: 13px;
                font-weight: 650;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-search {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                outline: none;
                font: inherit;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-search:focus {
                border-color: #3498db;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-list {
                overflow: auto;
                max-height: 250px;
                margin-top: 10px;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-pupils-shell {
                position: relative;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-pupils-shell.is-loading .edvibe-reset-pupils {
                opacity: 0.45;
                pointer-events: none;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-pupils-loading {
                position: absolute;
                inset: 10px 0 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.48);
                color: #374151;
                font-size: 13px;
                font-weight: 650;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-spinner {
                width: 22px;
                height: 22px;
                border: 3px solid #bfdbfe;
                border-top-color: #2563eb;
                border-radius: 50%;
                animation: edvibe-reset-spinner-rotate 0.8s linear infinite;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-row {
                display: flex;
                width: 100%;
                align-items: center;
                gap: 10px;
                padding: 11px 12px;
                border: 0;
                border-bottom: 1px solid #f1f5f9;
                background: #ffffff;
                color: #1f2937;
                text-align: left;
                cursor: pointer;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-row:last-child {
                border-bottom: 0;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-row:hover,
            #${RESET_OVERLAY_ID} .edvibe-reset-row.is-selected {
                background: #eff6ff;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-row-copy {
                min-width: 0;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-row-name,
            #${RESET_OVERLAY_ID} .edvibe-reset-row-email {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-row-name {
                font-size: 14px;
                font-weight: 650;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-row-email {
                margin-top: 2px;
                color: #6b7280;
                font-size: 12px;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-select-all {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                font-size: 13px;
                font-weight: 650;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-lesson {
                align-items: flex-start;
                cursor: default;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-lesson input {
                margin-top: 3px;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-empty {
                margin: 0;
                padding: 22px;
                color: #6b7280;
                text-align: center;
                font-size: 13px;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-status {
                min-height: 38px;
                margin: 0;
                color: #4b5563;
                font-size: 13px;
                line-height: 1.4;
                white-space: pre-line;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-live-region {
                flex: 0 0 auto;
                padding-top: 16px;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-status.is-error {
                color: #b91c1c;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-status.is-success {
                color: #15803d;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-progress {
                display: none;
                overflow: hidden;
                height: 11px;
                margin-top: 10px;
                border-radius: 999px;
                background: #e5e7eb;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-progress.is-visible {
                display: block;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-progress-bar {
                width: 0%;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(90deg, #e74c3c, #f59e0b);
                transition: width 0.2s ease;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-progress.is-indeterminate .edvibe-reset-progress-bar {
                width: 38%;
                animation: edvibe-reset-progress-slide 1.1s ease-in-out infinite;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 18px;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-button {
                padding: 10px 16px;
                border: 0;
                border-radius: 8px;
                color: #ffffff;
                font-size: 13px;
                font-weight: 650;
                cursor: pointer;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-button:disabled,
            #${RESET_OVERLAY_ID} button:disabled,
            #${RESET_OVERLAY_ID} input:disabled {
                cursor: not-allowed;
                opacity: 0.58;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-cancel {
                background: #64748b;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-back {
                background: #64748b;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-next {
                background: #2563eb;
            }

            #${RESET_OVERLAY_ID} .edvibe-reset-submit {
                background: #e74c3c;
            }

            @keyframes edvibe-reset-progress-slide {
                0% { transform: translateX(-120%); }
                50% { transform: translateX(90%); }
                100% { transform: translateX(270%); }
            }

            @keyframes edvibe-reset-spinner-rotate {
                to { transform: rotate(360deg); }
            }

            @media (prefers-reduced-motion: reduce) {
                #${RESET_OVERLAY_ID} .edvibe-reset-spinner {
                    animation: none;
                }
            }
        `;

        (document.head || document.documentElement).appendChild(style);
    }

    function getResetModalMarkup() {
        return `
            <div class="edvibe-reset-card">
                <div class="edvibe-reset-header">
                    <div>
                        <h2 id="edvibe-reset-title" class="edvibe-reset-title">Сброс уроков</h2>
                        <p class="edvibe-reset-subtitle">
                            <span class="edvibe-reset-step-indicator">Шаг 1 из 2</span>
                            <span class="edvibe-reset-step-description">Выберите пользователя.</span>
                        </p>
                    </div>
                    <button class="edvibe-reset-close" type="button" aria-label="Закрыть">&times;</button>
                </div>
                <div class="edvibe-reset-body">
                    <section class="edvibe-reset-user-step" aria-label="Выбор пользователя">
                        <label class="edvibe-reset-label" for="edvibe-reset-search">Поиск по email</label>
                        <input id="edvibe-reset-search" class="edvibe-reset-search" type="search"
                            placeholder="user@example.com" autocomplete="off">
                        <div class="edvibe-reset-pupils-shell">
                            <div class="edvibe-reset-list edvibe-reset-pupils" role="listbox"
                                aria-label="Пользователи марафона"></div>
                            <div class="edvibe-reset-pupils-loading" role="status"
                                aria-live="polite" hidden>
                                <span class="edvibe-reset-spinner" aria-hidden="true"></span>
                                <span>Загрузка пользователей...</span>
                            </div>
                        </div>
                    </section>
                    <section class="edvibe-reset-lesson-step" aria-label="Выбор уроков" hidden>
                        <div class="edvibe-reset-label edvibe-reset-selected-pupil"></div>
                        <label class="edvibe-reset-select-all">
                            <input class="edvibe-reset-select-all-input" type="checkbox">
                            Выбрать все уроки
                        </label>
                        <div class="edvibe-reset-list edvibe-reset-lessons"
                            aria-label="Уроки пользователя" tabindex="-1"></div>
                    </section>
                </div>
                <div class="edvibe-reset-live-region">
                    <p class="edvibe-reset-status" aria-live="polite"></p>
                    <div class="edvibe-reset-progress" role="progressbar"
                        aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                        <div class="edvibe-reset-progress-bar"></div>
                    </div>
                </div>
                <div class="edvibe-reset-footer">
                    <button class="edvibe-reset-button edvibe-reset-cancel" type="button">Закрыть</button>
                    <button class="edvibe-reset-button edvibe-reset-back" type="button" hidden>
                        Назад
                    </button>
                    <button class="edvibe-reset-button edvibe-reset-next" type="button" disabled>
                        Далее
                    </button>
                    <button class="edvibe-reset-button edvibe-reset-submit" type="button" disabled hidden>
                        Сбросить прогресс
                    </button>
                </div>
            </div>
        `;
    }

    function createResetModal({
        onClose,
        schedule = setTimeout,
        cancelScheduled = clearTimeout,
        searchDelay = 1000
    }) {
        ensureResetStyles();

        const overlay = document.createElement('div');
        overlay.id = RESET_OVERLAY_ID;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'edvibe-reset-title');
        overlay.innerHTML = getResetModalMarkup();

        const search = overlay.querySelector('.edvibe-reset-search');
        const userStep = overlay.querySelector('.edvibe-reset-user-step');
        const lessonStep = overlay.querySelector('.edvibe-reset-lesson-step');
        const stepIndicator = overlay.querySelector('.edvibe-reset-step-indicator');
        const stepDescription = overlay.querySelector('.edvibe-reset-step-description');
        const pupilsShell = overlay.querySelector('.edvibe-reset-pupils-shell');
        const pupilsList = overlay.querySelector('.edvibe-reset-pupils');
        const pupilsLoading = overlay.querySelector('.edvibe-reset-pupils-loading');
        const lessonsList = overlay.querySelector('.edvibe-reset-lessons');
        const selectedPupilLabel = overlay.querySelector('.edvibe-reset-selected-pupil');
        const selectAll = overlay.querySelector('.edvibe-reset-select-all-input');
        const status = overlay.querySelector('.edvibe-reset-status');
        const progress = overlay.querySelector('.edvibe-reset-progress');
        const progressBar = overlay.querySelector('.edvibe-reset-progress-bar');
        const closeButtons = [
            overlay.querySelector('.edvibe-reset-close'),
            overlay.querySelector('.edvibe-reset-cancel')
        ];
        const back = overlay.querySelector('.edvibe-reset-back');
        const next = overlay.querySelector('.edvibe-reset-next');
        const submit = overlay.querySelector('.edvibe-reset-submit');

        let currentStep = 'user';
        let allPupils = [];
        let selectedPupil = null;
        let loadedPupilId = null;
        let lessons = [];
        let selectedLessonIds = new Set();
        let selectPupilHandler = null;
        let resetHandler = null;
        let locked = false;
        let loading = false;
        let finished = false;
        let closed = false;
        let pupilTotal = 0;
        let loadNextPupilsHandler = null;
        let pupilPagePromise = null;
        let pupilPageLoading = false;
        let searchTimer = null;
        let searchGeneration = 0;
        let appliedSearchQuery = '';
        let searchDebouncing = false;
        let suppressPupilPageLoading = false;

        function setStatus(message, state = '') {
            status.textContent = message;
            status.classList.toggle('is-error', state === 'error');
            status.classList.toggle('is-success', state === 'success');
        }

        function normalizeSearchQuery(value) {
            return String(value || '').trim().toLowerCase();
        }

        function hasMorePupils() {
            return allPupils.length < pupilTotal;
        }

        function isPupilLoadingVisible() {
            return loading || (pupilPageLoading && !suppressPupilPageLoading);
        }

        function updatePupilLoadingState() {
            const busy = isPupilLoadingVisible();
            pupilsShell.classList.toggle('is-loading', busy);
            pupilsLoading.hidden = !busy;
            pupilsList.setAttribute('aria-busy', String(busy));
            pupilsList.inert = busy;
            pupilsList.querySelectorAll('button').forEach((button) => {
                button.disabled = busy || locked || finished;
            });
        }

        async function loadNextPupilPage() {
            if (closed || !loadNextPupilsHandler || !hasMorePupils()) return false;
            if (pupilPagePromise) return pupilPagePromise;

            suppressPupilPageLoading = false;
            pupilPageLoading = true;
            updatePupilLoadingState();
            pupilPagePromise = (async () => {
                try {
                    const page = await loadNextPupilsHandler();
                    if (closed) return false;
                    allPupils = page.pupils;
                    pupilTotal = page.total;
                    renderPupils();
                    if (currentStep === 'user' && !loading) {
                        setStatus(
                            `Загружено пользователей: ${allPupils.length} из ${pupilTotal}`
                        );
                    }
                    return true;
                } catch (error) {
                    if (!closed && currentStep === 'user' && !loading) {
                        console.error(
                            `[Edvibe Toolbox][Reset] Failed to load another pupil page `
                            + `(${getErrorType(error)}).`
                        );
                        setStatus(error.message, 'error');
                    }
                    return false;
                } finally {
                    pupilPagePromise = null;
                    pupilPageLoading = false;
                    if (!searchDebouncing) {
                        suppressPupilPageLoading = false;
                    }
                    updatePupilLoadingState();
                }
            })();

            return pupilPagePromise;
        }

        async function continueSearch(generation, query) {
            while (
                !closed
                && generation === searchGeneration
                && query === normalizeSearchQuery(search.value)
                && filterPupilsByEmail(allPupils, query).length === 0
                && hasMorePupils()
            ) {
                const loaded = await loadNextPupilPage();
                if (!loaded) return false;
            }
            return true;
        }

        function handleSearchInput() {
            searchGeneration += 1;
            if (searchTimer !== null) {
                cancelScheduled(searchTimer);
                searchTimer = null;
            }

            searchDebouncing = true;
            suppressPupilPageLoading = true;
            updatePupilLoadingState();
            const query = normalizeSearchQuery(search.value);
            const generation = searchGeneration;
            searchTimer = schedule(async () => {
                if (
                    closed
                    || generation !== searchGeneration
                    || query !== normalizeSearchQuery(search.value)
                ) {
                    return;
                }

                searchTimer = null;
                const needsRemotePupils = Boolean(
                    query
                    && filterPupilsByEmail(allPupils, query).length === 0
                    && hasMorePupils()
                );
                searchDebouncing = false;
                if (needsRemotePupils || !pupilPageLoading) {
                    suppressPupilPageLoading = false;
                }
                updatePupilLoadingState();
                if (needsRemotePupils) {
                    const searchCompleted = await continueSearch(generation, query);
                    if (!searchCompleted) return;
                }

                if (
                    closed
                    || generation !== searchGeneration
                    || query !== normalizeSearchQuery(search.value)
                ) {
                    return;
                }

                appliedSearchQuery = query;
                renderPupils();
            }, searchDelay);
        }

        function updateInteractiveState() {
            const view = getResetWizardViewState({
                step: currentStep,
                hasSelectedPupil: Boolean(selectedPupil),
                selectedLessonCount: selectedLessonIds.size,
                loading,
                locked,
                finished
            });
            const inputsBlocked = locked || loading || finished;

            userStep.hidden = view.userStepHidden;
            lessonStep.hidden = view.lessonStepHidden;
            next.hidden = view.nextHidden;
            next.disabled = view.nextDisabled;
            back.hidden = view.backHidden;
            back.disabled = view.backDisabled;
            submit.hidden = view.submitHidden;
            submit.disabled = view.submitDisabled;
            search.disabled = inputsBlocked;
            closeButtons.forEach((button) => {
                button.disabled = view.closeDisabled;
            });
            pupilsList.querySelectorAll('button').forEach((button) => {
                button.disabled = inputsBlocked;
            });
            lessonsList.querySelectorAll('input').forEach((input) => {
                input.disabled = inputsBlocked;
            });
            selectAll.disabled = inputsBlocked || lessons.length === 0;

            const showingUsers = currentStep === 'user';
            stepIndicator.textContent = showingUsers ? 'Шаг 1 из 2' : 'Шаг 2 из 2';
            stepDescription.textContent = showingUsers
                ? 'Выберите пользователя.'
                : 'Выберите уроки для сброса прогресса.';
            updatePupilLoadingState();
        }

        function close() {
            if (locked || loading || closed) return;
            closed = true;
            searchGeneration += 1;
            if (searchTimer !== null) {
                cancelScheduled(searchTimer);
                searchTimer = null;
            }
            document.removeEventListener('keydown', handleKeydown);
            overlay.remove();
            onClose();
        }

        function handleKeydown(event) {
            if (event.key === 'Escape') close();
        }

        function renderPupils() {
            pupilsList.replaceChildren();
            const visiblePupils = filterPupilsByEmail(allPupils, appliedSearchQuery);

            if (visiblePupils.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'edvibe-reset-empty';
                empty.textContent = 'Пользователи не найдены.';
                pupilsList.appendChild(empty);
                return;
            }

            for (const pupil of visiblePupils) {
                const row = document.createElement('button');
                row.type = 'button';
                row.className = 'edvibe-reset-row';
                row.setAttribute('role', 'option');
                row.setAttribute('aria-selected', String(pupil.PupilId === selectedPupil?.PupilId));
                row.classList.toggle('is-selected', pupil.PupilId === selectedPupil?.PupilId);
                row.disabled = locked || finished || isPupilLoadingVisible();

                const copy = document.createElement('span');
                copy.className = 'edvibe-reset-row-copy';
                const name = document.createElement('span');
                name.className = 'edvibe-reset-row-name';
                name.textContent = pupil.Name || 'Без имени';
                const email = document.createElement('span');
                email.className = 'edvibe-reset-row-email';
                email.textContent = pupil.Email || 'Email отсутствует';
                copy.append(name, email);
                row.appendChild(copy);

                row.addEventListener('click', () => {
                    if (
                        locked
                        || finished
                        || isPupilLoadingVisible()
                        || pupil.PupilId === selectedPupil?.PupilId
                    ) return;

                    const selection = getResetPupilSelectionState({
                        pupil,
                        loadedPupilId,
                        lessons,
                        selectedLessonIds
                    });
                    selectedPupil = selection.selectedPupil;
                    loadedPupilId = selection.loadedPupilId;
                    lessons = selection.lessons;
                    selectedLessonIds = selection.selectedLessonIds;
                    if (loadedPupilId === null) {
                        renderLessons();
                    }
                    setStatus(`Выбран пользователь: ${pupil.Email || 'email отсутствует'}`);
                    renderPupils();
                    updateInteractiveState();
                });
                pupilsList.appendChild(row);
            }
        }

        function renderLessons() {
            lessonsList.replaceChildren();

            if (lessons.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'edvibe-reset-empty';
                empty.textContent = 'Для пользователя нет уроков.';
                lessonsList.appendChild(empty);
            }

            for (const lesson of lessons) {
                const label = document.createElement('label');
                label.className = 'edvibe-reset-row edvibe-reset-lesson';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = String(lesson.MarathonLessonId);
                checkbox.checked = selectedLessonIds.has(lesson.MarathonLessonId);
                checkbox.disabled = locked || loading || finished;

                const copy = document.createElement('span');
                copy.className = 'edvibe-reset-row-copy';
                const name = document.createElement('span');
                name.className = 'edvibe-reset-row-name';
                name.textContent = `${Number(lesson.Number) + 1}. ${lesson.Name}`;
                const requestStatus = document.createElement('span');
                requestStatus.className = 'edvibe-reset-row-email';
                requestStatus.textContent = lesson.LastRequest
                    ? `Статус последнего запроса: ${lesson.LastRequest.Status}`
                    : 'Нет запросов на проверку';
                copy.append(name, requestStatus);
                label.append(checkbox, copy);

                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        selectedLessonIds.add(lesson.MarathonLessonId);
                    } else {
                        selectedLessonIds.delete(lesson.MarathonLessonId);
                    }
                    selectAll.checked = lessons.length > 0
                        && selectedLessonIds.size === lessons.length;
                    selectAll.indeterminate = selectedLessonIds.size > 0
                        && selectedLessonIds.size < lessons.length;
                    updateInteractiveState();
                });
                lessonsList.appendChild(label);
            }

            selectAll.checked = lessons.length > 0 && selectedLessonIds.size === lessons.length;
            selectAll.indeterminate = selectedLessonIds.size > 0
                && selectedLessonIds.size < lessons.length;
            selectAll.disabled = locked || loading || finished || lessons.length === 0;
            updateInteractiveState();
        }

        search.addEventListener('input', handleSearchInput);
        pupilsList.addEventListener('scroll', () => {
            if (searchDebouncing) return;
            const distanceFromBottom = pupilsList.scrollHeight
                - pupilsList.scrollTop
                - pupilsList.clientHeight;
            if (distanceFromBottom <= 24) {
                return loadNextPupilPage();
            }
        });
        selectAll.addEventListener('change', () => {
            selectedLessonIds = selectAll.checked
                ? new Set(lessons.map((lesson) => lesson.MarathonLessonId))
                : new Set();
            renderLessons();
        });
        next.addEventListener('click', async () => {
            if (next.disabled || !selectPupilHandler || !selectedPupil) return;

            if (hasLoadedLessonsForPupil(selectedPupil, loadedPupilId)) {
                currentStep = 'lessons';
                updateInteractiveState();
                lessonsList.focus();
                return;
            }

            try {
                await selectPupilHandler(selectedPupil);
            } catch (error) {
                loading = false;
                currentStep = 'user';
                updateInteractiveState();
                console.error(
                    `[Edvibe Toolbox][Reset] Failed to load lessons for PupilId `
                    + `${selectedPupil.PupilId} (${getErrorType(error)}).`
                );
                setStatus(error.message, 'error');
            }
        });
        back.addEventListener('click', () => {
            if (back.disabled) return;
            currentStep = 'user';
            setStatus(`Выбран пользователь: ${selectedPupil?.Email || 'email отсутствует'}`);
            updateInteractiveState();
            search.focus();
        });
        submit.addEventListener('click', () => {
            if (submit.disabled || !resetHandler) return;
            resetHandler({
                pupil: selectedPupil,
                lessons: lessons.filter((lesson) =>
                    selectedLessonIds.has(lesson.MarathonLessonId)
                )
            });
        });
        closeButtons.forEach((button) => button.addEventListener('click', close));
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) close();
        });
        document.addEventListener('keydown', handleKeydown);

        return {
            overlay,
            setLoading(message) {
                loading = true;
                setStatus(message);
                updateInteractiveState();
            },
            showPupils({ pupils, total, onSelectPupil, onLoadNext }) {
                allPupils = pupils;
                pupilTotal = total;
                selectPupilHandler = onSelectPupil;
                loadNextPupilsHandler = onLoadNext;
                currentStep = 'user';
                loading = false;
                setStatus(`Загружено пользователей: ${pupils.length} из ${total}`);
                renderPupils();
                updateInteractiveState();
                search.focus();
            },
            showLessons(pupil, loadedLessons) {
                const pupilChanged = loadedPupilId !== pupil.PupilId;
                selectedPupil = pupil;
                loadedPupilId = pupil.PupilId;
                lessons = loadedLessons;
                if (pupilChanged) {
                    selectedLessonIds = new Set();
                }
                loading = false;
                currentStep = 'lessons';
                selectedPupilLabel.textContent = `${pupil.Name || 'Без имени'} — ${pupil.Email || ''}`;
                setStatus(`Загружено уроков: ${lessons.length}`);
                renderLessons();
                updateInteractiveState();
                lessonsList.focus();
            },
            onReset(handler) {
                resetHandler = handler;
            },
            lock() {
                locked = true;
                setResetRunningState(overlay, true);
                renderLessons();
                updateInteractiveState();
            },
            unlockAfterRun() {
                locked = false;
                finished = true;
                updateInteractiveState();
            },
            showDiscovery(message) {
                setStatus(message);
                progress.classList.add('is-visible', 'is-indeterminate');
                progress.removeAttribute('aria-valuenow');
                progressBar.style.width = '';
            },
            showProgress({ completed, total, lesson, exerciseId }) {
                const percent = total > 0 ? Math.round((completed / total) * 100) : 100;
                const detail = exerciseId
                    ? `Упражнение ${exerciseId}`
                    : 'Удаление запроса урока';
                setStatus(`${lesson.Name}\n${detail} — ${completed} / ${total}`);
                progress.classList.add('is-visible');
                progress.classList.remove('is-indeterminate');
                progress.setAttribute('aria-valuenow', String(percent));
                progressBar.style.width = `${percent}%`;
            },
            showComplete(message) {
                setStatus(message, 'success');
                progress.classList.add('is-visible');
                progress.classList.remove('is-indeterminate');
                progress.setAttribute('aria-valuenow', '100');
                progressBar.style.width = '100%';
            },
            showError(message) {
                if (!locked) {
                    loading = false;
                    updateInteractiveState();
                }
                setStatus(message, 'error');
                progress.classList.remove('is-indeterminate');
            }
        };
    }

    function createResetLessonsFeature({
        sendRequest,
        sendWithoutResponse,
        wait,
        canStart,
        onActiveChange,
        createModal = createResetModal
    }) {
        let running = false;
        let active = false;

        function releaseOperation() {
            if (!active) return;
            active = false;
            onActiveChange(false);
        }

        async function open() {
            if (document.getElementById(RESET_OVERLAY_ID)) return;
            if (!canStart()) {
                window.alert('Another Edvibe Toolbox operation is already running.');
                return;
            }

            const marathonId = parseMarathonId(window.location.href);
            if (!marathonId) {
                window.alert('Open an Edvibe marathon page before resetting lessons.');
                return;
            }

            active = true;
            onActiveChange(true);

            const modal = createModal({ onClose: releaseOperation });
            (document.body || document.documentElement).appendChild(modal.overlay);
            modal.onReset(async ({ pupil, lessons }) => {
                const confirmed = window.confirm(
                    `Reset ${lessons.length} lesson(s) for ${pupil.Email}?`
                );
                if (!confirmed) return;

                running = true;
                modal.lock();

                try {
                    modal.showDiscovery('Discovering exercises...');
                    const work = await discoverResetWork({
                        sendRequest,
                        wait,
                        marathonId,
                        pupilId: pupil.PupilId,
                        lessons,
                        onDiscovery: modal.showDiscovery
                    });
                    await executeResetWork({
                        sendRequest,
                        sendWithoutResponse,
                        wait,
                        marathonId,
                        pupilId: pupil.PupilId,
                        work,
                        onProgress: modal.showProgress
                    });
                    modal.showComplete('Selected lesson progress was reset successfully.');
                } catch (error) {
                    const lessonIds = lessons.map((lesson) => lesson.MarathonLessonId).join(', ');
                    console.error(
                        `[Edvibe Toolbox][Reset] Reset stopped for PupilId ${pupil.PupilId}; `
                        + `MarathonLessonIds: ${lessonIds} (${getErrorType(error)}).`
                    );
                    modal.showError(error.message);
                } finally {
                    running = false;
                    releaseOperation();
                    modal.unlockAfterRun();
                }
            });

            try {
                modal.setLoading('Loading marathon pupils...');
                const pupilPager = createPupilPager(sendRequest, marathonId);
                const initialPage = await pupilPager.loadNext();
                console.log(
                    `[Edvibe Toolbox][Reset] Loaded ${initialPage.pupils.length} of `
                    + `${initialPage.total} pupil(s) for MarathonId ${marathonId}.`
                );
                modal.showPupils({
                    pupils: initialPage.pupils,
                    total: initialPage.total,
                    onLoadNext: () => pupilPager.loadNext(),
                    onSelectPupil: async (pupil) => {
                        console.log(
                            `[Edvibe Toolbox][Reset] Loading lessons for PupilId `
                            + `${pupil.PupilId}.`
                        );
                        modal.setLoading(`Loading lessons for ${pupil.Email}...`);
                        const response = await sendRequest(
                            'MarathonLessonWsController',
                            'GetMarathonLessonsForPupil',
                            'Marathons',
                            {
                                PupilId: pupil.PupilId,
                                MarathonId: marathonId,
                                SearchTerm: '',
                                Domain: 'edvibe.com'
                            }
                        );
                        if (!Array.isArray(response.Value)) {
                            throw new Error(
                                'GetMarathonLessonsForPupil returned invalid data.'
                            );
                        }
                        console.log(
                            `[Edvibe Toolbox][Reset] Loaded ${response.Value.length} `
                            + `lesson(s) for PupilId ${pupil.PupilId}.`
                        );
                        modal.showLessons(pupil, response.Value);
                    }
                });
            } catch (error) {
                console.error(
                    `[Edvibe Toolbox][Reset] Failed to initialize reset workflow `
                    + `for MarathonId ${marathonId} (${getErrorType(error)}).`
                );
                modal.showError(error.message);
            }
        }

        return { open, isRunning: () => running };
    }

    return {
        parseMarathonId,
        filterPupilsByEmail,
        collectLessonSections,
        shouldDeleteLastRequest,
        buildLoadExercisesPayload,
        buildResetAnswerPayload,
        createPupilPager,
        discoverResetWork,
        executeResetWork,
        createResetModal,
        createResetLessonsFeature,
        getResetModalMarkup,
        getResetRunningStyles,
        getResetPupilSelectionState,
        getResetWizardViewState,
        hasLoadedLessonsForPupil,
        setResetRunningState,
        getErrorType
    };
});
