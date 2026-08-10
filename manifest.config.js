import { defineManifest } from '@crxjs/vite-plugin';

export const ContentScripts = {
    ISOLATED: 'src/entrypoints/isolated.js',
    MAIN: 'src/entrypoints/main.js',
};

export default defineManifest({
    manifest_version: 3,
    name: 'Edvibe Toolbox',
    version: '1.0',
    description: 'A universal toolkit for automation and backup on the Edvibe platform.',
    permissions: [
        'storage',
        'activeTab'
    ],
    action: {
        default_popup: 'src/popup/index.html'
    },
    content_scripts: [
        {
            matches: ['*://*.edvibe.com/*'],
            js: [ContentScripts.ISOLATED],
            run_at: 'document_start',
            world: 'ISOLATED'
        },
        {
            matches: ['*://*.edvibe.com/*'],
            js: [ContentScripts.MAIN],
            run_at: 'document_start',
            world: 'MAIN'
        }
    ]
});
