# Edvibe Toolbox

**Edvibe Toolbox** is a Google Chrome extension for automating routine processes, extending interface capabilities, and optimizing workflows on the Edvibe platform.

## ✨ Key Features

- **Process Automation:** Execute repetitive and uniform actions in a few clicks through the extension popup and in-page dialogs.
- **Data Management:** Analyze, intercept, and process Edvibe data needed by Toolbox workflows.
- **Interface Customization:** Local UI/UX enhancements for supported Edvibe workflows.
- **WebSocket Action Recorder:** Capture a manual Edvibe workflow as correlated request/response operations, copy `sendRequest(...)` scaffolding, and export a local JSON trace without opening DevTools.

## WebSocket Action Recorder

Open any Edvibe page, select **Запись действий WebSocket** in the extension popup, and start recording in the in-page panel. Perform one logical operation, stop the recording, then inspect its requests and responses. Individual requests and a review-only recipe can be copied; the complete trace can be downloaded as JSON.

The recorder never replays traffic. Generated code contains the exact observed values and must be reviewed for dynamic IDs, sequencing, and mutation effects. If an operation produces no frames, it may use HTTP, uploads, browser storage, or DOM-only behavior instead of WebSocket messaging.

Recordings stay in page memory until exported and are lost on navigation or reload. Common credential fields are redacted, but traces may still contain pupil data, names, answers, lesson content, email addresses, and stable IDs. Review recordings before sharing or committing them. A session stops at 1,000 frames, 5 MiB of text traffic, or 10 minutes.

## 🚀 Installation (Developer Mode)

The repository contains a committed, ready-to-load extension build in `dist/`. Installing dependencies or running a build is not required just to use the extension.

1. Clone this repository or download and unpack its ZIP archive.
2. Open `chrome://extensions/` in Google Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the repository's **`dist/` directory**. The manifest Chrome loads is `dist/manifest.json`.

After updating to a newer repository revision, click **Reload** on the extension card if Chrome does not pick up the changed files automatically.

> 💡 Pin Edvibe Toolbox from Chrome's extensions menu for quick access to the popup.

## 🛠️ Tech Stack

Edvibe Toolbox targets **Manifest V3** and uses a bundled browser-extension toolchain:

- **Vite + CRXJS** build the extension and its isolated, MAIN-world, and popup entry points.
- **Lit** is the standard implementation for Toolbox Web Components and reactive UI.
- **HTML/CSS/JavaScript** remain the underlying browser platform technologies.
- Runtime libraries such as **JSZip** and **Turndown** are installed through npm and bundled into the extension.

The source manifest is `manifest.json`. Production builds are written to `dist/`; generated files there are build-owned output and must not be edited manually.

## Development

The reproducible development and CI environment uses Node.js 22, pinned in `.nvmrc` and the `package.json` engines field.

Install dependencies once from a clean checkout:

```bash
npm ci
```

For development builds that rebuild when source files change:

```bash
npm run dev
```

Load or reload `dist/` in Chrome while developing. The development command is still a build pipeline, so edits belong in source files, never directly in generated `dist/` files.

Create a production build with:

```bash
npm run build
```

Pull requests do **not** need to include regenerated `dist/` changes. CI verifies that the production extension builds successfully. After a source change reaches `master`, CI rebuilds the extension and commits an updated `dist/` only when generated output actually changed.

## Testing

Tests are colocated with the source modules they cover and use kebab-case names ending in `.test.js`.

Run the non-browser Node.js tests:

```bash
npm test
```

Run Web Component tests in a real local Chrome or Chromium process:

```bash
npm run test:components
```

Run the complete test command used by CI:

```bash
npm run test:ci
```

GitHub Actions installs dependencies with `npm ci`, runs `npm run test:ci`, and then runs `npm run build` for pull requests and changes to `master`.

## Component Conventions

Dynamic Toolbox UI is implemented as custom elements with Lit. Keep component state reactive and markup declarative, preserve existing public methods/events when refactoring, and keep presentation in dedicated `.css` files. Use Shadow DOM or light DOM according to the component's styling and integration contract rather than bypassing Lit with manual DOM rendering.

Static extension assets and component stylesheets are referenced from source paths and copied or bundled by CRXJS/Vite into `dist/`. Update the source asset, manifest, or build configuration as appropriate; do not patch the generated copy.
