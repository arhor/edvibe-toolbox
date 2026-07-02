// popup.js - Extension popup UI control script

console.log('[Edvibe Toolbox][Popup] Popup script initialized and active.');

// 1. Fetch initial cache status from local storage when the popup opens
chrome.storage.local.get({ capturedLessons: {} }, (result) => {
    if (chrome.runtime.lastError) {
        console.error('[Edvibe Toolbox][Popup] Failed to retrieve data from local storage on startup:', chrome.runtime.lastError.message);
        return;
    }
    const count = Object.keys(result.capturedLessons).length;
    console.log(`[Edvibe Toolbox][Popup] Cached lessons count detected on startup: ${count}`);

    // Dynamic UI count updates can be wired here if a text tag is added to popup.html
});

// 2. Click handler for initiating full automation scraping loop
const startBtn = document.getElementById('startCaptureBtn');
if (startBtn) {
    startBtn.addEventListener('click', async (e) => {
        console.log('[Edvibe Toolbox][Popup] Click event detected on startCaptureBtn.');

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            console.log('[Edvibe Toolbox][Popup] Active tab query result returned:', tab);

            if (!tab) {
                console.error('[Edvibe Toolbox][Popup] Aborting operation: No active tab found.');
                alert('Error: Active browser tab context could not be determined.');
                return;
            }

            // Guard clause to handle restricted/missing URL fields (e.g. permission gap)
            if (!tab.url) {
                console.warn('[Edvibe Toolbox][Popup] tab.url is undefined. Ensure "activeTab" permission is declared in manifest.json.');
                alert('Cannot inspect current page. Please verify extension permissions or refresh the tab.');
                return;
            }

            if (!tab.url.includes('edvibe.com')) {
                console.warn('[Edvibe Toolbox][Popup] Scraper executed on invalid domain context:', tab.url);
                alert('Please navigate to an active Edvibe marathon page before starting.');
                return;
            }

            // Cache original button styles to restore them dynamically if the runtime pipe fails
            const originalText = e.target.innerText;
            const originalBg = e.target.style.backgroundColor;

            e.target.innerText = "⚡ Scraping...";
            e.target.style.backgroundColor = "#d35400";

            console.log(`[Edvibe Toolbox][Popup] Dispatched action "START_FULL_AUTOMATION" to tab identifier: ${tab.id}`);

            // Send asynchronous command to isolated.js with integrated response matching
            chrome.tabs.sendMessage(tab.id, { action: "START_FULL_AUTOMATION" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('[Edvibe Toolbox][Popup] Message routing failed. Content script channel is missing or unlinked:', chrome.runtime.lastError.message);
                    alert('Connection to page context failed. Please perform a full page refresh (F5) on your Edvibe tab and retry.');

                    // Revert button state gracefully upon execution failure
                    e.target.innerText = originalText;
                    e.target.style.backgroundColor = originalBg;
                } else {
                    console.log('[Edvibe Toolbox][Popup] Positive acknowledgment received from the content script context:', response);
                }
            });

        } catch (error) {
            console.error('[Edvibe Toolbox][Popup] Fatal exception occurred during automation startup:', error);
        }
    });
} else {
    console.warn('[Edvibe Toolbox][Popup] Target DOM element "startCaptureBtn" was not found in popup.html layout.');
}

// 3. Click handler for compiling and downloading the aggregated JSON backup
const downloadBtn = document.getElementById('downloadJsonBtn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        console.log('[Edvibe Toolbox][Popup] Click event detected on downloadJsonBtn.');

        chrome.storage.local.get({ capturedLessons: {} }, (result) => {
            if (chrome.runtime.lastError) {
                console.error('[Edvibe Toolbox][Popup] Storage read failure during file assembly:', chrome.runtime.lastError.message);
                return;
            }

            const lessonsMap = result.capturedLessons;
            const lessonsList = Object.values(lessonsMap);
            console.log(`[Edvibe Toolbox][Popup] Compiling export payload for ${lessonsList.length} unique lessons.`);

            if (lessonsList.length === 0) {
                console.warn('[Edvibe Toolbox][Popup] Export cycle canceled: Local storage cache is completely empty.');
                alert('The storage cache is currently empty! Please activate the scraper on a live session first.');
                return;
            }

            // Build structured backup wrapper schema
            const backupData = {
                exportedAt: new Date().toISOString(),
                totalLessons: lessonsList.length,
                lessons: lessonsList
            };

            try {
                // Generate download link using standard Blob APIs
                const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `edvibe_backup_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();

                // Memory cleanup execution
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                console.log('[Edvibe Toolbox][Popup] JSON backup bundle successfully compiled and download sequence pushed to browser.');
            } catch (exportError) {
                console.error('[Edvibe Toolbox][Popup] Failed to correctly assemble or pipe download data Blob:', exportError);
            }
        });
    });
} else {
    console.warn('[Edvibe Toolbox][Popup] Target DOM element "downloadJsonBtn" was not found in popup.html layout.');
}
