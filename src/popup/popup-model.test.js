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
    test('should identify supported Edvibe contexts', () => {
        // Given
        const marathonTab = { id: 12, url: 'https://app.edvibe.com/marathon/456/lessons' };
        const edvibeTab = { id: 13, url: 'https://edvibe.com/profile' };

        // When
        const marathonContext = resolvePageContext(marathonTab);
        const edvibeContext = resolvePageContext(edvibeTab);

        // Then
        assert.deepEqual(marathonContext, { type: 'marathon', marathonId: '456', tabId: 12 });
        assert.deepEqual(edvibeContext, { type: 'edvibe', tabId: 13 });
    });

    test('should reject unavailable and unsupported tabs', () => {
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
    test('should describe loading and marathon contexts', () => {
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
    const cases = [
        {
            toolId: 'marathon-export',
            outcome: 'disabled as unavailable',
            condition: 'outside a marathon',
            state: {
                pageContext: { type: 'edvibe' },
                exportInProgress: false,
                pendingToolId: null
            },
            expected: {
                disabled: true,
                busy: false,
                reason: 'Откройте страницу марафона.'
            }
        },
        {
            toolId: 'marathon-export',
            outcome: 'disabled and busy',
            condition: 'export is in progress',
            state: {
                pageContext: { type: 'marathon' },
                exportInProgress: true,
                pendingToolId: null
            },
            expected: {
                disabled: true,
                busy: true,
                reason: ''
            }
        },
        {
            toolId: 'execution-history',
            outcome: 'disabled but not busy',
            condition: 'export is in progress',
            state: {
                pageContext: { type: 'marathon' },
                exportInProgress: true,
                pendingToolId: null
            },
            expected: {
                disabled: true,
                busy: false,
                reason: 'Дождитесь завершения другого инструмента.'
            }
        },
        {
            toolId: 'execution-history',
            outcome: 'disabled and busy',
            condition: 'it is pending',
            state: {
                pageContext: { type: 'marathon' },
                exportInProgress: false,
                pendingToolId: 'execution-history'
            },
            expected: {
                disabled: true,
                busy: true,
                reason: '',
            }
        }
    ];

    cases.forEach(({ toolId, outcome, condition, state, expected }) => {
        test(`getToolViewModel should derive ${toolId} as ${outcome} when ${condition}`, () => {
            // Given
            const tool = getToolDefinition(toolId);

            // When
            const viewModel = getToolViewModel(tool, state);

            // Then
            assert.deepEqual(
                { disabled: viewModel.disabled, busy: viewModel.busy, reason: viewModel.reason },
                expected
            );
        });
    });
});

describe('getToolDefinition', () => {
    // Given
    const cases =
        TOOL_GROUPS
            .flatMap((group) => group.tools)
            .map((tool) => ({ toolId: tool.id, expectedTitle: tool.title }))
            .concat([{ toolId: 'unknown-tool', expectedTitle: undefined }]);

    cases.forEach(({ toolId, expectedTitle }) => {
        test(`should resolve ${toolId} tool definition`, () => {
            // When
            const tool = getToolDefinition(toolId);

            // Then
            assert.equal(tool?.title, expectedTitle);
        });
    });
});
