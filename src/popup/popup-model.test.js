import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    TOOL_GROUPS,
    getPageContextContent,
    getToolDefinition,
    getToolViewModel,
    resolvePageContext
} from '#src/popup/popup-model.js';

describe('resolvePageContext', () => {
    test('identifies supported Edvibe contexts', () => {
        // Given
        const marathonTab = { id: 12, url: 'https://app.edvibe.com/marathon/456/lessons' };
        const edvibeTab = { id: 13, url: 'https://edvibe.com/profile' };

        // When
        const marathonContext = resolvePageContext(marathonTab);
        const edvibeContext = resolvePageContext(edvibeTab);

        // Then
        assert.deepEqual(
            marathonContext,
            { type: 'marathon', marathonId: '456', tabId: 12 }
        );
        assert.deepEqual(edvibeContext, { type: 'edvibe', tabId: 13 });
    });

    test('rejects unavailable and unsupported tabs', () => {
        // Given
        const tabs = [
            null,
            { id: 1 },
            { id: 2, url: 'not a URL' },
            { id: 3, url: 'https://not-edvibe.com/marathon/456' }
        ];

        // When
        const contexts = tabs.map(resolvePageContext);

        // Then
        assert.deepEqual(contexts, [
            { type: 'unavailable' },
            { type: 'unavailable' },
            { type: 'unsupported', tabId: 2 },
            { type: 'unsupported', tabId: 3 }
        ]);
    });
});

describe('getPageContextContent', () => {
    test('describes loading and marathon contexts', () => {
        // Given
        const loadingContext = { type: 'loading' };
        const marathonContext = { type: 'marathon', marathonId: '42' };

        // When
        const loadingContent = getPageContextContent(loadingContext);
        const marathonContent = getPageContextContent(marathonContext);

        // Then
        assert.deepEqual(loadingContent, {
            title: 'Проверяем страницу…',
            description: 'Определяем доступные инструменты'
        });
        assert.deepEqual(marathonContent, {
            title: 'Марафон #42',
            description: 'Инструменты марафона доступны'
        });
    });
});

describe('getToolViewModel', () => {
    test('derives availability, pending, and export states', () => {
        // Given
        const exportTool = getToolDefinition('marathon-export');
        const historyTool = getToolDefinition('execution-history');
        const unavailableState = {
            pageContext: { type: 'edvibe' },
            exportInProgress: false,
            pendingToolId: null
        };
        const exportingState = {
            pageContext: { type: 'marathon' },
            exportInProgress: true,
            pendingToolId: null
        };
        const pendingState = {
            pageContext: { type: 'marathon' },
            exportInProgress: false,
            pendingToolId: historyTool.id
        };

        // When
        const unavailableExport = getToolViewModel(exportTool, unavailableState);
        const activeExport = getToolViewModel(exportTool, {
            ...exportingState
        });
        const blockedHistory = getToolViewModel(historyTool, exportingState);
        const pendingHistory = getToolViewModel(historyTool, pendingState);

        // Then
        assert.deepEqual(unavailableExport, {
            ...exportTool,
            disabled: true,
            reason: 'Откройте страницу марафона.',
            busy: false
        });
        assert.deepEqual(
            { disabled: activeExport.disabled, busy: activeExport.busy, reason: activeExport.reason },
            { disabled: true, busy: true, reason: '' }
        );
        assert.equal(blockedHistory.disabled, true);
        assert.equal(blockedHistory.busy, false);
        assert.equal(blockedHistory.reason, 'Дождитесь завершения другого инструмента.');
        assert.equal(pendingHistory.disabled, true);
        assert.equal(pendingHistory.busy, true);
        assert.equal(pendingHistory.reason, '');
    });
});

describe('tool definitions', () => {
    test('keeps groups ordered and resolves nested tools by id', () => {
        // Given
        const expectedGroupIds = ['history', 'export', 'management', 'development'];

        // When
        const groupIds = TOOL_GROUPS.map(({ id }) => id);
        const lessonResetTool = getToolDefinition('lesson-reset');
        const unknownTool = getToolDefinition('unknown-tool');

        // Then
        assert.deepEqual(groupIds, expectedGroupIds);
        assert.equal(lessonResetTool?.title, 'Сброс прогресса учеников');
        assert.equal(unknownTool, undefined);
    });
});
