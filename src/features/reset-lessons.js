const RESET_DIALOG_TAG = 'edvibe-toolbox-reset-dialog';
const RESET_OVERLAY_ID = 'edvibe-toolbox-reset-overlay';

function parseMarathonId(url) {
    const match = String(url || '').match(/marathon\/(\d+)/);
    return match ? Number(match[1]) : null;
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
        if (total !== null && pupils.length >= total) {
            return snapshot();
        }

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
            throw new Error(
                'GetMarathonPupils pagination stopped before all pupils were loaded.'
            );
        }

        pupils = pupils.concat(items);
        total = nextTotal;
        return snapshot();
    }

    return {
        loadNext() {
            if (inFlight) {
                return inFlight;
            }
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
    onDiscovery = () => {},
    log = () => {}
}) {
    const work = [];

    for (const lesson of lessons) {
        log(
            `Discovering lesson ${lesson.MarathonLessonId} `
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
        log(
            `Lesson ${lesson.MarathonLessonId}: `
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
                throw new Error(
                    `LoadExercises returned invalid data for "${lesson.Name}".`
                );
            }
            const resettableItems = items.filter((item) =>
                Number.isFinite(item.Id)
                && Array.isArray(item.AnswerVersion1)
                && item.AnswerVersion1.length > 0
            );
            exercises.push(...resettableItems.map((item) => ({
                id: item.Id,
                type: item.Type,
                sectionId: section.Id
            })));
            log(
                `Lesson ${lesson.MarathonLessonId}, section ${section.Id}: `
                + `${resettableItems.length} of ${items.length} `
                + 'exercise(s) have saved answers.'
            );
        }

        work.push({
            lesson,
            exercises,
            deleteRequestId: shouldDeleteLastRequest(lesson)
                ? lesson.LastRequest.Id
                : null
        });
        log(
            `Lesson ${lesson.MarathonLessonId}: ${exercises.length} exercise reset(s), `
            + `${shouldDeleteLastRequest(lesson)
                ? 'request deletion required'
                : 'no request deletion'}.`
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
    onProgress,
    log = () => {}
}) {
    const total = work.reduce((sum, item) => sum + item.exercises.length, 0);
    let completed = 0;
    log(
        `Starting ${total} operation(s) for PupilId ${pupilId} `
        + `across ${work.length} lesson(s).`
    );

    for (const item of work) {
        for (const exercise of item.exercises) {
            try {
                log(
                    `Resetting exercise ${exercise.id} `
                    + `for lesson ${item.lesson.MarathonLessonId} `
                    + `(${completed + 1}/${total}).`
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
                    `Failed in "${item.lesson.Name}", `
                    + `exercise ${exercise.id}: ${error.message}`
                );
            }

            completed += 1;
            onProgress({
                completed,
                total,
                lesson: item.lesson,
                exerciseId: exercise.id
            });
        }

        if (item.deleteRequestId) {
            sendWithoutResponse(
                'MarathonLessonWsController',
                'DeleteMarathonLessonRequestPupil',
                'Marathons',
                { RequestId: item.deleteRequestId }
            );
        }
    }

    log(`Completed all ${total} operation(s) for PupilId ${pupilId}.`);
}

function getErrorType(error) {
    return typeof error?.name === 'string' ? error.name : 'Error';
}

function createResetLessonsFeature({
    sendRequest,
    sendWithoutResponse,
    wait,
    canStart,
    onActiveChange,
    createDialog = () => document.createElement(RESET_DIALOG_TAG),
    log = () => {}
}) {
    let running = false;
    let active = false;

    function releaseOperation() {
        if (!active) {
            return;
        }
        active = false;
        onActiveChange(false);
    }

    async function open() {
        if (document.getElementById(RESET_OVERLAY_ID)) {
            return;
        }
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

        const dialog = createDialog();
        dialog.addEventListener('edvibe-dialog-close', releaseOperation);
        dialog.addEventListener('edvibe-reset-request', async (event) => {
            const { pupil, lessons } = event.detail;
            const confirmed = window.confirm(
                `Reset ${lessons.length} lesson(s) for ${pupil.Email}?`
            );
            if (!confirmed) {
                return;
            }

            running = true;
            dialog.lock();
            let completed = false;

            try {
                dialog.showDiscovery('Discovering exercises...');
                const work = await discoverResetWork({
                    sendRequest,
                    wait,
                    marathonId,
                    pupilId: pupil.PupilId,
                    lessons,
                    onDiscovery: (message) => dialog.showDiscovery(message),
                    log
                });
                await executeResetWork({
                    sendRequest,
                    sendWithoutResponse,
                    wait,
                    marathonId,
                    pupilId: pupil.PupilId,
                    work,
                    onProgress: (progress) => dialog.showProgress(progress),
                    log
                });
                dialog.showComplete('Selected lesson progress was reset successfully.');
                completed = true;
            } catch (error) {
                const lessonIds = lessons
                    .map((lesson) => lesson.MarathonLessonId)
                    .join(', ');
                log(
                    `Reset stopped for PupilId ${pupil.PupilId}; `
                    + `MarathonLessonIds: ${lessonIds} (${getErrorType(error)}).`
                );
                dialog.showError(error.message);
            } finally {
                running = false;
                if (completed) {
                    dialog.completeRun();
                }
                else {
                    dialog.unlockAfterRun();
                }
            }
        });

        try {
            const pupilPager = createPupilPager(sendRequest, marathonId);
            dialog.configure({
                loadNextPupils: () => pupilPager.loadNext(),
                loadLessons: async (pupil) => {
                    log(`Loading lessons for PupilId ${pupil.PupilId}.`);
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
                    log(
                        `Loaded ${response.Value.length} lesson(s) `
                        + `for PupilId ${pupil.PupilId}.`
                    );
                    return response.Value;
                },
                log
            });
            (document.body || document.documentElement).appendChild(dialog);
            dialog.setLoading('Loading marathon pupils...');
            const initialPage = await pupilPager.loadNext();
            log(
                `Loaded ${initialPage.pupils.length} of `
                + `${initialPage.total} pupil(s) for MarathonId ${marathonId}.`
            );
            dialog.showPupils({
                pupils: initialPage.pupils,
                total: initialPage.total
            });
        } catch (error) {
            log(
                `Failed to initialize reset workflow for MarathonId ${marathonId} `
                + `(${getErrorType(error)}).`
            );
            if (typeof dialog.showError === 'function') {
                dialog.showError(error.message);
            } else {
                releaseOperation();
                throw error;
            }
        }
    }

    return { open, isRunning: () => running };
}

export {
    parseMarathonId,
    collectLessonSections,
    shouldDeleteLastRequest,
    buildLoadExercisesPayload,
    buildResetAnswerPayload,
    createPupilPager,
    discoverResetWork,
    executeResetWork,
    createResetLessonsFeature,
    getErrorType
};
