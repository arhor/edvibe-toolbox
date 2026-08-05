const test = require('node:test');
const assert = require('node:assert/strict');

const api = require('../src/features/batch-section-creation.js');

function definition() {
    return {
        name: 'Summer promotion',
        blocks: [
            { id: 'banner', type: 'image', url: 'https://cdn.example/banner.jpg', alt: 'Sale' },
            { id: 'copy', type: 'text', text: '<p>Save twenty percent.</p>' },
            { id: 'cta', type: 'link', label: 'Open offer', url: 'https://example.com/offer' }
        ]
    };
}

function lessons() {
    return [
        { lessonId: 101, marathonLessonId: 1001, number: 1, name: 'Welcome' },
        { lessonId: 102, marathonLessonId: 1002, number: 2, name: 'Practice' },
        { lessonId: 103, marathonLessonId: 1003, number: 3, name: 'Review' }
    ];
}

function plan({ eligible = lessons(), rejected = [] } = {}) {
    return Object.freeze({
        definition: Object.freeze(definition()),
        selectedLessonIds: Object.freeze(eligible.map((lesson) => lesson.lessonId)),
        eligible: Object.freeze(eligible.map(Object.freeze)),
        rejected: Object.freeze(rejected.map(Object.freeze)),
        blockSummary: Object.freeze([])
    });
}

function reviewedRecipe() {
    return {
        version: 1,
        reviewedDynamicFields: true,
        steps: [
            {
                id: 'create-section',
                controller: 'RecordedSectionController',
                method: 'CreateSection',
                projectName: 'Books',
                valueTemplate: {
                    LessonId: '{{lesson.lessonId}}',
                    MarathonId: '{{marathonId}}',
                    Name: '{{section.name}}',
                    ClientId: '{{generated.sectionClientId}}'
                },
                capture: { sectionId: 'Value.SectionId' },
                marksSectionCreated: true
            },
            {
                id: 'add-image',
                controller: 'RecordedSectionController',
                method: 'AddImage',
                projectName: 'Books',
                forEach: 'blocks',
                blockTypes: ['image'],
                valueTemplate: {
                    LessonId: '{{lesson.lessonId}}',
                    SectionId: '{{captured.sectionId}}',
                    Url: '{{block.url}}',
                    Alt: '{{block.alt}}',
                    Position: '{{blockIndex}}',
                    ClientId: '{{generated.imageClientId}}'
                }
            },
            {
                id: 'add-text',
                controller: 'RecordedSectionController',
                method: 'AddText',
                projectName: 'Books',
                forEach: 'blocks',
                blockTypes: ['text'],
                valueTemplate: {
                    LessonId: '{{lesson.lessonId}}',
                    SectionId: '{{captured.sectionId}}',
                    Text: '{{block.text}}',
                    Position: '{{blockIndex}}',
                    ClientId: '{{generated.textClientId}}'
                }
            },
            {
                id: 'add-link',
                controller: 'RecordedSectionController',
                method: 'AddLink',
                projectName: 'Books',
                forEach: 'blocks',
                blockTypes: ['link'],
                valueTemplate: {
                    LessonId: '{{lesson.lessonId}}',
                    SectionId: '{{captured.sectionId}}',
                    Label: '{{block.label}}',
                    Url: '{{block.url}}',
                    Position: '{{blockIndex}}',
                    ClientId: '{{generated.linkClientId}}'
                }
            }
        ],
        cleanupSteps: [
            {
                id: 'delete-partial-section',
                controller: 'RecordedSectionController',
                method: 'DeleteSection',
                projectName: 'Books',
                valueTemplate: {
                    LessonId: '{{lesson.lessonId}}',
                    SectionId: '{{captured.sectionId}}'
                }
            }
        ]
    };
}

test('parses marathon IDs only from marathon pages', () => {
    assert.equal(api.parseMarathonId('https://school.edvibe.com/marathon/42/lessons'), 42);
    assert.equal(api.parseMarathonId('https://school.edvibe.com/marathon/not-a-number'), null);
    assert.equal(api.parseMarathonId('https://school.edvibe.com/books/42'), null);
});

test('validates the supported section constructor fields', () => {
    const valid = api.validateSectionDefinition(definition());
    assert.equal(valid.errors.length, 0);
    assert.equal(valid.definition.name, 'Summer promotion');

    const invalid = api.validateSectionDefinition({
        name: '   ',
        blocks: [
            { id: 'one', type: 'image', url: 'ftp://example.com/banner.jpg' },
            { id: 'one', type: 'text', text: '' },
            { id: 'three', type: 'link', label: '', url: 'not a url' }
        ]
    });
    assert.deepEqual(
        invalid.errors.map((error) => error.code),
        [
            'SECTION_NAME_REQUIRED',
            'IMAGE_URL_REQUIRED',
            'DUPLICATE_BLOCK_ID',
            'TEXT_REQUIRED',
            'LINK_LABEL_REQUIRED',
            'LINK_URL_REQUIRED'
        ]
    );
});

test('reorders blocks without mutating the input', () => {
    const source = definition().blocks;
    const reordered = api.reorderBlocks(source, 2, 0);
    assert.deepEqual(reordered.map((block) => block.id), ['cta', 'banner', 'copy']);
    assert.deepEqual(source.map((block) => block.id), ['banner', 'copy', 'cta']);
});

test('builds an immutable collision-aware preflight plan', () => {
    const inspection = new Map([
        [101, { structure: { Sections: [{ Id: 1, Name: 'Existing section' }] } }],
        [102, { structure: { Sections: [{ Id: 2, Name: 'Summer promotion' }] } }],
        [103, { error: Object.assign(new Error('Could not inspect lesson.'), { code: 'REQUEST_TIMEOUT' }) }]
    ]);
    const result = api.buildPreflightPlan({
        lessons: lessons(),
        selectedLessonIds: [101, 102, 103],
        definition: definition(),
        inspectionsByLessonId: inspection
    });

    assert.deepEqual(result.eligible.map((lesson) => lesson.lessonId), [101]);
    assert.deepEqual(
        result.rejected.map((lesson) => lesson.code),
        ['SECTION_NAME_COLLISION', 'REQUEST_TIMEOUT']
    );
    assert.equal(Object.isFrozen(result), true);
    assert.equal(Object.isFrozen(result.definition.blocks[0]), true);
    assert.throws(() => result.eligible.push({}), TypeError);
});

test('expands a reviewed recording recipe with lesson-specific IDs and stable generated values', async () => {
    const calls = [];
    const waits = [];
    let uuid = 0;
    const adapter = api.createRecordedCreationAdapter({
        recipe: reviewedRecipe(),
        cryptoApi: { randomUUID: () => `uuid-${++uuid}` },
        requestDelayMs: 25
    });
    const result = await adapter.createSection({
        marathonId: 77,
        lesson: lessons()[0],
        definition: definition(),
        wait: async (ms) => waits.push(ms),
        sendRequest: async (controller, method, projectName, value) => {
            calls.push({ controller, method, projectName, value });
            return method === 'CreateSection'
                ? { Value: { SectionId: 9001 } }
                : { Value: true };
        }
    });

    assert.equal(adapter.isReady, true);
    assert.deepEqual(calls.map((call) => call.method), [
        'CreateSection', 'AddImage', 'AddText', 'AddLink'
    ]);
    assert.equal(calls[0].value.LessonId, 101);
    assert.equal(calls[0].value.MarathonId, 77);
    assert.equal(calls[1].value.SectionId, 9001);
    assert.equal(calls[2].value.Position, 1);
    assert.equal(calls[3].value.Position, 2);
    assert.equal(calls[0].value.ClientId, 'uuid-1');
    assert.equal(calls[1].value.ClientId, 'uuid-2');
    assert.deepEqual(waits, [25, 25, 25]);
    assert.equal(result.captured.sectionId, 9001);
});

test('preserves configured block order and generates unique IDs per block', async () => {
    const calls = [];
    let uuid = 0;
    const adapter = api.createRecordedCreationAdapter({
        recipe: reviewedRecipe(),
        cryptoApi: { randomUUID: () => `uuid-${++uuid}` },
        requestDelayMs: 0
    });
    const reorderedDefinition = {
        name: 'Ordered section',
        blocks: [
            { id: 'cta', type: 'link', label: 'Go', url: 'https://example.com' },
            { id: 'banner-a', type: 'image', url: 'https://cdn.example/a.jpg', alt: 'A' },
            { id: 'banner-b', type: 'image', url: 'https://cdn.example/b.jpg', alt: 'B' },
            { id: 'copy', type: 'text', text: 'Last' }
        ]
    };

    await adapter.createSection({
        marathonId: 77,
        lesson: lessons()[0],
        definition: reorderedDefinition,
        wait: async () => {},
        sendRequest: async (_controller, method, _projectName, value) => {
            calls.push({ method, value });
            return method === 'CreateSection'
                ? { Value: { SectionId: 9100 } }
                : { Value: true };
        }
    });

    assert.deepEqual(calls.map((call) => call.method), [
        'CreateSection', 'AddLink', 'AddImage', 'AddImage', 'AddText'
    ]);
    assert.notEqual(calls[2].value.ClientId, calls[3].value.ClientId);
    assert.deepEqual(calls.slice(1).map((call) => call.value.Position), [0, 1, 2, 3]);
});

test('keeps execution sequential, continues after per-lesson failure, and preserves preflight rejection', async () => {
    const active = [];
    const waits = [];
    const executionPlan = plan({
        eligible: lessons().slice(0, 2),
        rejected: [{
            ...lessons()[2],
            code: 'SECTION_NAME_COLLISION',
            message: 'Already exists.'
        }]
    });
    const adapter = {
        isReady: true,
        errors: [],
        async createSection({ lesson }) {
            active.push(`start-${lesson.lessonId}`);
            if (lesson.lessonId === 101) {
                throw Object.assign(new Error('Rejected by server.'), {
                    code: 'SERVER_REJECTED',
                    partialCreated: false
                });
            }
            active.push(`done-${lesson.lessonId}`);
            return { captured: { sectionId: 502 }, generated: {} };
        },
        async cleanupSection() {
            throw new Error('Cleanup should not run.');
        }
    };

    const result = await api.executeCreationPlan({
        marathonId: 77,
        plan: executionPlan,
        adapter,
        sendRequest: async () => ({}),
        wait: async (ms) => waits.push(ms),
        getConnectionState: () => ({ isOpen: true }),
        lessonDelayMs: 40
    });

    assert.deepEqual(active, ['start-101', 'start-102', 'done-102']);
    assert.deepEqual(waits, [40]);
    assert.deepEqual(
        result.results.map((entry) => [entry.lessonId, entry.status]),
        [[103, 'rejected'], [101, 'failed'], [102, 'created']]
    );
});

test('reports partial creation and runs safe cleanup without stopping later lessons', async () => {
    const cleaned = [];
    const adapter = {
        isReady: true,
        errors: [],
        async createSection({ lesson }) {
            if (lesson.lessonId === 101) {
                throw Object.assign(new Error('Block creation failed.'), {
                    code: 'SERVER_REJECTED',
                    partialCreated: true,
                    captured: { sectionId: 501 },
                    generated: { clientId: 'a' }
                });
            }
            return { captured: { sectionId: 502 }, generated: {} };
        },
        async cleanupSection({ lesson, captured }) {
            cleaned.push([lesson.lessonId, captured.sectionId]);
            return { attempted: true, status: 'success' };
        }
    };

    const result = await api.executeCreationPlan({
        marathonId: 77,
        plan: plan({ eligible: lessons().slice(0, 2) }),
        adapter,
        sendRequest: async () => ({}),
        wait: async () => {},
        getConnectionState: () => ({ isOpen: true })
    });

    assert.deepEqual(cleaned, [[101, 501]]);
    assert.deepEqual(result.results.map((entry) => entry.status), [
        'partially_created', 'created'
    ]);
    assert.equal(result.results[0].cleanup.status, 'success');
});

test('retains a complete partial result after a fatal connection interruption', async () => {
    const adapter = {
        isReady: true,
        errors: [],
        async createSection({ lesson }) {
            if (lesson.lessonId === 102) {
                throw Object.assign(new Error('Connection disappeared.'), {
                    code: 'WS_UNAVAILABLE',
                    partialCreated: true,
                    captured: { sectionId: 602 }
                });
            }
            return { captured: { sectionId: 601 }, generated: {} };
        },
        async cleanupSection() {
            throw new Error('Fatal paths must not attempt cleanup.');
        }
    };

    await assert.rejects(
        api.executeCreationPlan({
            marathonId: 77,
            plan: plan(),
            adapter,
            sendRequest: async () => ({}),
            wait: async () => {},
            getConnectionState: () => ({ isOpen: false })
        }),
        (error) => {
            assert.equal(error.code, 'WS_UNAVAILABLE');
            assert.deepEqual(error.partialResult.results.map((entry) => entry.status), [
                'created', 'partially_created', 'not_attempted'
            ]);
            assert.equal(error.partialResult.results[1].captured.sectionId, 602);
            return true;
        }
    );
});

test('inspects selected lessons sequentially with one throttle gap', async () => {
    const calls = [];
    const waits = [];
    const inspections = await api.inspectLessonsSequentially({
        lessons: lessons(),
        selectedLessonIds: [101, 103],
        delayMs: 55,
        wait: async (ms) => waits.push(ms),
        sendRequest: async (_controller, _method, _project, payload) => {
            calls.push(payload.LessonId);
            return { Value: { Sections: [] } };
        }
    });

    assert.deepEqual(calls, [101, 103]);
    assert.deepEqual(waits, [55]);
    assert.equal(inspections.size, 2);
});

test('formats a copyable report with all terminal states', () => {
    const report = api.formatCreationReport({
        definition: definition(),
        results: [
            { lessonNumber: 1, lessonName: 'Welcome', status: 'created' },
            { lessonNumber: 2, lessonName: 'Practice', status: 'rejected', code: 'SECTION_NAME_COLLISION', message: 'Already exists.' },
            { lessonNumber: 3, lessonName: 'Review', status: 'partially_created', code: 'SERVER_REJECTED', message: 'Failed.', captured: { sectionId: 88 }, cleanup: { status: 'failed' } }
        ]
    });

    assert.match(report, /Section: Summer promotion/);
    assert.match(report, /Created: 1/);
    assert.match(report, /Rejected in preflight: 1/);
    assert.match(report, /Partially created: 1/);
    assert.match(report, /Captured sectionId: 88/);
    assert.match(report, /Cleanup: failed/);
});

test('releases the operation guard when initialization fails', async () => {
    const activeChanges = [];
    const dialog = {
        listeners: new Map(),
        addEventListener(type, handler) { this.listeners.set(type, handler); },
        configure() {},
        showLoading() {},
        showFatalError(error) { this.error = error; }
    };
    const previousDocument = global.document;
    const previousWindow = global.window;
    global.document = {
        getElementById: () => null,
        body: { appendChild() {} },
        documentElement: { appendChild() {} }
    };
    global.window = {
        location: { href: 'https://school.edvibe.com/marathon/77/lessons' },
        alert() {}
    };

    try {
        const feature = api.createBatchSectionCreationFeature({
            sendRequest: async () => { throw Object.assign(new Error('No socket.'), { code: 'WS_UNAVAILABLE' }); },
            getConnectionState: () => ({ isOpen: false }),
            wait: async () => {},
            canStart: () => true,
            onActiveChange: (value) => activeChanges.push(value),
            adapter: api.createRecordedCreationAdapter(),
            createDialog: () => dialog
        });
        await feature.open({ stylesheetUrl: 'dialog.css' });
        assert.deepEqual(activeChanges, [true, false]);
        assert.equal(dialog.error.code, 'WS_UNAVAILABLE');
    } finally {
        global.document = previousDocument;
        global.window = previousWindow;
    }
});
