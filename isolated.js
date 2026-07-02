// isolated.js - Runs in the extension's ISOLATED world context

console.log('[Edvibe Toolbox][Isolated] Script successfully injected and initialized.');

// 1. Listen for messages from the page context (MAIN world)
window.addEventListener('message', (event) => {
    // Debug log specifically for our toolbox events to avoid spamming web-page noise
    if (event.data && typeof event.data === 'object' && event.data.type?.startsWith('EDVIBE_TOOLBOX_')) {
        console.log('[Edvibe Toolbox][Isolated] Detected window message event:', event.data.type, event.data);
    }

    // Security and origin verification guard clause
    if (event.source !== window || !event.data || event.data.type !== 'EDVIBE_TOOLBOX_CAPTURE') {
        return;
    }

    const newLesson = event.data.payload;
    console.log(`[Edvibe Toolbox][Isolated] Capturing lesson payload for LessonId: ${newLesson?.lessonId}`);

    if (!newLesson || !newLesson.lessonId) {
        console.error('[Edvibe Toolbox][Isolated] Critical Error: Payload is missing lessonId!', newLesson);
        return;
    }

    // Save the intercepted data into the extension's local storage
    chrome.storage.local.get({ capturedLessons: {} }, (result) => {
        if (chrome.runtime.lastError) {
            console.error('[Edvibe Toolbox][Isolated] Storage retrieval error:', chrome.runtime.lastError.message);
            return;
        }

        const lessons = result.capturedLessons;
        lessons[newLesson.lessonId] = newLesson;

        chrome.storage.local.set({ capturedLessons: lessons }, () => {
            if (chrome.runtime.lastError) {
                console.error('[Edvibe Toolbox][Isolated] Storage save error:', chrome.runtime.lastError.message);
            } else {
                console.log(`[Edvibe Toolbox][Isolated] Lesson ${newLesson.lessonId} successfully committed to local storage cache.`);
            }
        });
    });
});

// 2. Listen for runtime messages from the extension's Popup UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Edvibe Toolbox][Isolated] Incoming chrome.runtime message received:', message);

    if (!message || !message.action) {
        console.warn('[Edvibe Toolbox][Isolated] Received an empty or malformed runtime message.');
        sendResponse({ status: "error", error: "Malformed message" });
        return false;
    }

    if (message.action === "START_FULL_AUTOMATION") {
        console.log('[Edvibe Toolbox][Isolated] Action matched: START_FULL_AUTOMATION. Forwarding command to MAIN world...');

        // Forward the orchestration command to the MAIN world script via standard DOM postMessage
        window.postMessage({ type: 'EDVIBE_TOOLBOX_START_ALL' }, '*');

        sendResponse({ status: "success", info: "Automation signal dispatched to page context." });
    } else {
        console.log(`[Edvibe Toolbox][Isolated] Action '${message.action}' is unhandled in this context.`);
        sendResponse({ status: "ignored" });
    }

    // Return true to keep the message channel open for asynchronous response handling
    return true;
});