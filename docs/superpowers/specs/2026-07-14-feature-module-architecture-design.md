# Feature Module Architecture

## Goal

Make `main.js` a composition root for Edvibe Toolbox's MAIN-world code. It must initialize shared infrastructure, construct feature modules, and route commands without implementing concrete export, ZIP, reset, or feature UI behavior.

This refactor preserves the current extension behavior, WebSocket payloads, backup data shape, throttling, and Manifest V3 execution model.

## Target Structure

```text
features/
  marathon-export.js
  compile-marathon-to-zip.js
  reset-lessons.js
shared/
  websocket-transport.js
  operation-guard.js
main.js
```

The existing root-level `compile-marathon-to-zip.js` and `reset-lessons.js` files move to `features/` without compatibility shims. Manifest and test references move with them.

Small domain helpers such as marathon-ID parsing and lesson-section collection remain feature-local. Sharing them is not necessary to establish the desired architecture and would broaden this structural refactor.

## Module Responsibilities

### `shared/websocket-transport.js`

- Installs the `window.WebSocket` interception at `document_start`.
- Tracks the active Edvibe socket.
- Creates request packets and correlates responses through `RequestId`.
- Enforces the existing 15-second request timeout.
- Exposes a browser global and CommonJS API with:
  - `sendRequest(controller, method, projectName, value)`
  - `sendWithoutResponse(controller, method, projectName, value)`

The manifest must load this module before `main.js` and before the Edvibe application creates its socket.

### `shared/operation-guard.js`

- Owns the single active Toolbox operation.
- Prevents export and reset from running concurrently.
- Exposes:
  - `canStart()`
  - `activate(operationName)`
  - `release(operationName)`
  - `getActiveOperation()`

`release` only clears the guard when its operation name matches the active operation. This prevents stale cleanup from releasing another operation.

### `features/marathon-export.js`

- Owns the complete marathon export workflow currently in `main.js`.
- Parses the marathon ID.
- Loads the marathon lesson directory and lesson structures.
- Loads section exercises with the existing 300 ms throttle.
- Builds the unchanged backup object containing `exportedAt`, `marathonId`, `totalLessons`, and `lessons`.
- Owns the export progress overlay and status lifecycle.
- Delegates archive creation to the ZIP compiler.
- Exposes:

```js
createMarathonExportFeature({
    sendRequest,
    wait,
    canStart,
    onActiveChange,
    compileToZip,
    notifyStatus,
    createProgressOverlay
}) // => { start }
```

`createProgressOverlay` is optional and defaults to the browser implementation, allowing focused Node tests without a full DOM.

### `features/compile-marathon-to-zip.js`

- Retains the existing ZIP, Markdown conversion, image localization, and browser download behavior.
- Continues to depend on JSZip and Turndown loaded earlier by the manifest.
- Continues exposing `compileMarathonToZip`.

### `features/reset-lessons.js`

- Retains the existing reset workflow, modal, helper exports, and dependency-injected factory.
- Changes location only, except for any minimal integration adjustments required by the shared operation guard.

### `main.js`

`main.js` becomes the MAIN-world composition root. It:

1. Reads the shared transport and operation-guard APIs.
2. Constructs marathon export and reset feature instances.
3. Wires export status notifications to `window.postMessage`.
4. Routes `EDVIBE_TOOLBOX_START_ALL` to export.
5. Routes `EDVIBE_TOOLBOX_OPEN_RESET` to reset.

It contains no WebSocket implementation, scraping loop, feature modal, progress overlay, ZIP compilation, or reset implementation.

## Script Loading

The MAIN-world manifest order becomes:

1. `lib/jszip.min.js`
2. `lib/turndown.min.js`
3. `shared/websocket-transport.js`
4. `shared/operation-guard.js`
5. `features/compile-marathon-to-zip.js`
6. `features/reset-lessons.js`
7. `features/marathon-export.js`
8. `main.js`

All scripts remain classic scripts loaded at `document_start` in the `MAIN` world. No bundler, framework, or ES-module migration is introduced.

## Error and Operation Lifecycle

- Missing or closed WebSocket connections retain the current clear rejection.
- Correlated requests retain the 15-second timeout and diagnostic logging.
- Export status uses the existing `started`, `complete`, and `error` states.
- Export errors appear in the progress overlay and propagate to the isolated-world status bridge.
- Reset errors remain in the reset modal.
- Export and reset always release their named operation after completion or failure.
- Missing required module globals fail during coordinator initialization with a clear error.

## Compatibility

The refactor preserves:

- Popup and isolated-world message names.
- WebSocket controller, method, project, and value payloads.
- The 300 ms scraping/reset throttling.
- Export backup and ZIP layouts.
- Reset behavior and UI.
- Console log prefix conventions.

The root feature-module paths are intentionally removed. `manifest.json` and Node test imports must use the new `features/` paths.

## Verification

Automated verification:

- Parse-check `main.js`, all `shared/` modules, and all `features/` modules.
- Run the existing reset test suite against `features/reset-lessons.js`.
- Add focused marathon-export tests covering:
  - request sequence and payloads;
  - lesson and homework-section aggregation;
  - backup object shape;
  - the 300 ms wait calls;
  - ZIP compiler delegation;
  - status transitions;
  - operation release after success, validation failure, and exceptions.
- Validate `manifest.json` syntax and script paths.

Manual verification:

- Reload the unpacked extension without manifest errors.
- Confirm WebSocket interception still occurs on a fresh Edvibe tab.
- Export a marathon and inspect the downloaded ZIP and embedded backup JSON.
- Reset selected lessons for a pupil through the existing modal.
- Confirm export and reset cannot run concurrently.
- Confirm the popup export state clears after successful and failed exports.

## Out of Scope

- UI redesign.
- Changes to Edvibe request payloads or response parsing.
- A bundler or package-manager introduction.
- Consolidating feature-specific DOM components.
- Broad extraction of duplicated domain helpers.
- Changes to popup or isolated-world protocols.
