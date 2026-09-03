import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    formatSendStatus,
    TelegramOwnedGroupsDialog
} from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-dialog.js';

function group(peerId, title, overrides = {}) {
    return Object.freeze({
        canSendText: true,
        kind: 'group',
        lastActivityAt: null,
        peerId,
        title,
        ...overrides
    });
}

function templateText(value) {
    if (value == null || value === false) {
        return '';
    }
    if (Array.isArray(value)) {
        return value.map(templateText).join('');
    }
    if (typeof value !== 'object' || !value.strings) {
        return String(value);
    }
    return value.strings.reduce((output, string, index) =>
        `${output}${string}${templateText(value.values[index])}`, '');
}

describe('Telegram owned-group send interaction', () => {
    test('should keep selection stable while the title filter changes', () => {
        const dialog = new TelegramOwnedGroupsDialog();
        dialog.groups = [
            group(-10, 'Alpha'),
            group(-20, 'Beta')
        ];
        dialog.startSelection('send');
        dialog.handleSelectionChange({ currentTarget: { checked: true } }, -10);

        dialog.handleFilterInput({ currentTarget: { value: 'beta' } });

        assert.deepEqual(dialog.selectedPeerIds, [-10]);
        assert.equal(dialog.filterQuery, 'beta');
    });

    test('should keep primary group actions rendered but disabled during selection', () => {
        const dialog = new TelegramOwnedGroupsDialog();
        dialog.groups = [group(-10, 'Alpha')];
        dialog.startSelection('send');

        const groupList = dialog.renderGroupList();
        const actions = groupList.values[0];

        assert.match(templateText(actions), /Отправить сообщение/);
        assert.match(templateText(actions), /Удалить группы/);
        assert.equal(actions.values[0], true);
        assert.equal(actions.values[2], true);
    });

    test('should require both selected groups and non-whitespace text before review', () => {
        const dialog = new TelegramOwnedGroupsDialog();
        dialog.groups = [group(-10, 'Alpha')];
        dialog.startSelection('send');

        dialog.messageDraft = 'Hello';
        dialog.requestSendConfirmation();
        assert.equal(dialog.actionStage, 'select');

        dialog.selectedPeerIds = [-10];
        dialog.messageDraft = '   ';
        dialog.requestSendConfirmation();
        assert.equal(dialog.actionStage, 'select');

        dialog.messageDraft = 'Hello';
        dialog.requestSendConfirmation();
        assert.equal(dialog.actionStage, 'confirm');
    });

    test('should cancel confirmation without sending and preserve the draft workflow', () => {
        let sendCalls = 0;
        const dialog = new TelegramOwnedGroupsDialog();
        dialog.configure({
            onSend() {
                sendCalls += 1;
            }
        });
        dialog.groups = [group(-10, 'Alpha')];
        dialog.startSelection('send');
        dialog.selectedPeerIds = [-10];
        dialog.messageDraft = 'Do not send yet';
        dialog.requestSendConfirmation();

        dialog.cancelConfirmation();

        assert.equal(sendCalls, 0);
        assert.equal(dialog.actionStage, 'select');
        assert.deepEqual(dialog.selectedPeerIds, [-10]);
        assert.equal(dialog.messageDraft, 'Do not send yet');
    });

    test('should render recipient identity and the exact message in the review surface', () => {
        const dialog = new TelegramOwnedGroupsDialog();
        dialog.groups = [
            group(-10, 'Same title'),
            group(-20, 'Same title', { kind: 'supergroup', canSendText: null })
        ];
        dialog.startSelection('send');
        dialog.selectedPeerIds = [-10, -20];
        dialog.messageDraft = '  First line\nSecond line  ';

        const markup = templateText(dialog.renderSendConfirmation());

        assert.match(markup, /Отправить сообщение в групп: 2/);
        assert.match(markup, /Same title/);
        assert.match(markup, /ID -10/);
        assert.match(markup, /ID -20/);
        assert.match(markup, /  First line\nSecond line  /);
        assert.match(markup, /неизвестной доступностью отправки/);
    });

    test('should pass the original text and explicit confirmation to the send workflow', async () => {
        const calls = [];
        const progress = {
            counts: { failed: 0, notAttempted: 0, pending: 0, sent: 1, total: 1 },
            results: [{ peerId: -10, status: 'sent', title: 'Alpha' }]
        };
        const dialog = new TelegramOwnedGroupsDialog();
        dialog.configure({
            async onSend(groups, text, options) {
                calls.push({ groups, text, confirmed: options.confirmed });
                options.onProgress(progress);
                return progress;
            }
        });
        dialog.groups = [group(-10, 'Alpha')];
        dialog.startSelection('send');
        dialog.selectedPeerIds = [-10];
        dialog.messageDraft = '  Keep my whitespace  ';
        dialog.requestSendConfirmation();

        await dialog.confirmSend();

        assert.equal(calls.length, 1);
        assert.deepEqual(calls[0].groups.map(({ peerId }) => peerId), [-10]);
        assert.equal(calls[0].text, '  Keep my whitespace  ');
        assert.equal(calls[0].confirmed, true);
        assert.equal(dialog.sendProgress, progress);
        assert.equal(dialog.actionStage, 'results');
        assert.deepEqual(dialog.selectedPeerIds, []);
    });

    test('should prevent groups with known send restrictions from being selectable for send', () => {
        const dialog = new TelegramOwnedGroupsDialog();
        const blocked = group(-10, 'Blocked', { canSendText: false });

        dialog.startSelection('send');
        assert.equal(dialog.isGroupSelectable(blocked), false);

        dialog.startSelection('delete');
        assert.equal(dialog.isGroupSelectable(blocked), true);
    });
});

test('formats Telegram send result states for progress and summary UI', () => {
    assert.equal(formatSendStatus('pending'), 'Ожидает');
    assert.equal(formatSendStatus('sending'), 'Отправляется…');
    assert.equal(formatSendStatus('sent'), 'Отправлено');
    assert.equal(formatSendStatus('failed'), 'Ошибка');
    assert.equal(formatSendStatus('not-attempted'), 'Не выполнено');
});
