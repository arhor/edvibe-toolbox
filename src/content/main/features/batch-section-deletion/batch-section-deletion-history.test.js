import assert from 'node:assert/strict';
import test from 'node:test';

import {
    createBatchSectionDeletionHistoryOperation,
    serializeResult
} from '#src/content/main/features/batch-section-deletion/batch-section-deletion-history.js';
import {
    createBatchSectionDeletionFeature,
    executePlan
} from '#src/content/main/features/batch-section-deletion/batch-section-deletion.js';

function attempt(correlationId, requestId, transportCode = 'SERVER_REJECTED') {
    return { correlationId, operationName: 'write', controller: 'C', method: 'POST', projectName: 'P', requestId, attemptNumber: 1, startedAt: '2026-01-01T00:00:00.000Z', completedAt: null, durationMs: null, outcome: 'failure', transportCode, serverErrorCode: 'DENIED', serverErrorMessage: null, requestSummary: null, responseSummary: null };
}

function lesson(lessonId, sectionId = lessonId + 100) {
    return {
        lessonId,
        marathonLessonId: lessonId,
        number: lessonId,
        name: `Lesson ${lessonId}`,
        sectionName: 'S',
        sectionId
    };
}

function plan(...lessons) {
    return Object.freeze({
        sectionName: 'S',
        selectedLessonIds: Object.freeze(lessons.map((entry) => entry.lessonId)),
        selectedCount: lessons.length,
        eligible: Object.freeze(lessons),
        rejected: Object.freeze([])
    });
}

function timestamps() {
    const values = [
        new Date('2026-01-01T00:00:00.000Z'),
        new Date('2026-01-01T00:00:01.000Z')
    ];
    return () => values.shift() || new Date('2026-01-01T00:00:02.000Z');
}

function historyOperation({ execute, persistExecution }) {
    return createBatchSectionDeletionHistoryOperation({
        execute,
        persistExecution,
        getLocationHref: () => 'https://edvibe.com/marathon/7',
        getMarathonName: () => 'Marathon',
        now: timestamps()
    });
}

test('preserves server rejection and transport failure diagnostics for deletion requests', () => {
    for (const [code, id] of [['SERVER_REJECTED', 'reject-1'], ['REQUEST_TIMEOUT', 'timeout-2']]) {
        const result = serializeResult({ lessonId: 1, number: 1, name: 'L', status: 'failed', code, attempts: 1, diagnostics: { requestAttempts: [attempt('lesson:1', id, code)] } }, { sectionName: 'S' }, null);
        assert.equal(result.diagnostics.requestAttempts[0].requestId, id);
    }
});

test('records success, returned partial failure, and fatal interruption at the operation boundary', async () => {
    // Given
    const inputs = [];
    const persistExecution = async (input) => {
        inputs.push(input);
        return Object.freeze({ stored: true, record: Object.freeze({ id: `history-${inputs.length}` }) });
    };
    const successful = lesson(1);
    const deleted = lesson(2);
    const failed = lesson(3);
    const interrupted = lesson(4);

    const successfulOperation = historyOperation({
        execute: async () => ({
            results: [{ ...successful, status: 'deleted', code: 'DELETED', message: 'Section deleted.' }]
        }),
        persistExecution
    });
    const partialOperation = historyOperation({
        execute: async () => ({
            results: [
                { ...deleted, status: 'deleted', code: 'DELETED', message: 'Section deleted.' },
                { ...failed, status: 'failed', code: 'SERVER_REJECTED', message: 'Denied.', attempts: 1 }
            ]
        }),
        persistExecution
    });
    const partialResult = {
        results: [{ ...interrupted, status: 'failed', code: 'INTERNAL_ERROR', message: 'Stopped.', attempts: 1 }]
    };
    const fatalError = Object.assign(new Error('boom'), { partialResult });
    const interruptedOperation = historyOperation({
        execute: async () => {
            throw fatalError;
        },
        persistExecution
    });

    // When
    await successfulOperation({ plan: plan(successful) });
    await partialOperation({ plan: plan(deleted, failed) });
    await assert.rejects(
        () => interruptedOperation({ plan: plan(interrupted) }),
        (error) => error === fatalError
    );

    // Then
    assert.deepEqual(inputs.map((input) => input.status), [
        'completed',
        'completed_with_failures',
        'interrupted'
    ]);
    assert.equal(inputs[0].counts.successful, 1);
    assert.equal(inputs[1].counts.successful, 1);
    assert.equal(inputs[1].counts.failed, 1);
    assert.equal(inputs[2].counts.failed, 1);
});

test('does not create history for preflight when execution never starts', async () => {
    // Given
    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    let options = null;
    let sessionOpen = false;
    const persisted = [];
    const fakeDialog = { configure(value) { options = value; } };
    const session = {
        isOpen: () => sessionOpen,
        activate() { sessionOpen = true; return true; },
        release() { sessionOpen = false; },
        ownDialog: (dialog) => dialog,
        close() { sessionOpen = false; }
    };
    const sendRequest = async (_controller, method) => {
        if (method === 'GetMarathonLessonsPagination') {
            return { Value: { Items: [{ LessonId: 1, MarathonLessonId: 11, Number: 1, Name: 'Lesson 1' }], Page: { Count: 1 } } };
        }
        if (method === 'GetLessonWithId') {
            return { Value: { Sections: [{ Id: 101, Name: 'Target' }] } };
        }
        throw new Error(`Unexpected request method: ${method}`);
    };
    const executeOperation = historyOperation({
        execute: ({ plan: executionPlan, onProgress }) => executePlan({
            plan: executionPlan,
            sendRequest,
            wait: async () => {},
            onProgress
        }),
        persistExecution: async (input) => {
            persisted.push(input);
            return Object.freeze({ stored: true });
        }
    });
    const feature = createBatchSectionDeletionFeature({
        sendRequest,
        getConnectionState: () => ({ ready: true }),
        session,
        createDialog: () => fakeDialog,
        copyText: async () => {},
        executeOperation
    });
    globalThis.window = { location: { href: 'https://edvibe.com/marathon/7' }, alert() {} };
    globalThis.document = { body: { append() {} } };

    try {
        // When
        await feature.open();
        await options.onInspect({ sectionName: 'Target', selectedLessonIds: [1], onProgress() {} });
        options.onClose();

        // Then
        assert.equal(persisted.length, 0);
    } finally {
        if (previousWindow === undefined) delete globalThis.window;
        else globalThis.window = previousWindow;
        if (previousDocument === undefined) delete globalThis.document;
        else globalThis.document = previousDocument;
    }
});

test('executes the feature with decorated history without a Lit dialog', async () => {
    // Given
    const previousWindow = globalThis.window;
    const previousDocument = globalThis.document;
    let appendedDialog = null;
    let dialogOptions = null;
    let sessionOpen = false;
    const persisted = [];
    const fakeDialog = { configure(options) { dialogOptions = options; return this; } };
    const session = {
        isOpen: () => sessionOpen,
        activate() { sessionOpen = true; return true; },
        release() { sessionOpen = false; },
        ownDialog: (dialog) => dialog,
        close() { sessionOpen = false; }
    };
    const sendRequest = async (_controller, method) => {
        if (method === 'GetMarathonLessonsPagination') {
            return { Value: { Items: [{ LessonId: 1, MarathonLessonId: 11, Number: 1, Name: 'Lesson 1' }], Page: { Count: 1 } } };
        }
        if (method === 'GetLessonWithId') {
            return { Value: { Sections: [{ Id: 101, Name: 'Target' }] } };
        }
        if (method === 'DeleteStageSection') {
            return { Value: true };
        }
        throw new Error(`Unexpected request method: ${method}`);
    };
    const executeOperation = historyOperation({
        execute: ({ plan: executionPlan, onProgress }) => executePlan({
            plan: executionPlan,
            sendRequest,
            wait: async () => {},
            onProgress
        }),
        persistExecution: async (input) => {
            persisted.push(input);
            return Object.freeze({ stored: true, record: Object.freeze({ id: 'history-1' }) });
        }
    });
    const feature = createBatchSectionDeletionFeature({
        sendRequest,
        getConnectionState: () => ({ ready: true }),
        session,
        createDialog: () => fakeDialog,
        copyText: async () => {},
        executeOperation
    });
    globalThis.window = { location: { href: 'https://edvibe.com/marathon/7' }, alert() { throw new Error('Unexpected alert'); } };
    globalThis.document = { body: { append(dialog) { appendedDialog = dialog; } } };

    try {
        // When
        await feature.open();
        const executionPlan = await dialogOptions.onInspect({ sectionName: 'Target', selectedLessonIds: [1], onProgress() {} });
        const result = await dialogOptions.onExecute(executionPlan, () => {});

        // Then
        assert.equal(appendedDialog, fakeDialog);
        assert.equal(result.results[0].status, 'deleted');
        assert.equal(persisted.length, 1);
        assert.equal(persisted[0].status, 'completed');
        assert.equal(persisted[0].counts.successful, 1);
    } finally {
        if (previousWindow === undefined) delete globalThis.window;
        else globalThis.window = previousWindow;
        if (previousDocument === undefined) delete globalThis.document;
        else globalThis.document = previousDocument;
    }
});
