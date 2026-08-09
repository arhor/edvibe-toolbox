const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('runtime entry points preserve execution worlds and compose through ESM', () => {
    const manifest = JSON.parse(read('manifest.json'));
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const isolatedWorld = manifest.content_scripts.find((entry) => entry.world === 'ISOLATED');

    assert.deepEqual(isolatedWorld.js, ['src/entrypoints/isolated.js']);
    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.equal(isolatedWorld.run_at, 'document_start');
    assert.equal(mainWorld.run_at, 'document_start');
    const mainEntrypoint = read('src/entrypoints/main.js');
    assert.match(mainEntrypoint, /import ['"]\.\.\/components\/export-progress-dialog\.js['"];?/);
    assert.match(mainEntrypoint, /import ['"]\.\.\/components\/reset-lessons-dialog\.js['"];?/);
    assert.match(mainEntrypoint, /import ['"]\.\.\/main\.js['"];?/);
    assert.equal(fs.existsSync(path.join(root, 'src/entrypoints/runtime-dependencies.js')), false);

    const mainSource = read('src/main.js');
    assert.match(mainSource, /^import .* from ['"].+['"];$/m);
    assert.doesNotMatch(mainSource, /requireToolboxModule|window\.EdVibe|globalThis\.EdVibe/);
    assert.match(mainSource, /from ['"]\.\/features\/marathon-export\.js['"]/);
    assert.match(mainSource, /from ['"]\.\/shared\/websocket-transport\.js['"]/);
});

test('dynamic UI and presentation stay in Lit components and reusable style modules', () => {
    const coordinatorFiles = [
        'popup.js',
        'src/main.js',
        'src/features/marathon-export.js',
        'src/features/reset-lessons.js',
        'src/features/action-recorder.js',
        'src/features/batch-lesson-access.js',
        'src/features/batch-user-management.js',
        'src/features/batch-user-onboarding.js',
        'src/features/batch-section-creation.js',
        'src/features/batch-section-deletion.js'
    ];

    for (const file of coordinatorFiles) {
        const source = read(file);
        assert.doesNotMatch(source, /(?:innerHTML|insertAdjacentHTML|cssText|\.style\.)/);
    }

    const agents = read('AGENTS.md');
    assert.match(agents, /Use Lit as the standard implementation for Web Components/);
    assert.match(agents, /Keep in-page Lit component presentation in Lit `css` template modules composed through `static styles`/);
    assert.match(agents, /Put reusable design tokens and visual foundations under `src\/components\/styles\/`/);
    assert.doesNotMatch(agents, /framework-free/);
});

test('main creates and installs shared transport and operation guard', () => {
    const mainSource = read('src/main.js');

    assert.match(mainSource, /createLoggerFactory\('MAIN'\)/);
    assert.match(mainSource, /createWebSocketTransport\(\{/);
    assert.match(mainSource, /log: createMainLog\('Transport'\)/);
    assert.match(mainSource, /transport\.install\(window\)/);
    assert.match(mainSource, /createOperationGuard\(\)/);
});

test('main remains a coordinator for feature modules', () => {
    const source = read('src/main.js');

    for (const factory of [
        'createMarathonExportFeature',
        'createResetLessonsFeature',
        'createActionRecorderFeature',
        'createBatchLessonAccessFeature',
        'createBatchUserManagementFeature',
        'createBatchUserOnboardingFeature',
        'createBatchSectionCreationFeature',
        'createBatchSectionDeletionFeature'
    ]) {
        assert.match(source, new RegExp(factory));
    }
    assert.doesNotMatch(source, /window\.WebSocket\s*=/);
    assert.doesNotMatch(source, /GetMarathonLessonsPagination/);
});

test('isolated routing uses a command table and forwards only minimal metadata', () => {
    const isolatedSource = read('src/isolated.js');

    const commands = [
        'OPEN_ACTION_RECORDER',
        'OPEN_BATCH_LESSON_ACCESS',
        'OPEN_BATCH_USER_ONBOARDING',
        'OPEN_BATCH_USER_MANAGEMENT',
        'OPEN_BATCH_SECTION_CREATION',
        'OPEN_BATCH_SECTION_DELETION'
    ];
    for (const command of commands) {
        assert.match(isolatedSource, new RegExp(`${command}: \\[`));
    }
    assert.match(isolatedSource, /const \[type, info\] = commands\[message\.action\]/);
    assert.match(isolatedSource, /window\.postMessage\(\{ type \}, '\*'\)/);
    assert.doesNotMatch(isolatedSource, /stylesheetUrl|sourceStylesheetUrl|recordedFrames|operations|otherFrames/);
    assert.doesNotMatch(isolatedSource, /\.css['"]/);
});

test('batch features use imported APIs instead of global module lookups', () => {
    const mainSource = read('src/main.js');
    const expected = [
        ['batchAccessApi', 'batchLessonAccessFeature'],
        ['batchUserManagementApi', 'batchUserManagementFeature'],
        ['batchUserOnboardingApi', 'batchUserOnboardingFeature'],
        ['batchSectionCreationApi', 'batchSectionCreationFeature'],
        ['batchSectionDeletionApi', 'batchSectionDeletionFeature']
    ];

    for (const [moduleName, variableName] of expected) {
        assert.match(mainSource, new RegExp(`${moduleName}\\.`));
        assert.match(mainSource, new RegExp(`${variableName}\\.open`));
    }
    assert.match(mainSource, /getConnectionState: transport\.getConnectionState/);
    assert.doesNotMatch(mainSource, /requireToolboxModule/);
});