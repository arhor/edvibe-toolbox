const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseMarathonId,
    parseEmailInput,
    loadAllPupils,
    loadAllPupilLessons,
    resolvePupilsByEmail
} = require('../src/features/batch-lesson-access.js');

test('parseMarathonId accepts only a numeric marathon path segment', () => {
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508'), 18508);
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508/lessons'), 18508);
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508x'), null);
    assert.equal(parseMarathonId('https://app.edvibe.com/dashboard'), null);
});

test('email input normalizes and deduplicates in first-seen order', () => {
    assert.deepEqual(
        parseEmailInput(' First@Example.com,second@example.com\nfirst@example.com '),
        {
            entries: [
                { input: 'First@Example.com', normalized: 'first@example.com' },
                { input: 'second@example.com', normalized: 'second@example.com' }
            ],
            malformed: []
        }
    );
});

test('email input separates semicolons and CRLF while collecting malformed entries once', () => {
    assert.deepEqual(
        parseEmailInput('valid@example.com; bad address\r\ninvalid@example\nBAD ADDRESS'),
        {
            entries: [{ input: 'valid@example.com', normalized: 'valid@example.com' }],
            malformed: ['bad address', 'invalid@example']
        }
    );
});

test('resolvePupilsByEmail returns exact case-insensitive unique matches', () => {
    const entries = [
        { input: 'First@Example.com', normalized: 'first@example.com' },
        { input: 'second@example.com', normalized: 'second@example.com' }
    ];
    const firstPupil = { Id: 11, Email: ' first@example.com ' };
    const secondPupil = { Id: 12, Email: 'SECOND@example.com' };

    assert.deepEqual(
        resolvePupilsByEmail(entries, [firstPupil, secondPupil]),
        { matches: [firstPupil, secondPupil], errors: [] }
    );
});

test('resolvePupilsByEmail reports every missing and ambiguous entry', () => {
    const entries = [
        { input: 'missing@example.com', normalized: 'missing@example.com' },
        { input: 'duplicate@example.com', normalized: 'duplicate@example.com' }
    ];

    assert.deepEqual(
        resolvePupilsByEmail(entries, [
            { Id: 1, Email: 'duplicate@example.com' },
            { Id: 2, Email: 'Duplicate@example.com' }
        ]),
        {
            matches: [],
            errors: [
                {
                    type: 'missing',
                    input: 'missing@example.com',
                    message: 'No marathon pupil found for missing@example.com.'
                },
                {
                    type: 'ambiguous',
                    input: 'duplicate@example.com',
                    count: 2,
                    message: 'Multiple marathon pupils found for duplicate@example.com.'
                }
            ]
        }
    );
});

test('loadAllPupils requests every page and accumulates the complete roster', async () => {
    const calls = [];
    const pupils = [{ Id: 1 }, { Id: 2 }, { Id: 3 }];
    const sendRequest = async (controller, method, projectName, value) => {
        calls.push({ controller, method, projectName, value });
        const offset = value.Skip;
        return { Value: { Items: pupils.slice(offset, offset + value.Take), Page: { Count: 3 } } };
    };

    assert.deepEqual(await loadAllPupils({ sendRequest, marathonId: 18508, pageSize: 2 }), pupils);
    assert.deepEqual(calls, [
        {
            controller: 'MarathonPupilsWsController',
            method: 'GetMarathonPupils',
            projectName: 'Marathons',
            value: { MarathonId: 18508, Skip: 0, Take: 2 }
        },
        {
            controller: 'MarathonPupilsWsController',
            method: 'GetMarathonPupils',
            projectName: 'Marathons',
            value: { MarathonId: 18508, Skip: 2, Take: 2 }
        }
    ]);
});

test('loadAllPupils uses the default request shape', async () => {
    const calls = [];
    const sendRequest = async (controller, method, projectName, value) => {
        calls.push({ controller, method, projectName, value });
        return { Value: { Items: [], Page: { Count: 0 } } };
    };

    assert.deepEqual(await loadAllPupils({ sendRequest, marathonId: 18508 }), []);
    assert.deepEqual(calls[0].value, { MarathonId: 18508, Skip: 0, Take: 50 });
});

test('loadAllPupilLessons requests every nested page and accumulates lessons', async () => {
    const calls = [];
    const lessons = [{ MarathonLessonId: 1 }, { MarathonLessonId: 2 }, { MarathonLessonId: 3 }];
    const sendRequest = async (controller, method, projectName, value) => {
        calls.push({ controller, method, projectName, value });
        const offset = value.Page.Skip;
        return {
            Value: { Items: lessons.slice(offset, offset + value.Page.Take), Page: { Count: 3 } }
        };
    };

    assert.deepEqual(
        await loadAllPupilLessons({ sendRequest, marathonId: 18508, pupilId: 1397893, pageSize: 2 }),
        lessons
    );
    assert.deepEqual(calls[0], {
        controller: 'MarathonLessonWsController',
        method: 'GetMarathonLessonsForPupilPagination',
        projectName: 'Marathons',
        value: {
            PupilId: 1397893,
            MarathonId: 18508,
            SearchTerm: '',
            Page: { Skip: 0, Take: 2 }
        }
    });
});

test('loadAllPupilLessons uses the default nested request shape', async () => {
    const calls = [];
    const sendRequest = async (controller, method, projectName, value) => {
        calls.push({ controller, method, projectName, value });
        return {
            Value: {
                Items: value.Page.Skip === 0 ? Array(20).fill({ MarathonLessonId: 1 }) : [{ MarathonLessonId: 2 }],
                Page: { Count: 21 }
            }
        };
    };

    assert.deepEqual(
        await loadAllPupilLessons({ sendRequest, marathonId: 18508, pupilId: 1397893 }),
        [...Array(20).fill({ MarathonLessonId: 1 }), { MarathonLessonId: 2 }]
    );
    assert.deepEqual(calls[1].value, {
        PupilId: 1397893,
        MarathonId: 18508,
        SearchTerm: '',
        Page: { Skip: 20, Take: 20 }
    });
});

for (const invalidResponse of [
    { label: 'non-array Items', response: { Value: { Items: {}, Page: { Count: 0 } } } },
    { label: 'fractional Page.Count', response: { Value: { Items: [], Page: { Count: 1.5 } } } },
    { label: 'negative Page.Count', response: { Value: { Items: [], Page: { Count: -1 } } } }
]) {
    test(`loadAllPupils rejects ${invalidResponse.label}`, async () => {
        await assert.rejects(
            loadAllPupils({ sendRequest: async () => invalidResponse.response, marathonId: 18508 }),
            (error) => error.code === 'INVALID_RESPONSE'
                && error.message === 'GetMarathonPupils returned invalid pagination data.'
        );
    });
}

test('loadAllPupils rejects an empty page before its reported total', async () => {
    await assert.rejects(
        loadAllPupils({
            sendRequest: async () => ({ Value: { Items: [], Page: { Count: 1 } } }),
            marathonId: 18508
        }),
        (error) => error.code === 'INVALID_RESPONSE'
    );
});

test('loadAllPupilLessons rejects a shrinking total', async () => {
    let requests = 0;
    await assert.rejects(
        loadAllPupilLessons({
            sendRequest: async () => {
                requests += 1;
                return requests === 1
                    ? { Value: { Items: [{ MarathonLessonId: 1 }], Page: { Count: 2 } } }
                    : { Value: { Items: [{ MarathonLessonId: 2 }], Page: { Count: 1 } } };
            },
            marathonId: 18508,
            pupilId: 1397893,
            pageSize: 1
        }),
        (error) => error.code === 'INVALID_RESPONSE'
            && error.message === 'GetMarathonLessonsForPupilPagination returned invalid pagination data.'
    );
});

test('loadAllPupils rejects a page that exceeds its reported total', async () => {
    await assert.rejects(
        loadAllPupils({
            sendRequest: async () => ({
                Value: { Items: [{ Id: 1 }, { Id: 2 }], Page: { Count: 1 } }
            }),
            marathonId: 18508
        }),
        (error) => error.code === 'INVALID_RESPONSE'
    );
});
