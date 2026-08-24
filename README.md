# Edvibe Toolbox

**Edvibe Toolbox** is a Google Chrome extension for automating routine processes, extending interface capabilities, and optimizing workflows on the Edvibe platform.

## ✨ Key Features

- **Process Automation:** execute repetitive Edvibe actions through the extension popup and in-page workflows.
- **Data Management:** analyze, intercept, and process Edvibe data needed by Toolbox features.
- **Interface Customization:** provide focused UI enhancements for supported workflows.
- **WebSocket Action Recorder:** capture a manual Edvibe workflow as correlated request/response operations, copy `sendRequest(...)` scaffolding, and export a local JSON trace without opening DevTools.

## WebSocket Action Recorder

Open any Edvibe page, select **Запись действий WebSocket** in the extension popup, and start recording in the in-page panel. Perform one logical operation, stop the recording, then inspect its requests and responses. Individual requests and a review-only recipe can be copied; the complete trace can be downloaded as JSON.

The recorder never replays traffic. Recorder exports and generated code contain the exact observed values and are intentionally unredacted, including credentials, pupil data, lesson content, and identifiers. They must be reviewed for dynamic IDs, sequencing, and mutation effects. Recordings stay in page memory until exported and are lost on navigation or reload.

## 🚀 Installation (Developer Mode)

The repository contains a committed, ready-to-load extension build in `dist/`. Installing dependencies or running a build is not required just to use the extension.

1. Clone this repository or download and unpack its ZIP archive.
2. Open `chrome://extensions/` in Google Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the repository's **`dist/` directory**. Chrome loads `dist/manifest.json`.

After updating to a newer repository revision, click **Reload** on the extension card if Chrome does not pick up changed files automatically.

## 🛠️ Tech Stack

Edvibe Toolbox targets **Manifest V3** and uses a bundled browser-extension toolchain:

- **Vite + CRXJS** build the extension and its popup, ISOLATED-world, and MAIN-world runtimes.
- **Lit** is the standard implementation for Toolbox Web Components and reactive UI.
- Runtime libraries such as **JSZip** and **Turndown** are installed through npm and bundled into the extension.
- **Node.js test runner** provides the colocated behavioral/unit test suite.

The source manifest configuration is `manifest.config.js`. Production builds are written to `dist/`; generated files there are build-owned output and must not be edited manually.

## Architecture

The source tree follows runtime ownership:

- `src/popup/` owns the extension popup and popup components.
- `src/content/isolated/` owns the Chrome extension ISOLATED-world bridge. It validates and routes messages between Chrome runtime APIs and the page.
- `src/content/main/` owns the page MAIN-world runtime, Edvibe transport, workflows, in-page UI, persistence, and execution history.
- `src/content/main/features/` contains feature slices.
- `src/content/main/components/` contains reusable MAIN-world UI components.
- `src/content/main/infrastructure/` contains MAIN-wide services and runtime infrastructure.
- `src/shared/` contains only contracts and primitives genuinely shared across runtimes, including the cross-world message protocol and extension-wide UI design tokens.

The MAIN and ISOLATED content scripts intentionally remain separate and start at `document_start`. Avoid cross-runtime implementation dependencies and keep `window.postMessage` contracts narrow and validated.

## Development

The reproducible development and CI environment uses Node.js 22, pinned in `.nvmrc`.

Install dependencies from a clean checkout:

```bash
npm ci
```

Build continuously while developing:

```bash
npm run dev
```

Create and validate a production build:

```bash
npm run build
npm run check:build-output
```

Load or reload `dist/` in Chrome while developing. Edits belong in source files, never directly in generated `dist/` files.

Pull requests do **not** need regenerated `dist/` changes. CI validates source changes. After a successful change reaches `master`, CI rebuilds the extension and synchronizes `dist/` only when generated output actually changed.

## Testing And Validation

Tests are colocated with the source modules they cover and use kebab-case names ending in `.test.js`.

```bash
npm run lint
npm test
npm run build
npm run check:build-output
```

GitHub Actions is the authoritative validation environment.

Tests should protect observable behavior and runtime contracts rather than source text or directory shape. In particular, messaging tests should validate popup ↔ ISOLATED ↔ MAIN contracts, while `npm run check:build-output` remains responsible for generated extension structure and bundle budgets.

## UI Conventions

Dynamic Toolbox UI is implemented as Lit custom elements. Keep component state reactive and markup declarative, preserve public methods/events when refactoring, and compose styles through Lit `css` modules and `static styles`.

Extension-wide design tokens live in `src/shared/ui-design-tokens.js`. Reusable MAIN visual foundations live in `src/content/main/styles/`, reusable MAIN components in `src/content/main/components/`, and feature-specific styles beside their feature components. See `docs/design-foundations.md` before introducing a new shared UI convention.

Use Shadow DOM or light DOM according to the component's existing integration contract. Update source assets, the manifest, or build configuration as appropriate; never patch generated files under `dist/`.
