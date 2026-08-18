import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
    ExecutionHistoryDialog,
    formatDiagnosticSummary,
    isExecutionInterruption
} from '#src/content/main/features/execution-history/execution-history-dialog.js';

function attempt(overrides = {}) {
    return {
        projectName: 'School', controller: 'Lessons', operationName: 'archiveLesson', method: 'POST',
        requestId: 'request-7', attemptNumber: 2, durationMs: 125,
        transportCode: 'MESSAGE', serverErrorCode: 'LESSON_LOCKED',
        serverErrorMessage: 'Lesson is locked', requestSummary: { lessonId: 7 },
        responseSummary: { success: false }, ...overrides
    };
}

function templateText(value) {
    if (value == null || value === false) {
        return '';
    }
    if (Array.isArray(value)) {
        return value.map(templateText).join('');
    }
    if (typeof value !== 'object' || !value.strings) {
        return String(value);
    }
    return value.strings.reduce((output, string, index) =>
        `${output}${string}${templateText(value.values[index])}`, '');
}

test('renders diagnostics beneath a failed outcome', () => {
    const dialog = new ExecutionHistoryDialog();
    const markup = templateText(dialog.renderOutcome({
        itemId: '7', label: 'Lesson', status: 'failed', code: 'SERVER_ERROR',
        message: 'Could not archive', attempts: 2, data: {},
        diagnostics: { requestAttempts: [attempt()] }
    }));

    for (const label of ['Endpoint', 'Request ID', 'Attempt', 'Duration', 'Transport code',
        'Server code', 'Server message', 'Request summary', 'Response summary']) {
        assert.match(markup, new RegExp(label));
    }
    assert.match(markup, /POST · School \/ Lessons \/ archiveLesson/);
    assert.match(markup, /request-7/);
});

test('does not add diagnostics to legacy outcomes', () => {
    const dialog = new ExecutionHistoryDialog();
    const markup = templateText(dialog.renderOutcome({
        label: 'Legacy lesson', status: 'failed', code: 'ERROR',
        message: 'Failed', attempts: 1, data: {}
    }));
    assert.doesNotMatch(markup, /Request diagnostics/);
});

test('renders server errors without response bodies as explicitly unavailable', () => {
    const dialog = new ExecutionHistoryDialog();
    const markup = templateText(dialog.renderDiagnostics({
        requestAttempts: [attempt({ responseSummary: null })]
    }));
    assert.match(markup, /Response summary/);
    assert.match(markup, /Not available/);
    assert.equal(formatDiagnosticSummary(null), 'Not available');
});

test('uses an accessible native collapsed details control that supports expanded state', () => {
    const dialog = new ExecutionHistoryDialog();
    const markup = templateText(dialog.renderDiagnostics({ requestAttempts: [attempt()] }));
    assert.match(markup, /<details class="diagnostics">/);
    assert.match(markup, /<summary>Request diagnostics<\/summary>/);
    assert.doesNotMatch(markup, /<details[^>]* open/);
    assert.match(markup, /aria-label=Request attempt 2/);
});

test('identifies itemless failures as execution-level interruptions', () => {
    assert.equal(isExecutionInterruption({ status: 'failed', itemId: null }), true);
    assert.equal(isExecutionInterruption({ status: 'failed', itemId: '7' }), false);
    assert.equal(isExecutionInterruption({ status: 'completed', itemId: null }), false);
});
