# Feature Module Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `main.js` into a composition-only coordinator and move all export, ZIP, and reset implementation into focused feature modules.

**Architecture:** Preserve classic Manifest V3 MAIN-world scripts and the existing UMD/CommonJS module pattern. Extract WebSocket transport and the cross-feature operation lock into `shared/`; move existing feature files into `features/`; extract the export workflow and overlay into a dependency-injected feature; leave `main.js` responsible only for module validation, dependency wiring, status bridging, and command routing.

**Tech Stack:** Manifest V3, vanilla JavaScript, browser globals, intercepted WebSocket transport, JSZip, Turndown, Node.js built-in test runner.

**Follow-up:** ZIP compilation was subsequently folded into `features/marathon-export.js` because it has no consumer outside the marathon export feature. The original steps below are retained as the implementation history.

**Commit policy:** Commit steps below are checkpoints, not authorization. Execute them only if the user explicitly requests commits.

---

## File Map

- Create `shared/operation-guard.js`: named single-operation lock shared by export and reset.
- Create `shared/websocket-transport.js`: WebSocket interception, packet creation, response correlation, timeout handling, and send APIs.
- Create `features/marathon-export.js`: export scraping workflow, backup assembly, progress overlay, status lifecycle, and ZIP delegation.
- Move `compile-marathon-to-zip.js` to `features/compile-marathon-to-zip.js`: existing ZIP compiler with no behavior change.
- Move `reset-lessons.js` to `features/reset-lessons.js`: existing reset feature with no behavior change.
- Rewrite `main.js`: module validation, dependency construction, status bridge, and command dispatch only.
- Modify `manifest.json`: load shared and feature modules in dependency order.
- Modify `tests/resetLessons.test.js`: import reset from its new path.
- Create `tests/operationGuard.test.js`: operation-lock behavior.
- Create `tests/websocketTransport.test.js`: transport interception, request correlation, and missing-socket behavior.
- Create `tests/marathonExport.test.js`: export requests, backup shape, throttling, status, and cleanup.
- Create `tests/moduleArchitecture.test.js`: manifest order, valid script paths, and coordinator boundary.

### Task 1: Add the named operation guard

**Files:**
- Create: `shared/operation-guard.js`
- Create: `tests/operationGuard.test.js`

- [ ] **Step 1: Create the shared directory**

Run:

```bash
mkdir -p shared
```

Expected: `shared/` exists.

- [ ] **Step 2: Write failing operation-guard tests**

Create `tests/operationGuard.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const { createOperationGuard } = require('../shared/operation-guard.js');

test('operation guard activates one named operation', () => {
    const guard = createOperationGuard();

    assert.equal(guard.canStart(), true);
    assert.equal(guard.activate('export'), true);
    assert.equal(guard.canStart(), false);
    assert.equal(guard.getActiveOperation(), 'export');
    assert.equal(guard.activate('reset'), false);
    assert.equal(guard.getActiveOperation(), 'export');
});

test('operation guard only releases the matching operation', () => {
    const guard = createOperationGuard();
    guard.activate('export');

    assert.equal(guard.release('reset'), false);
    assert.equal(guard.getActiveOperation(), 'export');
    assert.equal(guard.release('export'), true);
    assert.equal(guard.getActiveOperation(), null);
    assert.equal(guard.canStart(), true);
});
```

- [ ] **Step 3: Run the tests and verify the missing-module failure**

Run:

```bash
node --test tests/operationGuard.test.js
```

Expected: FAIL with `Cannot find module '../shared/operation-guard.js'`.

- [ ] **Step 4: Implement the UMD operation guard**

Create `shared/operation-guard.js`:

```js
(function initializeOperationGuard(root, factory) {
    const api = factory();
    root.EdVibeOperationGuard = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createOperationGuardModule() {
    'use strict';

    function createOperationGuard() {
        let activeOperation = null;

        return {
            canStart() {
                return activeOperation === null;
            },
            activate(operationName) {
                if (activeOperation !== null) return false;
                activeOperation = operationName;
                return true;
            },
            release(operationName) {
                if (activeOperation !== operationName) return false;
                activeOperation = null;
                return true;
            },
            getActiveOperation() {
                return activeOperation;
            }
        };
    }

    return { createOperationGuard };
});
```

- [ ] **Step 5: Run the guard tests**

Run:

```bash
node --test tests/operationGuard.test.js
```

Expected: 2 tests pass.

- [ ] **Step 6: Commit this checkpoint if explicitly authorized**

```bash
git add shared/operation-guard.js tests/operationGuard.test.js
git commit -m "refactor: add shared operation guard"
```

### Task 2: Extract WebSocket transport from `main.js`

**Files:**
- Create: `shared/websocket-transport.js`
- Create: `tests/websocketTransport.test.js`
- Modify: `main.js:5-118` later in Task 5

- [ ] **Step 1: Write failing transport tests**

Create `tests/websocketTransport.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const { createWebSocketTransport } = require('../shared/websocket-transport.js');

class FakeWebSocket {
    static OPEN = 1;

    constructor(url) {
        this.url = url;
        this.readyState = FakeWebSocket.OPEN;
        this.listeners = new Map();
        this.sent = [];
    }

    addEventListener(type, listener) {
        this.listeners.set(type, listener);
    }

    send(payload) {
        this.sent.push(payload);
    }

    receive(payload) {
        this.listeners.get('message')?.({ data: JSON.stringify(payload) });
    }
}

test('transport intercepts a socket and resolves its correlated response', async () => {
    const root = { WebSocket: FakeWebSocket };
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-1' },
        logger: { log() {}, error() {}, debug() {} }
    });
    transport.install(root);

    const socket = new root.WebSocket('wss://example.test');
    const responsePromise = transport.sendRequest(
        'LessonWsController',
        'GetLessonWithId',
        'Books',
        { LessonId: 42 }
    );
    const packet = JSON.parse(socket.sent[0]);

    assert.deepEqual(packet, {
        Controller: 'LessonWsController',
        Method: 'GetLessonWithId',
        ProjectName: 'Books',
        RequestId: 'request-1',
        Value: JSON.stringify({ LessonId: 42 })
    });

    socket.receive({
        RequestId: 'request-1',
        IsSuccess: true,
        Value: { Id: 42 }
    });

    assert.deepEqual(await responsePromise, {
        RequestId: 'request-1',
        IsSuccess: true,
        Value: { Id: 42 }
    });
});

test('transport rejects when no intercepted socket is open', async () => {
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-2' },
        logger: { log() {}, error() {}, debug() {} }
    });

    await assert.rejects(
        transport.sendRequest('Controller', 'Method', 'Project', {}),
        /Active WebSocket connection is missing/
    );
});

test('transport sends fire-and-forget packets through the active socket', () => {
    const root = { WebSocket: FakeWebSocket };
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-3' },
        logger: { log() {}, error() {}, debug() {} }
    });
    transport.install(root);
    const socket = new root.WebSocket('wss://example.test');

    transport.sendWithoutResponse('Controller', 'Method', 'Project', { Id: 7 });

    assert.equal(JSON.parse(socket.sent[0]).RequestId, 'request-3');
});
```

- [ ] **Step 2: Run the tests and verify the missing-module failure**

Run:

```bash
node --test tests/websocketTransport.test.js
```

Expected: FAIL with `Cannot find module '../shared/websocket-transport.js'`.

- [ ] **Step 3: Implement the transport module**

Create `shared/websocket-transport.js` by moving the packet creation, interception, pending-request map, 15-second timeout, response handling, `sendSocketMessage`, and `sendSocketMessageWithoutResponse` logic from `main.js`. Wrap it with this public structure:

```js
(function initializeWebSocketTransport(root, factory) {
    const api = factory();

    if (typeof window !== 'undefined' && root === window) {
        const transport = api.createWebSocketTransport({
            WebSocketClass: root.WebSocket,
            cryptoApi: root.crypto
        });
        transport.install(root);
        root.EdVibeWebSocketTransport = { ...api, ...transport };
    } else {
        root.EdVibeWebSocketTransport = api;
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createWebSocketTransportModule() {
    'use strict';

    const REQUEST_TIMEOUT_MS = 15000;

    function createWebSocketTransport({
        WebSocketClass,
        cryptoApi,
        requestTimeoutMs = REQUEST_TIMEOUT_MS,
        setTimeoutFn = setTimeout,
        clearTimeoutFn = clearTimeout,
        logger = console
    }) {
        let activeSocket = null;
        const pendingRequests = new Map();

        function createPacket(controller, method, projectName, valueObject) {
            return {
                Controller: controller,
                Method: method,
                ProjectName: projectName,
                RequestId: cryptoApi.randomUUID(),
                Value: JSON.stringify(valueObject)
            };
        }

        function handleMessage(event) {
            if (typeof event.data !== 'string') return;

            try {
                const data = JSON.parse(event.data);
                if (!data.RequestId || !pendingRequests.has(data.RequestId)) return;

                const pending = pendingRequests.get(data.RequestId);
                pendingRequests.delete(data.RequestId);
                clearTimeoutFn(pending.timeoutId);
                const elapsedMs = Date.now() - pending.startedAt;
                const outcome = data.IsSuccess === true
                    ? 'success'
                    : `failed (${data.ErrorCode})`;
                logger.log(
                    `[Edvibe Toolbox][WS] ← ${pending.controller}.${pending.method} `
                    + `[${data.RequestId}] ${outcome} in ${elapsedMs}ms`
                );

                if (data.IsSuccess !== true) {
                    pending.reject(new Error(
                        `${data.Class || 'Edvibe'}:${data.Method || 'request'} `
                        + `failed with ErrorCode ${data.ErrorCode}`
                    ));
                    return;
                }

                pending.resolve(data);
            } catch (error) {
                logger.debug(
                    '[Edvibe Toolbox][Transport] Failed parsing WebSocket frame:',
                    error
                );
            }
        }

        function install(rootObject) {
            function InterceptedWebSocket(url, protocols) {
                logger.log(
                    `[Edvibe Toolbox][Transport] Intercepting WebSocket targeting: ${url}`
                );
                const socket = protocols === undefined
                    ? new WebSocketClass(url)
                    : new WebSocketClass(url, protocols);
                activeSocket = socket;
                socket.addEventListener('message', handleMessage);
                return socket;
            }

            InterceptedWebSocket.prototype = WebSocketClass.prototype;
            rootObject.WebSocket = InterceptedWebSocket;
        }

        function requireOpenSocket() {
            if (!activeSocket || activeSocket.readyState !== WebSocketClass.OPEN) {
                throw new Error(
                    'Active WebSocket connection is missing. '
                    + 'Please reload the Edvibe tab context.'
                );
            }
            return activeSocket;
        }

        function sendRequest(controller, method, projectName, valueObject) {
            return new Promise((resolve, reject) => {
                let socket;
                try {
                    socket = requireOpenSocket();
                } catch (error) {
                    reject(error);
                    return;
                }

                const packet = createPacket(controller, method, projectName, valueObject);
                const timeoutId = setTimeoutFn(() => {
                    pendingRequests.delete(packet.RequestId);
                    reject(new Error(
                        `${controller}:${method} timed out after ${requestTimeoutMs}ms.`
                    ));
                }, requestTimeoutMs);

                pendingRequests.set(packet.RequestId, {
                    resolve,
                    reject,
                    timeoutId,
                    controller,
                    method,
                    startedAt: Date.now()
                });

                try {
                    socket.send(JSON.stringify(packet));
                } catch (error) {
                    clearTimeoutFn(timeoutId);
                    pendingRequests.delete(packet.RequestId);
                    reject(error);
                }
            });
        }

        function sendWithoutResponse(controller, method, projectName, valueObject) {
            const socket = requireOpenSocket();
            socket.send(JSON.stringify(
                createPacket(controller, method, projectName, valueObject)
            ));
        }

        return { install, sendRequest, sendWithoutResponse };
    }

    return { createWebSocketTransport };
});
```

Retain the current structured request/response logs and timeout/send-failure logs while moving the logic; do not log payload bodies.

- [ ] **Step 4: Run the transport tests**

Run:

```bash
node --test tests/websocketTransport.test.js
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit this checkpoint if explicitly authorized**

```bash
git add shared/websocket-transport.js tests/websocketTransport.test.js
git commit -m "refactor: extract websocket transport"
```

### Task 3: Move the existing reset and ZIP modules

**Files:**
- Move: `reset-lessons.js` → `features/reset-lessons.js`
- Move: `compile-marathon-to-zip.js` → `features/compile-marathon-to-zip.js`
- Modify: `tests/resetLessons.test.js:24`

- [ ] **Step 1: Create the feature directory and move both modules**

Run:

```bash
mkdir -p features
mv reset-lessons.js features/reset-lessons.js
mv compile-marathon-to-zip.js features/compile-marathon-to-zip.js
```

Expected: both files exist only under `features/`.

- [ ] **Step 2: Run the reset suite and verify the old import fails**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: FAIL because `../resetLessons.js` no longer exists.

- [ ] **Step 3: Update the reset test import**

Change the import in `tests/resetLessons.test.js` to:

```js
} = require('../features/reset-lessons.js');
```

- [ ] **Step 4: Run the reset suite**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: all existing reset tests pass with no behavior changes.

- [ ] **Step 5: Commit this checkpoint if explicitly authorized**

```bash
git add features/reset-lessons.js features/compile-marathon-to-zip.js \
  tests/resetLessons.test.js reset-lessons.js compile-marathon-to-zip.js
git commit -m "refactor: move features into dedicated modules"
```

### Task 4: Extract the marathon export feature

**Files:**
- Create: `features/marathon-export.js`
- Create: `tests/marathonExport.test.js`
- Modify: `main.js:120-493` later in Task 5

- [ ] **Step 1: Write the export orchestration tests**

Create `tests/marathonExport.test.js` with an injected overlay and deterministic dependencies:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createMarathonExportFeature
} = require('../features/marathon-export.js');

function createOverlaySpy() {
    const calls = [];
    return {
        calls,
        update(detail) {
            calls.push(['update', detail]);
        },
        complete(message, total) {
            calls.push(['complete', message, total]);
        },
        error(message) {
            calls.push(['error', message]);
        },
        dismissAfter(ms) {
            calls.push(['dismissAfter', ms]);
        }
    };
}

test('export builds the backup, throttles sections, and compiles the ZIP', async () => {
    const requests = [];
    const waits = [];
    const statuses = [];
    const activeChanges = [];
    const overlay = createOverlaySpy();
    let compiledBackup;

    const responses = [
        {
            Value: {
                Items: [{
                    LessonId: 10,
                    MarathonLessonId: 100,
                    Name: 'Lesson one',
                    Image: 'fallback.png'
                }]
            }
        },
        {
            Value: {
                ImageUrl: 'lesson.png',
                Sections: [{ Id: 20, Name: 'Words' }],
                HomeworkSection: {
                    Id: 21,
                    Name: 'Homework',
                    IsHomework: true
                }
            }
        },
        { Value: { Items: [{ Id: 30 }] } },
        { Value: JSON.stringify({ Items: [{ Id: 31 }] }) }
    ];

    const feature = createMarathonExportFeature({
        sendRequest: async (...args) => {
            requests.push(args);
            return responses.shift();
        },
        wait: async (ms) => waits.push(ms),
        canStart: () => true,
        onActiveChange: (active) => activeChanges.push(active),
        compileToZip: async (backup) => {
            compiledBackup = backup;
        },
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: () => overlay,
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508',
        now: () => '2026-07-14T12:00:00.000Z'
    });

    await feature.start();

    assert.deepEqual(waits, [300, 300]);
    assert.deepEqual(requests.map((request) => request.slice(0, 3)), [
        ['MarathonLessonWsController', 'GetMarathonLessonsPagination', 'Marathons'],
        ['LessonWsController', 'GetLessonWithId', 'Books'],
        ['GetExerciseWsController', 'LoadExercises', 'Exercises'],
        ['GetExerciseWsController', 'LoadExercises', 'Exercises']
    ]);
    assert.deepEqual(requests[2][3], {
        IsTeacher: true,
        SectionId: 20,
        LessonId: 10,
        LessonSection: 0
    });
    assert.deepEqual(compiledBackup, {
        exportedAt: '2026-07-14T12:00:00.000Z',
        marathonId: 18508,
        totalLessons: 1,
        lessons: [{
            lessonId: 10,
            marathonLessonId: 100,
            name: 'Lesson one',
            imageUrl: 'lesson.png',
            sections: [
                {
                    sectionId: 20,
                    name: 'Words',
                    isHomework: false,
                    items: [{ Id: 30 }]
                },
                {
                    sectionId: 21,
                    name: 'Homework',
                    isHomework: true,
                    items: [{ Id: 31 }]
                }
            ]
        }]
    });
    assert.deepEqual(statuses, [['started', ''], ['complete', '']]);
    assert.deepEqual(activeChanges, [true, false]);
    assert.equal(overlay.calls.at(-1)[0], 'dismissAfter');
});

test('export reports invalid marathon URLs and releases the operation', async () => {
    const statuses = [];
    const activeChanges = [];
    const overlay = createOverlaySpy();

    const feature = createMarathonExportFeature({
        sendRequest: async () => assert.fail('request should not run'),
        wait: async () => {},
        canStart: () => true,
        onActiveChange: (active) => activeChanges.push(active),
        compileToZip: async () => assert.fail('compiler should not run'),
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: () => overlay,
        getCurrentUrl: () => 'https://app.edvibe.com/dashboard'
    });

    await feature.start();

    assert.deepEqual(statuses, [
        ['started', ''],
        ['error', 'Invalid marathon URL.']
    ]);
    assert.deepEqual(activeChanges, [true, false]);
    assert.match(overlay.calls.at(-1)[1], /MarathonId/);
});

test('export reports request failures and releases the operation', async () => {
    const statuses = [];
    const activeChanges = [];

    const feature = createMarathonExportFeature({
        sendRequest: async () => {
            throw new Error('network failure');
        },
        wait: async () => {},
        canStart: () => true,
        onActiveChange: (active) => activeChanges.push(active),
        compileToZip: async () => {},
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: createOverlaySpy,
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508'
    });

    await feature.start();

    assert.deepEqual(statuses, [
        ['started', ''],
        ['error', 'network failure']
    ]);
    assert.deepEqual(activeChanges, [true, false]);
});

test('export refuses to start while another operation is active', async () => {
    const statuses = [];
    const feature = createMarathonExportFeature({
        sendRequest: async () => assert.fail('request should not run'),
        wait: async () => {},
        canStart: () => false,
        onActiveChange: () => assert.fail('operation should not activate'),
        compileToZip: async () => assert.fail('compiler should not run'),
        notifyStatus: (state, message = '') => statuses.push([state, message]),
        createProgressOverlay: () => assert.fail('overlay should not open'),
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508'
    });

    await feature.start();

    assert.equal(statuses[0][0], 'error');
    assert.match(statuses[0][1], /another operation/i);
});
```

- [ ] **Step 2: Run the tests and verify the missing-module failure**

Run:

```bash
node --test tests/marathonExport.test.js
```

Expected: FAIL with `Cannot find module '../features/marathon-export.js'`.

- [ ] **Step 3: Create the UMD export feature**

First move `main.js:120-295`—the two overlay constants,
`ensureExportProgressStyles`, and `createExportProgressOverlay`—verbatim into
the feature factory. Then wrap those definitions and the export workflow with
the same UMD pattern as the reset feature:

```js
(function initializeMarathonExport(root, factory) {
    const api = factory();
    root.EdVibeMarathonExport = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createMarathonExportModule() {
    'use strict';

    function parseMarathonId(url) {
        const match = String(url || '').match(/marathon\/(\d+)/);
        return match ? Number(match[1]) : null;
    }

    function createMarathonExportFeature({
        sendRequest,
        wait,
        canStart,
        onActiveChange,
        compileToZip,
        notifyStatus,
        createProgressOverlay = createExportProgressOverlay,
        getCurrentUrl = () => window.location.href,
        now = () => new Date().toISOString()
    }) {
        async function start() {
            if (!canStart()) {
                notifyStatus(
                    'error',
                    'Cannot start export while another operation is active.'
                );
                return;
            }

            onActiveChange(true);
            notifyStatus('started');
            const progressOverlay = createProgressOverlay();
            progressOverlay.update({
                statusText: 'Finding marathon lessons...',
                loadedSections: 0,
                totalSections: 0
            });

            try {
                const marathonId = parseMarathonId(getCurrentUrl());
                if (!marathonId) {
                    progressOverlay.error(
                        'Failed to find a valid MarathonId in the current page URL.'
                    );
                    notifyStatus('error', 'Invalid marathon URL.');
                    return;
                }

                const backupBundle = {
                    exportedAt: now(),
                    marathonId,
                    totalLessons: 0,
                    lessons: []
                };

                const paginationData = await sendRequest(
                    'MarathonLessonWsController',
                    'GetMarathonLessonsPagination',
                    'Marathons',
                    {
                        MarathonId: marathonId,
                        SearchTerm: '',
                        Page: { Skip: 0, Take: 100 }
                    }
                );
                const marathonLessons = paginationData.Value?.Items || [];
                backupBundle.totalLessons = marathonLessons.length;
                progressOverlay.update({
                    statusText: `Found ${marathonLessons.length} lessons. `
                        + 'Loading lesson sections...',
                    loadedSections: 0,
                    totalSections: 0
                });

                const lessonQueue = [];
                let totalSections = 0;

                for (const [lessonIndex, lessonNode] of marathonLessons.entries()) {
                    progressOverlay.update({
                        statusText: `Loading sections for lesson `
                            + `${lessonIndex + 1} of ${marathonLessons.length}: `
                            + lessonNode.Name,
                        loadedSections: 0,
                        totalSections: 0
                    });
                    const lessonStructure = await sendRequest(
                        'LessonWsController',
                        'GetLessonWithId',
                        'Books',
                        { LessonId: lessonNode.LessonId }
                    );
                    const sections = [...(lessonStructure.Value?.Sections || [])];
                    if (lessonStructure.Value?.HomeworkSection) {
                        sections.push(lessonStructure.Value.HomeworkSection);
                    }
                    totalSections += sections.length;
                    lessonQueue.push({ lessonNode, lessonStructure, sections });
                }

                progressOverlay.update({
                    statusText: `Found ${totalSections} sections. `
                        + 'Loading exercise assets...',
                    loadedSections: 0,
                    totalSections
                });

                let loadedSections = 0;
                for (const { lessonNode, lessonStructure, sections } of lessonQueue) {
                    const lessonEntry = {
                        lessonId: lessonNode.LessonId,
                        marathonLessonId: lessonNode.MarathonLessonId,
                        name: lessonNode.Name,
                        imageUrl: lessonStructure.Value?.ImageUrl || lessonNode.Image,
                        sections: []
                    };

                    for (const section of sections) {
                        progressOverlay.update({
                            statusText: `Lesson: ${lessonNode.Name}\n`
                                + `Section: ${section.Name}`,
                            loadedSections,
                            totalSections
                        });
                        await wait(300);
                        const exerciseResponse = await sendRequest(
                            'GetExerciseWsController',
                            'LoadExercises',
                            'Exercises',
                            {
                                IsTeacher: true,
                                SectionId: section.Id,
                                LessonId: lessonNode.LessonId,
                                LessonSection: 0
                            }
                        );
                        const parsedValue = typeof exerciseResponse.Value === 'string'
                            ? JSON.parse(exerciseResponse.Value)
                            : exerciseResponse.Value;
                        lessonEntry.sections.push({
                            sectionId: section.Id,
                            name: section.Name,
                            isHomework: section.IsHomework || false,
                            items: parsedValue?.Items || []
                        });
                        loadedSections += 1;
                        progressOverlay.update({
                            statusText: `Loaded "${section.Name}" `
                                + `from "${lessonNode.Name}".`,
                            loadedSections,
                            totalSections
                        });
                    }

                    backupBundle.lessons.push(lessonEntry);
                }

                progressOverlay.update({
                    statusText: 'All sections loaded.\n'
                        + 'Processing lesson content and archiving workspace...\n'
                        + 'Downloading images — this may take a few minutes.',
                    loadedSections: 0,
                    totalSections: 0
                });

                await compileToZip(backupBundle, {
                    onProgress({ message, current, total }) {
                        const isCompressing = message === 'Compressing archive...';
                        progressOverlay.update({
                            statusText: isCompressing
                                ? 'Processing lesson content and archiving workspace...\n'
                                    + 'Compressing archive...'
                                : 'Processing lesson content and archiving workspace...\n'
                                    + message,
                            loadedSections: isCompressing ? 0 : (current || 0),
                            totalSections: isCompressing ? 0 : (total || 0),
                            countText: isCompressing
                                ? 'Compressing archive...'
                                : (total
                                    ? `${current} / ${total} lessons processed`
                                    : 'Preparing archive...')
                        });
                    }
                });

                progressOverlay.complete(
                    'ZIP workspace archive downloaded successfully.',
                    totalSections
                );
                progressOverlay.dismissAfter(3000);
                notifyStatus('complete');
            } catch (error) {
                console.error(
                    '[Edvibe Toolbox][Export] Export workflow failed:',
                    error
                );
                progressOverlay.error(`Export failed: ${error.message}`);
                notifyStatus('error', error.message);
            } finally {
                onActiveChange(false);
            }
        }

        return { start };
    }

    return {
        parseMarathonId,
        createExportProgressOverlay,
        createMarathonExportFeature
    };
});
```

The extracted implementation must retain:

- `GetMarathonLessonsPagination` with `{ MarathonId, SearchTerm: '', Page: { Skip: 0, Take: 100 } }`;
- `GetLessonWithId` with the source lesson ID;
- regular sections followed by `HomeworkSection`;
- `wait(300)` before each `LoadExercises`;
- teacher exercise payload `{ IsTeacher: true, SectionId, LessonId, LessonSection: 0 }`;
- parsing string-valued exercise responses;
- the existing lesson and section output fields;
- progress updates before discovery, section loading, and ZIP processing.

- [ ] **Step 4: Run the export tests**

Run:

```bash
node --test tests/marathonExport.test.js
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit this checkpoint if explicitly authorized**

```bash
git add features/marathon-export.js tests/marathonExport.test.js
git commit -m "refactor: extract marathon export feature"
```

### Task 5: Replace `main.js` with composition and routing

**Files:**
- Rewrite: `main.js`
- Modify: `manifest.json:28-34`
- Create: `tests/moduleArchitecture.test.js`

- [ ] **Step 1: Write architecture tests**

Create `tests/moduleArchitecture.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

test('manifest loads shared infrastructure and features before main', () => {
    const manifest = JSON.parse(
        fs.readFileSync(path.join(root, 'manifest.json'), 'utf8')
    );
    const mainWorld = manifest.content_scripts.find(
        (entry) => entry.world === 'MAIN'
    );

    assert.deepEqual(mainWorld.js, [
        'lib/jszip.min.js',
        'lib/turndown.min.js',
        'shared/websocket-transport.js',
        'shared/operation-guard.js',
        'features/compile-marathon-to-zip.js',
        'features/reset-lessons.js',
        'features/marathon-export.js',
        'main.js'
    ]);

    for (const scriptPath of mainWorld.js) {
        assert.equal(
            fs.existsSync(path.join(root, scriptPath)),
            true,
            `${scriptPath} should exist`
        );
    }
});

test('main remains a coordinator without concrete feature logic', () => {
    const source = fs.readFileSync(path.join(root, 'main.js'), 'utf8');

    assert.doesNotMatch(source, /GetMarathonLessonsPagination/);
    assert.doesNotMatch(source, /LoadExercises/);
    assert.doesNotMatch(source, /EXPORT_PROGRESS_OVERLAY_ID/);
    assert.doesNotMatch(source, /window\.WebSocket\s*=/);
    assert.match(source, /createMarathonExportFeature/);
    assert.match(source, /createResetLessonsFeature/);
});
```

- [ ] **Step 2: Run the architecture tests and verify they fail**

Run:

```bash
node --test tests/moduleArchitecture.test.js
```

Expected: FAIL because the manifest still uses root feature paths and `main.js` still contains implementation logic.

- [ ] **Step 3: Rewrite `main.js` as the composition root**

Replace `main.js` with:

```js
// main.js - MAIN-world composition root

console.log('[Edvibe Toolbox][Main] Initializing Toolbox modules...');

function requireToolboxModule(name, value) {
    if (!value) {
        throw new Error(`[Edvibe Toolbox][Main] Required module is missing: ${name}`);
    }
    return value;
}

const transport = requireToolboxModule(
    'EdVibeWebSocketTransport',
    window.EdVibeWebSocketTransport
);
const operationGuardApi = requireToolboxModule(
    'EdVibeOperationGuard',
    window.EdVibeOperationGuard
);
const exportApi = requireToolboxModule(
    'EdVibeMarathonExport',
    window.EdVibeMarathonExport
);
const zipApi = requireToolboxModule(
    'EdVibeCompileMarathonToZip',
    window.EdVibeCompileMarathonToZip
);
const resetApi = requireToolboxModule(
    'EdVibeLessonReset',
    window.EdVibeLessonReset
);

const operationGuard = operationGuardApi.createOperationGuard();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function notifyExportStatus(state, message = '') {
    window.postMessage({
        type: 'EDVIBE_TOOLBOX_EXPORT_STATUS',
        state,
        message
    }, '*');
}

const marathonExportFeature = exportApi.createMarathonExportFeature({
    sendRequest: transport.sendRequest,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) operationGuard.activate('export');
        else operationGuard.release('export');
    },
    compileToZip: zipApi.compileMarathonToZip,
    notifyStatus: notifyExportStatus
});

const lessonResetFeature = resetApi.createResetLessonsFeature({
    sendRequest: transport.sendRequest,
    sendWithoutResponse: transport.sendWithoutResponse,
    wait,
    canStart: operationGuard.canStart,
    onActiveChange(isActive) {
        if (isActive) operationGuard.activate('reset');
        else operationGuard.release('reset');
    }
});

window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data?.type === 'EDVIBE_TOOLBOX_START_ALL') {
        marathonExportFeature.start();
    }

    if (event.data?.type === 'EDVIBE_TOOLBOX_OPEN_RESET') {
        lessonResetFeature.open();
    }
});

console.log('[Edvibe Toolbox][Main] Toolbox modules ready.');
```

- [ ] **Step 4: Update manifest script order**

Replace the MAIN-world `js` array in `manifest.json` with:

```json
[
    "lib/jszip.min.js",
    "lib/turndown.min.js",
    "shared/websocket-transport.js",
    "shared/operation-guard.js",
    "features/compile-marathon-to-zip.js",
    "features/reset-lessons.js",
    "features/marathon-export.js",
    "main.js"
]
```

- [ ] **Step 5: Run the architecture tests**

Run:

```bash
node --test tests/moduleArchitecture.test.js
```

Expected: 2 tests pass.

- [ ] **Step 6: Run all automated tests**

Run:

```bash
node --test tests/*.test.js
```

Expected: all reset, operation-guard, transport, export, and architecture tests pass.

- [ ] **Step 7: Commit this checkpoint if explicitly authorized**

```bash
git add main.js manifest.json tests/moduleArchitecture.test.js
git commit -m "refactor: make main a feature coordinator"
```

### Task 6: Verify syntax, loading, and extension behavior

**Files:**
- Verify: `main.js`
- Verify: `manifest.json`
- Verify: `shared/*.js`
- Verify: `features/*.js`
- Verify: `tests/*.test.js`

- [ ] **Step 1: Parse-check every non-vendored JavaScript module**

Run:

```bash
node --check main.js
node --check isolated.js
node --check popup.js
node --check shared/operation-guard.js
node --check shared/websocket-transport.js
node --check features/marathon-export.js
node --check features/compile-marathon-to-zip.js
node --check features/reset-lessons.js
```

Expected: every command exits successfully without output.

- [ ] **Step 2: Validate manifest JSON and all declared script paths**

Run:

```bash
node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('manifest.json','utf8'));for(const c of m.content_scripts)for(const f of c.js)if(!fs.existsSync(f))throw new Error('Missing '+f);console.log('manifest scripts valid')"
```

Expected: `manifest scripts valid`.

- [ ] **Step 3: Run the complete test suite**

Run:

```bash
node --test tests/*.test.js
```

Expected: all tests pass with zero failures.

- [ ] **Step 4: Inspect the final diff**

Run:

```bash
git status --short
git diff --check
git diff --stat
```

Expected:

- `main.js` is substantially smaller.
- root-level feature files are removed.
- corresponding files exist under `features/`.
- shared modules and focused tests are added.
- `git diff --check` reports no whitespace errors.

- [ ] **Step 5: Perform manual Chrome validation**

1. Open `chrome://extensions/`, reload Edvibe Toolbox, and confirm there are no manifest errors.
2. Open a fresh Edvibe marathon tab and confirm the transport interception log appears.
3. Export the marathon and verify:
   - the progress overlay advances;
   - the popup export button remains disabled during export;
   - the ZIP downloads;
   - its backup JSON retains `exportedAt`, `marathonId`, `totalLessons`, and `lessons`;
   - the popup state clears after completion.
4. Open the reset workflow and complete a reset for a selected pupil and lesson.
5. Start one operation and attempt the other; verify the second operation is blocked.
6. Force an export failure by reloading during export and verify the overlay and popup report/clear the failed state.

- [ ] **Step 6: Commit final verification adjustments if explicitly authorized**

```bash
git add main.js manifest.json shared features tests \
  docs/superpowers/specs/2026-07-14-feature-module-architecture-design.md \
  docs/superpowers/plans/2026-07-14-feature-module-architecture.md
git commit -m "test: verify modular feature architecture"
```
