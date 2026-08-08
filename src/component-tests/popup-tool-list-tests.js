import '../components/popup-tool-list.js';
import {
    cleanup,
    click,
    elementUpdated,
    equal,
    fixture,
    keydown
} from './component-test-harness.js';

export async function runPopupToolListTests() {
    const executed = [];
    const card = await fixture('<popup-tool-card></popup-tool-card>');
    card.configure({
        tool: {
            id: 'danger-tool',
            title: 'Danger tool',
            description: 'Careful now',
            busyLabel: 'Working…',
            appearance: 'danger'
        },
        reason: 'Requires a marathon page',
        busy: true,
        onExecute: (toolId) => executed.push(toolId)
    });
    await elementUpdated(card);

    equal(card.querySelector('.tool-title').textContent, 'Danger tool');
    equal(card.querySelector('.tool-description').textContent, 'Careful now');
    equal(card.querySelector('.tool-requirement').hidden, false);
    equal(card.querySelector('.tool-requirement').textContent, 'Requires a marathon page');
    equal(card.querySelector('.tool-busy').hidden, false);
    equal(card.querySelector('.tool-busy').textContent, 'Working…');
    equal(card.dataset.toolId, 'danger-tool');
    equal(card.dataset.disabled, 'false');
    equal(card.getAttribute('aria-disabled'), 'false');
    equal(card.tabIndex, 0);
    equal(card.classList.contains('is-danger'), true);

    click(card);
    keydown(card, 'Enter');
    keydown(card, ' ');
    equal(executed.length, 3, 'Click, Enter, and Space should activate an enabled card.');
    equal(executed.every((toolId) => toolId === 'danger-tool'), true);

    card.configure({
        tool: {
            id: 'danger-tool',
            title: 'Danger tool',
            description: 'Careful now',
            busyLabel: 'Working…',
            appearance: 'danger'
        },
        disabled: true,
        onExecute: (toolId) => executed.push(toolId)
    });
    await elementUpdated(card);
    equal(card.dataset.disabled, 'true');
    equal(card.getAttribute('aria-disabled'), 'true');
    equal(card.tabIndex, -1);
    equal(card.querySelector('.tool-requirement').hidden, true);
    equal(card.querySelector('.tool-busy').hidden, true);
    click(card);
    keydown(card, 'Enter');
    equal(executed.length, 3, 'Disabled cards should not execute.');

    await cleanup();

    const groupExecutions = [];
    const group = await fixture('<popup-tool-group></popup-tool-group>');
    group.configure({
        title: 'Management',
        tools: [
            {id: 'first', title: 'First', description: 'One'},
            {id: 'second', title: 'Second', description: 'Two'}
        ],
        getState: (tool) => ({
            disabled: tool.id === 'second',
            reason: tool.id === 'second' ? 'Unavailable here' : ''
        }),
        onExecute: (toolId) => groupExecutions.push(toolId)
    });
    await elementUpdated(group);
    const cards = [...group.querySelectorAll('popup-tool-card')];
    await Promise.all(cards.map((element) => elementUpdated(element)));

    equal(group.querySelector('.tool-group-title').textContent, 'Management');
    equal(cards.length, 2);
    equal(cards[0].querySelector('.tool-title').textContent, 'First');
    equal(cards[1].dataset.disabled, 'true');
    equal(cards[1].querySelector('.tool-requirement').textContent, 'Unavailable here');
    click(cards[0]);
    click(cards[1]);
    equal(JSON.stringify(groupExecutions), JSON.stringify(['first']));

    await cleanup();
}
