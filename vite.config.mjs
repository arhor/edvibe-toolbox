import path from 'node:path'
import { crx } from '@crxjs/vite-plugin';
import { defineConfig, withFilter } from 'vite';
import swc from '@rollup/plugin-swc';
import manifest from './manifest.config.mjs';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        crx({
            manifest,
            contentScripts: {
                standaloneFiles: manifest.content_scripts.flatMap((it) => it.js ?? []),
            },
        }),
        withFilter(
            swc({
                swc: {
                    jsc: {
                        parser: {
                            decorators: true,
                            decoratorsBeforeExport: true
                        },
                        transform: {
                            decoratorVersion: '2023-11'
                        },
                    },
                },
            }),
            {
                transform: {
                    code: '@'
                }
            },
        ),
    ],
    server: {
        cors: {
            origin: [
                /chrome-extension:\/\//,
            ],
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        minify: 'oxc'
    }
});
