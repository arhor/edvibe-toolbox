import * as recorderDialogApi from '#src/content/main/features/action-recorder/action-recorder-dialog.js';
import * as recorderApi from '#src/content/main/features/action-recorder/action-recorder.js';
import * as batchAccessDialogApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access-dialog.js';
import * as batchAccessHistoryApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access-history.js';
import * as batchAccessApi from '#src/content/main/features/batch-lesson-access/batch-lesson-access.js';
import * as batchSectionCreationDialogApi from '#src/content/main/features/batch-section-creation/batch-section-creation-dialog.js';
import * as batchSectionCreationHistoryApi from '#src/content/main/features/batch-section-creation/batch-section-creation-history.js';
import * as batchSectionCreationApi from '#src/content/main/features/batch-section-creation/batch-section-creation.js';
import {
    createImageUploadCreationAdapter,
    dynamicImageRecipe
} from '#src/content/main/features/batch-section-creation/batch-section-image-upload.js';
import * as batchSectionDeletionDialogApi from '#src/content/main/features/batch-section-deletion/batch-section-deletion-dialog.js';
import '#src/content/main/features/marathon-export/export-progress-dialog.js';
import '#src/content/main/features/reset-lessons/reset-lessons-dialog.js';
import * as batchSectionDeletionApi from '#src/content/main/features/batch-section-deletion/batch-section-deletion-history.js';
import * as batchUserManagementDialogApi from '#src/content/main/features/batch-user-management/batch-user-management-dialog.js';
import * as batchUserManagementHistoryApi from '#src/content/main/features/batch-user-management/batch-user-management-history.js';
import * as batchUserManagementApi from '#src/content/main/features/batch-user-management/batch-user-management.js';
import * as batchUserOnboardingDialogApi from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-dialog.js';
import * as batchUserOnboardingApi from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding.js';
import * as historyDialogApi from '#src/content/main/features/execution-history/execution-history-dialog.js';
import * as historyFeatureApi from '#src/content/main/features/execution-history/execution-history.js';
import * as exportApi from '#src/content/main/features/marathon-export/marathon-export.js';
import * as resetApi from '#src/content/main/features/reset-lessons/reset-lessons.js';
import * as storageBridgeApi from '#src/content/main/infrastructure/chrome-storage-bridge.js';
import * as historyExportApi from '#src/content/main/infrastructure/execution-history-export.js';
import * as historyRepositoryApi from '#src/content/main/infrastructure/execution-history-repository.js';
import * as historyRetentionApi from '#src/content/main/infrastructure/execution-history-retention.js';
import * as historyServiceApi from '#src/content/main/infrastructure/execution-history-service.js';
import * as indexedDbApi from '#src/content/main/infrastructure/indexeddb.js';
import * as operationGuardApi from '#src/content/main/infrastructure/operation-guard.js';
import * as transportApi from '#src/content/main/infrastructure/websocket-transport.js';
import { createLoggerFactory } from '#src/shared/logger.js';
import {
    WINDOW_MESSAGE_TYPES,
    createExportStatusMessage,
    isMainCommandMessage
} from '#src/shared/message-protocol.js';

const createMainLog = createLoggerFactory('MAIN');
const log = createMainLog();

log('Initializing Toolbox modules...');

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
const historyRepository = historyRepositoryApi.createExecutionHistoryRepository({
    indexedDbApi,
    indexedDB: window.indexedDB
});
const historyPreferenceStore = historyRetentionApi.createRetentionPreferenceStore(storageBridge);
const historyService = historyServiceApi.createExecutionHistoryService({
    repository: historyRepository,
    preferenceStore: historyPreferenceStore,
    downloader: historyExportApi.createJsonDownloader({
        document,
        URL: window.URL,
        Blob: window.Blob
    }),
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
    window.postMessage(createExportStatusMessage(state, message), '*');
}

const marathonExportFeature = exportApi.createMarathonExportFeature({
    sendRequest: transport.sendRequest,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('export'),
    notifyStatus: notifyExportStatus,
    log: createMainLog('Export'),
    compileToZip: (backupData, options) => exportApi.compileMarathonToZip(
        backupData,
        { ...options, log: createMainLog('Zip') }
    )
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
    log: createMainLog('Recorder')
});

const batchLessonAccessFeature = batchAccessHistoryApi.createHistoryAwareFeature({
    createFeature: batchAccessApi.createBatchLessonAccessFeature,
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('batch-access'),
    createDialog: () => document.createElement(batchAccessDialogApi.BATCH_ACCESS_DIALOG_TAG),
    copyText: (text) => navigator.clipboard.writeText(text),
    persistExecution: historyService.persistTerminal,
    openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
    getLocationHref: () => window.location.href,
    getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
        || document.title
        || null,
    log: createMainLog('BatchAccessHistory')
});

const createBatchUserManagementDialog = batchUserManagementHistoryApi.createHistoryAwareDialog({
    createDialog: () => document.createElement(batchUserManagementDialogApi.USER_MANAGEMENT_DIALOG_TAG),
    persistExecution: historyService.persistTerminal,
    openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
    getLocationHref: () => window.location.href,
    getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
        || document.title
        || null,
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

const batchUserOnboardingFeature = batchUserOnboardingApi.createBatchUserOnboardingFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('batch-user-onboarding'),
    createDialog: () => document.createElement(batchUserOnboardingDialogApi.BATCH_USER_ONBOARDING_DIALOG_TAG),
    copyText: (text) => navigator.clipboard.writeText(text),
    persistExecution: historyService.persistTerminal,
    openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
    getLocationHref: () => window.location.href,
    getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
        || document.title
        || null,
    getRequestContext: () => ({ host: window.location.hostname }),
    log: createMainLog('BatchUserOnboarding')
});

const createBatchSectionCreationDialog = batchSectionCreationHistoryApi.createHistoryAwareDialog({
    createDialog: () => document.createElement(batchSectionCreationDialogApi.BATCH_SECTION_DIALOG_TAG),
    persistExecution: historyService.persistTerminal,
    openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
    getLocationHref: () => window.location.href,
    getMarathonName: () => document.querySelector('h1')?.textContent?.trim()
        || document.title
        || null,
    log: createMainLog('BatchSectionCreationHistory')
});
const batchSectionCreationAdapter = createImageUploadCreationAdapter({
    recipe: dynamicImageRecipe,
    cryptoApi: window.crypto
});
const batchSectionCreationFeature = batchSectionCreationApi.createBatchSectionCreationFeature({
    sendRequest: transport.sendRequest,
    getConnectionState: transport.getConnectionState,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange: guardedActiveChange('batch-section-creation'),
    adapter: batchSectionCreationAdapter,
    createDialog: createBatchSectionCreationDialog,
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
    openHistory: (executionId) => executionHistoryFeature.open({ executionId }),
    log: createMainLog('BatchSectionDeletion')
});

function openActionRecorder() {
    if (recorderOpen) {
        actionRecorderFeature.open();
    } else if (operationGuard.activate('recording')) {
        try {
            actionRecorderFeature.open();
        } catch (error) {
            operationGuard.release('recording');
            throw error;
        }
    } else {
        window.alert('Another Edvibe Toolbox operation is already running.');
    }
}

const mainCommandHandlers = new Map([
    [WINDOW_MESSAGE_TYPES.START_EXPORT, () => marathonExportFeature.start()],
    [WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET, () => lessonResetFeature.open()],
    [WINDOW_MESSAGE_TYPES.OPEN_BATCH_LESSON_ACCESS, () => batchLessonAccessFeature.open()],
    [WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_ONBOARDING, () => batchUserOnboardingFeature.open()],
    [WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_MANAGEMENT, () => batchUserManagementFeature.open()],
    [WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_CREATION, () => batchSectionCreationFeature.open()],
    [WINDOW_MESSAGE_TYPES.OPEN_BATCH_SECTION_DELETION, () => batchSectionDeletionFeature.open()],
    [WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY, (data) => executionHistoryFeature.open({ executionId: data.executionId || null })],
    [WINDOW_MESSAGE_TYPES.OPEN_ACTION_RECORDER, openActionRecorder]
]);

window.addEventListener('message', ({ source, data }) => {
    if (source !== window || !isMainCommandMessage(data)) {
        return;
    }
    mainCommandHandlers.get(data.type)?.(data);
});

log('Toolbox modules ready.');
