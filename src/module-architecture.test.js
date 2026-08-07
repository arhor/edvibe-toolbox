const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('manifest loads infrastructure, components, features, and main in dependency order', () => {
    const manifest = JSON.parse(read('manifest.json'));
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const isolatedWorld = manifest.content_scripts.find((entry) => entry.world === 'ISOLATED');

    assert.deepEqual(isolatedWorld.js, ['src/shared//logger.js', 'src/isolated.js']);
    assert.equal(mainWorld.js.at(-1), 'src/main.js');

    const requiredScripts = [
        'src/shared/logger.js',
        'src/shared/websocket-transport.js',
        'src/shared/operation-guard.js',
        'src/components/action-recorder-dialog.js',
        'src/components/batch-lesson-access-dialog.js',
        'src/components/batch-user-onboarding-dialog.js',
        'src/components/batch-user-management-dialog.js',
        'src/components/batch-section-creation-dialog.js',
        'src/components/batch-section-deletion-dialog.js',
        'src/features/action-recorder.js',
        'src/features/batch-lesson-access.js',
        'src/features/batch-user-management.js',
        'src/features/batch-user-onboarding.js',
        'src/features/batch-section-creation.js',
        'src/features/batch-section-deletion.js'
    ];

    for (const scriptPath of requiredScripts) {
        assert.ok(mainWorld.js.includes(scriptPath), `${scriptPath} should be loaded`);
        assert.ok(fs.existsSync(path.join(root, scriptPath)), `${scriptPath} should exist`);
    }

    const firstFeature = Math.min(...mainWorld.js
        .map((scriptPath, index) => scriptPath.startsWith('src/features/') ? index : Infinity));
    const lastComponent = Math.max(...mainWorld.js
        .map((scriptPath, index) => scriptPath.startsWith('src/components/') ? index : -1));
    assert.ok(lastComponent < firstFeature);
    assert.ok(
        mainWorld.js.indexOf('src/features/batch-user-management.js')
        < mainWorld.js.indexOf('src/features/batch-user-onboarding.js')
    );
});

test('dynamic UI and presentation stay in components and stylesheets', () => {
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
    assert.match(agents, /dynamically created user-interface HTML as Web Components/);
    assert.match(agents, /Keep all CSS\s+in dedicated `\.css` files/);
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