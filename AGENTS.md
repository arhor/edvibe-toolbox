# AGENTS.md

Guidance for AI agents working in this repository.

## Project Overview

Edvibe Toolbox is a Manifest V3 Chrome extension for automating workflows on `edvibe.com`. The source is JavaScript/CSS/HTML, browser UI components use Lit, npm manages runtime and build dependencies, and CRXJS/Vite produces the loadable extension under `dist/`.

The extension has two content-script contexts:

- `src/entrypoints/isolated.js` runs in the extension isolated world. It initializes isolated-world dependencies and then loads the command bridge in `src/runtime/isolated.js`.
- `src/entrypoints/main.js` runs in the page `MAIN` world. It initializes package-managed runtime libraries and shared infrastructure before components, features, and the coordinator in `src/runtime/main.js`.

Keep these runtime worlds separate and preserve `document_start` behavior for timing-sensitive interception.

## Repository Layout

- `manifest.json`: source Manifest V3 configuration consumed by CRXJS.
- `popup.html`: source popup document. Its module entry point is `src/entrypoints/popup.js`.
- `src/entrypoints/`: small Vite/CRXJS composition roots for popup, ISOLATED, and MAIN runtimes.
- `src/runtime/`: runtime coordinators and popup-owned global presentation; application runtime code belongs here rather than at repository root.
- `src/components/`: Lit custom elements, component-specific Lit style modules, and reusable style foundations.
- `src/features/`: feature workflows that coordinate transport, data, components, and persistence.
- `src/shared/`: shared infrastructure such as logging, WebSocket transport, IndexedDB, operation guards, and execution history.
- `src/component-tests/`: real-browser component tests and their browser harness.
- `scripts/run-component-tests.mjs`: Chrome/Chromium component-test runner.
- `package.json` and `package-lock.json`: pinned npm dependency and command configuration.
- `vite.config.mjs`: CRXJS/Vite build configuration.
- `.github/workflows/ci.yml`: pull-request validation and `master` distribution synchronization.
- `dist/`: committed generated extension distribution. Chrome loads `dist/manifest.json`. Treat every file under `dist/` as build-owned output and never edit it manually.
- `export-*.json`: generated/exported data artifacts. Treat as local data unless the user explicitly asks to inspect or modify them.

## Development Commands

Use Node.js 22, as pinned by `.nvmrc` and `package.json`.

```bash
npm ci
npm run dev
npm run build
```

`npm run dev` runs the Vite build in watch mode. `npm run build` creates the production extension in `dist/`.

Testing commands are intentionally separated:

```bash
npm test                 # non-browser Node.js tests
npm run test:components  # real Chrome/Chromium Web Component tests
npm run test:ci          # complete test suite used by CI
```

For manual browser validation, load the repository's `dist/` directory with Chrome's **Load unpacked** action. Rebuild after source changes and reload the extension card before testing the affected Edvibe workflow.

## Build And Generated Files

- Source files are authoritative. Never hand-edit files under `dist/`.
- Pull requests are validated with `npm ci`, `npm run test:ci`, and `npm run build`.
- PR authors do not need to commit generated `dist/` updates.
- After a successful source change reaches `master`, the CI `sync-dist` job rebuilds and commits `dist/` only when generated output changed.
- Keep write permissions scoped to the distribution synchronization job. Validation jobs remain read-only.
- Runtime libraries are npm dependencies imported through source modules and bundled by Vite. Do not add copied/minified library files to the repository as an alternative dependency mechanism.

## Coding Guidelines

- Preserve the Manifest V3 architecture and keep isolated-world and MAIN-world responsibilities separate.
- Use source entry points to express runtime dependency evaluation order. Keep manifest content-script entries focused on the standalone runtime entry files expected by CRXJS.
- Use Lit as the standard implementation for Web Components. Prefer `LitElement`, reactive properties/state, declarative `html` templates, and Lit lifecycle/update APIs over manual DOM construction and synchronization.
- Preserve existing custom-element public contracts when migrating or refactoring: tag names, methods, properties, events, and integration callbacks should remain stable unless the task explicitly changes them.
- Choose Shadow DOM or light DOM according to the existing component styling/integration contract. Do not switch encapsulation casually during unrelated work.
- Keep in-page Lit component presentation in Lit `css` template modules composed through `static styles`. Put reusable design tokens and visual foundations under `src/components/styles/`, keep component-specific rules beside their component, and leave popup page CSS global unless a separate migration intentionally changes its light-DOM styling model.
- Keep feature/network/persistence logic outside UI components where an existing service or feature boundary already owns it. Components should primarily own presentation and interaction state.
- Use clear console log prefixes consistent with the existing `[Edvibe Toolbox][Area]` style.
- Avoid broad permissions in `manifest.json`; add only the minimum Chrome permissions needed for a feature.
- Do not commit generated export files unless the user explicitly requests it and confirms the data is safe to include.
- Keep comments useful and sparse. Explain non-obvious browser-extension, lifecycle, build, or WebSocket behavior rather than simple assignments.
- Keep tests beside the primary source module they exercise and name them in kebab-case with the `.test.js` suffix. Browser component tests belong in `src/component-tests/`.

## Validation Expectations

GitHub Actions is the authoritative validation environment for repository changes.

- Source or build changes: require the full CI test suite and a successful production build.
- Component changes: cover important reactive state, user events, Shadow/light DOM behavior, cleanup, and public integration contracts in the real-browser component suite.
- Popup changes: verify relevant button state, labels, command availability, and error handling.
- Messaging changes: confirm popup/isolated/MAIN routing forwards only expected commands and minimal metadata.
- Automation changes: preserve safe partial results, retries/cancellation semantics, and execution-history behavior where applicable.
- Manifest or entry-point changes: verify the production build and preserve the standalone `document_start` content-script behavior required by CRXJS.
- Generated-output changes: change the source or build configuration and let the build produce `dist/`; do not patch generated files.

## Safety And Data Handling

- Treat Edvibe lesson exports, execution history, recordings, and pupil/user data as potentially sensitive educational content.
- Avoid logging full payloads when concise IDs or counts are enough.
- Be careful with cross-world `window.postMessage` traffic; send minimal command messages and validate incoming message types before acting.
- Preserve current throttling behavior in scraping and batch-operation loops unless there is a clear reason to adjust it.