console.log('[Edvibe Toolbox][Main] Initializing Toolbox modules...');

function requireToolboxModule(name) {
    const module = window[name];
    
    if (!module) {
        throw new Error(`[Edvibe Toolbox][Main] Required module is missing: ${name}`);
    }
    return module;
}

const transport = requireToolboxModule('EdVibeWebSocketTransport');
const operationGuardApi = requireToolboxModule('EdVibeOperationGuard');
const exportApi = requireToolboxModule('EdVibeMarathonExport');
const resetApi = requireToolboxModule('EdVibeLessonReset');

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
    notifyStatus: notifyExportStatus
});

const lessonResetFeature = resetApi.createResetLessonsFeature({
    sendRequest: transport.sendRequest,
    sendWithoutResponse: transport.sendWithoutResponse,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) operationGuard.activate('reset');
        else operationGuard.release('reset');
    }
});

window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data?.type === 'EDVIBE_TOOLBOX_START_ALL') {
        marathonExportFeature.start();
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_RESET') {
        lessonResetFeature.open();
    }
});

console.log('[Edvibe Toolbox][Main] Toolbox modules ready.');
