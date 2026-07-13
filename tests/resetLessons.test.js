const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseMarathonId,
    filterPupilsByEmail,
    collectLessonSections,
    shouldDeleteLastRequest,
    buildLoadExercisesPayload,
    loadAllPupils,
    discoverResetWork,
    executeResetWork
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
                    ? [{ Id: 100 }, { Id: 101 }]
                    : [{ Id: 102 }]
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

    assert.deepEqual(work[0].exerciseIds, [100, 101, 102]);
    assert.equal(work[0].deleteRequestId, 3690753);
    assert.equal(calls.filter((call) => call.method === 'LoadExercises').length, 2);
});

test('executeResetWork stops on the first failed reset', async () => {
    const resetIds = [];
    const deletedIds = [];
    const sendRequest = async (_controller, _method, _project, value) => {
        resetIds.push(value.ExerciseId);
        if (value.ExerciseId === 101) throw new Error('reset rejected');
        return { Value: true };
    };

    await assert.rejects(
        executeResetWork({
            sendRequest,
            sendWithoutResponse: (...args) => deletedIds.push(args[3].RequestId),
            wait: async () => {},
            marathonId: 18508,
            pupilId: 1397893,
            work: [{
                lesson: { Name: 'Lesson 2' },
                exerciseIds: [100, 101, 102],
                deleteRequestId: 3690753
            }],
            onProgress: () => {}
        }),
        /Lesson 2.*101.*reset rejected/
    );

    assert.deepEqual(resetIds, [100, 101]);
    assert.deepEqual(deletedIds, []);
});

test('executeResetWork deletes an applicable request and reports complete progress', async () => {
    const deletedIds = [];
    const progress = [];

    await executeResetWork({
        sendRequest: async () => ({ Value: true }),
        sendWithoutResponse: (...args) => deletedIds.push(args[3].RequestId),
        wait: async () => {},
        marathonId: 18508,
        pupilId: 1397893,
        work: [{
            lesson: { Name: 'Lesson 2' },
            exerciseIds: [100],
            deleteRequestId: 3690753
        }],
        onProgress: (update) => progress.push(update)
    });

    assert.deepEqual(deletedIds, [3690753]);
    assert.deepEqual(
        progress.map(({ completed, total, exerciseId }) => ({ completed, total, exerciseId })),
        [
            { completed: 1, total: 2, exerciseId: 100 },
            { completed: 2, total: 2, exerciseId: null }
        ]
    );
});
