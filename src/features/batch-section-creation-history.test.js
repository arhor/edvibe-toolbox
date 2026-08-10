import test from 'node:test';
import assert from 'node:assert/strict';
import * as history from './batch-section-creation-history.js';
import { lessons, plan } from './batch-section-creation-history-test-fixtures.js';

test('history-aware dialog preserves the visible result when persistence rejects', async () => {
    const status = { textContent: '' };
    const dialog = {
        elements: { status },
        shadowRoot: { querySelector: () => null },
        ownerDocument: { createElement: () => null },
        configure() { return this; },
        showConfigure() { return this; },
        showConfirmation() { status.textContent = 'План подтверждён.'; return this; },
        showExecution() { return this; },
        showComplete() { status.textContent = 'Пакетная операция завершена.'; return this; },
        showFatalError() { return this; },
        setStatus(value) { status.textContent = value; },
        addEventListener() {}
    };
    const logs = [];
    const createDialog = history.createHistoryAwareDialog({
        createDialog: () => dialog,
        persistExecution: async () => { throw new Error('database unavailable'); },
        getLocationHref: () => 'https://app.edvibe.com/marathon/77',
        now: () => new Date('2026-08-06T05:00:00.000Z'),
        log: (...args) => logs.push(args)
    });
    const patched = createDialog();
    patched.showConfirmation(plan({ eligible: [lessons()[0]], selectedLessonIds: [101] }));
    patched.showComplete({
        results: [{ ...lessons()[0], status: 'created' }]
    });
    await new Promise((resolve) => setImmediate(resolve));

    assert.match(status.textContent, /Пакетная операция завершена\./);
    assert.match(status.textContent, /записать историю не удалось/);
    assert.equal(logs.length, 1);
});

test('history-aware dialog persists an all-rejected preflight', async () => {
    const status = { textContent: '' };
    const persisted = [];
    const dialog = {
        elements: { status },
        shadowRoot: { querySelector: () => null },
        ownerDocument: { createElement: () => null },
        configure() { return this; },
        showConfigure() { return this; },
        showConfirmation() { status.textContent = 'Нет подходящих уроков.'; return this; },
        showExecution() { return this; },
        showComplete() { return this; },
        showFatalError() { return this; },
        setStatus(value) { status.textContent = value; },
        addEventListener() {}
    };
    const createDialog = history.createHistoryAwareDialog({
        createDialog: () => dialog,
        persistExecution: async (input) => {
            persisted.push(input);
            return { stored: true, record: { id: 'history-id' } };
        },
        getLocationHref: () => 'https://app.edvibe.com/marathon/77',
        now: () => new Date('2026-08-06T05:00:00.000Z')
    });
    const rejectedPlan = plan({
        eligible: [],
        rejected: lessons().map((lesson) => ({
            ...lesson,
            code: 'SECTION_NAME_COLLISION',
            message: 'Already exists.'
        }))
    });
    createDialog().showConfirmation(rejectedPlan);
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(persisted.length, 1);
    assert.equal(persisted[0].status, 'completed_with_failures');
    assert.equal(persisted[0].results.length, 3);
    assert.ok(persisted[0].results.every((result) => result.status === 'rejected'));
});

test('closing a confirmed run persists cancellation and keeps preflight rejections', async () => {
    const listeners = new Map();
    const persisted = [];
    const dialog = {
        elements: { status: { textContent: '' } },
        shadowRoot: { querySelector: () => null },
        ownerDocument: { createElement: () => null },
        configure() { return this; },
        showConfigure() { return this; },
        showConfirmation() { return this; },
        showExecution() { return this; },
        showComplete() { return this; },
        showFatalError() { return this; },
        setStatus() {},
        addEventListener(name, listener) { listeners.set(name, listener); }
    };
    const createDialog = history.createHistoryAwareDialog({
        createDialog: () => dialog,
        persistExecution: async (input) => {
            persisted.push(input);
            return { stored: true };
        },
        now: () => new Date('2026-08-06T05:00:00.000Z')
    });
    const rejected = {
        ...lessons()[1],
        code: 'SECTION_NAME_COLLISION',
        message: 'Already exists.'
    };
    createDialog().showConfirmation(plan({
        eligible: [lessons()[0]],
        rejected: [rejected],
        selectedLessonIds: [101, 102]
    }));
    listeners.get('edvibe-dialog-close')();
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(persisted[0].status, 'cancelled');
    assert.deepEqual(persisted[0].results.map((result) => result.status), [
        'not_attempted', 'rejected'
    ]);
});