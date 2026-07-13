// main.js - Runs directly in the web-page context (MAIN world)

console.log('[Edvibe Toolbox][Main] Core socket injection payload executing...');

let activeEdvibeSocket = null;
const pendingRequests = new Map();
const REQUEST_TIMEOUT_MS = 15000;

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
                const pending = pendingRequests.get(data.RequestId);
                pendingRequests.delete(data.RequestId);
                clearTimeout(pending.timeoutId);

                if (data.IsSuccess !== true) {
                    pending.reject(new Error(
                        `${data.Class || 'Edvibe'}:${data.Method || 'request'} failed with ErrorCode ${data.ErrorCode}`
                    ));
                } else {
                    pending.resolve(data);
                }
            }
        } catch (parseError) {
            console.debug('[Edvibe Toolbox][Main] Failed parsing un-formatted data frame string:', parseError);
        }
    });

    return ws;
};
window.WebSocket.prototype = OriginalWebSocket.prototype;

function createSocketPacket(controller, method, projectName, valueObject) {
    return {
        Controller: controller,
        Method: method,
        ProjectName: projectName,
        RequestId: crypto.randomUUID(),
        Value: JSON.stringify(valueObject)
    };
}

// Async helper utility transforming decoupled WebSockets into structured Request-Response Promises
function sendSocketMessage(controller, method, projectName, valueObject) {
    return new Promise((resolve, reject) => {
        if (!activeEdvibeSocket || activeEdvibeSocket.readyState !== OriginalWebSocket.OPEN) {
            console.error('[Edvibe Toolbox][Main] Execution halted: No active WebSocket connection found in an OPEN state.');
            return reject(new Error('Active WebSocket connection is missing. Please reload the Edvibe tab context.'));
        }

        const packet = createSocketPacket(controller, method, projectName, valueObject);
        const timeoutId = setTimeout(() => {
            pendingRequests.delete(packet.RequestId);
            reject(new Error(`${controller}:${method} timed out after ${REQUEST_TIMEOUT_MS}ms.`));
        }, REQUEST_TIMEOUT_MS);

        pendingRequests.set(packet.RequestId, { resolve, reject, timeoutId });
        try {
            activeEdvibeSocket.send(JSON.stringify(packet));
        } catch (error) {
            clearTimeout(timeoutId);
            pendingRequests.delete(packet.RequestId);
            reject(error);
        }
    });
}

function sendSocketMessageWithoutResponse(controller, method, projectName, valueObject) {
    if (!activeEdvibeSocket || activeEdvibeSocket.readyState !== OriginalWebSocket.OPEN) {
        throw new Error('Active WebSocket connection is missing. Please reload the Edvibe tab context.');
    }

    activeEdvibeSocket.send(JSON.stringify(
        createSocketPacket(controller, method, projectName, valueObject)
    ));
}

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const EXPORT_PROGRESS_OVERLAY_ID = 'edvibe-toolbox-export-progress';
const EXPORT_PROGRESS_STYLE_ID = 'edvibe-toolbox-export-progress-styles';

function ensureExportProgressStyles() {
    if (document.getElementById(EXPORT_PROGRESS_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = EXPORT_PROGRESS_STYLE_ID;
    style.textContent = `
        #${EXPORT_PROGRESS_OVERLAY_ID} {
            position: fixed;
            inset: 0;
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(15, 23, 42, 0.55);
            font-family: "Segoe UI", Arial, sans-serif;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-card {
            width: min(630px, calc(100vw - 32px));
            padding: 24px;
            border-radius: 16px;
            background: #ffffff;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.35);
            color: #1f2937;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-title {
            margin: 0 0 8px;
            font-size: 20px;
            line-height: 1.3;
            font-weight: 700;
            color: #111827;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-status {
            margin: 0 0 16px;
            min-height: 40px;
            font-size: 14px;
            line-height: 1.4;
            white-space: pre-line;
            color: #4b5563;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-track {
            overflow: hidden;
            height: 12px;
            border-radius: 999px;
            background: #e5e7eb;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-bar {
            width: 0%;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #3498db, #22c55e);
            transition: width 0.25s ease;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID}.is-indeterminate .edvibe-export-bar {
            width: 40%;
            animation: edvibe-export-progress-slide 1.2s ease-in-out infinite;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-meta {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-top: 10px;
            font-size: 12px;
            color: #6b7280;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID} .edvibe-export-close {
            display: none;
            margin-top: 18px;
            width: 100%;
            padding: 9px 12px;
            border: 0;
            border-radius: 8px;
            background: #3498db;
            color: #ffffff;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID}.is-complete .edvibe-export-close,
        #${EXPORT_PROGRESS_OVERLAY_ID}.is-error .edvibe-export-close {
            display: block;
        }

        #${EXPORT_PROGRESS_OVERLAY_ID}.is-error .edvibe-export-bar {
            background: #e74c3c;
        }

        @keyframes edvibe-export-progress-slide {
            0% { transform: translateX(-120%); }
            50% { transform: translateX(80%); }
            100% { transform: translateX(260%); }
        }
    `;

    (document.head || document.documentElement).appendChild(style);
}

function createExportProgressOverlay() {
    ensureExportProgressStyles();

    document.getElementById(EXPORT_PROGRESS_OVERLAY_ID)?.remove();

    const overlay = document.createElement('div');
    overlay.id = EXPORT_PROGRESS_OVERLAY_ID;
    overlay.className = 'is-indeterminate';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
        <div class="edvibe-export-card">
            <h2 class="edvibe-export-title">Exporting marathon</h2>
            <p class="edvibe-export-status">Preparing export...</p>
            <div class="edvibe-export-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                <div class="edvibe-export-bar"></div>
            </div>
            <div class="edvibe-export-meta">
                <span class="edvibe-export-count">Discovering sections...</span>
                <span class="edvibe-export-percent">0%</span>
            </div>
            <button class="edvibe-export-close" type="button">Close</button>
        </div>
    `;

    (document.body || document.documentElement).appendChild(overlay);

    const status = overlay.querySelector('.edvibe-export-status');
    const track = overlay.querySelector('.edvibe-export-track');
    const bar = overlay.querySelector('.edvibe-export-bar');
    const count = overlay.querySelector('.edvibe-export-count');
    const percent = overlay.querySelector('.edvibe-export-percent');
    const closeButton = overlay.querySelector('.edvibe-export-close');

    closeButton.addEventListener('click', () => overlay.remove());

    function update({ statusText, loadedSections = 0, totalSections = 0, countText, state = 'loading' }) {
        const hasTotal = totalSections > 0;
        const progressPercent = state === 'complete'
            ? 100
            : hasTotal ? Math.min(100, Math.round((loadedSections / totalSections) * 100)) : 0;

        overlay.classList.toggle('is-indeterminate', !hasTotal && state === 'loading');
        overlay.classList.toggle('is-complete', state === 'complete');
        overlay.classList.toggle('is-error', state === 'error');

        status.textContent = statusText;
        count.textContent = countText ?? (hasTotal
            ? `${loadedSections} / ${totalSections} sections loaded`
            : state === 'complete' ? 'Export complete' : 'Discovering sections...');
        percent.textContent = `${progressPercent}%`;
        bar.style.width = hasTotal || state === 'complete' ? `${progressPercent}%` : '';
        track.setAttribute('aria-valuenow', String(progressPercent));
    }

    return {
        update,
        complete(statusText, totalSections) {
            update({ statusText, loadedSections: totalSections, totalSections, state: 'complete' });
        },
        error(statusText) {
            update({ statusText, state: 'error' });
        },
        dismissAfter(ms) {
            setTimeout(() => overlay.remove(), ms);
        }
    };
}

// CORE ORCHESTRATION PIPELINE FOR IN-MEMORY SCRAPING & AUTO-DOWNLOAD
let activeToolboxOperation = null;

function canStartToolboxOperation() {
    return activeToolboxOperation === null;
}

function setToolboxOperation(operation) {
    activeToolboxOperation = operation;
}

function notifyExportStatus(state, message = '') {
    window.postMessage({ type: 'EDVIBE_TOOLBOX_EXPORT_STATUS', state, message }, '*');
}

async function startAutomatedMarathonBackup() {
    if (!canStartToolboxOperation()) {
        const message = `Cannot start export while "${activeToolboxOperation}" is active.`;
        console.warn(`[Edvibe Toolbox][Main] ${message}`);
        notifyExportStatus('error', message);
        return;
    }

    setToolboxOperation('export');
    notifyExportStatus('started');

    console.log('[Edvibe Toolbox][Main] Initializing automated marathon compilation routine...');
    const progressOverlay = createExportProgressOverlay();
    progressOverlay.update({
        statusText: 'Finding marathon lessons...',
        loadedSections: 0,
        totalSections: 0
    });

    try {
        const match = window.location.href.match(/marathon\/(\d+)/);
        if (!match) {
            console.error('[Edvibe Toolbox][Main] URL compilation failed. Location is out of marathon scope:', window.location.href);
            progressOverlay.error('Failed to find a valid MarathonId in the current page URL.');
            notifyExportStatus('error', 'Invalid marathon URL.');
            return;
        }
        const marathonId = Number(match[1]);
        console.log(`[Edvibe Toolbox][Main] Targeted MarathonId confirmed: ${marathonId}`);

        const backupBundle = {
            exportedAt: new Date().toISOString(),
            marathonId: marathonId,
            totalLessons: 0,
            lessons: []
        };

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
        progressOverlay.update({
            statusText: `Found ${marathonLessons.length} lessons. Loading lesson sections...`,
            loadedSections: 0,
            totalSections: 0
        });

        const lessonQueue = [];
        let totalSections = 0;

        // Step 2: Discover each lesson structure first so the section progress total is accurate
        for (const [lessonIndex, lessonNode] of marathonLessons.entries()) {
            console.log(`[Edvibe Toolbox][Main] Scraping lesson manifest blueprint: "${lessonNode.Name}" (LessonId: ${lessonNode.LessonId})`);
            progressOverlay.update({
                statusText: `Loading sections for lesson ${lessonIndex + 1} of ${marathonLessons.length}: ${lessonNode.Name}`,
                loadedSections: 0,
                totalSections: 0
            });

            const lessonStructure = await sendSocketMessage(
                "LessonWsController",
                "GetLessonWithId",
                "Books",
                { LessonId: lessonNode.LessonId }
            );

            // Dynamically combine structural sections (Standard content subsections + Homework assignments)
            const sections = [...(lessonStructure.Value?.Sections || [])];
            if (lessonStructure.Value?.HomeworkSection) {
                sections.push(lessonStructure.Value.HomeworkSection);
            }

            console.log(`[Edvibe Toolbox][Main] Identified ${sections.length} sub-sections inside LessonId ${lessonNode.LessonId}. Compiling raw task assets...`);
            totalSections += sections.length;
            lessonQueue.push({ lessonNode, lessonStructure, sections });
        }

        progressOverlay.update({
            statusText: `Found ${totalSections} sections. Loading exercise assets...`,
            loadedSections: 0,
            totalSections
        });

        let loadedSections = 0;

        // Step 3: Process each isolated layout section container and command a target data retrieval fetch
        for (const { lessonNode, lessonStructure, sections } of lessonQueue) {
            const lessonEntry = {
                lessonId: lessonNode.LessonId,
                marathonLessonId: lessonNode.MarathonLessonId,
                name: lessonNode.Name,
                imageUrl: lessonStructure.Value?.ImageUrl || lessonNode.Image,
                sections: []
            };

            for (const section of sections) {
                console.log(`[Edvibe Toolbox][Main] Fetching task exercise assets for SectionId: ${section.Id} (${section.Name})`);
                progressOverlay.update({
                    statusText: `Lesson: ${lessonNode.Name}\nSection: ${section.Name}`,
                    loadedSections,
                    totalSections
                });

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

                loadedSections += 1;
                progressOverlay.update({
                    statusText: `Loaded "${section.Name}" from "${lessonNode.Name}".`,
                    loadedSections,
                    totalSections
                });
            }

            // Append the fully aggregated lesson structure tree into our main backup data packet
            backupBundle.lessons.push(lessonEntry);
        }

        console.log('[Edvibe Toolbox][Main] Automation loop fully completed. Building ZIP workspace archive...');

        progressOverlay.update({
            statusText: 'All sections loaded.\nProcessing lesson content and archiving workspace...\nDownloading images — this may take a few minutes.',
            loadedSections: 0,
            totalSections: 0
        });

        await compileMarathonToZip(backupBundle, {
            onProgress({ message, current, total }) {
                const isCompressing = message === 'Compressing archive...';
                progressOverlay.update({
                    statusText: isCompressing
                        ? 'Processing lesson content and archiving workspace...\nCompressing archive...'
                        : `Processing lesson content and archiving workspace...\n${message}`,
                    loadedSections: isCompressing ? 0 : (current || 0),
                    totalSections: isCompressing ? 0 : (total || 0),
                    countText: isCompressing
                        ? 'Compressing archive...'
                        : (total ? `${current} / ${total} lessons processed` : 'Preparing archive...')
                });
            }
        });

        console.log('[Edvibe Toolbox][Main] ZIP workspace archive download complete.');
        progressOverlay.complete('ZIP workspace archive downloaded successfully.', totalSections);
        progressOverlay.dismissAfter(3000);
        notifyExportStatus('complete');

    } catch (error) {
        console.error('[Edvibe Toolbox][Main] Fatal exception caught inside execution orchestration context:', error);
        progressOverlay.error('Export failed: ' + error.message);
        notifyExportStatus('error', error.message);
    } finally {
        if (activeToolboxOperation === 'export') {
            setToolboxOperation(null);
        }
    }
}

const lessonResetFeature = window.EdVibeLessonReset.createResetLessonsFeature({
    sendRequest: sendSocketMessage,
    sendWithoutResponse: sendSocketMessageWithoutResponse,
    wait: delay,
    canStart: canStartToolboxOperation,
    onActiveChange(isActive) {
        setToolboxOperation(isActive ? 'reset' : null);
    }
});

// Global window link receiver accepting automation commands routed up from the extension sandbox (ISOLATED world)
window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data?.type === 'EDVIBE_TOOLBOX_START_ALL') {
        console.log('[Edvibe Toolbox][Main] Execution signal verified from Sandbox layer. Triggering automation engine...');
        startAutomatedMarathonBackup();
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_RESET') {
        console.log('[Edvibe Toolbox][Main] Opening lesson reset workflow.');
        lessonResetFeature.open();
    }
});

console.log('[Edvibe Toolbox][Main] Injection pipeline fully linked and awaiting operational context commands.');