const createMainLog = EdVibeLogger.createLoggerFactory('MAIN');
const log = createMainLog();

log('Initializing Toolbox modules...');

function requireToolboxModule(name) {
    const module = window[name];
    if (!module) throw new Error(`Required module is missing: ${name}`);
    return module;
}

const transportApi = requireToolboxModule('EdVibeWebSocketTransport');
const operationGuardApi = requireToolboxModule('EdVibeOperationGuard');
const indexedDbApi = requireToolboxModule('EdVibeIndexedDb');
const historyRepositoryApi = requireToolboxModule('EdVibeExecutionHistoryRepository');
const historyRetentionApi = requireToolboxModule('EdVibeExecutionHistoryRetention');
const historyExportApi = requireToolboxModule('EdVibeExecutionHistoryExport');
const storageBridgeApi = requireToolboxModule('EdVibeChromeStorageBridge');
const historyServiceApi = requireToolboxModule('EdVibeExecutionHistoryService');
const historyDialogApi = requireToolboxModule('EdVibeExecutionHistoryDialog');
const historyFeatureApi = requireToolboxModule('EdVibeExecutionHistory');
const exportApi = requireToolboxModule('EdVibeMarathonExport');
const resetApi = requireToolboxModule('EdVibeLessonReset');
const recorderApi = requireToolboxModule('EdVibeActionRecorder');
const recorderDialogApi = requireToolboxModule('EdVibeActionRecorderDialog');
const batchAccessApi = requireToolboxModule('EdVibeBatchLessonAccess');
const batchAccessDialogApi = requireToolboxModule('EdVibeBatchAccessDialogComponent');
const batchUserManagementApi = requireToolboxModule('EdVibeBatchUserManagement');
const batchUserManagementHistoryApi = requireToolboxModule('EdVibeBatchUserManagementHistory');
const batchUserManagementDialogApi = requireToolboxModule('EdVibeBatchUserManagementDialog');
const batchSectionCreationApi = requireToolboxModule('EdVibeBatchSectionCreation');
const batchSectionCreationDialogApi = requireToolboxModule('EdVibeBatchSectionCreationDialog');
const batchSectionCreationRecipe = requireToolboxModule('EdVibeBatchSectionCreationRecipe');
const batchSectionDeletionApi = requireToolboxModule('EdVibeBatchSectionDeletion');
const batchSectionDeletionDialogApi = requireToolboxModule('EdVibeBatchSectionDeletionDialog');

const transport = transportApi.createWebSocketTransport({
    WebSocketClass: window.WebSocket,
    cryptoApi: window.crypto,
    log: createMainLog('Transport')
});
transport.install(window);

const operationGuard = operationGuardApi.createOperationGuard();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const guardedActiveChange = (key) => (isActive) => {
    if (isActive) operationGuard.activate(key);
    else operationGuard.release(key);
};

const storageBridge = storageBridgeApi.createStorageBridge({ window, cryptoApi: window.crypto });
const historyRepository = historyRepositoryApi.createExecutionHistoryRepository({ indexedDbApi, indexedDB: window.indexedDB });
const historyPreferenceStore = historyRetentionApi.createRetentionPreferenceStore(storageBridge);
const historyService = historyServiceApi.createExecutionHistoryService({
    repository: historyRepository,
    preferenceStore: historyPreferenceStore,
    downloader: historyExportApi.createJsonDownloader({ document, URL: window.URL, Blob: window.Blob }),
    cryptoApi: window.crypto
});
const executionHistoryFeature = historyFeatureApi.createExecutionHistoryFeature({
    service: historyService,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('history'),
    createDialog: () => document.createElement(historyDialogApi.EXECUTION_HISTORY_DIALOG_TAG),
    log: createMainLog('History')
});

function notifyExportStatus(state, message = '') {
    window.postMessage({ type: 'EDVIBE_TOOLBOX_EXPORT_STATUS', state, message }, '*');
}

const marathonExportFeature = exportApi.createMarathonExportFeature({
    sendRequest: transport.sendRequest,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('export'),
    notifyStatus: notifyExportStatus,
    log: createMainLog('Export'),
    compileToZip: (backupData, options) => exportApi.compileMarathonToZip(backupData, { ...options, log: createMainLog('Zip') })
});

const lessonResetFeature = resetApi.createResetLessonsFeature({
    sendRequest: transport.sendRequest,
    sendWithoutResponse: transport.sendWithoutResponse,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('reset'),
    log: createMainLog('Reset')
});

let recorderOpen = false;
const actionRecorderFeature = recorderApi.createActionRecorderFeature({
    subscribeFrames: transport.subscribeFrames,
    createPanel() {
        const panel = document.createElement(recorderDialogApi.RECORDER_DIALOG_TAG);
        const configure = panel.configure.bind(panel);
        panel.configure = (options = {}) => configure({ ...options, onClose() {
            try { options.onClose?.(); }
            finally { recorderOpen = false; operationGuard.release('recording'); }
        }});
        recorderOpen = true;
        return panel;
    },
    log: createMainLog('Recorder')
});

const batchLessonAccessFeature = batchAccessApi.createBatchLessonAccessFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('batch-access'),
    createDialog: () => document.createElement(batchAccessDialogApi.BATCH_ACCESS_DIALOG_TAG),
    copyText: (text) => navigator.clipboard.writeText(text),
    log: createMainLog('BatchAccess')
});

const createBatchUserManagementDialog = batchUserManagementHistoryApi.createHistoryAwareDialog({
    createDialog: () => document.createElement(batchUserManagementDialogApi.USER_MANAGEMENT_DIALOG_TAG),
    persistExecution: historyService.persistTerminal,
    openHistory: (executionId, sourceStylesheetUrl) => executionHistoryFeature.open({
        stylesheetUrl: new URL('execution-history-dialog.css', sourceStylesheetUrl).href,
        executionId
    }),
    getLocationHref: () => window.location.href,
    getMarathonName: () => document.querySelector('h1')?.textContent?.trim() || document.title || null,
    log: createMainLog('BatchUserManagementHistory')
});
const batchUserManagementFeature = batchUserManagementApi.createBatchUserManagementFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('batch-user-management'),
    createDialog: createBatchUserManagementDialog,
    log: createMainLog('BatchUserManagement')
});

const batchSectionCreationAdapter = batchSectionCreationApi.createRecordedCreationAdapter({ recipe: batchSectionCreationRecipe, cryptoApi: window.crypto });
const batchSectionCreationFeature = batchSectionCreationApi.createBatchSectionCreationFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('batch-section-creation'),
    adapter: batchSectionCreationAdapter,
    createDialog: () => document.createElement(batchSectionCreationDialogApi.BATCH_SECTION_DIALOG_TAG),
    copyText: (text) => navigator.clipboard.writeText(text),
    log: createMainLog('BatchSectionCreation')
});

const batchSectionDeletionFeature = batchSectionDeletionApi.createBatchSectionDeletionFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('batch-section-deletion'),
    createDialog: () => document.createElement(batchSectionDeletionDialogApi.BATCH_SECTION_DELETION_DIALOG_TAG),
    copyText: (text) => navigator.clipboard.writeText(text),
    persistExecution: historyService.persistTerminal,
    openHistory: (executionId, sourceStylesheetUrl) => executionHistoryFeature.open({
        stylesheetUrl: new URL('execution-history-dialog.css', sourceStylesheetUrl).href,
        executionId
    }),
    log: createMainLog('BatchSectionDeletion')
});

window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const data = event.data || {};
    if (data.type === 'EDVIBE_TOOLBOX_START_ALL') marathonExportFeature.start({ stylesheetUrl: data.stylesheetUrl });
    if (data.type === 'EDVIBE_TOOLBOX_OPEN_RESET') lessonResetFeature.open({ stylesheetUrl: data.stylesheetUrl });
    if (data.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS') batchLessonAccessFeature.open({ stylesheetUrl: data.stylesheetUrl });
    if (data.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT') batchUserManagementFeature.open({ stylesheetUrl: data.stylesheetUrl });
    if (data.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION') batchSectionCreationFeature.open({ stylesheetUrl: data.stylesheetUrl });
    if (data.type === 'EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION') batchSectionDeletionFeature.open({ stylesheetUrl: data.stylesheetUrl });
    if (data.type === 'EDVIBE_TOOLBOX_OPEN_EXECUTION_HISTORY') executionHistoryFeature.open({ stylesheetUrl: data.stylesheetUrl, executionId: data.executionId || null });
    if (data.type === 'EDVIBE_TOOLBOX_OPEN_RECORDER') {
        if (recorderOpen) actionRecorderFeature.open({ stylesheetUrl: data.stylesheetUrl });
        else if (operationGuard.activate('recording')) {
            try { actionRecorderFeature.open({ stylesheetUrl: data.stylesheetUrl }); }
            catch (error) { operationGuard.release('recording'); throw error; }
        } else window.alert('Another Edvibe Toolbox operation is already running.');
    }
});

log('Toolbox modules ready.');