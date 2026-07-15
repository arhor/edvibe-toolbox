console.log('[Edvibe Toolbox][Popup] Popup initialized.');

const DEFAULT_BUTTON_TEXT = 'Выгрузить марафон';
const EXPORTING_BUTTON_TEXT = '⚡ Exporting...';

chrome.runtime.onMessage.addListener((message) => {
    if (message?.action !== 'EXPORT_STATUS') {
        return;
    }

    console.log(`[Edvibe Toolbox][Popup] Received export status: ${message.state}.`);

    switch (message.state) {
        case 'started':
            setExportButtonState(true);
            break;
        case 'complete':
        case 'error':
            setExportButtonState(false);
            break;
        default:
            break;
    }
});

chrome.storage.local.get('exportInProgress').then((value) => {
    const isExporting = Boolean(value.exportInProgress);
    console.log(`[Edvibe Toolbox][Popup] Restored export state: ${isExporting}.`);
    setExportButtonState(isExporting);
});

function setExportButtonState(isExporting) {
    const startCaptureBtn = document.getElementById('startCaptureBtn');

    if (startCaptureBtn) {
        startCaptureBtn.disabled = isExporting;
        startCaptureBtn.innerText = isExporting ? EXPORTING_BUTTON_TEXT : DEFAULT_BUTTON_TEXT;
        startCaptureBtn.style.backgroundColor = isExporting ? '#d35400' : '';
    }
}

async function getActiveMarathonTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url) {
        throw new Error('Active browser tab could not be determined.');
    }

    const url = new URL(tab.url);
    const isEdvibe = url.hostname === 'edvibe.com' || url.hostname.endsWith('.edvibe.com');
    if (!isEdvibe || !/\/marathon\/\d+/.test(url.pathname)) {
        throw new Error('Open an Edvibe marathon page first.');
    }

    return tab;
}

function sendTabCommand(tabId, action) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, { action }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            resolve(response);
        });
    });
}

async function startAutomation(button) {
    if (button.disabled) {
        return;
    }

    console.log('[Edvibe Toolbox][Popup] Starting marathon export.');

    try {
        const tab = await getActiveMarathonTab();
        setExportButtonState(true);
        console.log(`[Edvibe Toolbox][Popup] Sending START_FULL_AUTOMATION to tab ${tab.id}.`);
        const response = await sendTabCommand(tab.id, 'START_FULL_AUTOMATION');
        console.log(`[Edvibe Toolbox][Popup] START_FULL_AUTOMATION acknowledged: ${response?.status || 'unknown'}.`);
    } catch (error) {
        console.error('[Edvibe Toolbox][Popup] Failed to start marathon export:', error);
        alert(error.message);
        setExportButtonState(false);
    }
}

async function openLessonReset(button) {
    if (button.disabled) return;

    console.log('[Edvibe Toolbox][Popup] Starting lesson reset.');
    button.disabled = true;
    try {
        const tab = await getActiveMarathonTab();
        console.log(`[Edvibe Toolbox][Popup] Sending OPEN_LESSON_RESET to tab ${tab.id}.`);
        await sendTabCommand(tab.id, 'OPEN_LESSON_RESET');
        console.log('[Edvibe Toolbox][Popup] OPEN_LESSON_RESET acknowledged.');
        window.close();
    } catch (error) {
        console.error('[Edvibe Toolbox][Popup] Failed to open lesson reset:', error);
        alert(error.message);
        button.disabled = false;
    }
}

window.startAutomation = startAutomation;
window.openLessonReset = openLessonReset;
