const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createMarathonExportFeature
} = require('../src/features/marathon-export.js');

const silentLog = () => {};

function createOverlaySpy() {
    const calls = [];

    return {
        calls,
        update(detail) {
            calls.push(['update', detail]);
        },
        complete(message, total) {
            calls.push(['complete', message, total]);
        },
        error(message) {
            calls.push(['error', message]);
        },
        dismissAfter(ms) {
            calls.push(['dismissAfter', ms]);
        }
    };
}

test('export builds the backup, throttles sections, and compiles the ZIP', async () => {
    const requests = [];
    const waits = [];
    const statuses = [];
    const activeChanges = [];
    const overlay = createOverlaySpy();
    let compiledBackup;

    const responses = [
        {
            Value: {
                Items: [{
                    LessonId: 10,
                    MarathonLessonId: 100,
                    Name: 'Lesson one',
                    Image: 'fallback.png'
                }]
            }
        },
        {
            Value: {
                ImageUrl: 'lesson.png',
                Sections: [{ Id: 20, Name: 'Words' }],
                HomeworkSection: {
                    Id: 21,
                    Name: 'Homework',
                    IsHomework: true
                }
            }
        },
        { Value: { Items: [{ Id: 30 }] } },
        { Value: JSON.stringify({ Items: [{ Id: 31 }] }) }
    ];

    const feature = createMarathonExportFeature({
        sendRequest: async (...args) => {
            requests.push(args);
            return responses.shift();
        },
        wait: async (ms) => waits.push(ms),
        canStart: () => true,
        onActiveChange: (active) => activeChanges.push(active),
        compileToZip: async (backup) => {
            compiledBackup = backup;
        },
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: () => overlay,
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508',
        now: () => '2026-07-14T12:00:00.000Z',
        log: silentLog
    });

    await feature.start();

    assert.deepEqual(waits, [300, 300]);
    assert.deepEqual(requests.map((request) => request.slice(0, 3)), [
        ['MarathonLessonWsController', 'GetMarathonLessonsPagination', 'Marathons'],
        ['LessonWsController', 'GetLessonWithId', 'Books'],
        ['GetExerciseWsController', 'LoadExercises', 'Exercises'],
        ['GetExerciseWsController', 'LoadExercises', 'Exercises']
    ]);
    assert.deepEqual(requests[2][3], {
        IsTeacher: true,
        SectionId: 20,
        LessonId: 10,
        LessonSection: 0
    });
    assert.deepEqual(compiledBackup, {
        exportedAt: '2026-07-14T12:00:00.000Z',
        marathonId: 18508,
        totalLessons: 1,
        lessons: [{
            lessonId: 10,
            marathonLessonId: 100,
            name: 'Lesson one',
            imageUrl: 'lesson.png',
            sections: [
                {
                    sectionId: 20,
                    name: 'Words',
                    isHomework: false,
                    items: [{ Id: 30 }]
                },
                {
                    sectionId: 21,
                    name: 'Homework',
                    isHomework: true,
                    items: [{ Id: 31 }]
                }
            ]
        }]
    });
    assert.deepEqual(statuses, [['started', ''], ['complete', '']]);
    assert.deepEqual(activeChanges, [true, false]);
    assert.equal(overlay.calls.at(-1)[0], 'dismissAfter');
});

test('export reports invalid marathon URLs and releases the operation', async () => {
    const statuses = [];
    const activeChanges = [];
    const overlay = createOverlaySpy();

    const feature = createMarathonExportFeature({
        sendRequest: async () => assert.fail('request should not run'),
        wait: async () => {},
        canStart: () => true,
        onActiveChange: (active) => activeChanges.push(active),
        compileToZip: async () => assert.fail('compiler should not run'),
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: () => overlay,
        getCurrentUrl: () => 'https://app.edvibe.com/dashboard',
        log: silentLog
    });

    await feature.start();

    assert.deepEqual(statuses, [
        ['started', ''],
        ['error', 'Invalid marathon URL.']
    ]);
    assert.deepEqual(activeChanges, [true, false]);
    assert.match(overlay.calls.at(-1)[1], /MarathonId/);
});

test('export reports request failures and releases the operation', async () => {
    const statuses = [];
    const activeChanges = [];

    const feature = createMarathonExportFeature({
        sendRequest: async () => {
            throw new Error('network failure');
        },
        wait: async () => {},
        canStart: () => true,
        onActiveChange: (active) => activeChanges.push(active),
        compileToZip: async () => {},
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: createOverlaySpy,
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508',
        log: silentLog
    });

    await feature.start();

    assert.deepEqual(statuses, [
        ['started', ''],
        ['error', 'network failure']
    ]);
    assert.deepEqual(activeChanges, [true, false]);
});

test('export releases the operation when overlay setup fails', async () => {
    const statuses = [];
    const activeChanges = [];

    const feature = createMarathonExportFeature({
        sendRequest: async () => assert.fail('request should not run'),
        wait: async () => {},
        canStart: () => true,
        onActiveChange: (active) => activeChanges.push(active),
        compileToZip: async () => assert.fail('compiler should not run'),
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: () => {
            throw new Error('overlay failure');
        },
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508',
        log: silentLog
    });

    await feature.start();

    assert.deepEqual(statuses, [
        ['started', ''],
        ['error', 'overlay failure']
    ]);
    assert.deepEqual(activeChanges, [true, false]);
});

test('export sends failures to its injected logger', async () => {
    const calls = [];
    const feature = createMarathonExportFeature({
        sendRequest: async () => {
            throw new Error('network failure');
        },
        wait: async () => {},
        canStart: () => true,
        onActiveChange() {},
        compileToZip: async () => {},
        notifyStatus() {},
        createProgressOverlay: createOverlaySpy,
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508',
        log: (...args) => calls.push(args)
    });

    await feature.start();

    assert.equal(calls.at(-1)[0], 'Export workflow failed:');
    assert.match(calls.at(-1)[1].message, /network failure/);
});

test('export refuses to start while another operation is active', async () => {
    const statuses = [];
    const feature = createMarathonExportFeature({
        sendRequest: async () => assert.fail('request should not run'),
        wait: async () => {},
        canStart: () => false,
        onActiveChange: () => assert.fail('operation should not activate'),
        compileToZip: async () => assert.fail('compiler should not run'),
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: () => assert.fail('overlay should not open'),
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508',
        log: silentLog
    });

    await feature.start();

    assert.equal(statuses[0][0], 'error');
    assert.match(statuses[0][1], /another operation/i);
});
