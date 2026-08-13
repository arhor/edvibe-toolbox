# AGENTS.md

Guidance for AI agents working in this repository.

## Project Overview

Edvibe Toolbox is a Manifest V3 Chrome extension for automating workflows on `edvibe.com`. Source code is JavaScript, browser UI components use Lit, npm manages dependencies, and CRXJS/Vite produces the loadable extension under `dist/`.

The extension has three deliberately separate runtime owners:

- `src/popup/` owns the extension popup, its components, and popup-global presentation.
- `src/content/isolated/` runs in Chrome's extension ISOLATED world and owns the bridge between Chrome runtime APIs and page messages.
- `src/content/main/` runs in the page MAIN world and owns Edvibe-facing transport, workflows, in-page UI, persistence, and runtime orchestration.

Code under `src/shared/` is reserved for contracts or primitives that genuinely need to be consumed by more than one runtime. Keep runtime-owned implementation out of shared code.

Preserve the ISOLATED/MAIN separation and the manifest's `document_start` behavior for timing-sensitive interception.

## Repository Layout

- `manifest.config.js`: source Manifest V3 configuration consumed by CRXJS.
- `src/popup/index.html` and `src/popup/index.js`: popup document and composition root.
- `src/popup/components/`: popup-owned Lit components.
- `src/content/isolated/index.js`: ISOLATED-world composition root.
- `src/content/isolated/bridge.js`: validated popup/runtime/window message routing.
- `src/content/main/index.js`: MAIN-world composition root and feature wiring.
- `src/content/main/features/`: MAIN-owned feature slices, including workflow logic, Lit dialogs, styles, and colocated tests.
- `src/content/main/components/`: reusable MAIN-world UI components shared by multiple MAIN features.
- `src/content/main/styles/`: reusable MAIN-world Lit style foundations.
- `src/content/main/infrastructure/`: MAIN-wide transport, operation coordination, storage bridging, IndexedDB, diagnostics, and execution-history infrastructure.
- `src/shared/`: cross-runtime contracts and genuinely shared primitives, including the message protocol, logger, and extension-wide UI design tokens.
- `docs/design-foundations.md`: design-system guidance and shared UI conventions.
- `scripts/check-build-output.js`: production bundle-shape and regression-budget checker.
- `package.json` and `package-lock.json`: pinned npm dependencies and commands.
- `vite.config.mjs`: CRXJS/Vite build configuration.
- `.github/workflows/ci.yml`: pull-request validation and `master` distribution synchronization.
- `dist/`: committed generated extension distribution. Chrome loads `dist/manifest.json`; never edit generated files manually.

## Development Commands

Use Node.js 22 as pinned by `.nvmrc`.

```bash
npm ci
npm run dev
npm run lint
npm test
npm run build
npm run check:build-output
```

`npm run dev` builds in watch mode. `npm test` and `npm run test:ci` run the colocated Node.js test suite. `npm run build` creates the production extension in `dist/`, and `npm run check:build-output` validates its generated shape and regression budgets.

For manual browser validation, load `dist/` with Chrome's **Load unpacked** action. Rebuild and reload the extension card before testing changed workflows.

## Build And Generated Files

- Source files are authoritative. Never hand-edit files under `dist/`.
- Pull requests are validated with `npm ci`, linting, `npm run test:ci`, a production build, and the build-output check.
- PR authors do not need to commit regenerated `dist/` output.
- After a successful source change reaches `master`, CI rebuilds and synchronizes `dist/` only when generated output changed.
- Runtime libraries are npm dependencies imported from source and bundled by Vite. Do not add copied/minified vendor files as an alternative dependency mechanism.
- Preserve the standalone MAIN and ISOLATED content-script bundles and `document_start` behavior unless a task intentionally changes that runtime contract.

## Architecture And Coding Guidelines

- Put code in the runtime that owns it. Do not move MAIN-only or popup-only helpers into `src/shared/` merely for convenience.
- Do not make one feature import another feature implementation as a utility library. Promote a primitive only when there is a real shared owner, and choose the narrowest appropriate one.
- Keep runtime composition roots readable. They should wire dependencies and route commands rather than accumulate feature-domain behavior.
- Keep feature/network/persistence logic outside UI components when a feature or infrastructure boundary already owns it. Components primarily own presentation and interaction state.
- Use Lit as the standard implementation for Web Components. Prefer reactive properties/state, declarative `html` templates, and Lit lifecycle/update APIs over manual DOM synchronization.
- Preserve custom-element public contracts during refactors unless the task explicitly changes them.
- Choose Shadow DOM or light DOM according to the existing integration contract. Do not switch encapsulation casually.
- Use shared UI design tokens from `src/shared/ui-design-tokens.js`. Reusable MAIN visual foundations belong under `src/content/main/styles/`; reusable MAIN components belong under `src/content/main/components/`; feature-specific styles stay beside their component as Lit `css` modules.
- Follow `docs/design-foundations.md` when introducing or changing shared UI patterns.
- Avoid broad permissions in `manifest.config.js`; add only the minimum Chrome permissions required.
- Keep comments sparse and useful, especially around non-obvious browser-extension, lifecycle, build, or WebSocket behavior.

## Testing Conventions

- Keep tests beside the primary source module they exercise and name them in kebab-case with the `.test.js` suffix.
- Prefer behavioral and contract tests over implementation-shape tests.
- Test observable message validation/routing, public component behavior, workflow results, retries, persistence contracts, and boundary error handling.
- Do not assert source files as strings, import text, or directory layout merely to freeze architecture. ESLint owns static import restrictions; `scripts/check-build-output.js` owns generated artifact shape and bundle budgets.
- Component tests should cover important reactive state, user events, cleanup, and public integration contracts where practical in the Node.js test environment. Note behavior that requires manual Chrome validation.
- Messaging changes should verify that popup, ISOLATED, and MAIN boundaries accept only supported contracts and minimal metadata.
- Batch/automation changes should preserve safe partial results, retry/cancellation semantics, and execution-history behavior where applicable.

## Validation Expectations

GitHub Actions is the authoritative validation environment for repository changes. Before considering a change complete, expect lint, tests, production build, and build-output validation to pass.

For manifest or runtime-entry changes, additionally verify the standalone `document_start` content-script behavior. For UI changes, manually inspect the affected popup or in-page workflow when browser-only behavior cannot be covered by Node tests.

## Safety And Data Handling

- Diagnostic artifacts, recordings, execution history, reports, and exports are local, full-fidelity records. Do not add redaction or content-based truncation to them.
- Keep console logging concise even though persisted and exported diagnostic artifacts retain complete values.
- Keep cross-world `window.postMessage` traffic minimal and validate incoming message shapes before acting.
- Preserve current throttling behavior in scraping and batch-operation loops unless there is a clear reason to adjust it.
- Do not commit generated export or recording files unless the user explicitly requests it and confirms the data is safe to include.
