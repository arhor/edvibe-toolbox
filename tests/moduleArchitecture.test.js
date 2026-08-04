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
        'src/shared/logger.js',
        'src/shared/websocket-transport.js',
        'src/shared/operation-guard.js',
        'src/components/reset-lessons-dialog.js',
        'src/components/action-recorder-dialog.js',
        'src/components/export-progress-dialog.js',
        'src/components/batch-lesson-access-dialog.js',
        'src/components/batch-user-management-dialog.js',
        'src/components/batch-section-creation-dialog.js',
        'src/features/reset-lessons.js',
        'src/features/marathon-export.js',
        'src/features/action-recorder.js',
        'src/features/batch-lesson-access.js',
        'src/features/batch-user-management.js',
        'src/features/batch-section-creation.js',
        'src/main.js'
    ]);

    const isolatedWorld = manifest.content_scripts.find(
        (entry) => entry.world === 'ISOLATED'
    );
    assert.deepEqual(isolatedWorld.js, [
        'src/shared//logger.js',
        'src/isolated.js'
    ]);

    assert.deepEqual(manifest.web_accessible_resources, [{
        resources: [
            'src/components/reset-lessons-dialog.css',
            'src/components/action-recorder-dialog.css',
            'src/components/export-progress-dialog.css',
            'src/components/batch-lesson-access-dialog.css',
            'src/components/batch-user-management-dialog.css',
            'src/components/batch-section-creation-dialog.css'
        ],
        matches: ['*://*.edvibe.com/*']
    }]);

    for (const scriptPath of mainWorld.js) {
        assert.equal(
            fs.existsSync(path.join(root, scriptPath)),
            true,
            `${scriptPath} should exist`
        );
    }
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
        'src/features/batch-section-creation.js'
    ];

    for (const file of coordinatorFiles) {
        const source = fs.readFileSync(path.join(root, file), 'utf8');
        assert.doesNotMatch(source, /(?:innerHTML|insertAdjacentHTML|cssText|\.style\.)/);
        assert.doesNotMatch(
            source,
            /createElement\(['"](?:div|section|article|button|p|span|style)['"]\)/
        );
    }

    const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
    assert.match(agents, /dynamically created user-interface HTML as Web Components/);
    assert.match(agents, /Keep all CSS\s+in dedicated `\.css` files/);
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
    assert.match(source, /createActionRecorderFeature/);
    assert.match(source, /createBatchLessonAccessFeature/);
    assert.match(source, /createBatchUserManagementFeature/);
    assert.match(source, /createBatchSectionCreationFeature/);
});

test('marathon export owns its ZIP compiler implementation', () => {
    const exportApi = require('../src/features/marathon-export.js');

    assert.equal(typeof exportApi.compileMarathonToZip, 'function');
    assert.equal(
        fs.existsSync(path.join(root, 'src/features/compile-marathon-to-zip.js')),
        false
    );
});

test('action recorder routing crosses worlds without captured payload storage', () => {
    const isolatedSource = fs.readFileSync(
        path.join(root, 'src/isolated.js'),
        'utf8'
    );
    const mainSource = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
    const recorderSource = fs.readFileSync(
        path.join(root, 'src/features/action-recorder.js'),
        'utf8'
    );

    assert.match(isolatedSource, /case 'OPEN_ACTION_RECORDER'/);
    assert.match(isolatedSource, /type: 'EDVIBE_TOOLBOX_OPEN_RECORDER'/);
    assert.match(
        isolatedSource,
        /src\/components\/action-recorder-dialog\.css/
    );
    assert.match(mainSource, /actionRecorderFeature\.open/);
    assert.match(recorderSource, /subscribeFrames\(handleFrame\)/);
    assert.doesNotMatch(recorderSource, /chrome\.storage/);
    assert.doesNotMatch(isolatedSource, /recordedFrames|operations|otherFrames/);
});

test('batch lesson access routing crosses worlds with its stylesheet only', () => {
    const isolatedSource = fs.readFileSync(
        path.join(root, 'src/isolated.js'),
        'utf8'
    );
    const mainSource = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');

    assert.match(
        isolatedSource,
        /case 'OPEN_BATCH_LESSON_ACCESS':\s*window\.postMessage\(\{\s*type: 'EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS',\s*stylesheetUrl: chrome\.runtime\.getURL\(\s*'src\/components\/batch-lesson-access-dialog\.css'\s*\)\s*\}, '\*'\)/
    );
    assert.match(
        mainSource,
        /requireToolboxModule\('EdVibeBatchLessonAccess'\)/
    );
    assert.match(
        mainSource,
        /requireToolboxModule\('EdVibeBatchAccessDialogComponent'\)/
    );
    assert.match(
        mainSource,
        /createBatchLessonAccessFeature\(\{[\s\S]*?getConnectionState: transport\.getConnectionState/
    );
    assert.match(
        mainSource,
        /event\.data\?\.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS'[\s\S]*?batchLessonAccessFeature\.open\(\{ stylesheetUrl: event\.data\.stylesheetUrl \}\)/
    );
});

test('batch user management routing crosses worlds with its stylesheet only', () => {
    const isolatedSource = fs.readFileSync(
        path.join(root, 'src/isolated.js'),
        'utf8'
    );
    const mainSource = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');

    assert.match(
        isolatedSource,
        /case 'OPEN_BATCH_USER_MANAGEMENT':\s*window\.postMessage\(\{\s*type: 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT',\s*stylesheetUrl: chrome\.runtime\.getURL\(\s*'src\/components\/batch-user-management-dialog\.css'\s*\)\s*\}, '\*'\)/
    );
    assert.match(mainSource, /requireToolboxModule\('EdVibeBatchUserManagement'\)/);
    assert.match(mainSource, /requireToolboxModule\('EdVibeBatchUserManagementDialog'\)/);
    assert.match(
        mainSource,
        /createBatchUserManagementFeature\(\{[\s\S]*?getConnectionState: transport\.getConnectionState/
    );
    assert.match(
        mainSource,
        /event\.data\?\.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT'[\s\S]*?batchUserManagementFeature\.open\(\{ stylesheetUrl: event\.data\.stylesheetUrl \}\)/
    );
});

test('batch section creation routing crosses worlds and uses a reviewed recipe adapter', () => {
    const isolatedSource = fs.readFileSync(
        path.join(root, 'src/isolated.js'),
        'utf8'
    );
    const mainSource = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');

    assert.match(
        isolatedSource,
        /case 'OPEN_BATCH_SECTION_CREATION':\s*window\.postMessage\(\{\s*type: 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION',\s*stylesheetUrl: chrome\.runtime\.getURL\(\s*'src\/components\/batch-section-creation-dialog\.css'\s*\)\s*\}, '\*'\)/
    );
    assert.match(mainSource, /requireToolboxModule\('EdVibeBatchSectionCreation'\)/);
    assert.match(mainSource, /requireToolboxModule\('EdVibeBatchSectionCreationDialog'\)/);
    assert.match(
        mainSource,
        /createRecordedCreationAdapter\(\{[\s\S]*?recipe: window\.EdVibeBatchSectionCreationRecipe \|\| null/
    );
    assert.match(
        mainSource,
        /createBatchSectionCreationFeature\(\{[\s\S]*?adapter: batchSectionCreationAdapter/
    );
    assert.match(
        mainSource,
        /event\.data\?\.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION'[\s\S]*?batchSectionCreationFeature\.open\(\{ stylesheetUrl: event\.data\.stylesheetUrl \}\)/
    );
});
