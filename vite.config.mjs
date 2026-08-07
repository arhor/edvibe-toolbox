import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';

const rootDirectory = fileURLToPath(new URL('.', import.meta.url));
const sourceManifest = JSON.parse(
    readFileSync(new URL('./manifest.json', import.meta.url), 'utf8')
);

const RAW_POPUP_SCRIPTS = Object.freeze([
    'popup.js',
    'src/components/popup-tool-list.js'
]);

function createBuildManifest(manifest = sourceManifest) {
    const buildManifest = structuredClone(manifest);
    const isolatedWorld = buildManifest.content_scripts?.find(
        (entry) => entry.world === 'ISOLATED'
    );

    if (!isolatedWorld) {
        throw new Error('The extension manifest must define an ISOLATED content script.');
    }

    const isolatedLoggerIndex = isolatedWorld.js?.indexOf('src/shared//logger.js') ?? -1;
    if (isolatedLoggerIndex < 0) {
        throw new Error('The ISOLATED logger cache-key path changed unexpectedly.');
    }

    isolatedWorld.js = [...isolatedWorld.js];
    isolatedWorld.js[isolatedLoggerIndex] = 'build/isolated-logger.js';
    return buildManifest;
}

const buildManifest = createBuildManifest();
const standaloneFiles = Object.freeze(
    buildManifest.content_scripts.flatMap(({ js = [] }) => js)
);
const watchedAssets = Object.freeze([
    ...new Set([
        ...standaloneFiles,
        ...RAW_POPUP_SCRIPTS,
        ...buildManifest.web_accessible_resources.flatMap(({ resources = [] }) => resources)
    ])
]);

function watchExtensionInputs() {
    return {
        name: 'edvibe:watch-extension-inputs',
        apply: 'build',
        buildStart() {
            for (const file of watchedAssets) {
                this.addWatchFile(resolve(rootDirectory, file));
            }
        }
    };
}

function preserveClassicPopupScripts() {
    return {
        name: 'edvibe:preserve-classic-popup-scripts',
        apply: 'build',
        generateBundle(_options, bundle) {
            for (const file of RAW_POPUP_SCRIPTS) {
                if (bundle[file]) continue;
                this.emitFile({
                    type: 'asset',
                    fileName: file,
                    source: readFileSync(resolve(rootDirectory, file), 'utf8')
                });
            }
        }
    };
}

export {
    RAW_POPUP_SCRIPTS,
    buildManifest,
    createBuildManifest,
    sourceManifest,
    standaloneFiles,
    watchedAssets
};

export default defineConfig({
    plugins: [
        watchExtensionInputs(),
        preserveClassicPopupScripts(),
        crx({
            manifest: buildManifest,
            contentScripts: { standaloneFiles }
        })
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: false
    }
});
