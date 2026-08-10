import { readFileSync } from 'node:fs';
import { crx } from '@crxjs/vite-plugin';
import { defineConfig, withFilter } from 'vite';
import swc from '@rollup/plugin-swc'

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
            contentScripts: { standaloneFiles },
        }),
        withFilter(
            swc({
                swc: {
                    jsc: {
                        parser: { decorators: true, decoratorsBeforeExport: true },
                        transform: { decoratorVersion: '2023-11' },
                    },
                },
            }),
            { transform: { code: '@' } },
        ),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'oxc'
    }
});