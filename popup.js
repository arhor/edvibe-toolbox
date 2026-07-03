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
    if (message?.action !== 'EXPORT_STATUS') return;

    if (message.state === 'started') {
        setExportButtonState(true);
        return;
    }

    if (message.state === 'complete' || message.state === 'error') {
        setExportButtonState(false);
    }
});

if (runAutomationBtn) {
    syncExportButtonFromStorage();

    runAutomationBtn.addEventListener('click', async (e) => {
        if (runAutomationBtn.disabled) return;

        console.log('[Edvibe Toolbox][Popup] Click event detected on main unified execution button.');

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab || !tab.url) {
                console.error('[Edvibe Toolbox][Popup] Aborting operation: Active browser tab context could not be determined.');
                alert('Error: Active browser tab context or URL path cannot be read.');
                return;
            }

            if (!tab.url.includes('edvibe.com')) {
                console.warn('[Edvibe Toolbox][Popup] Scraper executed on invalid domain context:', tab.url);
                alert('Please navigate to an active Edvibe marathon dashboard page before execution.');
                return;
            }

            setExportButtonState(true);

            console.log(`[Edvibe Toolbox][Popup] Sending execution token to tab identifier: ${tab.id}`);

            chrome.tabs.sendMessage(tab.id, { action: 'START_FULL_AUTOMATION' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('[Edvibe Toolbox][Popup] Content script channel link failed:', chrome.runtime.lastError.message);
                    alert('Connection to page failed. Please refresh your Edvibe browser tab (F5) and try again.');
                    setExportButtonState(false);
                    return;
                }

                console.log('[Edvibe Toolbox][Popup] Acknowledgment received from the page environment:', response);
            });
        } catch (error) {
            console.error('[Edvibe Toolbox][Popup] Fatal exception occurred during automation startup:', error);
            setExportButtonState(false);
        }
    });
} else {
    console.warn('[Edvibe Toolbox][Popup] Target DOM element "startCaptureBtn" was not found in the popup UI layout.');
}
