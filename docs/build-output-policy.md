# Production bundle output policy

Edvibe Toolbox uses CRXJS/Vite to build the Manifest V3 extension under `dist/`. Production output is intentionally minified with Vite's Oxc minifier (`build.minify: 'oxc'`). Keeping the setting explicit makes the policy visible and prevents an accidental return to the former unminified production bundle.

## Runtime bundle shape

CRXJS emits the MAIN-world and ISOLATED-world content scripts as standalone IIFEs. This is important for Manifest V3 `document_start` content-script behavior, especially the MAIN-world WebSocket interception path. The popup remains a separate module asset.

The current production shape is therefore intentionally three JavaScript outputs:

- one MAIN-world content-script bundle;
- one ISOLATED-world content-script bundle;
- one popup JavaScript asset.

Do not introduce dynamic imports or manual chunking merely to reduce the apparent size of the eager MAIN bundle. Any split must first demonstrate that it preserves content-script timing, CRXJS compatibility, and feature behavior.

## Decorator transpilation

Vite 8's default Oxc transformer does not lower stage-3 decorators (used by Lit's `@customElement`). `vite.config.mjs` runs `@rollup/plugin-swc` ahead of Oxc, scoped with `withFilter`/`code: '@'` so only files containing a decorator are transpiled. Oxc continues to minify the rest of the build; do not widen the SWC transform to the whole bundle.

## Reviewed baseline

After adding the scoped SWC decorator transform, the production build was measured with Vite 8.2.1 and Oxc minification:

- MAIN: about 449 kB;
- ISOLATED: about 6.7 kB;
- popup JavaScript: about 31.2 kB;
- total JavaScript: about 487 kB.

For comparison, the previously committed unminified MAIN bundle was about 662 kB. Two consecutive builds from the same source produced identical file hashes, which is sufficient for the existing deterministic `dist/` synchronization workflow.

The relatively large MAIN bundle is expected because the MAIN entry point is deliberately composed eagerly at `document_start`, and it contains the feature implementations plus package-managed runtime libraries needed in the page world. This is an intentional startup/timing tradeoff rather than an unexplained chunking accident.

## Regression checks

Run:

```bash
npm run build
npm run check:build-output
```

The output checker reads the generated manifest, discovers the MAIN and ISOLATED entry files, verifies the expected three-JavaScript-file shape, reports raw and gzip sizes, and applies generous regression ceilings. The limits are guardrails against accidental unminification, unexpected eager growth, or unreviewed chunk proliferation. They are not optimization targets.

When a legitimate architectural or product change needs to exceed a limit or change the bundle shape, review the generated output and update the policy intentionally instead of silently raising a number.
