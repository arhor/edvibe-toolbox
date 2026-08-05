const createIsolatedLog = EdVibeLogger.createLoggerFactory('ISOLATED');
const log = createIsolatedLog();

log('Script successfully injected and initialized.');

chrome.storage.local.set({ exportInProgress: false }, () => {
    log('Reset stale export state for the loaded page.');
});

window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data?.type) return;
    if (event.data.type === 'EDVIBE_TOOLBOX_EXPORT_STATUS') relayExportStatus(event.data);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    log('Incoming message received:', message);
    const commands = {
        OPEN_LESSON_RESET: ['EDVIBE_TOOLBOX_OPEN_RESET', 'src/components/reset-lessons-dialog.css', 'Lesson reset workflow opened.'],
        OPEN_ACTION_RECORDER: ['EDVIBE_TOOLBOX_OPEN_RECORDER', 'src/components/action-recorder-dialog.css', 'Action recorder opened.'],
        OPEN_BATCH_LESSON_ACCESS: ['EDVIBE_TOOLBOX_OPEN_BATCH_LESSON_ACCESS', 'src/components/batch-lesson-access-dialog.css', 'Batch lesson access opened.'],
        OPEN_BATCH_USER_MANAGEMENT: ['EDVIBE_TOOLBOX_OPEN_BATCH_USER_MANAGEMENT', 'src/components/batch-user-management-dialog.css', 'Batch user management opened.'],
        OPEN_BATCH_SECTION_CREATION: ['EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_CREATION', 'src/components/batch-section-creation-dialog.css', 'Batch section creation opened.'],
        OPEN_BATCH_SECTION_DELETION: ['EDVIBE_TOOLBOX_OPEN_BATCH_SECTION_DELETION', 'src/components/batch-section-deletion-dialog.css', 'Batch section deletion opened.']
    };

    if (message.action === 'START_FULL_AUTOMATION') {
        relayExportStatus({ state: 'started' });
        window.postMessage({ type: 'EDVIBE_TOOLBOX_START_ALL', stylesheetUrl: chrome.runtime.getURL('src/components/export-progress-dialog.css') }, '*');
        sendResponse({ status: 'success', info: 'Automation sequence channeled to page engine.' });
    } else if (commands[message.action]) {
        const [type, stylesheet, info] = commands[message.action];
        window.postMessage({ type, stylesheetUrl: chrome.runtime.getURL(stylesheet) }, '*');
        sendResponse({ status: 'success', info });
    } else {
        sendResponse({ status: 'ignored' });
    }
    return true;
});

function relayExportStatus(payload) {
    const isActive = payload.state === 'started';
    chrome.storage.local.set({ exportInProgress: isActive }, () => {
        chrome.runtime.sendMessage({ action: 'EXPORT_STATUS', state: payload.state, message: payload.message || '' });
    });
}
