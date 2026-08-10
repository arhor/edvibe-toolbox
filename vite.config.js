import path from 'node:path'
import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import manifest, { ContentScripts } from './manifest.config.js';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, 'src'),
        },
    },
    plugins: [
        crx({
            manifest,
            contentScripts: {
                standaloneFiles: Object.values(ContentScripts),
            },
        }),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'oxc',
    },
});
