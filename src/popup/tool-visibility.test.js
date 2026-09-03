import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getRelevantTools } from '#src/popup/tool-visibility.js';

const tools = [
    { id: 'edvibe', requirement: 'edvibe' },
    { id: 'marathon', requirement: 'marathon' },
    { id: 'telegram', requirement: 'telegram' }
];

function visibleIds(pageContext) {
    return getRelevantTools(tools, pageContext).map(({ id }) => id);
}

describe('popup tool visibility', () => {
    test('should show only Edvibe tools on Edvibe pages', () => {
        assert.deepEqual(visibleIds({ type: 'edvibe', tabId: 1 }), ['edvibe', 'marathon']);
        assert.deepEqual(
            visibleIds({ type: 'marathon', marathonId: '42', tabId: 1 }),
            ['edvibe', 'marathon']
        );
    });

    test('should show only Telegram tools on Telegram Web K', () => {
        assert.deepEqual(visibleIds({ type: 'telegram-web-k', tabId: 2 }), ['telegram']);
    });

    test('should show no tools when the current page is unsupported or unavailable', () => {
        assert.deepEqual(visibleIds({ type: 'unsupported', tabId: 3 }), []);
        assert.deepEqual(visibleIds({ type: 'unavailable' }), []);
        assert.deepEqual(visibleIds({ type: 'loading' }), []);
    });
});
