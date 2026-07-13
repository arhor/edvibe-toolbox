const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseMarathonId,
    filterPupilsByEmail,
    collectLessonSections,
    shouldDeleteLastRequest,
    buildLoadExercisesPayload,
    buildResetAnswerPayload,
    loadAllPupils,
    discoverResetWork,
    executeResetWork,
    getResetModalMarkup,
    getResetRunningStyles,
    setResetRunningState,
    getErrorType
} = require('../resetLessons.js');

test('parseMarathonId reads a numeric marathon id', () => {
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508'), 18508);
    assert.equal(parseMarathonId('https://app.edvibe.com/dashboard'), null);
});

test('filterPupilsByEmail uses case-insensitive includes logic', () => {
    const pupils = [
        { PupilId: 1, Email: 'first@example.com' },
        { PupilId: 2, Email: 'OTHER@EXAMPLE.COM' },
        { PupilId: 3, Email: null }
    ];

    assert.deepEqual(filterPupilsByEmail(pupils, 'other@'), [pupils[1]]);
    assert.deepEqual(filterPupilsByEmail(pupils, ''), pupils);
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

test('loadAllPupils follows Page.Count until every pupil is loaded', async () => {
    const calls = [];
    const pages = [
        { Value: { Items: [{ PupilId: 1 }, { PupilId: 2 }], Page: { Count: 3 } } },
        { Value: { Items: [{ PupilId: 3 }], Page: { Count: 3 } } }
    ];

    const pupils = await loadAllPupils(async (...args) => {
        calls.push(args);
        return pages[calls.length - 1];
    }, 18508, 2);

    assert.deepEqual(pupils.map((pupil) => pupil.PupilId), [1, 2, 3]);
    assert.deepEqual(calls.map((call) => call[3].Skip), [0, 2]);
});

test('discoverResetWork loads sections and user exercises', async () => {
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
                    ? [{ Id: 100, Type: 6 }, { Id: 101, Type: 10 }]
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
        { id: 100, type: 6, sectionId: 10 },
        { id: 101, type: 10, sectionId: 10 },
        { id: 102, type: 18, sectionId: 11 }
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

test('executeResetWork leaves an applicable lesson request untouched', async () => {
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

    assert.deepEqual(deletedIds, []);
    assert.deepEqual(
        progress.map(({ completed, total, exerciseId }) => ({ completed, total, exerciseId })),
        [
            { completed: 1, total: 1, exerciseId: 100 }
        ]
    );
});

test('reset progress region is outside the scrollable selection body', () => {
    const markup = getResetModalMarkup();

    assert.match(
        markup,
        /<\/div>\s*<div class="edvibe-reset-live-region">[\s\S]*edvibe-reset-progress/
    );
});

test('running reset hides selection but not the live progress region', () => {
    const styles = getResetRunningStyles();

    assert.match(styles, /\.is-running \.edvibe-reset-body\s*\{[^}]*display:\s*none/);
    assert.doesNotMatch(styles, /\.is-running \.edvibe-reset-live-region\s*\{[^}]*display:\s*none/);
});

test('setResetRunningState applies the running class', () => {
    const classes = new Set();
    const overlay = {
        classList: {
            toggle(name, force) {
                if (force) classes.add(name);
                else classes.delete(name);
            }
        }
    };

    setResetRunningState(overlay, true);
    assert.equal(classes.has('is-running'), true);
    setResetRunningState(overlay, false);
    assert.equal(classes.has('is-running'), false);
});

test('getErrorType omits potentially sensitive error messages', () => {
    const result = getErrorType(new Error('Failed in "Sensitive lesson name"'));

    assert.equal(result, 'Error');
    assert.equal(result.includes('Sensitive lesson name'), false);
});
