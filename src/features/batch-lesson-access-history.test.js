const test = require('node:test');
const assert = require('node:assert/strict');

const {
    OPERATION_TYPE,
    buildObservedPlan,
    buildExecutionHistoryInput,
    createHistoryAwareFeature
} = require('./batch-lesson-access-history.js');

function pupil(email, pupilId, marathonPupilId = pupilId + 1000) {
    return Object.freeze({ email, pupilId, marathonPupilId });
}

function lesson(marathonLessonId, lessonNumber, lessonName, isOpen) {
    return Object.freeze({ marathonLessonId, lessonNumber, lessonName, isOpen });
}

function buildPlan(overrides = {}) {
    return buildObservedPlan({
        submittedEmailInput: 'first@example.com, second@example.com',
        selectedLessonIds: [10, 20],
        pupils: [pupil('first@example.com', 1, 101), pupil('second@example.com', 2, 102)],
        lessonsByPupilId: new Map([
            [1, [lesson(10, 1, 'Intro', false), lesson(20, 2, 'Practice', true)]],
            [2, [lesson(10, 1, 'Intro', false), lesson(20, 2, 'Practice', false)]]
        ]),
        lessonCatalogue: [lesson(10, 1, 'Intro', false), lesson(20, 2, 'Practice', false)],
        ...overrides
    });
}

function matrix(record) {
    return record.results.filter((result) => result.data?.marathonLessonId !== undefined);
}

test('serializes successful, retried, and already-open combinations with stable matrix data', () => {
    const plan = buildPlan();
    const input = buildExecutionHistoryInput({
        plan,
        summary: {
            opened: [
                { email: 'first@example.com', marathonLessonId: 10 },
                { email: 'second@example.com', marathonLessonId: 10 },
                { email: 'second@example.com', marathonLessonId: 20 }
            ],
            failures: []
        },
        writeAttempts: new Map([['101:10', 1], ['102:10', 2], ['102:20', 1]]),
        startedAt: '2026-08-06T08:00:00.000Z',
        completedAt: '2026-08-06T08:01:00.000Z',
        marathonId: 18508,
        marathonName: 'Autumn marathon'
    });

    assert.equal(input.operationType, OPERATION_TYPE);
    assert.equal(input.status, 'completed');
    assert.deepEqual(input.counts, {
        requested: 2,
        eligible: 4,
        attempted: 3,
        successful: 3,
        noOp: 1,
        skipped: 0,
        failed: 0,
        notAttempted: 0
    });
    assert.deepEqual(matrix(input).map((result) => [result.data.outcome, result.attempts]), [
        ['opened', 1],
        ['already_open', 0],
        ['opened', 2],
        ['opened', 1]
    ]);
    assert.deepEqual(matrix(input)[0].data, {
        submittedEmail: 'first@example.com',
        resolvedEmail: 'first@example.com',
        pupilId: 1,
        marathonPupilId: 101,
        marathonLessonId: 10,
        lessonNumber: 1,
        lessonName: 'Intro',
        preflightAccessState: 'closed',
        outcome: 'opened'
    });
});

test('distinguishes rejected lesson responses from failed writes', () => {
    const input = buildExecutionHistoryInput({
        plan: buildPlan({ selectedLessonIds: [10] }),
        summary: {
            opened: [],
            failures: [
                { email: 'first@example.com', marathonLessonId: 10, attempts: 1, code: 'INVALID_RESPONSE', message: 'Unsafe reply.' },
                { email: 'second@example.com', marathonLessonId: 10, attempts: 3, code: 'REQUEST_TIMEOUT', message: 'Timed out.' }
            ]
        },
        startedAt: '2026-08-06T08:00:00.000Z',
        completedAt: '2026-08-06T08:01:00.000Z',
        marathonId: 18508
    });

    assert.equal(input.status, 'completed_with_failures');
    assert.deepEqual(matrix(input).map((result) => [result.data.outcome, result.code, result.attempts]), [
        ['rejected', 'INVALID_RESPONSE', 1],
        ['failed', 'REQUEST_TIMEOUT', 3]
    ]);
    assert.equal(input.counts.failed, 2);
});

test('preserves malformed, missing, and ambiguous user inputs', () => {
    const plan = buildObservedPlan({
        submittedEmailInput: 'broken, missing@example.com, duplicate@example.com',
        selectedLessonIds: [10],
        pupils: [
            pupil('duplicate@example.com', 1, 101),
            pupil('Duplicate@example.com', 2, 102)
        ],
        lessonsByPupilId: new Map(),
        lessonCatalogue: [lesson(10, 1, 'Intro', false)]
    });
    const input = buildExecutionHistoryInput({
        plan,
        startedAt: '2026-08-06T08:00:00.000Z',
        completedAt: '2026-08-06T08:00:01.000Z',
        marathonId: 18508
    });

    assert.equal(input.status, 'completed_with_failures');
    assert.deepEqual(input.results.map((result) => [result.data.resolution, result.code]), [
        ['malformed', 'USER_INPUT_MALFORMED'],
        ['missing', 'USER_NOT_FOUND'],
        ['ambiguous', 'USER_AMBIGUOUS']
    ]);
    assert.equal(input.counts.requested, 3);
    assert.equal(input.counts.skipped, 3);
});

test('preserves discovery failures, missing selected lessons, and invalid access states', () => {
    const plan = buildObservedPlan({
        submittedEmailInput: 'first@example.com, second@example.com, third@example.com',
        selectedLessonIds: [10, 20],
        pupils: [
            pupil('first@example.com', 1, 101),
            pupil('second@example.com', 2, 102),
            pupil('third@example.com', 3, 103)
        ],
        lessonsByPupilId: new Map([
            [1, [lesson(10, 1, 'Intro', false)]],
            [2, [lesson(10, 1, 'Intro', null), lesson(20, 2, 'Practice', true)]]
        ]),
        lessonCatalogue: [lesson(10, 1, 'Intro', false), lesson(20, 2, 'Practice', false)],
        errors: [{
            code: 'REQUEST_TIMEOUT',
            message: 'Could not load lesson access for third@example.com.',
            email: 'third@example.com',
            pupilId: 3,
            attempts: 3
        }]
    });
    const input = buildExecutionHistoryInput({
        plan,
        summary: { opened: [{ email: 'first@example.com', marathonLessonId: 10 }], failures: [] },
        writeAttempts: new Map([['101:10', 1]]),
        startedAt: '2026-08-06T08:00:00.000Z',
        completedAt: '2026-08-06T08:01:00.000Z',
        marathonId: 18508
    });

    assert.equal(input.results.some((result) => result.code === 'REQUEST_TIMEOUT' && result.data.stage === 'lesson_state_discovery'), true);
    assert.deepEqual(matrix(input).map((result) => [result.data.resolvedEmail, result.data.marathonLessonId, result.data.outcome, result.code]), [
        ['first@example.com', 10, 'opened', 'LESSON_ACCESS_OPENED'],
        ['first@example.com', 20, 'rejected', 'LESSON_NOT_RETURNED'],
        ['second@example.com', 10, 'rejected', 'INVALID_ACCESS_STATE'],
        ['second@example.com', 20, 'already_open', 'LESSON_ALREADY_OPEN'],
        ['third@example.com', 10, 'not_attempted', 'LESSON_STATE_UNAVAILABLE'],
        ['third@example.com', 20, 'not_attempted', 'LESSON_STATE_UNAVAILABLE']
    ]);
});

test('marks the untouched remainder of an interrupted confirmed matrix as not attempted', () => {
    const input = buildExecutionHistoryInput({
        plan: buildPlan({ selectedLessonIds: [10] }),
        summary: {
            opened: [{ email: 'first@example.com', marathonLessonId: 10 }],
            failures: []
        },
        writeAttempts: new Map([['101:10', 1]]),
        startedAt: '2026-08-06T08:00:00.000Z',
        completedAt: '2026-08-06T08:01:00.000Z',
        marathonId: 18508,
        terminalStatus: 'interrupted'
    });

    assert.equal(input.status, 'interrupted');
    assert.deepEqual(matrix(input).map((result) => result.data.outcome), ['opened', 'not_attempted']);
    assert.equal(input.counts.notAttempted, 1);
});

test('supports cancellation and keeps records free from unsafe transport fields', () => {
    const input = buildExecutionHistoryInput({
        plan: buildPlan({ selectedLessonIds: [10] }),
        startedAt: '2026-08-06T08:00:00.000Z',
        completedAt: '2026-08-06T08:01:00.000Z',
        marathonId: 18508,
        terminalStatus: 'cancelled'
    });
    const json = JSON.stringify(input);

    assert.equal(input.status, 'cancelled');
    assert.deepEqual(matrix(input).map((result) => result.data.outcome), ['not_attempted', 'not_attempted']);
    assert.doesNotMatch(json, /websocket|transport|session|raw|response/i);
});

function createDialog() {
    const listeners = new Map();
    const footerChildren = [];
    const dialog = {
        elements: {
            status: { textContent: '' },
            footer: { appendChild(value) { footerChildren.push(value); } }
        },
        footerChildren,
        addEventListener(type, listener) {
            const values = listeners.get(type) || [];
            values.push(listener);
            listeners.set(type, values);
        },
        emit(type, detail) {
            for (const listener of listeners.get(type) || []) listener({ detail });
        },
        configure() { return this; },
        showConfigure() { return this; },
        showConfirmation() { return this; },
        showValidationErrors() { return this; },
        showComplete() { return this; },
        showFatalError() { return this; },
        setStatus(message) { this.elements.status.textContent = message; return this; }
    };
    return dialog;
}

function installDocument() {
    const previous = global.document;
    global.document = {
        createElement() {
            return {
                addEventListener() {},
                remove() {}
            };
        }
    };
    return () => { global.document = previous; };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

test('history-aware feature persists terminal output without replacing the visible result', async () => {
    const restore = installDocument();
    const persisted = [];
    const baseDialog = createDialog();
    try {
        const feature = createHistoryAwareFeature({
            createFeature: (value) => value,
            sendRequest: async (controller, method, projectName, value) => {
                if (method === 'GetMarathonPupils') return { Value: { Items: [{ Email: 'first@example.com', PupilId: 1, MarathonPupilId: 101 }] } };
                if (method === 'GetMarathonLessonsForPupilPagination') return { Value: { Items: [{ MarathonLessonId: 10, Number: 0, Name: 'Intro', IsOpen: false }] } };
                return { Value: true };
            },
            createDialog: () => baseDialog,
            persistExecution: async (input) => {
                persisted.push(input);
                return { stored: false, persistenceError: new Error('disk full') };
            },
            getLocationHref: () => 'https://app.edvibe.com/marathon/18508',
            now: (() => {
                let tick = 0;
                return () => new Date(1_700_000_000_000 + tick++ * 1000);
            })()
        });
        const dialog = feature.createDialog();
        dialog.configure();
        await feature.sendRequest('', 'GetMarathonPupils', '', { Skip: 0 });
        await feature.sendRequest('', 'GetMarathonLessonsForPupilPagination', '', { PupilId: 1, Page: { Skip: 0 } });
        dialog.showConfigure({ lessons: [{ MarathonLessonId: 10, Number: 0, Name: 'Intro', IsOpen: false }] });
        dialog.emit('edvibe-batch-access-submit', { emailInput: 'first@example.com', selectedLessonIds: [10] });
        dialog.showConfirmation({});
        await feature.sendRequest('', 'ChangeIsOpenLessonForPupil', '', { MarathonPupilId: 101, MarathonLessonId: 10 });
        dialog.showComplete({ opened: [{ email: 'first@example.com', marathonLessonId: 10 }], failures: [] });
        await flush();

        assert.equal(persisted.length, 1);
        assert.equal(persisted[0].results.at(-1).data.outcome, 'opened');
        assert.match(dialog.elements.status.textContent, /записать историю не удалось/);
    } finally {
        restore();
    }
});

test('history record creation failures leave the visible completion intact', async () => {
    const restore = installDocument();
    const logs = [];
    const baseDialog = createDialog();
    try {
        const feature = createHistoryAwareFeature({
            createFeature: (value) => value,
            sendRequest: async (controller, method) => {
                if (method === 'GetMarathonPupils') {
                    return { Value: { Items: [{ Email: 'first@example.com', PupilId: 1, MarathonPupilId: 101 }] } };
                }
                if (method === 'GetMarathonLessonsForPupilPagination') {
                    return { Value: { Items: [{ MarathonLessonId: 10, Number: 0, Name: 'Intro', IsOpen: true }] } };
                }
                return { Value: true };
            },
            createDialog: () => baseDialog,
            persistExecution: async () => {
                throw new Error('must not be reached');
            },
            getLocationHref: () => 'https://app.edvibe.com/marathon/18508',
            getMarathonName: () => {
                throw new Error('page metadata unavailable');
            },
            log: (...values) => logs.push(values)
        });
        const dialog = feature.createDialog();
        await feature.sendRequest('', 'GetMarathonPupils', '', { Skip: 0 });
        await feature.sendRequest('', 'GetMarathonLessonsForPupilPagination', '', { PupilId: 1, Page: { Skip: 0 } });
        dialog.showConfigure({ lessons: [{ MarathonLessonId: 10, Number: 0, Name: 'Intro', IsOpen: true }] });
        dialog.emit('edvibe-batch-access-submit', { emailInput: 'first@example.com', selectedLessonIds: [10] });

        assert.doesNotThrow(() => dialog.showComplete({ opened: [], alreadyOpen: 1, failures: [] }));
        assert.match(dialog.elements.status.textContent, /записать историю не удалось/);
        assert.match(String(logs[0]?.[0]), /record creation failed/);
    } finally {
        restore();
    }
});
