// main.js - Runs directly in the web-page context (MAIN world)

console.log('[Edvibe Toolbox][Main] Core socket injection payload executing...');

let activeEdvibeSocket = null;
const pendingRequests = new Map();

const OriginalWebSocket = window.WebSocket;

// Override the native window.WebSocket constructor to capture active connections
window.WebSocket = function (url, protocols) {
    console.log(`[Edvibe Toolbox][Main] Intercepting new WebSocket instantiation targeting: ${url}`);
    const ws = new OriginalWebSocket(url, protocols);
    activeEdvibeSocket = ws;

    ws.addEventListener('message', (event) => {
        if (typeof event.data !== 'string') return;

        try {
            const data = JSON.parse(event.data);

            // Correlation ID (RequestId) Matching Flow
            if (data.RequestId && pendingRequests.has(data.RequestId)) {
                console.log(`[Edvibe Toolbox][Main] Inbound response matched pending RequestId: ${data.RequestId}`);
                const resolve = pendingRequests.get(data.RequestId);
                pendingRequests.delete(data.RequestId);
                resolve(data);
            }
        } catch (parseError) {
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

        pendingRequests.set(requestId, resolve);
        activeEdvibeSocket.send(JSON.stringify(packet));
    });
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// CORE ORCHESTRATION PIPELINE FOR IN-MEMORY SCRAPING & AUTO-DOWNLOAD
async function startAutomatedMarathonBackup() {
    console.log('[Edvibe Toolbox][Main] Initializing automated marathon compilation routine...');

    const match = window.location.href.match(/marathon\/(\d+)/);
    if (!match) {
        console.error('[Edvibe Toolbox][Main] URL compilation failed. Location is out of marathon scope:', window.location.href);
        alert('Automation Error: Failed to find a valid MarathonId within the current browser URL path.');
        return;
    }
    const marathonId = Number(match[1]);
    console.log(`[Edvibe Toolbox][Main] Targeted MarathonId confirmed: ${marathonId}`);

    // Core volatile memory structure to hold all compiled data points during runtime execution
    const backupBundle = {
        exportedAt: new Date().toISOString(),
        marathonId: marathonId,
        totalLessons: 0,
        lessons: []
    };

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
        backupBundle.totalLessons = marathonLessons.length;
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

            const lessonEntry = {
                lessonId: lessonNode.LessonId,
                marathonLessonId: lessonNode.MarathonLessonId,
                name: lessonNode.Name,
                imageUrl: lessonStructure.Value?.ImageUrl || lessonNode.Image,
                sections: []
            };

            // Dynamically combine structural sections (Standard content subsections + Homework assignments)
            const sections = lessonStructure.Value?.Sections || [];
            if (lessonStructure.Value?.HomeworkSection) {
                sections.push(lessonStructure.Value.HomeworkSection);
            }

            console.log(`[Edvibe Toolbox][Main] Identified ${sections.length} sub-sections inside LessonId ${lessonNode.LessonId}. Compiling raw task assets...`);

            // Step 3: Loop through each isolated layout section container and command a target data retrieval fetch
            for (const section of sections) {
                console.log(`[Edvibe Toolbox][Main] Fetching task exercise assets for SectionId: ${section.Id} (${section.Name})`);

                // Imposed 300ms throttle to insulate pipeline from triggering server-side WAF rule alarms
                await delay(300);

                const exerciseResponse = await sendSocketMessage(
                    "GetExerciseWsController",
                    "LoadExercises",
                    "Exercises",
                    { IsTeacher: true, SectionId: section.Id, LessonId: lessonNode.LessonId, LessonSection: 0 }
                );

                const parsedValue = typeof exerciseResponse.Value === 'string' ? JSON.parse(exerciseResponse.Value) : exerciseResponse.Value;

                // Push the data right into our in-memory lesson structure node
                lessonEntry.sections.push({
                    sectionId: section.Id,
                    name: section.Name,
                    isHomework: section.IsHomework || false,
                    items: parsedValue?.Items || []
                });
            }

            // Append the fully aggregated lesson structure tree into our main backup data packet
            backupBundle.lessons.push(lessonEntry);
        }

        console.log('[Edvibe Toolbox][Main] Automation loop fully completed. Preparing instant payload delivery download...');

        // Step 4: Instantly compile memory data frame into a JSON Blob and push a download action down to the browser layer
        const blob = new Blob([JSON.stringify(backupBundle, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const linkAnchor = document.createElement('a');
        linkAnchor.href = url;
        linkAnchor.download = `edvibe_marathon_${marathonId}_backup.json`;
        document.body.appendChild(linkAnchor);
        linkAnchor.click();

        // Memory optimization lifecycle cleanup
        document.body.removeChild(linkAnchor);
        URL.revokeObjectURL(url);

        console.log('[Edvibe Toolbox][Main] Memory compiled download execution fully complete.');
        alert('🎉 Marathon dataset completely compiled and downloaded successfully!');

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