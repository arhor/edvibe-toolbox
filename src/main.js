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
const resetDialogApi = requireToolboxModule('EdVibeResetDialogComponent');
const resetApi = requireToolboxModule('EdVibeLessonReset');

const transportLog = createMainLog('Transport');
const exportLog = createMainLog('Export');
const zipLog = createMainLog('Zip');
const resetLog = createMainLog('Reset');

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
        if (isActive) operationGuard.activate('export');
        else operationGuard.release('export');
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
        if (isActive) operationGuard.activate('reset');
        else operationGuard.release('reset');
    },
    log: resetLog
});

window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data?.type === 'EDVIBE_TOOLBOX_START_ALL') {
        marathonExportFeature.start();
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_RESET') {
        resetDialogApi.setStylesheetUrl(event.data.stylesheetUrl);
        lessonResetFeature.open();
    }
});

log('Toolbox modules ready.');
