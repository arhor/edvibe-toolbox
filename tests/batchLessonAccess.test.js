const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseMarathonId,
    parseEmailInput,
    loadAllPupils,
    loadAllPupilLessons,
    resolvePupilsByEmail,
    createFeatureError,
    runWithRetry,
    buildAccessPlan,
    executeAccessPlan,
    formatBatchReport
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

test('buildAccessPlan classifies selected boolean lesson states for every pupil', () => {
    const pupils = [
        { PupilId: 1001, MarathonPupilId: 2001, Email: 'first@example.com' },
        { PupilId: 1002, MarathonPupilId: 2002, Email: 'second@example.com' }
    ];
    const plan = buildAccessPlan({
        pupils,
        selectedLessonIds: [10, 11],
        lessonsByPupilId: new Map([
            [1001, [
                { MarathonLessonId: 10, Number: 0, Name: 'Introduction', IsOpen: true },
                { MarathonLessonId: 11, Number: 4, Name: 'Practice', IsOpen: false }
            ]],
            [1002, [
                { MarathonLessonId: 10, Number: 0, Name: 'Introduction', IsOpen: true },
                { MarathonLessonId: 11, Number: 4, Name: 'Practice', IsOpen: false }
            ]]
        ])
    });

    assert.deepEqual(plan.alreadyOpen.map((item) => item.marathonLessonId), [10, 10]);
    assert.deepEqual(plan.needsOpening.map((item) => item.marathonLessonId), [11, 11]);
    assert.deepEqual(plan.needsOpening[0], {
        email: 'first@example.com',
        pupilId: 1001,
        marathonPupilId: 2001,
        marathonLessonId: 11,
        lessonNumber: 5,
        lessonName: 'Practice'
    });
    assert.deepEqual(plan.errors, []);
});

test('buildAccessPlan aggregates missing duplicate and non-boolean selected lessons', () => {
    const plan = buildAccessPlan({
        pupils: [
            { PupilId: 1, MarathonPupilId: 101, Email: 'missing@example.com' },
            { PupilId: 2, MarathonPupilId: 102, Email: 'duplicate@example.com' },
            { PupilId: 3, MarathonPupilId: 103, Email: 'invalid@example.com' }
        ],
        selectedLessonIds: [10],
        lessonsByPupilId: new Map([
            [1, []],
            [2, [
                { MarathonLessonId: 10, Name: 'Duplicate', IsOpen: false },
                { MarathonLessonId: 10, Name: 'Duplicate copy', IsOpen: false }
            ]],
            [3, [{ MarathonLessonId: 10, Name: 'Unknown', IsOpen: 'yes' }]]
        ])
    });

    assert.equal(plan.alreadyOpen.length, 0);
    assert.equal(plan.needsOpening.length, 0);
    assert.deepEqual(plan.errors.map((error) => error.code), [
        'INVALID_RESPONSE',
        'INVALID_RESPONSE',
        'INVALID_RESPONSE'
    ]);
    assert.deepEqual(plan.errors.map((error) => error.email), [
        'missing@example.com',
        'duplicate@example.com',
        'invalid@example.com'
    ]);
});

test('runWithRetry retries timeouts with the specified delays before succeeding', async () => {
    let calls = 0;
    const waits = [];
    const result = await runWithRetry(async () => {
        calls += 1;
        if (calls < 3) {
            throw createFeatureError('REQUEST_TIMEOUT', 'Request timed out.');
        }
        return 'opened';
    }, {
        wait: async (delay) => waits.push(delay),
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(result, { value: 'opened', attempts: 3 });
    assert.equal(calls, 3);
    assert.deepEqual(waits, [1000, 3000]);
});

for (const code of ['SERVER_REJECTED', 'INVALID_RESPONSE']) {
    test(`runWithRetry does not retry ${code}`, async () => {
        let calls = 0;
        const waits = [];
        await assert.rejects(
            runWithRetry(async () => {
                calls += 1;
                throw createFeatureError(code, 'Permanent failure.');
            }, {
                wait: async (delay) => waits.push(delay),
                getConnectionState: () => ({ isOpen: true })
            }),
            (error) => error.code === code && error.attempts === 1
        );
        assert.equal(calls, 1);
        assert.deepEqual(waits, []);
    });
}

test('runWithRetry records unavailable connection before retrying without another operation call', async () => {
    let calls = 0;
    const waits = [];
    await assert.rejects(
        runWithRetry(async () => {
            calls += 1;
            throw createFeatureError('REQUEST_TIMEOUT', 'Request timed out.');
        }, {
            wait: async (delay) => waits.push(delay),
            getConnectionState: () => ({ isOpen: false })
        }),
        (error) => error.code === 'WS_UNAVAILABLE' && error.attempts === 3
    );
    assert.equal(calls, 1);
    assert.deepEqual(waits, [1000, 3000]);
});

test('runWithRetry rejects the third transient failure with three attempts', async () => {
    let calls = 0;
    await assert.rejects(
        runWithRetry(async () => {
            calls += 1;
            throw createFeatureError('REQUEST_TIMEOUT', 'Request timed out.');
        }, {
            wait: async () => {},
            getConnectionState: () => ({ isOpen: true })
        }),
        (error) => error.code === 'REQUEST_TIMEOUT' && error.attempts === 3
    );
    assert.equal(calls, 3);
});

test('runWithRetry retries SEND_FAILED with a cause after a closed connection', async () => {
    let calls = 0;
    let connectionChecks = 0;
    const waits = [];
    const result = await runWithRetry(async () => {
        calls += 1;
        if (calls === 1) {
            throw createFeatureError('SEND_FAILED', 'Socket closed.', { cause: new Error('closed') });
        }
        return 'opened';
    }, {
        wait: async (delay) => waits.push(delay),
        getConnectionState: () => ({ isOpen: connectionChecks++ > 0 })
    });

    assert.deepEqual(result, { value: 'opened', attempts: 2 });
    assert.equal(calls, 2);
    assert.deepEqual(waits, [1000]);
});

test('runWithRetry does not retry SEND_FAILED without a cause', async () => {
    let calls = 0;
    const waits = [];
    await assert.rejects(
        runWithRetry(async () => {
            calls += 1;
            throw createFeatureError('SEND_FAILED', 'Socket closed.');
        }, {
            wait: async (delay) => waits.push(delay),
            getConnectionState: () => ({ isOpen: false })
        }),
        (error) => error.code === 'SEND_FAILED' && error.attempts === 1
    );
    assert.equal(calls, 1);
    assert.deepEqual(waits, []);
});

test('runWithRetry does not retry SEND_FAILED while the connection is open', async () => {
    let calls = 0;
    const waits = [];
    await assert.rejects(
        runWithRetry(async () => {
            calls += 1;
            throw createFeatureError('SEND_FAILED', 'Socket closed.', { cause: new Error('closed') });
        }, {
            wait: async (delay) => waits.push(delay),
            getConnectionState: () => ({ isOpen: true })
        }),
        (error) => error.code === 'SEND_FAILED' && error.attempts === 1
    );
    assert.equal(calls, 1);
    assert.deepEqual(waits, []);
});

test('executeAccessPlan serializes mutations, validates responses, and aggregates results', async () => {
    const calls = [];
    const waits = [];
    const progress = [];
    let active = 0;
    let maximumActive = 0;
    const result = await executeAccessPlan({
        marathonId: 18508,
        requestedEmails: ['first@example.com', 'second@example.com'],
        matchedUsers: 2,
        selectedLessons: 2,
        alreadyOpen: [{
            email: 'first@example.com',
            pupilId: 1001,
            marathonPupilId: 228018,
            marathonLessonId: 2034970,
            lessonNumber: 1,
            lessonName: 'Already open'
        }],
        needsOpening: [
            {
                email: 'first@example.com',
                pupilId: 1001,
                marathonPupilId: 228019,
                marathonLessonId: 2034971,
                lessonNumber: 5,
                lessonName: 'Lesson one'
            },
            {
                email: 'second@example.com',
                pupilId: 1002,
                marathonPupilId: 228020,
                marathonLessonId: 2034972,
                lessonNumber: 6,
                lessonName: 'Lesson two'
            }
        ],
        wait: async (delay) => waits.push(delay),
        getConnectionState: () => ({ isOpen: true }),
        onProgress: (snapshot) => progress.push(snapshot),
        sendRequest: async (controller, method, project, value) => {
            calls.push({ controller, method, project, value });
            active += 1;
            maximumActive = Math.max(maximumActive, active);
            await Promise.resolve();
            active -= 1;
            if (value.MarathonLessonId === 2034972) {
                throw createFeatureError('SERVER_REJECTED', 'Access denied.');
            }
            return { Value: true };
        }
    });

    assert.equal(maximumActive, 1);
    assert.deepEqual(waits, [300, 300]);
    assert.deepEqual(calls[0], {
        controller: 'MarathonLessonWsController',
        method: 'ChangeIsOpenLessonForPupil',
        project: 'Marathons',
        value: {
            IsOpen: true,
            MarathonLessonId: 2034971,
            MarathonPupilId: 228019,
            MarathonId: 18508
        }
    });
    assert.deepEqual(result.opened.map((item) => item.marathonLessonId), [2034971]);
    assert.equal(result.alreadyOpen, 1);
    assert.equal(result.failures.length, 1);
    assert.equal(result.failures[0].email, 'second@example.com');
    assert.equal(result.failures[0].lessonNumber, 6);
    assert.equal(result.failures[0].lessonName, 'Lesson two');
    assert.equal(result.failures[0].attempts, 1);
    assert.equal(result.attempts, 2);
    assert.deepEqual(progress.map((snapshot) => snapshot.completed), [1, 2]);
    assert.ok(Object.isFrozen(progress[0]));
});

test('executeAccessPlan treats a successful transport response without Value true as invalid', async () => {
    const result = await executeAccessPlan({
        marathonId: 18508,
        requestedEmails: ['first@example.com'],
        matchedUsers: 1,
        selectedLessons: 1,
        alreadyOpen: [],
        needsOpening: [{
            email: 'first@example.com',
            pupilId: 1,
            marathonPupilId: 2,
            marathonLessonId: 3,
            lessonNumber: 3,
            lessonName: 'Lesson three'
        }],
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true }),
        sendRequest: async () => ({ Value: false })
    });

    assert.equal(result.opened.length, 0);
    assert.equal(result.failures.length, 1);
    assert.equal(result.failures[0].code, 'INVALID_RESPONSE');
    assert.equal(result.failures[0].attempts, 1);
});

test('formatBatchReport includes actionable failures without internal IDs or payloads', () => {
    const report = formatBatchReport({
        requestedEmails: ['first@example.com', 'second@example.com'],
        matchedUsers: 2,
        selectedLessons: 3,
        opened: [{ marathonLessonId: 10 }],
        alreadyOpen: 4,
        attempts: 5,
        failures: [{
            email: 'user@example.com',
            pupilId: 123,
            marathonPupilId: 456,
            marathonLessonId: 2034971,
            lessonNumber: 5,
            lessonName: 'Lesson name',
            attempts: 3,
            code: 'REQUEST_TIMEOUT',
            message: 'The request timed out.',
            response: { Value: false }
        }]
    });

    assert.match(report, /Requested emails: 2/);
    assert.match(report, /Opened: 1/);
    assert.match(
        report,
        /FAILED user@example\.com — 5\. Lesson name — 3 attempts — REQUEST_TIMEOUT: The request timed out\./
    );
    assert.doesNotMatch(report, /PupilId|MarathonPupilId|2034971|\{"Value":false\}/);
});
