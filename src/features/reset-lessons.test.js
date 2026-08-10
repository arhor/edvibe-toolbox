import test from 'node:test';
import assert from 'node:assert/strict';

import {
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
} from './reset-lessons.js';

test('parseMarathonId reads a numeric marathon id', () => {
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508'), 18508);
    assert.equal(parseMarathonId('https://app.edvibe.com/dashboard'), null);
});

test('collectLessonSections appends homework and removes missing sections', () => {
    const regular = [{ Id: 10 }, null, { Id: 11 }];

    assert.deepEqual(
        collectLessonSections({ Sections: regular, HomeworkSection: { Id: 12 } }),
        [{ Id: 10 }, { Id: 11 }, { Id: 12 }]
    );
});

test('shouldDeleteLastRequest requires a non-zero latest status', () => {
    assert.equal(shouldDeleteLastRequest({}), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 1, Status: 0 } }), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 2 } }), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 3, Status: null } }), false);
    assert.equal(shouldDeleteLastRequest({ LastRequest: { Id: 2, Status: 2 } }), true);
});

test('buildLoadExercisesPayload uses MarathonLessonId as LessonId', () => {
    assert.deepEqual(
        buildLoadExercisesPayload({
            marathonId: 18508,
            pupilId: 1397893,
            marathonLessonId: 230807,
            sectionId: 6975727
        }),
        {
            MarathonId: 18508,
            LessonId: 230807,
            SectionId: 6975727,
            PupilId: 1397893,
            IsTeacher: true,
            LessonSection: 0,
            Domain: 'edvibe.com'
        }
    );
});

test('buildResetAnswerPayload clears the saved exercise answer', () => {
    assert.deepEqual(
        buildResetAnswerPayload({
            marathonId: 18508,
            pupilId: 1397893,
            lessonId: 1468989,
            exercise: { id: 32726464, type: 10, sectionId: 6975766 }
        }),
        {
            SelfSync: false,
            IsReset: true,
            ExerciseId: 32726464,
            ExerciseType: 10,
            SectionId: 6975766,
            PupilId: 1397893,
            MarathonId: 18508,
            SingleAnswer: {},
            ManyAnswers: [],
            RepeatingManyAnswers: [],
            AnswerErrorsCount: [[]],
            StatisticsInfo: {
                CountAnswersTrue: 0,
                CountAnswersFalse: 0,
                CountAnswersPending: 0
            },
            LessonId: 1468989
        }
    );
});

test('pupil pager loads one page at a time with a default size of 50', async () => {
    const calls = [];
    const pages = [
        { Value: { Items: [{ PupilId: 1 }, { PupilId: 2 }], Page: { Count: 3 } } },
        { Value: { Items: [{ PupilId: 3 }], Page: { Count: 3 } } }
    ];
    const pager = createPupilPager(async (...args) => {
        calls.push(args);
        return pages[calls.length - 1];
    }, 18508);

    const first = await pager.loadNext();
    assert.deepEqual(first.pupils.map((pupil) => pupil.PupilId), [1, 2]);
    assert.equal(first.total, 3);
    assert.equal(first.hasMore, true);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0][3], { MarathonId: 18508, Skip: 0, Take: 50 });

    const second = await pager.loadNext();
    assert.deepEqual(second.pupils.map((pupil) => pupil.PupilId), [1, 2, 3]);
    assert.equal(second.hasMore, false);
    assert.equal(calls[1][3].Skip, 2);
});

test('pupil pager shares an in-flight next-page request', async () => {
    let resolveRequest;
    let callCount = 0;
    const pager = createPupilPager(() => {
        callCount += 1;
        return new Promise((resolve) => {
            resolveRequest = resolve;
        });
    }, 18508);

    const first = pager.loadNext();
    const duplicate = pager.loadNext();
    assert.equal(callCount, 1);

    resolveRequest({
        Value: {
            Items: [{ PupilId: 1 }],
            Page: { Count: 1 }
        }
    });

    assert.deepEqual(await first, await duplicate);
    assert.equal(callCount, 1);
});

test('pupil pager rejects an empty page before the reported total', async () => {
    const pager = createPupilPager(async () => ({
        Value: {
            Items: [],
            Page: { Count: 2 }
        }
    }), 18508);

    await assert.rejects(
        pager.loadNext(),
        /pagination stopped before all pupils were loaded/
    );
});

test('pupil pager rejects a malformed total count', async () => {
    const pager = createPupilPager(async () => ({
        Value: {
            Items: [],
            Page: { Count: null }
        }
    }), 18508);

    await assert.rejects(
        pager.loadNext(),
        /returned an invalid response/
    );
});

test('discoverResetWork queues only exercises with saved answer versions', async () => {
    const lesson = {
        LessonId: 1468983,
        MarathonLessonId: 230807,
        Name: 'Lesson 2',
        LastRequest: { Id: 3690753, Status: 2 }
    };
    const calls = [];
    const sendRequest = async (controller, method, project, value) => {
        calls.push({ controller, method, project, value });

        if (method === 'GetLessonWithId') {
            return { Value: { Sections: [{ Id: 10 }], HomeworkSection: { Id: 11 } } };
        }

        return {
            Value: {
                Items: value.SectionId === 10
                    ? [
                        { Id: 100, Type: 6, AnswerVersion1: [{ PupilId: 1397893 }] },
                        { Id: 101, Type: 10, AnswerVersion1: [] }
                    ]
                    : [{ Id: 102, Type: 18 }]
            }
        };
    };

    const work = await discoverResetWork({
        sendRequest,
        wait: async () => {},
        marathonId: 18508,
        pupilId: 1397893,
        lessons: [lesson]
    });

    assert.deepEqual(work[0].exercises, [
        { id: 100, type: 6, sectionId: 10 }
    ]);
    assert.equal(work[0].deleteRequestId, 3690753);
    assert.equal(calls.filter((call) => call.method === 'LoadExercises').length, 2);
});

test('executeResetWork saves an empty answer before dropping exercise statistics', async () => {
    const calls = [];

    await executeResetWork({
        sendRequest: async (controller, method, project, value) => {
            calls.push({ controller, method, project, value });
            return method === 'SaveAnswer' ? { Value: {} } : { Value: true };
        },
        sendWithoutResponse: () => {},
        wait: async () => {},
        marathonId: 18508,
        pupilId: 1397893,
        work: [{
            lesson: { LessonId: 1468989, Name: 'Lesson 2' },
            exercises: [{ id: 100, type: 10, sectionId: 20 }],
            deleteRequestId: null
        }],
        onProgress: () => {}
    });

    assert.deepEqual(
        calls.map(({ controller, method, project }) => ({ controller, method, project })),
        [
            {
                controller: 'ExerciseAnswerSaveVersion1WsController',
                method: 'SaveAnswer',
                project: 'ExerciseAnswer'
            },
            {
                controller: 'MarathonStatisticService',
                method: 'DropMarathonExerciseStatistic',
                project: 'Statistic'
            }
        ]
    );
    assert.deepEqual(calls[0].value, buildResetAnswerPayload({
        marathonId: 18508,
        pupilId: 1397893,
        lessonId: 1468989,
        exercise: { id: 100, type: 10, sectionId: 20 }
    }));
});

test('executeResetWork stops when dropping statistics fails', async () => {
    const calls = [];
    const deletedIds = [];
    const sendRequest = async (_controller, method, _project, value) => {
        calls.push({ method, exerciseId: value.ExerciseId });
        if (method === 'DropMarathonExerciseStatistic' && value.ExerciseId === 101) {
            throw new Error('reset rejected');
        }
        return method === 'SaveAnswer' ? { Value: {} } : { Value: true };
    };

    await assert.rejects(
        executeResetWork({
            sendRequest,
            sendWithoutResponse: (...args) => deletedIds.push(args[3].RequestId),
            wait: async () => {},
            marathonId: 18508,
            pupilId: 1397893,
            work: [{
                lesson: { LessonId: 1468989, Name: 'Lesson 2' },
                exercises: [
                    { id: 100, type: 6, sectionId: 10 },
                    { id: 101, type: 10, sectionId: 10 },
                    { id: 102, type: 18, sectionId: 11 }
                ],
                deleteRequestId: 3690753
            }],
            onProgress: () => {}
        }),
        /Lesson 2.*101.*reset rejected/
    );

    assert.deepEqual(calls, [
        { method: 'SaveAnswer', exerciseId: 100 },
        { method: 'DropMarathonExerciseStatistic', exerciseId: 100 },
        { method: 'SaveAnswer', exerciseId: 101 },
        { method: 'DropMarathonExerciseStatistic', exerciseId: 101 }
    ]);
    assert.deepEqual(deletedIds, []);
});

test('executeResetWork does not drop statistics when saving the reset answer fails', async () => {
    const methods = [];

    await assert.rejects(
        executeResetWork({
            sendRequest: async (_controller, method) => {
                methods.push(method);
                throw new Error('answer reset rejected');
            },
            sendWithoutResponse: () => {},
            wait: async () => {},
            marathonId: 18508,
            pupilId: 1397893,
            work: [{
                lesson: { LessonId: 1468989, Name: 'Lesson 2' },
                exercises: [{ id: 100, type: 10, sectionId: 20 }],
                deleteRequestId: null
            }],
            onProgress: () => {}
        }),
        /Lesson 2.*100.*answer reset rejected/
    );

    assert.deepEqual(methods, ['SaveAnswer']);
});

test('executeResetWork deletes an applicable lesson request after resetting answers', async () => {
    const deletedIds = [];
    const progress = [];

    await executeResetWork({
        sendRequest: async () => ({ Value: true }),
        sendWithoutResponse: (...args) => deletedIds.push(args[3].RequestId),
        wait: async () => {},
        marathonId: 18508,
        pupilId: 1397893,
        work: [{
            lesson: { LessonId: 1468989, Name: 'Lesson 2' },
            exercises: [{ id: 100, type: 10, sectionId: 20 }],
            deleteRequestId: 3690753
        }],
        onProgress: (update) => progress.push(update)
    });

    assert.deepEqual(deletedIds, [3690753]);
    assert.deepEqual(
        progress.map(({ completed, total, exerciseId }) => ({ completed, total, exerciseId })),
        [
            { completed: 1, total: 1, exerciseId: 100 }
        ]
    );
});


test('reset workflow opens with exactly one 50-pupil request', async (t) => {
    const originalDocument = global.document;
    const originalWindow = global.window;
    global.document = {
        getElementById: () => null,
        body: { appendChild() {} }
    };
    global.window = {
        location: { href: 'https://app.edvibe.com/marathon/18508' },
        alert() {},
        confirm: () => false
    };
    t.after(() => {
        global.document = originalDocument;
        global.window = originalWindow;
    });

    const calls = [];
    const logs = [];
    let pupilConfig;
    const dialog = {
        listeners: new Map(),
        addEventListener(type, listener) {
            this.listeners.set(type, listener);
        },
        configure(config) {
            this.config = config;
        },
        setLoading() {},
        showPupils(config) {
            pupilConfig = config;
        },
        showError(error) {
            throw error;
        }
    };
    const feature = createResetLessonsFeature({
        sendRequest: async (...args) => {
            calls.push(args);
            return {
                Value: {
                    Items: [{ PupilId: 1, Email: 'first@example.com' }],
                    Page: { Count: 120 }
                }
            };
        },
        sendWithoutResponse() {},
        wait: async () => {},
        canStart: () => true,
        onActiveChange() {},
        createDialog: () => dialog,
        log: (...args) => logs.push(args)
    });

    await feature.open();

    assert.deepEqual(logs[0], [
        'Loaded 1 of 120 pupil(s) for MarathonId 18508.'
    ]);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][1], 'GetMarathonPupils');
    assert.deepEqual(calls[0][3], { MarathonId: 18508, Skip: 0, Take: 50 });
    assert.equal(pupilConfig.pupils.length, 1);
    assert.equal(pupilConfig.total, 120);
    assert.equal(typeof dialog.config.loadNextPupils, 'function');
    assert.equal(typeof dialog.config.loadLessons, 'function');
});

test('getErrorType omits potentially sensitive error messages', () => {
    const result = getErrorType(new Error('Failed in "Sensitive lesson name"'));

    assert.equal(result, 'Error');
    assert.equal(result.includes('Sensitive lesson name'), false);
});
