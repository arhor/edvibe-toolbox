# WebSocket Action Recorder

## Goal

Add a developer-facing recorder that observes WebSocket traffic while a user
performs an operation in Edvibe and turns that traffic into an
implementation-ready trace.

The recorder replaces the repetitive DevTools workflow:

1. Open the recorder from Edvibe Toolbox.
2. Start a recording.
3. Perform one logical operation in the Edvibe UI.
4. Stop the recording.
5. Inspect correlated request/response pairs, copy individual
   `sendRequest(...)` calls, or export the complete session as JSON.

The recorder is an analysis tool, not a macro recorder. It does not replay
traffic and does not claim that every Edvibe feature is WebSocket-only. An
operation that produces no captured request is useful evidence that the feature
may use HTTP, file upload, browser storage, or local DOM state instead.

## User Experience

Add an `Action recorder` card under a new `Development` popup group. It is
available on every supported Edvibe page, not only marathon pages. Its action
opens an in-page recorder panel and closes the popup.

The panel remains mounted in the Edvibe page while the popup is closed. It has
four states:

- **Idle**: explains what is captured and shows a `Start recording` button.
- **Recording**: shows elapsed time and the number of captured operations. A
  small persistent red indicator remains visible if the panel is minimized.
- **Stopped**: shows the captured operations and enables copy/export actions.
- **Limit reached**: stops accepting frames, retains the trace captured so far,
  and clearly reports the configured limit.

The primary controls are:

- `Start recording`: clears any previous in-memory session after confirmation
  when necessary and begins a new session.
- `Stop`: stops capture without discarding the session.
- `Clear`: discards the current in-memory session after confirmation.
- `Export JSON`: downloads the full normalized session.
- `Copy recipe`: copies a review-only JavaScript skeleton for all outbound
  operations.

Each captured operation appears as one row:

```text
01  MarathonLessonWsController.GetMarathonLessonsPagination  184 ms  Success
02  LessonWsController.GetLessonWithId                       97 ms  Success
03  GetExerciseWsController.LoadExercises                   213 ms  Success
```

Expanding a row shows:

- controller, method, and project;
- parsed request `Value`;
- parsed response;
- request ID and relative timestamps;
- a `Copy request` action that produces one exact `sendRequest(...)` call.

Unmatched inbound messages and unparseable frames appear in a separate
`Other frames` section. They are retained because server pushes may be relevant,
but they do not obscure the normal outbound-operation list.

The panel includes this warning before the first recording:

> Recordings may contain pupil data, lesson content, answers, and identifiers.
> Review the file before sharing or committing it.

## Architecture

The feature follows the existing execution-world split:

```text
popup.js
  OPEN_ACTION_RECORDER
        |
        v
src/isolated.js
  EDVIBE_TOOLBOX_OPEN_RECORDER
        |
        v
src/main.js
  actionRecorderFeature.open()
        |
        +--> recorder panel
        |
        +--> WebSocket transport frame subscription
```

No background service worker, new Chrome permission, framework, or build step is
required.

### `src/shared/websocket-transport.js`

Extend the transport with a passive observer API:

```js
const unsubscribe = transport.subscribeFrames((frame) => {
    // Synchronous notification. Observer errors are isolated by the transport.
});
```

The returned transport API becomes:

```js
{
    install,
    sendRequest,
    sendWithoutResponse,
    subscribeFrames
}
```

`subscribeFrames` owns no recording state and retains no payloads. This keeps
the transport reusable and prevents normal browsing traffic from accumulating
in memory when the recorder is closed.

When an intercepted socket is constructed, the transport:

1. assigns it a monotonically increasing local `socketId`;
2. wraps that socket instance's `send` method;
3. emits an outbound frame before delegating to the original `send`;
4. observes inbound `message` events and emits an inbound frame;
5. preserves the existing request-correlation listener and active-socket
   behavior.

The original `send` function must be invoked with the native socket as `this`,
and its return value and thrown errors must be preserved. A failing observer
must be logged but must never prevent Edvibe from sending or receiving a frame.

The transport emits an ephemeral frame shaped like:

```js
{
    direction: 'outbound',       // or 'inbound'
    socketId: 1,
    capturedAt: 1784982000123,
    dataType: 'text',            // text, blob, array-buffer, other
    data: '{"Controller": ...}', // only for text frames
    byteLength: 241,
    origin: 'page'               // page or toolbox
}
```

`origin` distinguishes Edvibe's own requests from Toolbox requests. The
transport already knows each request ID it creates in `sendRequest` and
`sendWithoutResponse`; it marks outbound frames containing those IDs as
`toolbox`, and marks their correlated inbound responses the same way. Everything
else is `page`. This lets a recording coexist with Toolbox activity without
mistaking an export or reset workflow for a manual Edvibe action.

Classification must not create an unbounded second request registry.
`sendRequest` uses its existing pending-request entry until the response or
timeout, while `sendWithoutResponse` needs only a synchronous internal-send
marker around `socket.send`. Inbound notification and pending-request cleanup
happen in one handler so the origin is determined before the pending entry is
deleted.

Do not expose or record the WebSocket URL. It may contain session or routing
parameters and is not needed to implement a Toolbox feature.

### `src/features/action-recorder.js`

Add a UMD-style feature module matching the existing feature modules:

```js
createActionRecorderFeature({
    subscribeFrames,
    createPanel,
    getPageContext,
    downloadJson,
    copyText,
    now,
    log
}) // => { open, getState }
```

The feature owns:

- recorder state and lifecycle;
- safe parsing and normalization;
- request/response correlation;
- session limits;
- JSON export;
- recipe generation;
- status updates to the panel.

It subscribes once when constructed. While idle, the subscription returns
immediately and stores nothing. Opening and closing the panel does not silently
start or stop recording.

Recording is passive and is not registered with `operation-guard.js`. The
operation guard controls Toolbox workflows; the recorder must be able to
observe the page while the user works. Toolbox-origin frames are retained in a
separate collection and hidden by default.

### `src/components/action-recorder-dialog.js`

Add a component module that owns only DOM rendering and user interaction. It
receives callbacks for start, stop, clear, export, copy, minimize, and close.
It does not parse frames or construct exports.

Use a custom element with a shadow root so Edvibe styles cannot affect the
panel. The component stylesheet is loaded into the shadow root using the same
web-accessible-resource pattern as the reset dialog.

Closing the panel while recording minimizes it to the persistent recording
indicator instead of removing it. Closing a stopped or idle panel removes it;
reopening it restores the feature's current in-memory state.

### `src/main.js`

`main.js` remains the composition root. It:

- requires the recorder feature and panel component;
- creates a `Recorder` logger;
- passes `transport.subscribeFrames` to the feature;
- routes `EDVIBE_TOOLBOX_OPEN_RECORDER` to `actionRecorderFeature.open()`.

No parsing, correlation, rendering, or download implementation belongs in
`main.js`.

### `src/isolated.js` and `popup.js`

Add one command path:

```text
OPEN_ACTION_RECORDER
    -> EDVIBE_TOOLBOX_OPEN_RECORDER
```

The isolated bridge accepts only that exact command and sends only the minimal
message type plus the component stylesheet URL. No captured frames cross
`window.postMessage`, and no captured data enters `chrome.storage`.

The popup tool has `requirement: 'edvibe'` and `closeOnSuccess: true`. Extend
`getUnavailableReason` so `edvibe` accepts both general Edvibe and marathon
contexts.

## Capture and Correlation

Only text WebSocket frames are parsed. Blob, ArrayBuffer, and other frame types
are represented by direction, time, type, and byte length; the recorder does
not asynchronously decode them in the first version.

For each text frame:

1. Keep the exact text only until normalization completes.
2. Parse the outer JSON object.
3. If `Value` is a JSON string, parse it recursively once.
4. Identify an outbound request by the presence of `RequestId` plus at least
   one of `Controller`, `Method`, or `ProjectName`.
5. Index outbound requests by `socketId + RequestId`.
6. Attach an inbound response with the same composite key.
7. Compute elapsed time from the outbound and inbound capture timestamps.
8. Store unmatched or unparseable frames under `otherFrames`.

Correlation is socket-aware so identical request IDs on different connections
cannot collide. A duplicate outbound key does not overwrite the first
operation; it is recorded as an anomaly in `otherFrames`.

The recorder must not rely on `IsSuccess` being present. When it is present,
display `success` for `true` and `failed` otherwise. Without it, display
`response received`.

## Export Format

The download name is:

```text
edvibe-ws-recording-YYYY-MM-DDTHH-mm-ss.json
```

The top-level schema is versioned:

```json
{
  "schemaVersion": 1,
  "sessionId": "uuid",
  "startedAt": "2026-07-25T12:00:00.000Z",
  "stoppedAt": "2026-07-25T12:00:06.200Z",
  "page": {
    "origin": "https://app.edvibe.com",
    "pathname": "/marathon/123",
    "marathonId": 123
  },
  "limits": {
    "maxFrames": 1000,
    "maxStoredBytes": 5242880,
    "limitReached": false
  },
  "operations": [
    {
      "sequence": 1,
      "socketId": 1,
      "origin": "page",
      "requestId": "observed-request-id",
      "startedAfterMs": 841,
      "durationMs": 184,
      "controller": "LessonWsController",
      "method": "GetLessonWithId",
      "projectName": "Books",
      "requestValue": {
        "LessonId": 42
      },
      "response": {
        "isSuccess": true,
        "errorCode": null,
        "value": {}
      }
    }
  ],
  "otherFrames": [],
  "anomalies": []
}
```

The page context includes only origin, pathname, and a parsed marathon ID. It
excludes query strings and URL fragments because they may contain sensitive
parameters.

`requestValue` and `response.value` preserve exact JSON-compatible values.
Outer envelope fields that are not represented by the normalized schema are
preserved in an `extra` object. This avoids losing evidence when Edvibe adds a
new protocol field.

Unparseable text is retained in `otherFrames.rawText` within the normal size
limit. This is necessary for protocol analysis, so the UI and README must treat
the complete recording as sensitive.

## Recipe Generation

`Copy request` emits:

```js
await sendRequest(
    'LessonWsController',
    'GetLessonWithId',
    'Books',
    {
        LessonId: 42
    }
);
```

`Copy recipe` emits all page-origin outbound operations in sequence. It starts
with:

```js
// Recorded from Edvibe UI. Review IDs, ordering, and mutation effects before use.
// This code is intentionally not executable by the recorder.
```

The recipe uses exact captured values and inserts `await wait(<gap>)` only when
the gap between requests is at least 250 ms. Generated waits are clues about
sequencing, not a claim that the delay is required.

The first version does not infer variables, loops, pagination, dependencies
between response fields and later requests, or whether a request is safe to
repeat. Those decisions require developer review. Responses remain in the JSON
export and inspector rather than being emitted as large source-code comments.

There is deliberately no `Replay`, `Run`, or `Test request` control. Captured
operations may create, update, delete, or submit educational data.

## Limits and Failure Handling

Default per-session limits:

- 1,000 total frames;
- 5 MiB of captured text-frame data;
- 10 minutes of recording.

The size counter uses the UTF-8 byte size of received text before parsing. When
any limit is reached, capture stops, the existing trace remains exportable, and
the panel explains which limit was reached.

Additional behavior:

- A malformed frame never stops the recording.
- An observer or render failure never affects the Edvibe socket.
- Requests without responses remain visible as `pending` after stop.
- A response received after stop is not appended; stop defines a precise trace
  boundary.
- Page unload destroys the in-memory session. The persistent indicator warns
  that navigating or reloading will lose an unexported recording.
- Export uses a local Blob download. No recording is sent over the network.
- Clipboard failure leaves the text visible in a selectable fallback field.

## Privacy and Data Handling

Recordings are intentionally kept only in MAIN-world memory until the user
downloads them. They are not logged to the console, sent through the isolated
bridge, or stored in `chrome.storage`.

Automatic recursive redaction applies to object keys matching:

```text
authorization, accessToken, refreshToken, token, cookie, password, secret
```

Matching is case-insensitive and replaces the value with
`"[REDACTED_BY_TOOLBOX]"`. Redaction happens before the value enters the session
model, so copied recipes and exports cannot expose these common credentials.
The export records the redacted key paths in `redactions`.

Redaction is a safety net, not a guarantee. Names, answers, lesson content,
email addresses, and stable IDs remain necessary for protocol analysis and are
therefore not removed automatically.

## File and Manifest Changes

Add:

```text
src/components/action-recorder-dialog.js
src/components/action-recorder-dialog.css
src/features/action-recorder.js
tests/actionRecorder.test.js
tests/actionRecorderDialog.test.js
```

Modify:

```text
manifest.json
popup.js
src/isolated.js
src/main.js
src/shared/websocket-transport.js
tests/websocketTransport.test.js
tests/moduleArchitecture.test.js
tests/popupHandlers.test.js
README.md
```

The MAIN-world manifest order places the dialog and feature before
`src/main.js`. Add the dialog stylesheet to the existing
`web_accessible_resources` entry. No permissions or host permissions change.

## Verification

Automated tests cover:

- outbound and inbound frame observation without changing socket behavior;
- observer failure isolation and unsubscribe behavior;
- page/toolbox origin classification;
- parsing string and object `Value` forms;
- socket-aware request/response correlation;
- unmatched, malformed, duplicate, pending, and failed operations;
- credential-field redaction before storage;
- frame, byte, and duration limits;
- deterministic JSON export and recipe generation;
- panel state transitions and minimize-while-recording behavior;
- popup command routing and Edvibe-page availability;
- manifest load order and web-accessible resources.

Run:

```bash
node --test tests/*.test.js
node --check popup.js
node --check src/isolated.js
node --check src/main.js
node --check src/shared/websocket-transport.js
node --check src/features/action-recorder.js
node --check src/components/action-recorder-dialog.js
```

Manual validation:

1. Reload the unpacked extension and open a fresh Edvibe tab.
2. Open the recorder, start it, and perform one known Edvibe operation.
3. Confirm the panel shows the expected controller/method and correlated
   response without opening DevTools.
4. Compare one recorded pair with Chrome DevTools to verify fidelity.
5. Copy one request and the full recipe.
6. Export the JSON and verify page query parameters and credential-like fields
   are absent or redacted.
7. Run a Toolbox export during recording and confirm its frames are identified
   as Toolbox traffic and hidden by default.
8. Test minimize, reopen, stop, clear, page reload, and each session limit.

## Out of Scope

- Replaying or executing captured requests.
- Automatically generating a complete production feature.
- Inferring loops, variables, response dependencies, or required delays.
- Capturing `fetch`, `XMLHttpRequest`, uploads, DOM changes, or browser storage.
- Persisting sessions across page reloads.
- Synchronizing recordings between tabs.
- Decoding binary WebSocket protocols.
- Uploading, sharing, or committing recordings.
