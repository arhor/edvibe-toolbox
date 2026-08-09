import { readFileSync } from 'node:fs';
import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';

const sourceManifest = JSON.parse(
    readFileSync(new URL('./manifest.json', import.meta.url), 'utf8')
);

const standaloneFiles = Object.freeze(
    sourceManifest.content_scripts.flatMap(({ js = [] }) => js)
);

export { sourceManifest, standaloneFiles };

export default defineConfig({
    plugins: [
        crx({
            manifest: sourceManifest,
            contentScripts: { standaloneFiles }
        })
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'oxc'
    }
});