// isolated.js - Runs in the extension's ISOLATED world context

console.log('[Edvibe Toolbox][Isolated] Script successfully injected and initialized.');

// Listen for runtime messages from the extension's Popup UI and proxy them straight to the MAIN page world
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Edvibe Toolbox][Isolated] Incoming chrome.runtime message received:', message);

    if (message && message.action === "START_FULL_AUTOMATION") {
        console.log('[Edvibe Toolbox][Isolated] Action matched: START_FULL_AUTOMATION. Forwarding command to MAIN world...');

        // Forward execution token down to the main window page frame context
        window.postMessage({ type: 'EDVIBE_TOOLBOX_START_ALL' }, '*');

        sendResponse({ status: "success", info: "Automation sequence channeled to page engine." });
    } else {
        sendResponse({ status: "ignored" });
    }

    return true;
});