const createIsolatedLog = EdVibeLogger.createLoggerFactory('ISOLATED');
const log = createIsolatedLog();

log('Script successfully injected and initialized.');

window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data?.type) {
        return;
    }

    if (event.data.type === 'EDVIBE_TOOLBOX_EXPORT_STATUS') {
        log('Export status update from MAIN world:', event.data.state);
        relayExportStatus(event.data);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    log('Incoming message received:', message);

    switch (message.action) {
        case 'START_FULL_AUTOMATION':
            relayExportStatus({ state: 'started' });

            window.postMessage({ type: 'EDVIBE_TOOLBOX_START_ALL' }, '*');
            sendResponse({ status: 'success', info: 'Automation sequence channeled to page engine.' });
            break;
        case 'OPEN_LESSON_RESET':
            window.postMessage({
                type: 'EDVIBE_TOOLBOX_OPEN_RESET',
                stylesheetUrl: chrome.runtime.getURL('src/components/reset-lessons-dialog.css')
            }, '*');
            sendResponse({ status: 'success', info: 'Lesson reset workflow opened.' });
            break;
        default:
            sendResponse({ status: 'ignored' });
            break;
    }

    return true;
});

function relayExportStatus(payload) {
    const isActive = payload.state === 'started';

    chrome.storage.local.set({ exportInProgress: isActive }, () => {
        chrome.runtime.sendMessage({
            action: 'EXPORT_STATUS',
            state: payload.state,
            message: payload.message || ''
        });
    });
}
