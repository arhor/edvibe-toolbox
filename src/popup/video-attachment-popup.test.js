import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    getToolDefinition,
    getUnavailableReason,
    resolvePageContext
} from '#src/popup/popup-model.js';

describe('YouTube video attachment popup context', () => {
    test('is available from marathon pages and lesson editor pages inside a marathon', () => {
        const videoTool = getToolDefinition('youtube-video-attachment');
        const marathonContext = resolvePageContext({
            id: 16,
            url: 'https://edvibe.com/cabinet/school/marathons/marathon/90691/lessons'
        });
        const sectionContext = resolvePageContext({
            id: 17,
            url: 'https://edvibe.com/lesson-editor/marathon/90691/book/758267/lesson/12222154/section/94447165'
        });

        assert.equal(getUnavailableReason(videoTool, marathonContext), '');
        assert.equal(getUnavailableReason(videoTool, sectionContext), '');
    });

    test('is unavailable on Edvibe pages outside a marathon', () => {
        const videoTool = getToolDefinition('youtube-video-attachment');

        assert.equal(
            getUnavailableReason(videoTool, { type: 'edvibe' }),
            'Откройте страницу марафона.'
        );
    });
});
