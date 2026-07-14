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
        'lib/jszip.min.js',
        'lib/turndown.min.js',
        'shared/websocket-transport.js',
        'shared/operation-guard.js',
        'features/compile-marathon-to-zip.js',
        'features/reset-lessons.js',
        'features/marathon-export.js',
        'main.js'
    ]);

    for (const scriptPath of mainWorld.js) {
        assert.equal(
            fs.existsSync(path.join(root, scriptPath)),
            true,
            `${scriptPath} should exist`
        );
    }
});

test('main remains a coordinator without concrete feature logic', () => {
    const source = fs.readFileSync(path.join(root, 'main.js'), 'utf8');

    assert.doesNotMatch(source, /GetMarathonLessonsPagination/);
    assert.doesNotMatch(source, /LoadExercises/);
    assert.doesNotMatch(source, /EXPORT_PROGRESS_OVERLAY_ID/);
    assert.doesNotMatch(source, /window\.WebSocket\s*=/);
    assert.match(source, /createMarathonExportFeature/);
    assert.match(source, /createResetLessonsFeature/);
});
