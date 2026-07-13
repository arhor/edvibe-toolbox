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

    async function loadAllPupils(sendRequest, marathonId, pageSize = 100) {
        const pupils = [];
        let total = Infinity;

        while (pupils.length < total) {
            const response = await sendRequest(
                'MarathonPupilsWsController',
                'GetMarathonPupils',
                'Marathons',
                { MarathonId: marathonId, Skip: pupils.length, Take: pageSize }
            );
            const items = response.Value?.Items;
            total = Number(response.Value?.Page?.Count);

            if (!Array.isArray(items) || !Number.isFinite(total)) {
                throw new Error('GetMarathonPupils returned an invalid response.');
            }

            pupils.push(...items);
            if (items.length === 0 && pupils.length < total) {
                throw new Error('GetMarathonPupils pagination stopped before all pupils were loaded.');
            }
        }

        return pupils;
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

            #${RESET_OVERLAY_ID} .edvibe-reset-section {
                margin-top: 18px;
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

            #${RESET_OVERLAY_ID} .edvibe-reset-submit {
                background: #e74c3c;
            }

            @keyframes edvibe-reset-progress-slide {
                0% { transform: translateX(-120%); }
                50% { transform: translateX(90%); }
                100% { transform: translateX(270%); }
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
                        <p class="edvibe-reset-subtitle">Выберите пользователя и уроки для сброса прогресса.</p>
                    </div>
                    <button class="edvibe-reset-close" type="button" aria-label="Закрыть">&times;</button>
                </div>
                <div class="edvibe-reset-body">
                    <label class="edvibe-reset-label" for="edvibe-reset-search">Поиск по email</label>
                    <input id="edvibe-reset-search" class="edvibe-reset-search" type="search"
                        placeholder="user@example.com" autocomplete="off">
                    <div class="edvibe-reset-list edvibe-reset-pupils" role="listbox"
                        aria-label="Пользователи марафона"></div>
                    <section class="edvibe-reset-section" hidden>
                        <div class="edvibe-reset-label edvibe-reset-selected-pupil"></div>
                        <label class="edvibe-reset-select-all">
                            <input class="edvibe-reset-select-all-input" type="checkbox">
                            Выбрать все уроки
                        </label>
                        <div class="edvibe-reset-list edvibe-reset-lessons"
                            aria-label="Уроки пользователя"></div>
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
                    <button class="edvibe-reset-button edvibe-reset-submit" type="button" disabled>
                        Сбросить прогресс
                    </button>
                </div>
            </div>
        `;
    }

    function createResetModal({ onClose }) {
        ensureResetStyles();

        const overlay = document.createElement('div');
        overlay.id = RESET_OVERLAY_ID;
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'edvibe-reset-title');
        overlay.innerHTML = getResetModalMarkup();

        const search = overlay.querySelector('.edvibe-reset-search');
        const pupilsList = overlay.querySelector('.edvibe-reset-pupils');
        const lessonsSection = overlay.querySelector('.edvibe-reset-section');
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
        const submit = overlay.querySelector('.edvibe-reset-submit');

        let allPupils = [];
        let selectedPupil = null;
        let lessons = [];
        let selectedLessonIds = new Set();
        let selectPupilHandler = null;
        let resetHandler = null;
        let locked = false;
        let loading = false;
        let finished = false;
        let closed = false;

        function setStatus(message, state = '') {
            status.textContent = message;
            status.classList.toggle('is-error', state === 'error');
            status.classList.toggle('is-success', state === 'success');
        }

        function updateSubmitState() {
            submit.disabled = locked || loading || finished
                || !selectedPupil || selectedLessonIds.size === 0;
        }

        function updateInteractiveState() {
            const inputsBlocked = locked || loading || finished;
            search.disabled = inputsBlocked;
            closeButtons.forEach((button) => {
                button.disabled = locked || loading;
            });
            pupilsList.querySelectorAll('button').forEach((button) => {
                button.disabled = inputsBlocked;
            });
            lessonsList.querySelectorAll('input').forEach((input) => {
                input.disabled = inputsBlocked;
            });
            selectAll.disabled = inputsBlocked || lessons.length === 0;
            updateSubmitState();
        }

        function close() {
            if (locked || loading || closed) return;
            closed = true;
            document.removeEventListener('keydown', handleKeydown);
            overlay.remove();
            onClose();
        }

        function handleKeydown(event) {
            if (event.key === 'Escape') close();
        }

        function renderPupils() {
            pupilsList.replaceChildren();
            const visiblePupils = filterPupilsByEmail(allPupils, search.value);

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
                row.disabled = locked || loading || finished;

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

                row.addEventListener('click', async () => {
                    if (locked || loading || finished || pupil.PupilId === selectedPupil?.PupilId) return;
                    selectedPupil = pupil;
                    lessons = [];
                    selectedLessonIds = new Set();
                    lessonsSection.hidden = true;
                    updateSubmitState();
                    renderPupils();

                    try {
                        await selectPupilHandler(pupil);
                    } catch (error) {
                        loading = false;
                        updateInteractiveState();
                        console.error(
                            `[Edvibe Toolbox][Reset] Failed to load lessons for PupilId `
                            + `${pupil.PupilId} (${getErrorType(error)}).`
                        );
                        setStatus(error.message, 'error');
                    }
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
                    updateSubmitState();
                });
                lessonsList.appendChild(label);
            }

            selectAll.checked = lessons.length > 0 && selectedLessonIds.size === lessons.length;
            selectAll.indeterminate = selectedLessonIds.size > 0
                && selectedLessonIds.size < lessons.length;
            selectAll.disabled = locked || loading || finished || lessons.length === 0;
            updateSubmitState();
        }

        search.addEventListener('input', renderPupils);
        selectAll.addEventListener('change', () => {
            selectedLessonIds = selectAll.checked
                ? new Set(lessons.map((lesson) => lesson.MarathonLessonId))
                : new Set();
            renderLessons();
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
            showPupils(pupils, onSelectPupil) {
                allPupils = pupils;
                selectPupilHandler = onSelectPupil;
                loading = false;
                setStatus(`Загружено пользователей: ${pupils.length}`);
                renderPupils();
                updateInteractiveState();
                search.focus();
            },
            showLessons(pupil, loadedLessons) {
                selectedPupil = pupil;
                lessons = loadedLessons;
                selectedLessonIds = new Set();
                loading = false;
                selectedPupilLabel.textContent = `${pupil.Name || 'Без имени'} — ${pupil.Email || ''}`;
                lessonsSection.hidden = false;
                setStatus(`Загружено уроков: ${lessons.length}`);
                renderLessons();
                updateInteractiveState();
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
        onActiveChange
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

            const modal = createResetModal({ onClose: releaseOperation });
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
                const pupils = await loadAllPupils(sendRequest, marathonId);
                console.log(
                    `[Edvibe Toolbox][Reset] Loaded ${pupils.length} pupil(s) for MarathonId ${marathonId}.`
                );
                modal.showPupils(pupils, async (pupil) => {
                    console.log(
                        `[Edvibe Toolbox][Reset] Loading lessons for PupilId ${pupil.PupilId}.`
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
                        throw new Error('GetMarathonLessonsForPupil returned invalid data.');
                    }
                    console.log(
                        `[Edvibe Toolbox][Reset] Loaded ${response.Value.length} lesson(s) `
                        + `for PupilId ${pupil.PupilId}.`
                    );
                    modal.showLessons(pupil, response.Value);
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
        loadAllPupils,
        discoverResetWork,
        executeResetWork,
        createResetLessonsFeature,
        getResetModalMarkup,
        getResetRunningStyles,
        setResetRunningState,
        getErrorType
    };
});
