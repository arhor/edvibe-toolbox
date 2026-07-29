---
name: preserving-edvibe-manifest-scripts
description: Use when editing, reviewing, formatting, normalizing, or resolving conflicts in Edvibe Toolbox manifest.json content_scripts or JavaScript file lists.
---

# Preserving Edvibe Manifest Scripts

## Overview

Preserve the intentional script paths and dependency order in `manifest.json`. Treat the two logger entries as distinct cache keys, not formatting inconsistencies.

## Required invariants

Keep these exact forms:

| World | Required order and path |
|---|---|
| `ISOLATED` | `"src/shared//logger.js"` immediately before `"src/isolated.js"` |
| `MAIN` | all `lib/*.js` dependencies first, then `"src/shared/logger.js"`, then the remaining `src/*` modules |

The double slash in the isolated-world logger path is intentional. Chrome uses the literal script path as a cache key; the distinct string forces logger evaluation in both worlds.

The main-world logger is the first project module, not the first script overall. Vendored libraries must remain before it.

## Workflow

1. Read the current `content_scripts` arrays before editing.
2. Preserve the isolated logger path byte-for-byte as `src/shared//logger.js`.
3. Preserve dependency order in `MAIN`: libraries, logger, other project modules.
4. Place a new project module after its dependencies and before its entry point; do not move the logger or libraries to make the list alphabetical.
5. Inspect the final diff and reject any incidental change that:
   - collapses `//` to `/` in the isolated logger path;
   - moves the main logger before a `lib/*.js` entry;
   - moves another project module before the main logger.
6. If a test expects normalized paths or places the logger before libraries, treat that assertion as stale. Do not change the manifest to satisfy it; when test changes are in scope, update the assertion to encode these invariants.

## Example

```json
{
    "js": [
        "src/shared//logger.js",
        "src/isolated.js"
    ],
    "world": "ISOLATED"
},
{
    "js": [
        "lib/jszip.min.js",
        "lib/turndown.min.js",
        "src/shared/logger.js",
        "src/shared/websocket-transport.js",
        "src/main.js"
    ],
    "world": "MAIN"
}
```

## Common mistakes

| Mistake | Required correction |
|---|---|
| “Normalize” `src/shared//logger.js` | Restore the exact double-slash path. |
| Sort all scripts alphabetically | Restore dependency order. |
| Put the main logger at array index 0 | Keep every `lib/*.js` dependency before it. |
| Treat the two logger strings as accidental inconsistency | Preserve both exact strings because they intentionally create distinct browser cache keys. |
| Follow a conflicting test expectation | Preserve the manifest and report or update the stale assertion. |
