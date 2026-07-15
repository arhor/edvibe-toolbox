# World-Aware Logging

## Goal

Replace manually repeated log prefixes with a small shared logging utility. Each
runtime entry point defines its execution world once, while reusable modules
receive a component-scoped logging function from their caller.

Logs use this namespace shape:

```text
[Edvibe Toolbox][POPUP]
[Edvibe Toolbox][MAIN][Export]
[Edvibe Toolbox][ISOLATED][Transport]
```

The allowed world names are `POPUP`, `MAIN`, and `ISOLATED`.

## Logger API

Add `src/shared/logger.js`. It exposes a `createLoggerFactory(world)` function.
The returned factory creates callable log functions:

```js
const createMainLog = createLoggerFactory('MAIN');
const log = createMainLog();
const exportLog = createMainLog('Export');
```

Calling a generated function forwards all arguments to `console.log`, with the
formatted namespace inserted as the first argument:

```js
exportLog('Starting marathon export...');
exportLog('Export workflow failed:', error);
```

The logger does not provide severity methods. Existing `console.warn`,
`console.error`, and `console.debug` calls are migrated to the same callable
logger and therefore emit through `console.log`.

The utility validates the world when a factory is created. Unsupported or
missing world names fail immediately, preventing unscoped logs. A component is
optional, but an explicitly supplied empty component is rejected.

## Ownership and Dependency Injection

Runtime entry scripts are composition roots and own namespace configuration:

- `popup.js` creates the `POPUP` factory.
- `src/main.js` creates the `MAIN` factory.
- `src/isolated.js` creates the `ISOLATED` factory.

Each composition root creates its own logger and creates component loggers for
the modules it instantiates. It passes those functions through existing
dependency objects:

```js
const createMainLog = createLoggerFactory('MAIN');
const transport = transportApi.createWebSocketTransport({
    WebSocketClass: window.WebSocket,
    cryptoApi: window.crypto,
    log: createMainLog('Transport')
});
```

Reusable modules accept a `log` function and call it without adding any
namespace text. They do not detect their execution world and do not choose
their component label. This keeps the same module reusable in either content
script world and makes the configured namespace visible at its call site.

Feature helper functions that are not independently instantiated use the
feature's injected logger. A separate component logger is only introduced when
the caller treats a unit as a distinct runtime component.

ZIP compilation remains a distinct component. `src/main.js` creates its `Zip`
logger and injects a small `compileToZip` adapter into the export feature. The
adapter passes that logger to `compileMarathonToZip` through its options
object, so ZIP helpers share one injected logger without knowing the world.

## Script Loading and Initialization

The logger utility must load before every script that creates a logger:

- Add it before `src/isolated.js` in the isolated-world manifest entry.
- Add it before shared infrastructure and `src/main.js` in the main-world
  manifest entry.
- Add it before `popup.js` in `popup.html`.

`src/shared/websocket-transport.js` currently installs itself as soon as the
file loads. That implicit initialization will be removed. The module will only
publish its factory, and `src/main.js` will create and install the transport
after creating its `MAIN` logger factory. Because manifest scripts execute in
order during the same `document_start` injection, installation remains early
while allowing explicit dependency injection.

## Existing Components

Initial component labels preserve the useful distinctions already present in
messages:

- Main coordinator: no component label
- WebSocket transport: `Transport`
- Marathon export workflow: `Export`
- ZIP compilation: `Zip`
- Lesson reset workflow: `Reset`

Popup and isolated entry scripts use only their world namespace unless they
later instantiate a reusable component.

## Testing

Add focused logger tests covering:

- World-only and world-plus-component prefix formatting.
- Forwarding multiple values and `Error` objects without stringifying them.
- Rejection of unsupported worlds and empty component labels.
- Independence of factories created for different worlds.

Update module tests to inject logging spies as plain functions. Update the
module architecture test to verify logger load order and explicit WebSocket
transport construction in `src/main.js`.

Run the complete Node test suite and parse-check all changed browser scripts.
Manual validation should confirm that popup, isolated-world, and main-world
console messages contain exactly one correctly formatted namespace.

## Constraints

- Do not infer a world from browser globals; MAIN and ISOLATED scripts can both
  expose similar global objects.
- Do not store the active world in mutable global state.
- Do not change feature behavior, message payloads, or Chrome permissions.
- Do not log additional user, lesson, or export data.
- Do not modify vendored library files.
