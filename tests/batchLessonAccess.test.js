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
    formatBatchReport,
    createBatchLessonAccessFeature
} = require('../src/features/batch-lesson-access.js');

function createFeatureDialog() {
    const listeners = new Map();
    const calls = [];
    const dialog = {
        calls,
        addEventListener(type, listener) {
            const typeListeners = listeners.get(type) || [];
            typeListeners.push(listener);
            listeners.set(type, typeListeners);
        },
        async emit(type, detail) {
            for (const listener of listeners.get(type) || []) {
                await listener({ detail });
            }
        }
    };

    for (const method of [
        'configure',
        'showConfigure',
        'setEmailState',
        'showValidation',
        'showValidationErrors',
        'showConfirmation',
        'showExecution',
        'showComplete',
        'showFatalError'
    ]) {
        dialog[method] = (...args) => {
            calls.push({ method, args });
            return dialog;
        };
    }

    return dialog;
}

function installFeatureBrowser({
    href = 'https://app.edvibe.com/marathon/18508',
    existingOverlay = null
} = {}) {
    const previousWindow = global.window;
    const previousDocument = global.document;
    const appended = [];
    const alerts = [];

    global.window = {
        location: { href },
        alert: (message) => alerts.push(message)
    };
    global.document = {
        getElementById: () => existingOverlay,
        body: {
            appendChild(element) {
                appended.push(element);
                return element;
            }
        },
        createElement: () => createFeatureDialog()
    };

    return {
        alerts,
        appended,
        restore() {
            global.window = previousWindow;
            global.document = previousDocument;
        }
    };
}

function responsePage(items, total) {
    return { Value: { Items: items, Page: { Count: total } } };
}

function createPupil({
    pupilId,
    marathonPupilId = pupilId + 1000,
    email
}) {
    return {
        PupilId: pupilId,
        MarathonPupilId: marathonPupilId,
        Email: email
    };
}

function createLesson({
    id,
    number = id - 1,
    name = `Lesson ${id}`,
    isOpen = false
}) {
    return {
        MarathonLessonId: id,
        Number: number,
        Name: name,
        IsOpen: isOpen
    };
}

function findDialogCalls(dialog, method) {
    return dialog.calls.filter((call) => call.method === method);
}

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
    assert.deepEqual(progress.map((snapshot) => snapshot.completed), [0, 1, 1, 2]);
    assert.deepEqual(progress.map((snapshot) => snapshot.current), [
        { email: 'first@example.com', lessonName: 'Lesson one' },
        { email: 'first@example.com', lessonName: 'Lesson one' },
        { email: 'second@example.com', lessonName: 'Lesson two' },
        { email: 'second@example.com', lessonName: 'Lesson two' }
    ]);
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

test('executeAccessPlan stops after an internal mutation error and carries a safe partial result', async () => {
    const calls = [];
    const progress = [];
    const needsOpening = [1, 2, 3].map((id) => ({
        email: `user-${id}@example.com`,
        pupilId: id,
        marathonPupilId: 100 + id,
        marathonLessonId: 200 + id,
        lessonNumber: id,
        lessonName: `Lesson ${id}`
    }));

    await assert.rejects(
        executeAccessPlan({
            marathonId: 18508,
            requestedEmails: needsOpening.map((item) => item.email),
            matchedUsers: 3,
            selectedLessons: 1,
            needsOpening,
            sendRequest: async (_controller, _method, _project, value) => {
                calls.push(value.MarathonLessonId);
                if (value.MarathonLessonId === 202) {
                    throw new TypeError('SENTINEL_INTERNAL_PAYLOAD');
                }
                return { Value: true };
            },
            wait: async () => {},
            getConnectionState: () => ({ isOpen: true }),
            onProgress: (snapshot) => progress.push(snapshot)
        }),
        (error) => {
            assert.equal(error.code, 'INTERNAL_ERROR');
            assert.deepEqual(
                error.partialResult.opened.map((item) => item.marathonLessonId),
                [201]
            );
            assert.equal(error.partialResult.failures.length, 1);
            assert.equal(error.partialResult.failures[0].code, 'INTERNAL_ERROR');
            assert.equal(error.partialResult.failures[0].marathonLessonId, 202);
            assert.doesNotMatch(
                error.partialResult.failures[0].message,
                /SENTINEL_INTERNAL_PAYLOAD/
            );
            assert.equal(error.partialResult.attempts, 2);
            return true;
        }
    );

    assert.deepEqual(calls, [201, 202]);
    assert.deepEqual(progress.map((snapshot) => snapshot.completed), [0, 1, 1]);
    assert.deepEqual(progress.map((snapshot) => snapshot.current.email), [
        'user-1@example.com',
        'user-1@example.com',
        'user-2@example.com'
    ]);
});

test('executeAccessPlan preserves a successful write when completion progress rendering throws', async () => {
    const calls = [];
    const needsOpening = [1, 2, 3].map((id) => ({
        email: `progress-${id}@example.com`,
        pupilId: id,
        marathonPupilId: 100 + id,
        marathonLessonId: 300 + id,
        lessonNumber: id,
        lessonName: `Progress lesson ${id}`
    }));

    await assert.rejects(
        executeAccessPlan({
            marathonId: 18508,
            requestedEmails: needsOpening.map((item) => item.email),
            matchedUsers: 3,
            selectedLessons: 1,
            needsOpening,
            sendRequest: async (_controller, _method, _project, value) => {
                calls.push(value.MarathonLessonId);
                return { Value: true };
            },
            wait: async () => {},
            getConnectionState: () => ({ isOpen: true }),
            onProgress: (snapshot) => {
                if (snapshot.completed === 1) {
                    throw new TypeError('render failed');
                }
            }
        }),
        (error) => {
            assert.equal(error.code, 'INTERNAL_ERROR');
            assert.deepEqual(
                error.partialResult.opened.map((item) => item.marathonLessonId),
                [301]
            );
            assert.equal(error.partialResult.failures.length, 1);
            assert.equal(error.partialResult.failures[0].code, 'INTERNAL_ERROR');
            assert.equal(error.partialResult.failures[0].marathonLessonId, 301);
            assert.equal(error.partialResult.attempts, 1);
            return true;
        }
    );

    assert.deepEqual(calls, [301]);
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

test('batch feature refuses duplicate or concurrent overlays before activating', async () => {
    const existing = installFeatureBrowser({ existingOverlay: {} });
    try {
        let createCount = 0;
        const feature = createBatchLessonAccessFeature({
            sendRequest: async () => {
                assert.fail('duplicate overlay must not read data');
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => assert.fail('duplicate overlay must not activate'),
            createDialog: () => {
                createCount += 1;
                return createFeatureDialog();
            },
            copyText: async () => {},
            log: () => {}
        });

        await feature.open();
        assert.equal(createCount, 0);
    } finally {
        existing.restore();
    }

    const concurrent = installFeatureBrowser();
    try {
        const activeChanges = [];
        const feature = createBatchLessonAccessFeature({
            sendRequest: async () => {
                assert.fail('concurrent operation must not read data');
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => false,
            onActiveChange: (active) => activeChanges.push(active),
            createDialog: () => createFeatureDialog(),
            copyText: async () => {},
            log: () => {}
        });

        await feature.open();
        assert.deepEqual(activeChanges, []);
        assert.equal(concurrent.appended.length, 0);
        assert.deepEqual(concurrent.alerts, [
            'Another Edvibe Toolbox operation is already running.'
        ]);
    } finally {
        concurrent.restore();
    }
});

test('batch feature initializes from the marathon URL, complete roster, and first-pupil catalogue', async () => {
    const browser = installFeatureBrowser();
    const roster = Array.from({ length: 51 }, (_, index) => createPupil({
        pupilId: index + 1,
        email: `pupil-${index + 1}@example.com`
    }));
    const catalogue = Array.from({ length: 21 }, (_, index) => createLesson({
        id: index + 1,
        number: index,
        isOpen: index % 2 === 0
    }));
    const requests = [];
    const activeChanges = [];
    const dialog = createFeatureDialog();
    let createCount = 0;

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (controller, method, project, value) => {
                requests.push({ controller, method, project, value });
                if (method === 'GetMarathonPupils') {
                    return responsePage(
                        roster.slice(value.Skip, value.Skip + value.Take),
                        roster.length
                    );
                }
                return responsePage(
                    catalogue.slice(value.Page.Skip, value.Page.Skip + value.Page.Take),
                    catalogue.length
                );
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: (active) => activeChanges.push(active),
            createDialog: () => {
                createCount += 1;
                return dialog;
            },
            copyText: async () => {},
            log: () => {}
        });

        await feature.open({ stylesheetUrl: 'chrome-extension://id/batch.css' });

        assert.equal(createCount, 1);
        assert.deepEqual(activeChanges, [true]);
        assert.deepEqual(browser.appended, [dialog]);
        assert.equal(requests.filter((request) => request.method === 'GetMarathonPupils').length, 2);
        assert.equal(
            requests.filter((request) => request.method === 'GetMarathonLessonsForPupilPagination').length,
            2
        );
        assert.equal(requests[0].value.MarathonId, 18508);
        assert.equal(requests[2].value.PupilId, roster[0].PupilId);
        assert.deepEqual(findDialogCalls(dialog, 'configure')[0].args, [{
            stylesheetUrl: 'chrome-extension://id/batch.css'
        }]);
        assert.deepEqual(findDialogCalls(dialog, 'showConfigure')[0].args, [{
            lessons: catalogue,
            emailState: { validCount: 0, malformedCount: 0 }
        }]);
        assert.equal(feature.isRunning(), false);

        await dialog.emit('edvibe-dialog-close');
        await dialog.emit('edvibe-dialog-close');
        assert.deepEqual(activeChanges, [true, false]);
    } finally {
        browser.restore();
    }
});

test('batch feature shows a fatal empty-roster error and releases initialization guard', async () => {
    const browser = installFeatureBrowser();
    const activeChanges = [];
    const dialog = createFeatureDialog();

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async () => responsePage([], 0),
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: (active) => activeChanges.push(active),
            createDialog: () => dialog,
            copyText: async () => {},
            log: () => {}
        });

        await feature.open();

        assert.deepEqual(activeChanges, [true, false]);
        assert.deepEqual(browser.appended, [dialog]);
        assert.equal(findDialogCalls(dialog, 'showConfigure').length, 0);
        const fatal = findDialogCalls(dialog, 'showFatalError');
        assert.equal(fatal.length, 1);
        assert.equal(fatal[0].args[0].code, 'EMPTY_ROSTER');
        assert.equal(feature.isRunning(), false);
    } finally {
        browser.restore();
    }
});

test('batch feature aggregates malformed, missing, and ambiguous emails before state reads', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const roster = [
        createPupil({ pupilId: 1, email: 'catalogue@example.com' }),
        createPupil({ pupilId: 2, email: 'duplicate@example.com' }),
        createPupil({ pupilId: 3, email: 'Duplicate@example.com' })
    ];
    let stateReads = 0;
    let writes = 0;

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method, _project, value) => {
                if (method === 'GetMarathonPupils') {
                    return responsePage(roster, roster.length);
                }
                if (method === 'ChangeIsOpenLessonForPupil') {
                    writes += 1;
                    return { Value: true };
                }
                if (value.PupilId !== roster[0].PupilId) {
                    stateReads += 1;
                }
                return responsePage([createLesson({ id: 10 })], 1);
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            copyText: async () => {},
            log: () => {}
        });
        await feature.open();

        await dialog.emit('edvibe-batch-access-input-change', {
            emailInput: 'valid@example.com; invalid'
        });
        assert.deepEqual(findDialogCalls(dialog, 'setEmailState').at(-1).args, [{
            validCount: 1,
            malformedCount: 1
        }]);

        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: 'bad address; missing@example.com; duplicate@example.com',
            selectedLessonIds: [10]
        });

        assert.equal(stateReads, 0);
        assert.equal(writes, 0);
        const errors = findDialogCalls(dialog, 'showValidationErrors').at(-1).args[0];
        assert.equal(errors.length, 3);
        assert.deepEqual(
            errors.map((error) => error.code || error.type),
            ['INVALID_EMAIL', 'missing', 'ambiguous']
        );
    } finally {
        browser.restore();
    }
});

test('batch feature retries and completes all matched-pupil state reads before confirmation', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const pupils = [
        createPupil({ pupilId: 1, email: 'first@example.com' }),
        createPupil({ pupilId: 2, email: 'second@example.com' })
    ];
    const waits = [];
    const stateRequests = [];
    let initializing = true;
    let firstPupilSecondPageFailures = 0;
    let writes = 0;

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method, _project, value) => {
                if (method === 'GetMarathonPupils') {
                    return responsePage(pupils, pupils.length);
                }
                if (method === 'ChangeIsOpenLessonForPupil') {
                    writes += 1;
                    return { Value: true };
                }
                if (initializing) {
                    return responsePage([
                        createLesson({ id: 10 }),
                        createLesson({ id: 11 })
                    ], 2);
                }

                stateRequests.push({ pupilId: value.PupilId, skip: value.Page.Skip });
                if (
                    value.PupilId === 1
                    && value.Page.Skip === 1
                    && firstPupilSecondPageFailures++ === 0
                ) {
                    throw createFeatureError('REQUEST_TIMEOUT', 'Timed out.');
                }
                const lessons = value.PupilId === 1
                    ? [
                        createLesson({ id: 10, isOpen: false }),
                        createLesson({ id: 11, isOpen: true })
                    ]
                    : [
                        createLesson({ id: 10, isOpen: false }),
                        createLesson({ id: 11, isOpen: false })
                    ];
                return responsePage(
                    lessons.slice(value.Page.Skip, value.Page.Skip + 1),
                    lessons.length
                );
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async (delay) => waits.push(delay),
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            copyText: async () => {},
            log: () => {}
        });
        await feature.open();
        initializing = false;

        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: 'first@example.com; second@example.com',
            selectedLessonIds: [10, 11]
        });

        assert.deepEqual(waits, [1000]);
        assert.deepEqual(stateRequests, [
            { pupilId: 1, skip: 0 },
            { pupilId: 1, skip: 1 },
            { pupilId: 1, skip: 0 },
            { pupilId: 1, skip: 1 },
            { pupilId: 2, skip: 0 },
            { pupilId: 2, skip: 1 }
        ]);
        assert.equal(writes, 0);
        const confirmation = findDialogCalls(dialog, 'showConfirmation').at(-1).args[0];
        assert.equal(confirmation.matchedUsers, 2);
        assert.equal(confirmation.selectedLessons, 2);
        assert.equal(confirmation.needsOpening.length, 3);
        assert.equal(confirmation.alreadyOpen.length, 1);
    } finally {
        browser.restore();
    }
});

test('batch feature aggregates final read and plan errors while issuing zero writes', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const pupils = [
        createPupil({ pupilId: 1, email: 'inconsistent@example.com' }),
        createPupil({ pupilId: 2, email: 'failed-read@example.com' })
    ];
    let initializing = true;
    let writes = 0;
    const logs = [];

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method, _project, value) => {
                if (method === 'GetMarathonPupils') {
                    return responsePage(pupils, pupils.length);
                }
                if (method === 'ChangeIsOpenLessonForPupil') {
                    writes += 1;
                    return { Value: true };
                }
                if (initializing) {
                    return responsePage([createLesson({ id: 10 })], 1);
                }
                if (value.PupilId === 2) {
                    throw createFeatureError(
                        'SERVER_REJECTED',
                        'SENTINEL_RAW_READ_RESPONSE'
                    );
                }
                return responsePage([], 0);
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            copyText: async () => {},
            log: (message) => logs.push(message)
        });
        await feature.open();
        initializing = false;

        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: 'inconsistent@example.com; failed-read@example.com',
            selectedLessonIds: [10]
        });

        const errors = findDialogCalls(dialog, 'showValidationErrors').at(-1).args[0];
        assert.equal(errors.length, 2);
        assert.deepEqual(errors.map((error) => error.code), [
            'SERVER_REJECTED',
            'INVALID_RESPONSE'
        ]);
        assert.equal(errors[0].email, 'failed-read@example.com');
        assert.match(errors[0].message, /failed-read@example\.com/);
        assert.match(errors[0].message, /SERVER_REJECTED/);
        assert.doesNotMatch(errors[0].message, /SENTINEL_RAW_READ_RESPONSE/);
        assert.doesNotMatch(logs.join('\n'), /failed-read@example\.com|SENTINEL_RAW_READ_RESPONSE/);
        assert.equal(findDialogCalls(dialog, 'showConfirmation').length, 0);
        assert.equal(writes, 0);
    } finally {
        browser.restore();
    }
});

test('batch feature completes an all-already-open plan without confirmation or writes', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const pupil = createPupil({ pupilId: 1, email: 'open@example.com' });
    let initializing = true;
    let writes = 0;

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method) => {
                if (method === 'GetMarathonPupils') {
                    return responsePage([pupil], 1);
                }
                if (method === 'ChangeIsOpenLessonForPupil') {
                    writes += 1;
                    return { Value: true };
                }
                return responsePage([
                    createLesson({ id: 10, isOpen: initializing ? false : true })
                ], 1);
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            copyText: async () => {},
            log: () => {}
        });
        await feature.open();
        initializing = false;

        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: 'open@example.com',
            selectedLessonIds: [10]
        });

        assert.equal(findDialogCalls(dialog, 'showConfirmation').length, 0);
        assert.equal(writes, 0);
        assert.deepEqual(findDialogCalls(dialog, 'showComplete').at(-1).args[0], {
            requestedEmails: ['open@example.com'],
            matchedUsers: 1,
            selectedLessons: 1,
            opened: [],
            alreadyOpen: 1,
            failures: [],
            attempts: 0
        });
    } finally {
        browser.restore();
    }
});

test('batch feature renders and copies a partial result after an internal mutation error', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const pupil = createPupil({
        pupilId: 1,
        marathonPupilId: 101,
        email: 'internal@example.com'
    });
    const lessons = [10, 11, 12].map((id, index) => createLesson({
        id,
        number: index,
        name: `Internal lesson ${index + 1}`,
        isOpen: false
    }));
    const writes = [];
    const copied = [];

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method, _project, value) => {
                if (method === 'GetMarathonPupils') {
                    return responsePage([pupil], 1);
                }
                if (method === 'GetMarathonLessonsForPupilPagination') {
                    return responsePage(lessons, lessons.length);
                }
                writes.push(value.MarathonLessonId);
                if (value.MarathonLessonId === 11) {
                    throw new TypeError('SENTINEL_INTERNAL_MUTATION');
                }
                return { Value: true };
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            copyText: async (text) => copied.push(text),
            log: () => {}
        });

        await feature.open();
        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: 'internal@example.com',
            selectedLessonIds: [10, 11, 12]
        });
        await dialog.emit('edvibe-batch-access-confirm');

        assert.deepEqual(writes, [10, 11]);
        assert.equal(feature.isRunning(), false);
        const completed = findDialogCalls(dialog, 'showComplete').at(-1).args[0];
        assert.deepEqual(completed.opened.map((item) => item.marathonLessonId), [10]);
        assert.equal(completed.failures.length, 1);
        assert.equal(completed.failures[0].code, 'INTERNAL_ERROR');
        assert.equal(completed.failures[0].marathonLessonId, 11);
        assert.equal(completed.attempts, 2);

        await dialog.emit('edvibe-batch-access-copy-report');
        assert.equal(copied.length, 1);
        assert.match(copied[0], /Opened: 1/);
        assert.match(copied[0], /Failed: 1/);
        assert.match(copied[0], /INTERNAL_ERROR/);
        assert.doesNotMatch(copied[0], /SENTINEL_INTERNAL_MUTATION/);
    } finally {
        browser.restore();
    }
});

test('batch feature renders a partial result when progress rendering throws after a write', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const pupil = createPupil({
        pupilId: 1,
        marathonPupilId: 101,
        email: 'render@example.com'
    });
    const lessons = [20, 21, 22].map((id, index) => createLesson({
        id,
        number: index,
        name: `Render lesson ${index + 1}`,
        isOpen: false
    }));
    const writes = [];
    const recordExecution = dialog.showExecution;
    dialog.showExecution = (progress) => {
        recordExecution(progress);
        if (progress.completed === 1) {
            throw new TypeError('render failed');
        }
        return dialog;
    };

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method, _project, value) => {
                if (method === 'GetMarathonPupils') {
                    return responsePage([pupil], 1);
                }
                if (method === 'GetMarathonLessonsForPupilPagination') {
                    return responsePage(lessons, lessons.length);
                }
                writes.push(value.MarathonLessonId);
                return { Value: true };
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            copyText: async () => {},
            log: () => {}
        });

        await feature.open();
        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: 'render@example.com',
            selectedLessonIds: [20, 21, 22]
        });
        await dialog.emit('edvibe-batch-access-confirm');

        assert.deepEqual(writes, [20]);
        assert.equal(feature.isRunning(), false);
        const completed = findDialogCalls(dialog, 'showComplete').at(-1).args[0];
        assert.deepEqual(completed.opened.map((item) => item.marathonLessonId), [20]);
        assert.equal(completed.failures.length, 1);
        assert.equal(completed.failures[0].code, 'INTERNAL_ERROR');
        assert.equal(completed.failures[0].marathonLessonId, 20);
        assert.equal(completed.attempts, 1);
    } finally {
        browser.restore();
    }
});

test('batch feature continues after an expected write failure with accurate safe reporting', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const sentinelEmail = 'sentinel-email@example.com';
    const pupil = createPupil({
        pupilId: 1,
        marathonPupilId: 101,
        email: sentinelEmail
    });
    const lessons = [
        createLesson({
            id: 30,
            number: 0,
            name: 'SENTINEL_LESSON_ONE',
            isOpen: false
        }),
        createLesson({
            id: 31,
            number: 1,
            name: 'SENTINEL_LESSON_TWO',
            isOpen: false
        })
    ];
    const writes = [];
    const copied = [];
    const logs = [];

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method, _project, value) => {
                if (method === 'GetMarathonPupils') {
                    return responsePage([pupil], 1);
                }
                if (method === 'GetMarathonLessonsForPupilPagination') {
                    return responsePage(lessons, lessons.length);
                }
                writes.push(value.MarathonLessonId);
                if (value.MarathonLessonId === 30) {
                    throw createFeatureError(
                        'SERVER_REJECTED',
                        'SENTINEL_PAYLOAD_REJECTED'
                    );
                }
                return { Value: true };
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            copyText: async (text) => copied.push(text),
            log: (message) => logs.push(message)
        });

        await feature.open();
        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: sentinelEmail,
            selectedLessonIds: [30, 31]
        });
        await dialog.emit('edvibe-batch-access-confirm');

        assert.deepEqual(writes, [30, 31]);
        const completed = findDialogCalls(dialog, 'showComplete').at(-1).args[0];
        assert.equal(completed.opened.length, 1);
        assert.equal(completed.opened[0].marathonLessonId, 31);
        assert.equal(completed.failures.length, 1);
        assert.equal(completed.failures[0].code, 'SERVER_REJECTED');
        assert.equal(completed.attempts, 2);

        await dialog.emit('edvibe-batch-access-copy-report');
        assert.equal(copied.length, 1);
        assert.match(copied[0], /Opened: 1/);
        assert.match(copied[0], /Failed: 1/);
        assert.match(copied[0], /Attempts: 2/);
        assert.doesNotMatch(
            logs.join('\n'),
            /sentinel-email@example\.com|SENTINEL_LESSON|SENTINEL_PAYLOAD/
        );
    } finally {
        browser.restore();
    }
});

test('batch feature executes a frozen plan once, forwards progress, copies result, and reuses caches', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const pupil = createPupil({
        pupilId: 1,
        marathonPupilId: 101,
        email: 'frozen@example.com'
    });
    const activeChanges = [];
    const copied = [];
    let rosterReads = 0;
    let catalogueOrStateReads = 0;
    let writes = 0;
    let resolveWrite;
    let initializationComplete = false;

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method, _project, value) => {
                if (method === 'GetMarathonPupils') {
                    rosterReads += 1;
                    return responsePage([pupil], 1);
                }
                if (method === 'GetMarathonLessonsForPupilPagination') {
                    catalogueOrStateReads += 1;
                    return responsePage([
                        createLesson({ id: 10, number: 4, name: 'Frozen lesson', isOpen: false })
                    ], 1);
                }
                writes += 1;
                assert.deepEqual(value, {
                    IsOpen: true,
                    MarathonLessonId: 10,
                    MarathonPupilId: 101,
                    MarathonId: 18508
                });
                if (!initializationComplete) {
                    assert.fail('writes cannot occur during initialization');
                }
                return new Promise((resolve) => {
                    resolveWrite = resolve;
                });
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: (active) => activeChanges.push(active),
            createDialog: () => dialog,
            copyText: async (text) => copied.push(text),
            log: () => {}
        });
        await feature.open();
        initializationComplete = true;

        const submitted = {
            emailInput: 'frozen@example.com',
            selectedLessonIds: [10]
        };
        await dialog.emit('edvibe-batch-access-submit', submitted);
        submitted.emailInput = 'changed@example.com';
        submitted.selectedLessonIds[0] = 999;

        const confirmation = findDialogCalls(dialog, 'showConfirmation').at(-1).args[0];
        assert.ok(Object.isFrozen(confirmation.needsOpening));
        assert.ok(Object.isFrozen(confirmation.needsOpening[0]));

        const firstConfirmation = dialog.emit('edvibe-batch-access-confirm');
        await Promise.resolve();
        await dialog.emit('edvibe-batch-access-confirm');
        assert.equal(feature.isRunning(), true);
        assert.equal(writes, 1);

        resolveWrite({ Value: true });
        await firstConfirmation;

        assert.equal(feature.isRunning(), false);
        assert.equal(writes, 1);
        const progress = findDialogCalls(dialog, 'showExecution');
        assert.equal(progress.length, 2);
        assert.equal(progress[0].args[0].total, 1);
        assert.equal(progress[1].args[0].completed, 1);
        const completed = findDialogCalls(dialog, 'showComplete').at(-1).args[0];
        assert.deepEqual(completed.requestedEmails, ['frozen@example.com']);
        assert.equal(completed.selectedLessons, 1);
        assert.equal(completed.opened[0].marathonLessonId, 10);

        await dialog.emit('edvibe-batch-access-copy-report');
        assert.equal(copied.length, 1);
        assert.equal(copied[0], formatBatchReport(completed));

        const readsBeforeRestart = { rosterReads, catalogueOrStateReads };
        await dialog.emit('edvibe-batch-access-restart');
        assert.deepEqual({ rosterReads, catalogueOrStateReads }, readsBeforeRestart);
        await dialog.emit('edvibe-batch-access-copy-report');
        assert.equal(copied.length, 1);

        await dialog.emit('edvibe-dialog-close');
        assert.deepEqual(activeChanges, [true, false]);
    } finally {
        browser.restore();
    }
});

test('batch feature close clears a pending plan, releases once, and reinitializes on reopen', async () => {
    const browser = installFeatureBrowser();
    const dialogs = [createFeatureDialog(), createFeatureDialog()];
    const pupil = createPupil({
        pupilId: 1,
        marathonPupilId: 101,
        email: 'pending@example.com'
    });
    const activeChanges = [];
    let rosterReads = 0;
    let lessonReads = 0;
    let writes = 0;
    let dialogIndex = 0;

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method) => {
                if (method === 'GetMarathonPupils') {
                    rosterReads += 1;
                    return responsePage([pupil], 1);
                }
                if (method === 'GetMarathonLessonsForPupilPagination') {
                    lessonReads += 1;
                    return responsePage([createLesson({ id: 10, isOpen: false })], 1);
                }
                writes += 1;
                return { Value: true };
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: (active) => activeChanges.push(active),
            createDialog: () => dialogs[dialogIndex++],
            copyText: async () => {},
            log: () => {}
        });

        await feature.open();
        await dialogs[0].emit('edvibe-batch-access-submit', {
            emailInput: 'pending@example.com',
            selectedLessonIds: [10]
        });
        assert.equal(findDialogCalls(dialogs[0], 'showConfirmation').length, 1);

        await dialogs[0].emit('edvibe-dialog-close');
        await dialogs[0].emit('edvibe-dialog-close');
        await dialogs[0].emit('edvibe-batch-access-confirm');

        assert.equal(writes, 0);
        assert.deepEqual(activeChanges, [true, false]);

        await feature.open();

        assert.equal(rosterReads, 2);
        assert.equal(lessonReads, 3);
        assert.equal(findDialogCalls(dialogs[1], 'showConfigure').length, 1);
        assert.deepEqual(activeChanges, [true, false, true]);

        await dialogs[1].emit('edvibe-dialog-close');
        await dialogs[1].emit('edvibe-dialog-close');
        assert.deepEqual(activeChanges, [true, false, true, false]);
    } finally {
        browser.restore();
    }
});

test('batch feature close discards the completed result while restart remains cache-preserving', async () => {
    const browser = installFeatureBrowser();
    const dialog = createFeatureDialog();
    const pupil = createPupil({ pupilId: 1, email: 'complete@example.com' });
    const copied = [];
    let initializationComplete = false;
    let reads = 0;

    try {
        const feature = createBatchLessonAccessFeature({
            sendRequest: async (_controller, method) => {
                reads += 1;
                if (method === 'GetMarathonPupils') {
                    return responsePage([pupil], 1);
                }
                return responsePage([
                    createLesson({ id: 10, isOpen: initializationComplete })
                ], 1);
            },
            getConnectionState: () => ({ isOpen: true }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: () => {},
            createDialog: () => dialog,
            copyText: async (text) => copied.push(text),
            log: () => {}
        });

        await feature.open();
        initializationComplete = true;
        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: 'complete@example.com',
            selectedLessonIds: [10]
        });
        await dialog.emit('edvibe-batch-access-copy-report');
        assert.equal(copied.length, 1);

        const readsBeforeRestart = reads;
        await dialog.emit('edvibe-batch-access-restart');
        assert.equal(reads, readsBeforeRestart);

        await dialog.emit('edvibe-batch-access-submit', {
            emailInput: 'complete@example.com',
            selectedLessonIds: [10]
        });
        await dialog.emit('edvibe-dialog-close');
        await dialog.emit('edvibe-batch-access-copy-report');

        assert.equal(copied.length, 1);
    } finally {
        browser.restore();
    }
});
