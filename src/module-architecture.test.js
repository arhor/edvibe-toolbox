const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readImports = (relativePath) => [...read(relativePath).matchAll(/^import ['"](.+?)['"];$/gm)]
    .map((match) => match[1]);

test('runtime entry points load dependencies in explicit source order', () => {
    const manifest = JSON.parse(read('manifest.json'));
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const isolatedWorld = manifest.content_scripts.find((entry) => entry.world === 'ISOLATED');
    const mainImports = readImports('src/entrypoints/main.js');

    assert.deepEqual(isolatedWorld.js, ['src/entrypoints/isolated.js']);
    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.deepEqual(readImports('src/entrypoints/isolated.js'), [
        '../shared/logger.js',
        '../isolated.js'
    ]);
    assert.deepEqual(mainImports.slice(0, 2), [
        './runtime-dependencies.js',
        '../shared/logger.js'
    ]);
    assert.equal(mainImports.at(-1), '../main.js');

    const requiredImports = [
        '../shared/logger.js',
        '../shared/websocket-transport.js',
        '../shared/operation-guard.js',
        '../components/action-recorder-dialog.js',
        '../components/batch-lesson-access-dialog.js',
        '../components/batch-user-onboarding-dialog.js',
        '../components/batch-user-management-dialog.js',
        '../components/batch-section-creation-dialog.js',
        '../components/batch-section-deletion-dialog.js',
        '../features/action-recorder.js',
        '../features/batch-lesson-access.js',
        '../features/batch-user-management.js',
        '../features/batch-user-onboarding.js',
        '../features/batch-section-creation.js',
        '../features/batch-section-deletion.js'
    ];

    for (const importPath of requiredImports) {
        assert.ok(mainImports.includes(importPath), `${importPath} should be imported`);
        assert.ok(
            fs.existsSync(path.resolve(root, 'src/entrypoints', importPath)),
            `${importPath} should resolve`
        );
    }

    const firstFeature = Math.min(...mainImports
        .map((importPath, index) => importPath.startsWith('../features/') ? index : Infinity));
    const lastComponent = Math.max(...mainImports
        .map((importPath, index) => importPath.startsWith('../components/') ? index : -1));
    assert.ok(lastComponent < firstFeature);
    assert.ok(
        mainImports.indexOf('../features/batch-user-management.js')
        < mainImports.indexOf('../features/batch-user-onboarding.js')
    );
});

test('dynamic UI and presentation stay in Lit components and stylesheets', () => {
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
    assert.match(agents, /Keep component presentation in dedicated `\.css` files/);
    assert.doesNotMatch(agents, /framework-free/);
});

test('main creates and installs shared transport and operation guard', () => {
    const transportSource = read('src/shared/websocket-transport.js');
    const mainSource = read('src/main.js');

    assert.doesNotMatch(transportSource, /root\.WebSocket/);
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
    assert.match(isolatedSource, /const \[type, stylesheet, info\] = commands\[message\.action\]/);
    assert.match(isolatedSource, /window\.postMessage\(\{ type, stylesheetUrl:/);
    assert.doesNotMatch(isolatedSource, /recordedFrames|operations|otherFrames/);
});

test('batch features are wired to transport state and their dialogs', () => {
    const mainSource = read('src/main.js');
    const expected = [
        ['EdVibeBatchLessonAccess', 'batchLessonAccessFeature'],
        ['EdVibeBatchUserManagement', 'batchUserManagementFeature'],
        ['EdVibeBatchUserOnboarding', 'batchUserOnboardingFeature'],
        ['EdVibeBatchSectionCreation', 'batchSectionCreationFeature'],
        ['EdVibeBatchSectionDeletion', 'batchSectionDeletionFeature']
    ];

    for (const [moduleName, variableName] of expected) {
        assert.match(mainSource, new RegExp(`requireToolboxModule\\('${moduleName}'\\)`));
        assert.match(mainSource, new RegExp(`${variableName}\\.open`));
    }
    assert.match(mainSource, /getConnectionState: transport\.getConnectionState/);
});
