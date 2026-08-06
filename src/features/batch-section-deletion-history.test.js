'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const history = require('./batch-section-deletion-history.js');

function createFakeDialog() {
    const status = { textContent: '', hidden: false };
    const footer = { appendChild() {} };
    return {
        status,
        options: null,
        shadowRoot: {
            querySelector(selector) {
                if (selector === '.status') return status;
                if (selector === 'footer') return footer;
                return null;
            }
        },
        ownerDocument: { createElement: () => null },
        configure(options) {
            this.options = options;
            return this;
        },
        showStatus(message) {
            status.textContent = message;
        }
    };
}

function samplePlan(overrides = {}) {
    const eligible = [{
        lessonId: 1,
        marathonLessonId: 11,
        number: 1,
        name: 'Welcome',
        sectionName: 'Promo',
        sectionId: 101,
        sectionType: 'normal',
        discoveryOutcome: 'matched'
    }];
    return {
        sectionName: 'Promo',
        selectedLessonIds: [1],
        selectedCount: 1,
        eligible,
        rejected: [],
        ...overrides
    };
}

function createHarness(options = {}) {
    const dialog = createFakeDialog();
    const feature = history.createHistoryAwareFeature({
        createFeature: ({ createDialog }) => ({ dialog: createDialog() }),
        createDialog: () => dialog,
        persistExecution: options.persistExecution
            || (async () => ({ stored: true, record: { id: 'history-1' } })),
        getLocationHref: () => 'https://app.edvibe.com/marathon/77',
        getMarathonName: () => 'Autumn course',
        now: () => new Date('2026-08-06T10:00:00.000Z'),
        log: options.log || (() => {})
    });
    let closed = false;
    dialog.configure({
        async onInspect() {
            return options.plan || samplePlan();
        },
        async onExecute(plan, onProgress) {
            const result = options.result || {
                plan,
                results: [{
                    ...plan.eligible[0],
                    status: 'deleted',
                    code: 'SECTION_DELETED',
                    message: 'Deleted.',
                    attempts: 1
                }],
                fatalError: null,
                report: 'visible report'
            };
            onProgress?.({
                results: result.results,
                fatalError: result.fatalError
            });
            return result;
        },
        onClose() {
            closed = true;
        }
    });
    return { dialog, feature, isClosed: () => closed };
}

test('persistence failure stays separate from and does not erase the visible result', async () => {
    const logs = [];
    const { dialog } = createHarness({
        persistExecution: async () => {
            throw new Error('database unavailable');
        },
        log: (...args) => logs.push(args)
    });
    const plan = await dialog.options.onInspect({});
    const result = await dialog.options.onExecute(plan, () => {});

    assert.equal(result.report, 'visible report');
    assert.equal(result.history.stored, false);
    assert.equal(result.history.persistenceError.message, 'database unavailable');
    assert.equal(logs.length, 1);
});

test('successful terminal persistence is returned for the built-in history link', async () => {
    const persisted = [];
    const { dialog } = createHarness({
        persistExecution: async (input) => {
            persisted.push(input);
            return { stored: true, record: { id: 'history-42' } };
        }
    });
    const plan = await dialog.options.onInspect({});
    const result = await dialog.options.onExecute(plan, () => {});

    assert.equal(result.history.record.id, 'history-42');
    assert.equal(persisted[0].operationType, 'batch-section-deletion');
    assert.equal(persisted[0].status, 'completed');
});

test('closing an inspected immutable plan persists cancellation', async () => {
    const persisted = [];
    const { dialog, isClosed } = createHarness({
        persistExecution: async (input) => {
            persisted.push(input);
            return { stored: true };
        }
    });
    await dialog.options.onInspect({});
    dialog.options.onClose();
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(isClosed(), true);
    assert.equal(persisted[0].status, 'cancelled');
    assert.equal(persisted[0].results[0].status, 'not_attempted');
    assert.equal(persisted[0].results[0].attempts, 0);
});

test('all-rejected discovery is persisted as a terminal mixed-failure record', async () => {
    const rejected = {
        lessonId: 1,
        marathonLessonId: 11,
        number: 1,
        name: 'Welcome',
        sectionName: 'Promo',
        discoveryOutcome: 'not_found',
        status: 'rejected',
        code: 'SECTION_NOT_FOUND',
        message: 'Not found.',
        attempts: 0
    };
    const persisted = [];
    const { dialog } = createHarness({
        plan: samplePlan({ eligible: [], rejected: [rejected] }),
        persistExecution: async (input) => {
            persisted.push(input);
            return { stored: true, record: { id: 'history-rejected' } };
        }
    });
    await dialog.options.onInspect({});
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(persisted.length, 1);
    assert.equal(persisted[0].status, 'completed_with_failures');
    assert.equal(persisted[0].results[0].status, 'rejected');
    assert.match(dialog.status.textContent, /saved to execution history/i);
});

test('installed API preserves core exports and upgrades the existing factory wiring', () => {
    const originalDialog = () => createFakeDialog();
    const baseApi = {
        marker: 'core-export',
        createBatchSectionDeletionFeature(options) {
            return options;
        }
    };
    const installed = history.installHistoryAwareFeature(baseApi);
    const wired = installed.createBatchSectionDeletionFeature({
        createDialog: originalDialog,
        persistExecution: async () => ({ stored: true })
    });

    assert.equal(installed.marker, 'core-export');
    assert.notEqual(
        installed.createBatchSectionDeletionFeature,
        baseApi.createBatchSectionDeletionFeature
    );
    assert.equal(wired.persistExecution, undefined);
    assert.notEqual(wired.createDialog, originalDialog);
});
