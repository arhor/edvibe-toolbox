const createMainLog = EdVibeLogger.createLoggerFactory('MAIN');
const log = createMainLog();

log('Initializing Toolbox modules...');

function requireToolboxModule(name) {
    const module = window[name];

    if (!module) {
        throw new Error(`Required module is missing: ${name}`);
    }
    return module;
}

const transportApi = requireToolboxModule('EdVibeWebSocketTransport');
const operationGuardApi = requireToolboxModule('EdVibeOperationGuard');
const exportApi = requireToolboxModule('EdVibeMarathonExport');
const resetApi = requireToolboxModule('EdVibeLessonReset');
const recorderApi = requireToolboxModule('EdVibeActionRecorder');
const recorderDialogApi = requireToolboxModule('EdVibeActionRecorderDialog');
const batchAccessApi = requireToolboxModule('EdVibeBatchLessonAccess');
const batchAccessDialogApi = requireToolboxModule('EdVibeBatchAccessDialogComponent');
const batchUserManagementApi = requireToolboxModule('EdVibeBatchUserManagement');
const batchUserManagementDialogApi = requireToolboxModule('EdVibeBatchUserManagementDialog');
const batchSectionCreationApi = requireToolboxModule('EdVibeBatchSectionCreation');
const batchSectionCreationDialogApi = requireToolboxModule('EdVibeBatchSectionCreationDialog');
const batchSectionCreationRecipe = requireToolboxModule('EdVibeBatchSectionCreationRecipe');

const transportLog = createMainLog('Transport');
const exportLog = createMainLog('Export');
const zipLog = createMainLog('Zip');
const resetLog = createMainLog('Reset');
const recorderLog = createMainLog('Recorder');
const batchAccessLog = createMainLog('BatchAccess');
const batchUserManagementLog = createMainLog('BatchUserManagement');
const batchSectionCreationLog = createMainLog('BatchSectionCreation');

const transport = transportApi.createWebSocketTransport({
    WebSocketClass: window.WebSocket,
    cryptoApi: window.crypto,
    log: transportLog
});
transport.install(window);

const operationGuard = operationGuardApi.createOperationGuard();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function notifyExportStatus(state, message = '') {
    window.postMessage({
        type: 'EDVIBE_TOOLBOX_EXPORT_STATUS',
        state,
        message
    }, '*');
}

const marathonExportFeature = exportApi.createMarathonExportFeature({
    sendRequest: transport.sendRequest,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) {
            operationGuard.activate('export');
        }
        else {
            operationGuard.release('export');
        }
    },
    notifyStatus: notifyExportStatus,
    log: exportLog,
    compileToZip: (backupData, options) => exportApi.compileMarathonToZip(
        backupData,
        { ...options, log: zipLog }
    )
});

const lessonResetFeature = resetApi.createResetLessonsFeature({
    sendRequest: transport.sendRequest,
    sendWithoutResponse: transport.sendWithoutResponse,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) {
            operationGuard.activate('reset');
        }
        else {
            operationGuard.release('reset');
        }
    },
    log: resetLog
});

let recorderOpen = false;
const actionRecorderFeature = recorderApi.createActionRecorderFeature({
    subscribeFrames: transport.subscribeFrames,
    createPanel() {
        const panel = document.createElement(recorderDialogApi.RECORDER_DIALOG_TAG);
        const configure = panel.configure.bind(panel);
        panel.configure = (options = {}) => configure({
            ...options,
            onClose() {
                try {
                    options.onClose?.();
                } finally {
                    recorderOpen = false;
                    operationGuard.release('recording');
                }
            }
        });
        recorderOpen = true;
        return panel;
    },
    log: recorderLog
});

const batchLessonAccessFeature = batchAccessApi.createBatchLessonAccessFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) {
            operationGuard.activate('batch-access');
        }
        else {
            operationGuard.release('batch-access');
        }
    },
    createDialog() {
        return document.createElement(batchAccessDialogApi.BATCH_ACCESS_DIALOG_TAG);
    },
    copyText: (text) => navigator.clipboard.writeText(text),
    log: batchAccessLog
});

const batchUserManagementFeature = batchUserManagementApi.createBatchUserManagementFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) {
            operationGuard.activate('batch-user-management');
        }
        else {
            operationGuard.release('batch-user-management');
        }
    },
    createDialog() {
        return document.createElement(batchUserManagementDialogApi.USER_MANAGEMENT_DIALOG_TAG);
    },
    log: batchUserManagementLog
});

const batchSectionCreationAdapter = batchSectionCreationApi.createRecordedCreationAdapter({
    recipe: batchSectionCreationRecipe,
    cryptoApi: window.crypto
});

const batchSectionCreationFeature = batchSectionCreationApi.createBatchSectionCreationFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) {
            operationGuard.activate('batch-section-creation');
        }
        else {
            operationGuard.release('batch-section-creation');
        }
    },
    adapter: batchSectionCreationAdapter,
    createDialog() {
        return document.createElement(batchSectionCreationDialogApi.BATCH_SECTION_DIALOG_TAG);
    },
    copyText: (text) => navigator.clipboard.writeText(text),
    log: batchSectionCreationLog
});

window.addEventListener('message', (event) => {
    if (event.source !== window) {
        return;
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_START_ALL') {
        marathonExportFeature.start({ stylesheetUrl: event.data.stylesheetUrl });
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_RESET') {
        lessonResetFeature.open({ stylesheetUrl: event.data.stylesheetUrl });
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_RECORDER') {
        if (recorderOpen) {
            actionRecorderFeature.open({ stylesheetUrl: event.data.stylesheetUrl });
        } else if (operationGuard.activate('recording')) {
            try {
                actionRecorderFeature.open({ stylesheetUrl: event.data.stylesheetUrl });
            } catch (error) {
                operationGuard.release('recording');
                throw error;
            }
        } else {
            window.alert('Another Edvibe Toolbox operation is already running.');
        }
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS') {
        batchLessonAccessFeature.open({ stylesheetUrl: event.data.stylesheetUrl });
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT') {
        batchUserManagementFeature.open({ stylesheetUrl: event.data.stylesheetUrl });
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION') {
        batchSectionCreationFeature.open({ stylesheetUrl: event.data.stylesheetUrl });
    }
});

log('Toolbox modules ready.');
