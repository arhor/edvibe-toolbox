// isolated.js - Runs in the extension's ISOLATED world context

console.log('[Edvibe Toolbox][Isolated] Script successfully injected and initialized.');

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

window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data?.type) return;

    if (event.data.type === 'EDVIBE_TOOLBOX_EXPORT_STATUS') {
        console.log('[Edvibe Toolbox][Isolated] Export status update from MAIN world:', event.data.state);
        relayExportStatus(event.data);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Edvibe Toolbox][Isolated] Incoming chrome.runtime message received:', message);

    if (message && message.action === 'START_FULL_AUTOMATION') {
        console.log('[Edvibe Toolbox][Isolated] Action matched: START_FULL_AUTOMATION. Forwarding command to MAIN world...');

        relayExportStatus({ state: 'started' });
        window.postMessage({ type: 'EDVIBE_TOOLBOX_START_ALL' }, '*');

        sendResponse({ status: 'success', info: 'Automation sequence channeled to page engine.' });
    } else if (message && message.action === 'OPEN_LESSON_RESET') {
        console.log('[Edvibe Toolbox][Isolated] Opening lesson reset workflow in MAIN world...');
        window.postMessage({ type: 'EDVIBE_TOOLBOX_OPEN_RESET' }, '*');
        sendResponse({ status: 'success', info: 'Lesson reset workflow opened.' });
    } else {
        sendResponse({ status: 'ignored' });
    }

    return true;
});
