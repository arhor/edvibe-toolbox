import { defineManifest } from '@crxjs/vite-plugin';

export const ContentScripts = {
    ISOLATED: 'src/content/isolated/index.js',
    MAIN: 'src/content/main/index.js',
    TELEGRAM_WEB_K_MAIN: 'src/content/main/telegram-web-k.js'
};

const EDVIBE_MATCHES = ['*://*.edvibe.com/*'];
const TELEGRAM_WEB_K_MATCHES = ['https://web.telegram.org/k/*'];

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
            matches: EDVIBE_MATCHES,
            js: [ContentScripts.ISOLATED],
            run_at: 'document_start',
            world: 'ISOLATED'
        },
        {
            matches: EDVIBE_MATCHES,
            js: [ContentScripts.MAIN],
            run_at: 'document_start',
            world: 'MAIN'
        },
        {
            matches: TELEGRAM_WEB_K_MATCHES,
            js: [ContentScripts.ISOLATED],
            run_at: 'document_start',
            world: 'ISOLATED'
        },
        {
            matches: TELEGRAM_WEB_K_MATCHES,
            js: [ContentScripts.TELEGRAM_WEB_K_MAIN],
            run_at: 'document_start',
            world: 'MAIN'
        }
    ]
});
