import test from 'node:test';
import assert from 'node:assert/strict';

import {
    REDACTED_VALUE,
    createActionRecorderFeature,
    makeRecipe,
    safePageContext
} from './action-recorder.js';

function createHarness(options = {}) {
    let observer;
    let currentTime = options.startTime || 1000;
    let durationCallback = null;
    const downloads = [];
    const panel = {
        states: [],
        configure(optionsValue) {
            this.options = { ...(this.options || {}), ...optionsValue };
        },
        mount() {
            this.mounted = true;
        },
        setState(state) {
            this.states.push(state);
        }
    };
    const feature = createActionRecorderFeature({
        subscribeFrames(callback) {
            observer = callback;
            return () => {};
        },
        createPanel: () => panel,
        getPageContext: () => ({
            origin: 'https://app.edvibe.com',
            pathname: '/marathon/7',
            marathonId: 7
        }),
        createId: () => 'session-1',
        now: () => currentTime,
        setTimeoutFn(callback) {
            durationCallback = callback;
            return 1;
        },
        clearTimeoutFn() {},
        downloadText: (filename, text) => downloads.push({ filename, text }),
        copyText: options.copyText || (() => Promise.resolve()),
        limits: options.limits,
        log() {}
    });

    return {
        feature,
        panel,
        downloads,
        emit(frame) {
            observer({
                direction: 'outbound',
                socketId: 1,
                capturedAt: currentTime,
                dataType: 'text',
                byteLength: Buffer.byteLength(frame.data || ''),
                origin: 'page',
                ...frame
            });
        },
        advance(ms) {
            currentTime += ms;
        },
        reachDurationLimit() {
            durationCallback();
        }
    };
}

test('records and correlates a redacted request/response pair', () => {
    const harness = createHarness();
    harness.feature.start();
    harness.advance(20);
    harness.emit({
        data: JSON.stringify({
            Controller: 'LessonWsController',
            Method: 'GetLessonWithId',
            ProjectName: 'Books',
            RequestId: 'request-1',
            Value: JSON.stringify({ LessonId: 42, accessToken: 'secret' })
        })
    });
    harness.advance(80);
    harness.emit({
        direction: 'inbound',
        data: JSON.stringify({
            RequestId: 'request-1',
            IsSuccess: true,
            Value: JSON.stringify({ Id: 42 })
        })
    });
    harness.feature.stop();

    const exported = harness.feature.buildExport();
    assert.equal(exported.operations.length, 1);
    assert.equal(exported.operations[0].durationMs, 80);
    assert.equal(exported.operations[0].requestValue.LessonId, 42);
    assert.equal(exported.operations[0].requestValue.accessToken, REDACTED_VALUE);
    assert.deepEqual(exported.operations[0].response.value, { Id: 42 });
    assert.deepEqual(exported.redactions, [{ frame: 1, path: 'Value.accessToken' }]);
    assert.equal('_capturedAt' in exported.operations[0], false);
});

test('keeps malformed, unmatched, and duplicate frames as evidence', () => {
    const harness = createHarness();
    harness.feature.start();
    harness.emit({ data: 'not-json' });
    harness.emit({
        direction: 'inbound',
        data: JSON.stringify({ RequestId: 'unknown', Value: true })
    });
    const request = JSON.stringify({
        Controller: 'Controller',
        Method: 'Method',
        ProjectName: 'Project',
        RequestId: 'duplicate',
        Value: '{}'
    });
    harness.emit({ data: request });
    harness.emit({ data: request });

    const exported = harness.feature.buildExport();
    assert.equal(exported.operations.length, 1);
    assert.equal(exported.otherFrames.length, 3);
    assert.equal(exported.otherFrames[0].rawText, 'not-json');
    assert.equal(exported.anomalies[0].type, 'duplicate-outbound-request');
});

test('separates Toolbox traffic and generates a review-only recipe', () => {
    const operations = [
        {
            origin: 'page',
            startedAfterMs: 0,
            controller: 'First',
            method: 'Load',
            projectName: 'Books',
            requestValue: { Id: 1 }
        },
        {
            origin: 'toolbox',
            startedAfterMs: 100,
            controller: 'Hidden',
            method: 'Skip',
            projectName: 'Books',
            requestValue: {}
        },
        {
            origin: 'page',
            startedAfterMs: 350,
            controller: 'Second',
            method: 'Save',
            projectName: 'Books',
            requestValue: { Id: 2 }
        }
    ];

    const recipe = makeRecipe(operations);
    assert.match(recipe, /Review IDs, ordering, and mutation effects/);
    assert.match(recipe, /"First"/);
    assert.match(recipe, /await wait\(350\)/);
    assert.match(recipe, /"Second"/);
    assert.doesNotMatch(recipe, /Hidden/);
});

test('enforces frame, size, and duration limits without storing overflow', () => {
    const frameHarness = createHarness({
        limits: { maxFrames: 1, maxStoredBytes: 100, maxDurationMs: 1000 }
    });
    frameHarness.feature.start();
    frameHarness.emit({ data: 'first' });
    frameHarness.emit({ data: 'second' });
    assert.equal(frameHarness.feature.getState().status, 'limit-reached');
    assert.equal(frameHarness.feature.buildExport().frameCount, 1);

    const sizeHarness = createHarness({
        limits: { maxFrames: 10, maxStoredBytes: 3, maxDurationMs: 1000 }
    });
    sizeHarness.feature.start();
    sizeHarness.emit({ data: 'four' });
    assert.equal(sizeHarness.feature.getState().status, 'limit-reached');
    assert.equal(sizeHarness.feature.buildExport().frameCount, 0);

    const durationHarness = createHarness();
    durationHarness.feature.start();
    durationHarness.reachDurationLimit();
    assert.equal(durationHarness.feature.getState().status, 'limit-reached');
});

test('exports deterministic local JSON and falls back after clipboard failure', async () => {
    const harness = createHarness({
        copyText: () => Promise.reject(new Error('denied'))
    });
    harness.feature.start();
    harness.emit({
        data: JSON.stringify({
            Controller: 'Controller',
            Method: 'Method',
            ProjectName: 'Project',
            RequestId: 'request',
            Value: '{}'
        })
    });
    harness.feature.stop();
    harness.feature.exportJson();
    await harness.feature.copyRecipe();

    assert.equal(harness.downloads.length, 1);
    assert.match(
        harness.downloads[0].filename,
        /^edvibe-ws-recording-1970-01-01T00-00-01-000Z\.json$/
    );
    assert.equal(JSON.parse(harness.downloads[0].text).schemaVersion, 1);
    assert.match(harness.feature.getState().copyFallback, /sendRequest/);
});

test('safe page context excludes query strings and fragments', () => {
    assert.deepEqual(
        safePageContext({
            origin: 'https://app.edvibe.com',
            pathname: '/marathon/123',
            search: '?token=secret',
            hash: '#private'
        }),
        {
            origin: 'https://app.edvibe.com',
            pathname: '/marathon/123',
            marathonId: 123
        }
    );
});
