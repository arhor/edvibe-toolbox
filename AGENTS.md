# AGENTS.md

Guidance for AI agents working in this repository.

## Project Overview

Edvibe Toolbox is a Manifest V3 Chrome extension for automating workflows on `edvibe.com`. It uses plain HTML, CSS, and JavaScript with no package manager, build step, framework, or test runner currently checked in.

The extension has two content-script contexts:

- `isolated.js` runs in the extension isolated world. It receives popup messages through `chrome.runtime.onMessage` and forwards trusted commands to the page with `window.postMessage`.
- `main.js` runs in the page `MAIN` world. It intercepts `window.WebSocket`, correlates request/response packets by `RequestId`, scrapes marathon lesson data, and downloads a JSON backup.

## Repository Layout

- `manifest.json`: Chrome extension manifest and content-script wiring.
- `popup.html`: Extension popup markup and inline styles.
- `popup.js`: Popup UI control flow and message dispatch to the active Edvibe tab.
- `isolated.js`: Message bridge between the extension sandbox and the page world.
- `main.js`: Page-world automation, WebSocket interception, scraping, and download logic.
- `jszip.min.js`: Vendored dependency. Do not edit manually.
- `export-*.json`: Generated/exported data artifacts. Treat as local data unless the user explicitly asks to inspect or modify them.

## Development Commands

There is no install or build command for the current project.

For manual validation:

1. Open `chrome://extensions/`.
2. Enable Developer Mode.
3. Load this repository with "Load unpacked".
4. After edits, click "Reload" on the extension card.
5. Test on a relevant `edvibe.com` page, especially a marathon page when changing backup behavior.

## Coding Guidelines

- Keep the project framework-free unless the user explicitly asks for a larger migration.
- Prefer small, direct vanilla JavaScript changes that match the existing file structure.
- Preserve the Manifest V3 model and keep content-script responsibilities separated between isolated and main worlds.
- Use clear console log prefixes consistent with the existing `[Edvibe Toolbox][Area]` style.
- Avoid broad permissions in `manifest.json`; add only the minimum Chrome permissions needed for a feature.
- Do not edit minified vendor files such as `jszip.min.js`; replace them from an upstream source if an update is required.
- Do not commit generated export files unless the user explicitly requests it and confirms the data is safe to include.
- Keep comments useful and sparse. Explain non-obvious browser-extension or WebSocket behavior, not simple assignments.

## Validation Expectations

Because there is no automated test suite, validate changes through focused manual checks:

- Popup changes: open the extension popup and verify the relevant button state, labels, and error handling.
- Messaging changes: confirm `popup.js` can send messages to `isolated.js`, and `isolated.js` forwards only expected commands to `main.js`.
- Automation changes: test on an Edvibe marathon URL and confirm the generated JSON shape still includes `exportedAt`, `marathonId`, `totalLessons`, and `lessons`.
- Manifest changes: reload the extension and check Chrome reports no manifest or permission errors.

## Safety And Data Handling

- Treat Edvibe lesson exports as potentially sensitive user or educational content.
- Avoid logging full payloads when concise IDs or counts are enough.
- Be careful with `window.postMessage('*')`; only send minimal command messages and validate incoming message types before acting.
- Preserve the current throttling behavior in scraping loops unless there is a clear reason to adjust it.
