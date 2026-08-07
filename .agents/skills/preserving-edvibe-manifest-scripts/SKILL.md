---
name: preserving-edvibe-manifest-scripts
description: Use when editing, reviewing, formatting, normalizing, or resolving conflicts in Edvibe Toolbox runtime entry points or manifest content_scripts.
---

# Preserving Edvibe Runtime Entry Points

## Overview

Keep the extension manifest focused on runtime wiring and keep dependency order in source entry points. The old multi-script manifest ordering and isolated logger cache-key workaround are obsolete once each runtime is bundled independently.

## Required invariants

| Runtime | Required wiring |
|---|---|
| Popup | `popup.html` loads only `src/entrypoints/popup.js` as a module script. |
| `ISOLATED` | `manifest.json` loads only `src/entrypoints/isolated.js` at `document_start`. |
| `MAIN` | `manifest.json` loads only `src/entrypoints/main.js` at `document_start`. |
| Standalone content scripts | Every manifest content-script entry point remains listed in CRXJS `contentScripts.standaloneFiles`, especially the timing-sensitive MAIN-world entry. |

The entry points own dependency evaluation order. The MAIN entry point must import vendored libraries before project modules, initialize the logger before modules that use it, load shared infrastructure before components and features, and import `src/main.js` last. The isolated entry point must initialize the logger before `src/isolated.js`.

## Workflow

1. Read `manifest.json`, `vite.config.mjs`, and the relevant `src/entrypoints/*.js` file before editing runtime wiring.
2. Keep one JavaScript entry per content-script world in the manifest; do not reintroduce dependency lists there.
3. Add or move runtime dependencies in the relevant source entry point, after their dependencies and before their consumers.
4. Preserve `document_start` for both content-script worlds and standalone CRXJS output for the MAIN-world entry point.
5. Keep popup dependency order in `src/entrypoints/popup.js`; do not add classic `vite-ignore` script tags back to `popup.html`.
6. Inspect the final diff and reject any incidental change that reintroduces `src/shared//logger.js`, `build/isolated-logger.js`, or a manifest-maintained dependency list.

## Example

```json
{
    "js": ["src/entrypoints/isolated.js"],
    "run_at": "document_start",
    "world": "ISOLATED"
},
{
    "js": ["src/entrypoints/main.js"],
    "run_at": "document_start",
    "world": "MAIN"
}
```

```js
// src/entrypoints/isolated.js
import '../shared/logger.js';
import '../isolated.js';
```

## Common mistakes

| Mistake | Required correction |
|---|---|
| Put module dependencies back into `manifest.json` | Move them into the relevant entry point. |
| Restore the double-slash logger path | Import the logger normally inside each independent runtime bundle. |
| Remove MAIN from standalone CRXJS output | Restore standalone output so `document_start` interception remains synchronous. |
| Load `src/main.js` before its dependencies | Keep the coordinator as the final MAIN entry-point import. |
| Add raw popup scripts with `vite-ignore` | Keep one Vite module entry point in `popup.html`. |
