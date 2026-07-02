// main.js - Runs directly in the web-page context (MAIN world)

console.log('[Edvibe Toolbox][Main] Core socket injection payload executing...');

let activeEdvibeSocket = null;
const pendingRequests = new Map();

const OriginalWebSocket = window.WebSocket;

// Override the native window.WebSocket constructor to capture active connections
window.WebSocket = function (url, protocols) {
    console.log(`[Edvibe Toolbox][Main] Intercepting new WebSocket instantiation targeting: ${url}`);
    const ws = new OriginalWebSocket(url, protocols);

    // Maintain a live reference to the most recently initialized active socket pipeline
    activeEdvibeSocket = ws;

    ws.addEventListener('message', (event) => {
        // Guard clause: ignore binary frames (Blobs/ArrayBuffers) to prevent JSON parsing crashes
        if (typeof event.data !== 'string') {
            return;
        }

        try {
            const data = JSON.parse(event.data);

            // 1. Correlation ID (RequestId) Matching Flow
            if (data.RequestId && pendingRequests.has(data.RequestId)) {
                console.log(`[Edvibe Toolbox][Main] Inbound response matched pending RequestId: ${data.RequestId} (Method: ${data.Method || 'unknown'})`);
                const resolve = pendingRequests.get(data.RequestId);
                pendingRequests.delete(data.RequestId);
                resolve(data); // Fulfill the awaiting async Promise
            }

            // 2. Continuous Background Capture Flow (Specifically tracking LoadExercises)
            if (data.Method === "LoadExercises" && data.IsSuccess) {
                console.log('[Edvibe Toolbox][Main] Intercepted valid LoadExercises payload frame.');
                const parsedValue = typeof data.Value === 'string' ? JSON.parse(data.Value) : data.Value;

                if (parsedValue) {
                    window.postMessage({
                        type: 'EDVIBE_TOOLBOX_CAPTURE',
                        payload: {
                            lessonId: parsedValue.LessonId || "unknown",
                            sectionId: parsedValue.SectionId,
                            items: parsedValue.Items || [],
                            timestamp: new Date().toISOString()
                        }
                    }, '*');
                } else {
                    console.warn('[Edvibe Toolbox][Main] LoadExercises matched but data.Value field is empty or corrupted.', data);
                }
            }
        } catch (parseError) {
            // Silently absorb parsing failures from unrelated operational stream noise
            console.debug('[Edvibe Toolbox][Main] Failed parsing un-formatted data frame string:', parseError);
        }
    });

    return ws;
};
window.WebSocket.prototype = OriginalWebSocket.prototype;

// Async helper utility transforming decoupled WebSockets into structured Request-Response Promises
function sendSocketMessage(controller, method, projectName, valueObject) {
    return new Promise((resolve, reject) => {
        if (!activeEdvibeSocket || activeEdvibeSocket.readyState !== OriginalWebSocket.OPEN) {
            console.error('[Edvibe Toolbox][Main] Execution halted: No active WebSocket connection found in an OPEN state.');
            return reject(new Error('Active WebSocket connection is missing. Please reload the Edvibe tab context.'));
        }

        const requestId = crypto.randomUUID();
        const packet = {
            Controller: controller,
            Method: method,
            ProjectName: projectName,
            RequestId: requestId,
            Value: JSON.stringify(valueObject)
        };

        // Register resolve hook ahead of network dispatch execution
        pendingRequests.set(requestId, resolve);

        console.log(`[Edvibe Toolbox][Main] Dispatching out-bound message [ID: ${requestId}][Method: ${method}]`);
        activeEdvibeSocket.send(JSON.stringify(packet));
    });
}

// Utility throttle control to mimic natural human reading behavior and respect backend rate limits
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// CORE ORCHESTRATION PIPELINE FOR AUTOMATED MARATHON SCRAPING
async function startAutomatedMarathonBackup() {
    console.log('[Edvibe Toolbox][Main] Initializing automated marathon compilation routine...');

    // Extract numerical identifier from URL routing schema
    const match = window.location.href.match(/marathon\/(\d+)/);
    if (!match) {
        console.error('[Edvibe Toolbox][Main] URL compilation failed. Location is out of marathon scope:', window.location.href);
        alert('Automation Error: Failed to find a valid MarathonId within the current browser URL path.');
        return;
    }
    const marathonId = Number(match[1]);
    console.log(`[Edvibe Toolbox][Main] Targeted MarathonId confirmed: ${marathonId}`);

    try {
        // Step 1: Query the pagination backend for all assigned curriculum lessons
        console.log('[Edvibe Toolbox][Main] Querying complete marathon lesson directory indexing...');
        const paginationData = await sendSocketMessage(
            "MarathonLessonWsController",
            "GetMarathonLessonsPagination",
            "Marathons",
            { MarathonId: marathonId, SearchTerm: "", Page: { Skip: 0, Take: 100 } }
        );

        const marathonLessons = paginationData.Value?.Items || [];
        console.log(`[Edvibe Toolbox][Main] Directory lookup completed. Found ${marathonLessons.length} lessons available.`);

        // Step 2: Sequentially process each extracted individual structural lesson node
        for (const lessonNode of marathonLessons) {
            console.log(`[Edvibe Toolbox][Main] Scraping lesson manifest blueprint: "${lessonNode.Name}" (LessonId: ${lessonNode.LessonId})`);

            const lessonStructure = await sendSocketMessage(
                "LessonWsController",
                "GetLessonWithId",
                "Books",
                { LessonId: lessonNode.LessonId }
            );

            // Dynamically combine structural sections (Standard content subsections + Homework assignments)
            const sections = lessonStructure.Value?.Sections || [];
            if (lessonStructure.Value?.HomeworkSection) {
                sections.push(lessonStructure.Value.HomeworkSection);
            }

            console.log(`[Edvibe Toolbox][Main] Identified ${sections.length} sub-sections inside LessonId ${lessonNode.LessonId}. Compiling raw task assets...`);

            // Step 3: Loop through each isolated layout section container and command a target data retrieval fetch
            for (const section of sections) {
                console.log(`[Edvibe Toolbox][Main] Fetching task exercise assets for SectionId: ${section.Id}`);

                // Imposed 300ms throttle to insulate pipeline from triggering server-side WAF rule alarms
                await delay(300);

                await sendSocketMessage(
                    "GetExerciseWsController",
                    "LoadExercises",
                    "Exercises",
                    { IsTeacher: true, SectionId: section.Id, LessonId: lessonNode.LessonId, LessonSection: 0 }
                );
            }
        }

        console.log('[Edvibe Toolbox][Main] Automation loop fully completed without interruptions.');
        alert('🎉 Automated marathon backup successfully completed! You may now download the compiled JSON configuration package from the toolbox popup panel.');

    } catch (error) {
        console.error('[Edvibe Toolbox][Main] Fatal exception caught inside execution orchestration context:', error);
        alert('A critical error derailed the automatic indexing pipeline: ' + error.message);
    }
}

// Global window link receiver accepting automation commands routed up from the extension sandbox (ISOLATED world)
window.addEventListener('message', (event) => {
    if (event.source === window && event.data?.type === 'EDVIBE_TOOLBOX_START_ALL') {
        console.log('[Edvibe Toolbox][Main] Execution signal verified from Sandbox layer. Triggering automation engine...');
        startAutomatedMarathonBackup();
    }
});

console.log('[Edvibe Toolbox][Main] Injection pipeline fully linked and awaiting operational context commands.');