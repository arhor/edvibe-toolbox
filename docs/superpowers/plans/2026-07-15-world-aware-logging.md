# World-Aware Logging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace repeated logging prefixes with one callable, world-aware logger that composition roots scope and inject into reusable components.

**Architecture:** A UMD-style `src/shared/logger.js` exports `createLoggerFactory(world)`. Popup, MAIN, and ISOLATED entry scripts each create their world factory once; MAIN additionally creates component loggers and injects them into explicitly instantiated transport, export, ZIP, and reset units. Shared modules receive plain `log(...args)` functions and neither detect execution worlds nor construct namespace prefixes.

**Tech Stack:** Manifest V3 Chrome extension, vanilla JavaScript, Node.js built-in test runner.

## Global Constraints

- Allowed world names are exactly `POPUP`, `MAIN`, and `ISOLATED`.
- Every emitted message uses `console.log`; do not retain `console.warn`, `console.error`, or `console.debug`.
- Component labels are selected by composition roots, not reusable modules.
- Do not infer a world from browser globals or keep an active world in mutable global state.
- Do not change feature behavior, message payloads, Chrome permissions, or logged data.
- Do not modify vendored library files.

---

### Task 1: Logger factory

**Files:**
- Create: `src/shared/logger.js`
- Create: `tests/logger.test.js`

**Interfaces:**
- Produces: `createLoggerFactory(world: 'POPUP' | 'MAIN' | 'ISOLATED'): (component?: string) => (...args: unknown[]) => void`
- Produces: browser global `window.EdVibeLogger.createLoggerFactory`
- Produces: CommonJS export `{ createLoggerFactory }`

- [ ] **Step 1: Write failing formatting and validation tests**

Create `tests/logger.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const { createLoggerFactory } = require('../src/shared/logger.js');

function captureConsole(t) {
    const calls = [];
    const originalLog = console.log;
    console.log = (...args) => calls.push(args);
    t.after(() => {
        console.log = originalLog;
    });
    return calls;
}

test('creates a world-only logger and forwards every argument', (t) => {
    const calls = captureConsole(t);
    const error = new Error('failure');
    const log = createLoggerFactory('POPUP')();

    log('message', { count: 2 }, error);

    assert.deepEqual(calls, [[
        '[Edvibe Toolbox][POPUP]',
        'message',
        { count: 2 },
        error
    ]]);
});

test('creates independent component loggers for one world', (t) => {
    const calls = captureConsole(t);
    const createMainLog = createLoggerFactory('MAIN');

    createMainLog('Export')('started');
    createMainLog('Transport')('connected');

    assert.deepEqual(calls, [
        ['[Edvibe Toolbox][MAIN][Export]', 'started'],
        ['[Edvibe Toolbox][MAIN][Transport]', 'connected']
    ]);
});

test('keeps factories for different worlds independent', (t) => {
    const calls = captureConsole(t);

    createLoggerFactory('MAIN')()('main');
    createLoggerFactory('ISOLATED')()('isolated');

    assert.deepEqual(calls, [
        ['[Edvibe Toolbox][MAIN]', 'main'],
        ['[Edvibe Toolbox][ISOLATED]', 'isolated']
    ]);
});

test('rejects unsupported worlds and empty component labels', () => {
    assert.throws(() => createLoggerFactory(), /Unsupported logging world/);
    assert.throws(() => createLoggerFactory('PAGE'), /Unsupported logging world/);

    const createMainLog = createLoggerFactory('MAIN');
    assert.throws(() => createMainLog(''), /Component must be a non-empty string/);
    assert.throws(() => createMainLog('   '), /Component must be a non-empty string/);
});
```

- [ ] **Step 2: Run the logger tests and verify the missing-module failure**

Run:

```bash
node --test tests/logger.test.js
```

Expected: FAIL with `Cannot find module '../src/shared/logger.js'`.

- [ ] **Step 3: Implement the logger factory**

Create `src/shared/logger.js`:

```js
(function initializeLogger(root, factory) {
    const api = factory();
    root.EdVibeLogger = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createLoggerModule() {
    'use strict';

    const ALLOWED_WORLDS = new Set(['POPUP', 'MAIN', 'ISOLATED']);

    function createLoggerFactory(world) {
        if (!ALLOWED_WORLDS.has(world)) {
            throw new Error(`Unsupported logging world: ${String(world)}.`);
        }

        return function createLog(component) {
            if (
                component !== undefined
                && (typeof component !== 'string' || !component.trim())
            ) {
                throw new Error('Component must be a non-empty string.');
            }

            const componentSuffix = component === undefined
                ? ''
                : `[${component.trim()}]`;
            const prefix = `[Edvibe Toolbox][${world}]${componentSuffix}`;

            return (...args) => console.log(prefix, ...args);
        };
    }

    return { createLoggerFactory };
});
```

- [ ] **Step 4: Run focused tests and parse-check the utility**

Run:

```bash
node --test tests/logger.test.js
node --check src/shared/logger.js
```

Expected: all four tests PASS and the parse check exits 0.

- [ ] **Step 5: Commit the logger primitive**

```bash
git add src/shared/logger.js tests/logger.test.js
git commit -m "feat: add world-aware logger factory"
```

### Task 2: Load logger and wire composition roots

**Files:**
- Modify: `manifest.json:13-39`
- Modify: `popup.html:96`
- Modify: `popup.js:1-109`
- Modify: `src/isolated.js:1-47`
- Modify: `src/shared/websocket-transport.js:1-174`
- Modify: `src/main.js:1-63`
- Modify: `tests/popupHandlers.test.js:1-25`
- Modify: `tests/websocketTransport.test.js:29-94`
- Modify: `tests/moduleArchitecture.test.js:8-44`

**Interfaces:**
- Consumes: `EdVibeLogger.createLoggerFactory(world)`
- Changes transport dependency from `logger: { log, error, debug }` to `log: (...args) => void`
- Produces: explicitly constructed and installed MAIN-world WebSocket transport

- [ ] **Step 1: Write failing script-order and explicit-initialization tests**

Extend `tests/moduleArchitecture.test.js` so the manifest expectation is:

```js
assert.deepEqual(mainWorld.js, [
    'src/shared/logger.js',
    'lib/jszip.min.js',
    'lib/turndown.min.js',
    'src/shared/websocket-transport.js',
    'src/shared/operation-guard.js',
    'src/features/reset-lessons.js',
    'src/features/marathon-export.js',
    'src/main.js'
]);

const isolatedWorld = manifest.content_scripts.find(
    (entry) => entry.world === 'ISOLATED'
);
assert.deepEqual(isolatedWorld.js, [
    'src/shared/logger.js',
    'src/isolated.js'
]);
```

Add a separate architecture test:

```js
test('main explicitly creates and installs the WebSocket transport', () => {
    const transportSource = fs.readFileSync(
        path.join(root, 'src/shared/websocket-transport.js'),
        'utf8'
    );
    const mainSource = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');

    assert.doesNotMatch(transportSource, /createWebSocketTransport\(\{[\s\S]*root\.WebSocket/);
    assert.match(mainSource, /createLoggerFactory\('MAIN'\)/);
    assert.match(mainSource, /const transportLog = createMainLog\('Transport'\)/);
    assert.match(mainSource, /createWebSocketTransport\(\{/);
    assert.match(mainSource, /log:\s*transportLog/);
    assert.match(mainSource, /transport\.install\(window\)/);
});
```

Extend `tests/popupHandlers.test.js`:

```js
test('popup loads its logger before the popup script', () => {
    assert.match(
        popupHtml,
        /<script src="src\/shared\/logger\.js"><\/script>\s*<script src="popup\.js"><\/script>/
    );
    assert.match(popupScript, /createLoggerFactory\('POPUP'\)/);
});
```

- [ ] **Step 2: Update transport tests to describe the callable dependency**

In `tests/websocketTransport.test.js`, replace each object logger:

```js
logger: { log() {}, error() {}, debug() {} }
```

with:

```js
log() {}
```

Add:

```js
test('transport writes messages through its injected log function', () => {
    const root = { WebSocket: FakeWebSocket };
    const calls = [];
    const transport = createWebSocketTransport({
        WebSocketClass: FakeWebSocket,
        cryptoApi: { randomUUID: () => 'request-log' },
        log: (...args) => calls.push(args)
    });

    transport.install(root);
    new root.WebSocket('wss://example.test');

    assert.deepEqual(calls, [[
        'Intercepting WebSocket targeting:',
        'wss://example.test'
    ]]);
});
```

- [ ] **Step 3: Run focused tests and verify they fail for the old wiring**

Run:

```bash
node --test tests/moduleArchitecture.test.js tests/popupHandlers.test.js tests/websocketTransport.test.js
```

Expected: FAIL because logger scripts are absent from load lists, transport still auto-installs, and it expects logger methods.

- [ ] **Step 4: Add logger scripts to browser load order**

In `manifest.json`, set the isolated and MAIN script arrays to:

```json
"js": [
    "src/shared/logger.js",
    "src/isolated.js"
]
```

and:

```json
"js": [
    "src/shared/logger.js",
    "lib/jszip.min.js",
    "lib/turndown.min.js",
    "src/shared/websocket-transport.js",
    "src/shared/operation-guard.js",
    "src/features/reset-lessons.js",
    "src/features/marathon-export.js",
    "src/main.js"
]
```

In `popup.html`, load the utility first:

```html
<script src="src/shared/logger.js"></script>
<script src="popup.js"></script>
```

- [ ] **Step 5: Convert popup and isolated entry scripts**

At the beginning of `popup.js`, define:

```js
const createPopupLog = EdVibeLogger.createLoggerFactory('POPUP');
const log = createPopupLog();

log('Popup initialized.');
```

Replace every remaining `console.log`, `console.error`, and manually prefixed
message in `popup.js` with `log(...)`. Preserve all non-prefix message text and
arguments. For example:

```js
log(`Received export status: ${message.state}.`);
log('Failed to start marathon export:', error);
```

At the beginning of `src/isolated.js`, define:

```js
const createIsolatedLog = EdVibeLogger.createLoggerFactory('ISOLATED');
const log = createIsolatedLog();

log('Script successfully injected and initialized.');
```

Replace its remaining console calls with:

```js
log('Export status update from MAIN world:', event.data.state);
log('Incoming message received:', message);
```

- [ ] **Step 6: Make transport initialization explicit and injectable**

Change the wrapper at the top of `src/shared/websocket-transport.js` to:

```js
(function initializeWebSocketTransport(root, factory) {
    const api = factory();
    root.EdVibeWebSocketTransport = api;

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createWebSocketTransportModule() {
```

Change the transport factory dependency:

```js
function createWebSocketTransport({
    WebSocketClass,
    cryptoApi,
    requestTimeoutMs = REQUEST_TIMEOUT_MS,
    setTimeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
    log = () => {}
}) {
```

Replace all `logger.log(...)`, `logger.debug(...)`, and `logger.error(...)`
calls with `log(...)`. Remove the existing `[Edvibe Toolbox][WS]` and
`[Edvibe Toolbox][Transport]` fragments while preserving message details. Use
separate arguments where values are naturally separate:

```js
log(
    `← ${pending.controller}.${pending.method} `
    + `[${data.RequestId}] ${outcome} in ${elapsedMs}ms`
);
log('Failed parsing WebSocket frame:', error);
log('Intercepting WebSocket targeting:', url);
log('No active WebSocket connection.');
```

Apply the same prefix removal to timeout, request-send, send-failure, and
fire-and-forget messages.

- [ ] **Step 7: Construct MAIN components and inject their loggers**

Replace the beginning of `src/main.js` through transport setup with:

```js
const createMainLog = EdVibeLogger.createLoggerFactory('MAIN');
const log = createMainLog();

log('Initializing Toolbox modules...');

function requireToolboxModule(name) {
    const module = window[name];

    if (!module) {
        throw new Error(`Required module is missing: ${name}`);
    }
    return module;
}

const transportApi = requireToolboxModule('EdVibeWebSocketTransport');
const operationGuardApi = requireToolboxModule('EdVibeOperationGuard');
const exportApi = requireToolboxModule('EdVibeMarathonExport');
const resetApi = requireToolboxModule('EdVibeLessonReset');

const transportLog = createMainLog('Transport');
const exportLog = createMainLog('Export');
const zipLog = createMainLog('Zip');
const resetLog = createMainLog('Reset');

const transport = transportApi.createWebSocketTransport({
    WebSocketClass: window.WebSocket,
    cryptoApi: window.crypto,
    log: transportLog
});
transport.install(window);
```

Keep operation-guard creation and existing feature wiring. Add these
dependencies to the feature factory calls:

```js
log: exportLog
```

and:

```js
log: resetLog
```

Create and inject the ZIP adapter in the export call:

```js
compileToZip: (backupData, options) => exportApi.compileMarathonToZip(
    backupData,
    { ...options, log: zipLog }
),
```

Finish the file with:

```js
log('Toolbox modules ready.');
```

- [ ] **Step 8: Run focused tests and parse checks**

Run:

```bash
node --test tests/moduleArchitecture.test.js tests/popupHandlers.test.js tests/websocketTransport.test.js
node --check popup.js
node --check src/isolated.js
node --check src/main.js
node --check src/shared/websocket-transport.js
```

Expected: all focused tests PASS and all parse checks exit 0. Feature tests may
still fail until Tasks 3 and 4 migrate their logger dependency.

- [ ] **Step 9: Commit composition-root wiring**

```bash
git add manifest.json popup.html popup.js src/isolated.js src/main.js src/shared/websocket-transport.js tests/moduleArchitecture.test.js tests/popupHandlers.test.js tests/websocketTransport.test.js
git commit -m "refactor: inject scoped loggers from runtime entry points"
```

### Task 3: Export and ZIP component logging

**Files:**
- Modify: `src/features/marathon-export.js:83-433,636-839`
- Modify: `tests/marathonExport.test.js:1-230`

**Interfaces:**
- Consumes: `createMarathonExportFeature({ ..., log: (...args) => void })`
- Consumes: `compileMarathonToZip(backupData, { onProgress?, log })`
- Removes: object-shaped `logger` dependency

- [ ] **Step 1: Update export tests to use a callable logger**

Replace `silentLogger` in `tests/marathonExport.test.js` with:

```js
const silentLog = () => {};
```

Replace every:

```js
logger: silentLogger
```

with:

```js
log: silentLog
```

Add a focused failure-log assertion:

```js
test('export sends failures to its injected logger', async () => {
    const calls = [];
    const feature = createMarathonExportFeature({
        sendRequest: async () => {
            throw new Error('network failure');
        },
        wait: async () => {},
        canStart: () => true,
        onActiveChange() {},
        compileToZip: async () => {},
        notifyStatus() {},
        createProgressOverlay: createOverlaySpy,
        getCurrentUrl: () => 'https://app.edvibe.com/marathon/18508',
        log: (...args) => calls.push(args)
    });

    await feature.start();

    assert.equal(calls.at(-1)[0], 'Export workflow failed:');
    assert.match(calls.at(-1)[1].message, /network failure/);
});
```

- [ ] **Step 2: Run export tests and verify the old object API fails**

Run:

```bash
node --test tests/marathonExport.test.js
```

Expected: FAIL because the implementation still calls `logger.log`,
`logger.warn`, or `logger.error`.

- [ ] **Step 3: Inject one log function through ZIP helpers**

In `compileMarathonToZip`, establish the dependency once:

```js
async function compileMarathonToZip(backupData, options = {}) {
    const log = options.log || (() => {});
```

Change helper signatures and their call sites to carry this same function:

```js
function htmlToMarkdown(html, turndown, log) { /* existing conversion */ }
async function localizeImage(url, imageId, imagesFolder, urlMap, log) { /* existing fetch */ }
async function renderImageMarkdown(imageEntry, imagesFolder, urlMap, log) { /* existing render */ }
```

Inside the compiler context use:

```js
const ctx = {
    turndown,
    imagesFolder,
    urlMap: new Map(),
    log,
    htmlToMarkdown: (html) => htmlToMarkdown(html, turndown, log)
};
```

Pass `log` as the final argument to every `localizeImage(...)` and
`renderImageMarkdown(...)` call. In `processItemToMarkdown`, use `ctx.log(...)`
for the unhandled-item message.

Replace all five ZIP console calls with the injected function and remove their
manual namespace:

```js
log('HTML conversion failed, falling back to plain text:', error);
log(`Image fetch failed for ${url}:`, error.message);
ctx.log(`Unhandled item Type ${item.Type} (Id: ${item.Id})`);
log('Starting marathon workspace compilation...');
log('Marathon workspace archive downloaded:', downloadName);
```

- [ ] **Step 4: Convert the export feature to one callable dependency**

Change its signature tail to:

```js
getCurrentUrl = () => window.location.href,
now = () => new Date().toISOString(),
log = () => {}
```

Replace the three export logging sites with:

```js
log(message);
log('Starting marathon export...');
log('Export workflow failed:', error);
```

Do not include `[Edvibe Toolbox]`, `[Export]`, or `[Zip]` in module messages.

- [ ] **Step 5: Run export tests and scan the module**

Run:

```bash
node --test tests/marathonExport.test.js
node --check src/features/marathon-export.js
```

Then search `src/features/marathon-export.js` for:

```text
console.
[Edvibe Toolbox]
logger.
```

Expected: tests PASS, parse check exits 0, and the search returns no matches.

- [ ] **Step 6: Commit export logging migration**

```bash
git add src/features/marathon-export.js tests/marathonExport.test.js
git commit -m "refactor: inject export and ZIP log functions"
```

### Task 4: Reset component logging and complete verification

**Files:**
- Modify: `src/features/reset-lessons.js:140-300,770-1317,1319-1453`
- Modify: `tests/resetLessons.test.js`

**Interfaces:**
- Consumes: `createResetLessonsFeature({ ..., log: (...args) => void })`
- Passes the same Reset-scoped logger to discovery, execution, and modal helpers

- [ ] **Step 1: Add a reset feature logging test**

In the existing `reset workflow opens with exactly one initial pupil page`
test, collect logs:

```js
const logs = [];
```

Add this factory dependency:

```js
log: (...args) => logs.push(args),
```

After `await feature.open()`, add:

```js
assert.deepEqual(logs[0], [
    'Loaded 1 of 120 pupil(s) for MarathonId 18508.'
]);
```

Replace tests that temporarily assign `console.error` with injected `log`
spies at the helper or feature boundary being exercised. Assertions should
continue checking the same error type and identifiers, but against captured
`log` arguments.

- [ ] **Step 2: Run reset tests and verify the missing dependency flow**

Run:

```bash
node --test tests/resetLessons.test.js
```

Expected: FAIL because reset helpers still write directly to console rather
than the injected spy.

- [ ] **Step 3: Thread the Reset logger through helper boundaries**

Add required `log` properties to reset operations:

```js
async function discoverResetWork({
    sendRequest,
    wait,
    marathonId,
    pupilId,
    lessons,
    onDiscovery,
    log = () => {}
}) {
```

```js
async function executeResetWork({
    sendRequest,
    sendWithoutResponse,
    wait,
    marathonId,
    pupilId,
    work,
    onProgress,
    log = () => {}
}) {
```

Add `log = () => {}` to `createResetModal`'s options. Change the feature
signature to:

```js
function createResetLessonsFeature({
    sendRequest,
    sendWithoutResponse,
    wait,
    canStart,
    onActiveChange,
    createModal = createResetModal,
    log = () => {}
}) {
```

Pass the function into each boundary:

```js
const modal = createModal({ onClose: releaseOperation, log });
```

```js
const work = await discoverResetWork({
    sendRequest,
    wait,
    marathonId,
    pupilId: pupil.PupilId,
    lessons,
    onDiscovery: modal.showDiscovery,
    log
});
```

```js
await executeResetWork({
    sendRequest,
    sendWithoutResponse,
    wait,
    marathonId,
    pupilId: pupil.PupilId,
    work,
    onProgress: modal.showProgress,
    log
});
```

- [ ] **Step 4: Replace reset console calls and prefixes**

Replace every `console.log(...)` and `console.error(...)` in
`src/features/reset-lessons.js` with the nearest injected `log(...)`. Remove
the `[Edvibe Toolbox][Reset] ` prefix from every message while preserving all
IDs, counts, error types, and other message text.

Examples:

```js
log(
    `Discovering lesson ${lesson.MarathonLessonId} `
    + `(LessonId: ${lesson.LessonId}).`
);
```

```js
log(
    `Failed to load lessons for PupilId ${selectedPupil.PupilId} `
    + `(${getErrorType(error)}).`
);
```

```js
log(
    `Failed to initialize reset workflow for MarathonId ${marathonId} `
    + `(${getErrorType(error)}).`
);
```

Do not alter the commented-out request-deletion block except to migrate its
commented logging call consistently, preventing the old prefix from remaining
in source scans.

- [ ] **Step 5: Run reset tests and parse-check**

Run:

```bash
node --test tests/resetLessons.test.js
node --check src/features/reset-lessons.js
```

Expected: all reset tests PASS and the parse check exits 0.

- [ ] **Step 6: Run full automated verification**

Run:

```bash
node --test tests/*.test.js
node --check src/shared/logger.js
node --check src/shared/websocket-transport.js
node --check src/features/marathon-export.js
node --check src/features/reset-lessons.js
node --check src/main.js
node --check src/isolated.js
node --check popup.js
```

Expected: complete test suite PASS; every parse check exits 0.

Search non-vendored runtime JavaScript for direct console use and manual
prefixes:

```bash
rg -n "console\.(log|warn|error|debug)|\[Edvibe Toolbox\]" popup.js src --glob '*.js' --glob '!src/shared/logger.js'
```

Expected: no matches. The only permitted runtime `console.log` is the forwarding
call inside `src/shared/logger.js`.

- [ ] **Step 7: Perform manual extension validation**

Reload the unpacked extension and test an Edvibe marathon page:

1. Open the popup and confirm popup logs start with exactly
   `[Edvibe Toolbox][POPUP]`.
2. Start an export and confirm MAIN logs use `[MAIN][Export]`, ZIP logs use
   `[MAIN][Zip]`, and transport logs use `[MAIN][Transport]`.
3. Open lesson reset and confirm reset logs use `[MAIN][Reset]`.
4. Confirm relayed extension messages use `[ISOLATED]`.
5. Confirm no message contains a duplicated namespace and export/reset behavior
   remains unchanged.

- [ ] **Step 8: Commit reset migration**

```bash
git add src/features/reset-lessons.js tests/resetLessons.test.js
git commit -m "refactor: inject reset workflow log function"
```
