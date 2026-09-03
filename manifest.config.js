import { defineManifest } from '@crxjs/vite-plugin';

export const ContentScripts = {
    ISOLATED: 'src/content/isolated/index.js',
    MAIN: 'src/content/main/index.js',
};

export const ContentScriptMatches = [
    '*://*.edvibe.com/*',
    'https://web.telegram.org/k/*'
];

export default defineManifest({
    manifest_version: 3,
    name: 'Toolfox',
    version: '1.0',
    description: 'A browser toolkit for productivity and workflow automation.',
    permissions: [
        'storage',
        'activeTab'
    ],
    action: {
        default_popup: 'src/popup/index.html'
    },
    content_scripts: [
        {
            matches: ContentScriptMatches,
            js: [ContentScripts.ISOLATED],
            run_at: 'document_start',
            world: 'ISOLATED'
        },
        {
            matches: ContentScriptMatches,
            js: [ContentScripts.MAIN],
            run_at: 'document_start',
            world: 'MAIN'
        }
    ]
});
