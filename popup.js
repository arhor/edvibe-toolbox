// popup.js - Extension popup UI control script

console.log('[Edvibe Toolbox][Popup] Popup script initialized and active.');

const runAutomationBtn = document.getElementById('startCaptureBtn');
const DEFAULT_BUTTON_TEXT = 'Выгрузить марафон';
const EXPORTING_BUTTON_TEXT = '⚡ Exporting...';

function setExportButtonState(isExporting) {
    if (!runAutomationBtn) return;

    runAutomationBtn.disabled = isExporting;
    runAutomationBtn.innerText = isExporting ? EXPORTING_BUTTON_TEXT : DEFAULT_BUTTON_TEXT;
    runAutomationBtn.style.backgroundColor = isExporting ? '#d35400' : '';
}

async function syncExportButtonFromStorage() {
    const { exportInProgress } = await chrome.storage.local.get('exportInProgress');
    setExportButtonState(Boolean(exportInProgress));
}

chrome.runtime.onMessage.addListener((message) => {
    if (message?.action === 'EXPORT_STATUS') {
        return;
    }
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

syncExportButtonFromStorage();

async function startAutomation(button) {
    if (button.disabled) return;

    console.log('[Edvibe Toolbox][Popup] Click event detected on main unified execution button.');

    try {
        const tab = await getActiveMarathonTab();
        setExportButtonState(true);
        console.log(`[Edvibe Toolbox][Popup] Sending execution token to tab identifier: ${tab.id}`);
        const response = await sendTabCommand(tab.id, 'START_FULL_AUTOMATION');
        console.log('[Edvibe Toolbox][Popup] Acknowledgment received from the page environment:', response);
    } catch (error) {
        console.error('[Edvibe Toolbox][Popup] Fatal exception occurred during automation startup:', error);
        alert(error.message);
        setExportButtonState(false);
    }
}

async function openLessonReset(button) {
    if (button.disabled) return;

    button.disabled = true;
    try {
        const tab = await getActiveMarathonTab();
        await sendTabCommand(tab.id, 'OPEN_LESSON_RESET');
        window.close();
    } catch (error) {
        console.error('[Edvibe Toolbox][Popup] Failed to open lesson reset:', error);
        alert(error.message);
        button.disabled = false;
    }
}

window.startAutomation = startAutomation;
window.openLessonReset = openLessonReset;
