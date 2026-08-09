'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const history = require('./batch-section-creation-history.js');
const recordApi = require('../shared/execution-history-record.js');
const { sectionDefinition, lessons, build } = require('./batch-section-creation-history-test-fixtures.js');

test('builds a canonical successful record with lesson, section, order, and generated IDs', () => {
    const input = build(history, {
        result: {
            definition: sectionDefinition(),
            results: lessons().map((lesson, index) => ({
                ...lesson,
                lessonNumber: lesson.number,
                lessonName: lesson.name,
                status: 'created',
                attempts: 1,
                captured: { sectionId: 9000 + index },
                generated: { sectionClientId: `section-client-${index}` },
                blockGenerated: {
                    banner: { imageClientId: `banner-client-${index}` },
                    copy: { textClientId: `copy-client-${index}` }
                }
            }))
        }
    });
    const record = recordApi.buildExecutionRecord(input, {
        cryptoApi: { randomUUID: () => 'execution-id' },
        now: new Date('2026-08-06T05:00:03.000Z')
    });

    assert.equal(record.operationType, history.OPERATION_TYPE);
    assert.equal(record.status, 'completed');
    assert.deepEqual(record.counts, {
        requested: 3,
        eligible: 3,
        attempted: 3,
        successful: 3,
        noOp: 0,
        skipped: 0,
        failed: 0,
        notAttempted: 0
    });
    assert.equal(record.results[0].data.lesson.marathonLessonId, 1001);
    assert.deepEqual(
        record.results[0].data.section.blocks.map((block) => [block.order, block.blockId, block.type]),
        [[0, 'banner', 'image'], [1, 'copy', 'text'], [2, 'cta', 'link']]
    );
    assert.equal(record.results[0].data.section.blocks[0].clientId, 'image-upload-client');
    assert.deepEqual(
        record.results[0].data.identifiers.map((entry) => entry.name),
        ['sectionId', 'sectionClientId', 'banner.imageClientId', 'copy.textClientId']
    );
});

test('serializes the confirmed section safely and excludes bytes, recordings, transport data, and session IDs', () => {
    const unsafePlan = {
        definition: {
            ...sectionDefinition(),
            blocks: [
                {
                    id: 'banner',
                    type: 'image',
                    url: 'data:image/png;base64,SECRET_IMAGE_BYTES',
                    alt: 'Banner'
                },
                {
                    id: 'copy',
                    type: 'text',
                    text: '<p>Safe</p><img src="data:image/png;base64,SECRET_INLINE_IMAGE_BYTES">'
                },
                ...sectionDefinition().blocks.slice(2)
            ],
            recording: { frames: ['SECRET_FRAME'] },
            sessionData: 'SECRET_SESSION'
        },
        selectedLessonIds: [101],
        eligible: [lessons()[0]],
        rejected: []
    };
    const input = build(history, {
        plan: unsafePlan,
        result: {
            results: [{
                ...lessons()[0],
                lessonNumber: 1,
                lessonName: 'Welcome',
                status: 'created',
                captured: {
                    sectionId: 901,
                    response: { secretId: 'SECRET_RESPONSE_ID' },
                    sessionId: 'SECRET_SESSION_ID'
                },
                generated: {
                    sectionClientId: 'SAFE_SECTION_CLIENT_ID',
                    tokenId: 'SECRET_TOKEN_ID'
                },
                rawTransport: { responseBytes: 'SECRET_BYTES' }
            }]
        }
    });
    const serialized = JSON.stringify(input);

    assert.equal(input.results[0].data.section.blocks[0].url, null);
    assert.equal(serialized.includes('SECRET_IMAGE_BYTES'), false);
    assert.equal(serialized.includes('SECRET_INLINE_IMAGE_BYTES'), false);
    assert.match(input.results[0].data.section.blocks[1].content, /redacted image data/);
    assert.equal(serialized.includes('SECRET_FRAME'), false);
    assert.equal(serialized.includes('SECRET_SESSION'), false);
    assert.equal(serialized.includes('SECRET_RESPONSE_ID'), false);
    assert.equal(serialized.includes('SECRET_TOKEN_ID'), false);
    assert.equal(serialized.includes('SECRET_BYTES'), false);
    assert.equal(serialized.includes('SAFE_SECTION_CLIENT_ID'), true);
    assert.doesNotThrow(() => recordApi.buildExecutionRecord(input, {
        cryptoApi: { randomUUID: () => 'safe-id' }
    }));
});

test('materializes every selected lesson even when plan metadata is incomplete', () => {
    const results = history.materializeResults({
        definition: sectionDefinition(),
        selectedLessonIds: [101, 999],
        eligible: [lessons()[0]],
        rejected: []
    }, { results: [] }, 'interrupted');

    assert.deepEqual(results.map((result) => String(result.lessonId)), ['101', '999']);
    assert.ok(results.every((result) => result.status === 'not_attempted'));
});
