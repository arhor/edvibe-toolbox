const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('manifest loads shared infrastructure and features before main', () => {
    const manifest = JSON.parse(
        fs.readFileSync(path.join(root, 'manifest.json'), 'utf8')
    );
    const mainWorld = manifest.content_scripts.find(
        (entry) => entry.world === 'MAIN'
    );

    assert.deepEqual(mainWorld.js, [
        'src/shared/logger.js',
        'lib/jszip.min.js',
        'lib/turndown.min.js',
        'src/shared/websocket-transport.js',
        'src/shared/operation-guard.js',
        'src/features/reset-lessons.js',
        'src/features/marathon-export.js',
        'src/main.js'
    ]);

    const isolatedWorld = manifest.content_scripts.find(
        (entry) => entry.world === 'ISOLATED'
    );
    assert.deepEqual(isolatedWorld.js, [
        'src/shared/logger.js',
        'src/isolated.js'
    ]);

    for (const scriptPath of mainWorld.js) {
        assert.equal(
            fs.existsSync(path.join(root, scriptPath)),
            true,
            `${scriptPath} should exist`
        );
    }
});

test('main explicitly creates and installs the WebSocket transport', () => {
    const transportSource = fs.readFileSync(
        path.join(root, 'src/shared/websocket-transport.js'),
        'utf8'
    );
    const mainSource = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');

    assert.doesNotMatch(transportSource, /createWebSocketTransport\(\{[\s\S]*root\.WebSocket/);
    assert.match(mainSource, /createLoggerFactory\('MAIN'\)/);
    assert.match(mainSource, /const transportLog = createMainLog\('Transport'\)/);
    assert.match(mainSource, /createWebSocketTransport\(\{/);
    assert.match(mainSource, /log:\s*transportLog/);
    assert.match(mainSource, /transport\.install\(window\)/);
});

test('main remains a coordinator without concrete feature logic', () => {
    const source = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');

    assert.doesNotMatch(source, /GetMarathonLessonsPagination/);
    assert.doesNotMatch(source, /LoadExercises/);
    assert.doesNotMatch(source, /EXPORT_PROGRESS_OVERLAY_ID/);
    assert.doesNotMatch(source, /window\.WebSocket\s*=/);
    assert.doesNotMatch(source, /EdVibeCompileMarathonToZip/);
    assert.match(source, /createMarathonExportFeature/);
    assert.match(source, /createResetLessonsFeature/);
});

test('marathon export owns its ZIP compiler implementation', () => {
    const exportApi = require('../src/features/marathon-export.js');

    assert.equal(typeof exportApi.compileMarathonToZip, 'function');
    assert.equal(
        fs.existsSync(path.join(root, 'src/features/compile-marathon-to-zip.js')),
        false
    );
});
