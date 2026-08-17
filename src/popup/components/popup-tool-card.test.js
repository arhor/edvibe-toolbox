import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { PopupToolCard } from '#src/popup/components/popup-tool-card.js';
import { getToolDefinition } from '#src/popup/popup-model.js';

class TestPopupToolCard extends PopupToolCard {
    scheduleUpdate() {
        return Promise.resolve();
    }
}

function createCard(toolId, state = {}) {
    const card = new TestPopupToolCard();
    card.tool = getToolDefinition(toolId);
    card.pageContext = state.pageContext || { type: 'marathon' };
    card.exportInProgress = state.exportInProgress || false;
    card.pendingToolId = state.pendingToolId || null;
    return card;
}

describe('PopupToolCard', () => {
    test('derives unavailable state and prevents activation', () => {
        // Given
        const card = createCard('marathon-export', {
            pageContext: { type: 'edvibe' }
        });
        let activationCount = 0;
        card.addEventListener('popup-tool-activate', () => {
            activationCount += 1;
        });

        // When
        card.activate();

        // Then
        assert.deepEqual(
            {
                disabled: card.toolViewModel.disabled,
                reason: card.toolViewModel.reason,
                busy: card.toolViewModel.busy
            },
            {
                disabled: true,
                reason: 'Откройте страницу марафона.',
                busy: false
            }
        );
        assert.equal(activationCount, 0);
    });

    test('derives busy and blocked operation states', () => {
        // Given
        const exportCard = createCard('marathon-export', { exportInProgress: true });
        const historyCard = createCard('execution-history', { exportInProgress: true });
        const pendingHistoryCard = createCard('execution-history', {
            pendingToolId: 'execution-history'
        });

        // Then
        assert.deepEqual(
            {
                disabled: exportCard.toolViewModel.disabled,
                reason: exportCard.toolViewModel.reason,
                busy: exportCard.toolViewModel.busy
            },
            { disabled: true, reason: '', busy: true }
        );
        assert.deepEqual(
            {
                disabled: historyCard.toolViewModel.disabled,
                reason: historyCard.toolViewModel.reason,
                busy: historyCard.toolViewModel.busy
            },
            {
                disabled: true,
                reason: 'Дождитесь завершения другого инструмента.',
                busy: false
            }
        );
        assert.deepEqual(
            {
                disabled: pendingHistoryCard.toolViewModel.disabled,
                reason: pendingHistoryCard.toolViewModel.reason,
                busy: pendingHistoryCard.toolViewModel.busy
            },
            { disabled: true, reason: '', busy: true }
        );
    });

    test('emits the activation event for an available idle tool', () => {
        // Given
        const card = createCard('execution-history');
        let detail;
        card.addEventListener('popup-tool-activate', (event) => {
            detail = event.detail;
        });

        // When
        card.activate();

        // Then
        assert.deepEqual(detail, { toolId: 'execution-history' });
    });
});
