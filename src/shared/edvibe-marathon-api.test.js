const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createEdvibeMarathonApi,
    loadAllPupilLessons,
    loadAllPupils
} = require('./edvibe-marathon-api.js');

function page(items, count) {
    return { Value: { Items: items, Page: { Count: count } } };
}

test('loads the complete marathon pupil roster behind one protocol boundary', async () => {
    const calls = [];
    const responses = [page([{ PupilId: 1 }], 2), page([{ PupilId: 2 }], 2)];
    const pupils = await loadAllPupils({
        marathonId: 18508,
        pageSize: 1,
        sendRequest: async (...args) => {
            calls.push(args);
            return responses.shift();
        }
    });

    assert.deepEqual(pupils.map(({ PupilId }) => PupilId), [1, 2]);
    assert.deepEqual(calls.map((call) => call.slice(0, 3)), [
        ['MarathonPupilsWsController', 'GetMarathonPupils', 'Marathons'],
        ['MarathonPupilsWsController', 'GetMarathonPupils', 'Marathons']
    ]);
    assert.deepEqual(calls.map((call) => call[3]), [
        { MarathonId: 18508, Skip: 0, Take: 1 },
        { MarathonId: 18508, Skip: 1, Take: 1 }
    ]);
});

test('loads complete pupil lesson state without exposing controller details to features', async () => {
    const calls = [];
    const lessons = await loadAllPupilLessons({
        marathonId: 18508,
        pupilId: 42,
        pageSize: 2,
        sendRequest: async (...args) => {
            calls.push(args);
            return page([{ MarathonLessonId: 1 }, { MarathonLessonId: 2 }], 2);
        }
    });

    assert.equal(lessons.length, 2);
    assert.deepEqual(calls[0], [
        'MarathonLessonWsController',
        'GetMarathonLessonsForPupilPagination',
        'Marathons',
        {
            PupilId: 42,
            MarathonId: 18508,
            SearchTerm: '',
            Page: { Skip: 0, Take: 2 }
        }
    ]);
});

test('bound API captures transport dependency once', async () => {
    const calls = [];
    const api = createEdvibeMarathonApi({
        sendRequest: async (...args) => {
            calls.push(args);
            return page([], 0);
        }
    });

    assert.deepEqual(await api.loadAllPupils({ marathonId: 7 }), []);
    assert.equal(calls.length, 1);
});

test('rejects malformed pagination at the API boundary', async () => {
    await assert.rejects(
        loadAllPupils({
            marathonId: 1,
            sendRequest: async () => ({ Value: { Items: [], Page: { Count: 1 } } })
        }),
        (error) => error.code === 'INVALID_RESPONSE'
    );
});