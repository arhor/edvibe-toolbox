// main.js - MAIN-world composition root

console.log('[Edvibe Toolbox][Main] Initializing Toolbox modules...');

function requireToolboxModule(name, value) {
    if (!value) {
        throw new Error(`[Edvibe Toolbox][Main] Required module is missing: ${name}`);
    }

    return value;
}

const transport = requireToolboxModule(
    'EdVibeWebSocketTransport',
    window.EdVibeWebSocketTransport
);
const operationGuardApi = requireToolboxModule(
    'EdVibeOperationGuard',
    window.EdVibeOperationGuard
);
const exportApi = requireToolboxModule(
    'EdVibeMarathonExport',
    window.EdVibeMarathonExport
);
const zipApi = requireToolboxModule(
    'EdVibeCompileMarathonToZip',
    window.EdVibeCompileMarathonToZip
);
const resetApi = requireToolboxModule(
    'EdVibeLessonReset',
    window.EdVibeLessonReset
);

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
    compileToZip: zipApi.compileMarathonToZip,
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
