import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { createActionRecorderFeature } from '#src/content/main/features/action-recorder/action-recorder.js';

function createHarness() {
    let observer;
    let time = 0;
    const feature = createActionRecorderFeature({
        subscribeFrames: (callback) => { observer = callback; },
        createPanel: () => ({}),
        createId: () => 'session-1',
        now: () => time,
        getPageContext: () => ({ pathname: '/marathon/42' })
    });
    return {
        feature,
        capture(frame) {
            time = frame.capturedAt;
            observer(frame);
        }
    };
}

describe('createActionRecorderFeature', () => {
    test('records exact credential-bearing envelopes until explicitly stopped', () => {
        // Given
        const { feature, capture } = createHarness();
        const request = {
            Controller: 'Users', Method: 'Save', ProjectName: 'School', RequestId: 'request-1',
            Authorization: 'Bearer secret', Cookie: 'session=secret',
            Value: JSON.stringify({ token: 'token', pupil: { email: 'pupil@example.test' } })
        };
        feature.start();

        // When
        capture({ direction: 'outbound', socketId: 1, origin: 'page', capturedAt: 700_000,
            dataType: 'text', byteLength: 6_000_000, data: JSON.stringify(request) });
        capture({ direction: 'inbound', socketId: 1, origin: 'page', capturedAt: 700_010,
            dataType: 'text', byteLength: 100, data: JSON.stringify({
                RequestId: 'request-1', IsSuccess: true,
                Value: JSON.stringify({ session: 'raw-session', image: 'data:image/png;base64,AAAA' })
            }) });
        feature.stop();
        const exported = feature.buildExport();

        // Then
        assert.equal(exported.schemaVersion, 2);
        assert.equal(exported.limits, undefined);
        assert.equal(exported.redactions, undefined);
        assert.equal(exported.operations[0].extra.Authorization, 'Bearer secret');
        assert.equal(exported.operations[0].extra.Cookie, 'session=secret');
        assert.equal(exported.operations[0].requestValue.token, 'token');
        assert.equal(exported.operations[0].response.value.session, 'raw-session');
        assert.equal(feature.getState().status, 'stopped');
    });

    test('keeps recording beyond the former frame limit and stores binary frames as metadata', () => {
        // Given
        const { feature, capture } = createHarness();
        feature.start();

        // When
        for (let index = 0; index < 1001; index += 1) {
            capture({ direction: 'inbound', socketId: 1, origin: 'page', capturedAt: index,
                dataType: 'array-buffer', byteLength: 1024 });
        }
        const exported = feature.buildExport();

        // Then
        assert.equal(feature.getState().status, 'recording');
        assert.equal(exported.frameCount, 1001);
        assert.equal(exported.otherFrames.length, 1001);
        assert.deepEqual(Object.keys(exported.otherFrames[0]), [
            'sequence', 'direction', 'socketId', 'origin', 'capturedAfterMs', 'dataType', 'byteLength'
        ]);
    });
});
