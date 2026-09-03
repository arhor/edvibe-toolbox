import { LitElement, html, nothing } from 'lit';

import { telegramOwnedGroupsDialogStyles } from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-dialog.styles.js';
import { createOwnedTelegramGroupsView } from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-service.js';
import {
    componentFoundationStyles,
    dialogFoundationStyles
} from '#src/content/main/styles/foundations.js';
import {
    controlStyles,
    dialogShellStyles,
    fieldStyles
} from '#src/content/main/styles/primitives.js';

const TELEGRAM_OWNED_GROUPS_DIALOG_TAG = 'toolfox-telegram-owned-groups-dialog';

function formatActivity(value) {
    if (!value) {
        return 'нет данных';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return 'нет данных';
    }
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
}

function formatGroupKind(kind) {
    return kind === 'supergroup' ? 'Супергруппа' : 'Группа';
}

function formatSendability(canSendText) {
    if (canSendText === true) {
        return 'Можно отправлять сообщения';
    }
    if (canSendText === false) {
        return 'Отправка сообщений недоступна';
    }
    return 'Возможность отправки неизвестна';
}

class TelegramOwnedGroupsDialog extends LitElement {
    static styles = [
        componentFoundationStyles,
        dialogFoundationStyles,
        dialogShellStyles,
        controlStyles,
        fieldStyles,
        telegramOwnedGroupsDialogStyles
    ];

    static properties = {
        options: { state: true },
        groups: { state: true },
        viewState: { state: true },
        message: { state: true },
        filterQuery: { state: true }
    };

    constructor() {
        super();
        this.options = null;
        this.groups = [];
        this.viewState = 'loading';
        this.message = 'Загружаем группы текущего аккаунта…';
        this.filterQuery = '';
        this.loadPromise = null;
        this.handleKeydownBound = (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        };
    }

    configure(options = {}) {
        this.options = options && typeof options === 'object' ? options : {};
        if (this.isConnected) {
            void this.load();
        }
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        this.ownerDocument?.addEventListener('keydown', this.handleKeydownBound);
        void this.load();
    }

    disconnectedCallback() {
        this.ownerDocument?.removeEventListener('keydown', this.handleKeydownBound);
        super.disconnectedCallback();
    }

    async load() {
        if (!this.options?.onLoad || this.loadPromise) {
            return this.loadPromise;
        }

        this.viewState = 'loading';
        this.groups = [];
        this.message = 'Загружаем группы текущего аккаунта…';
        this.loadPromise = (async () => {
            try {
                const result = await this.options.onLoad();
                this.groups = [...(result?.groups || [])];
                this.viewState = result?.state || (this.groups.length > 0 ? 'ready' : 'empty');
                if (this.viewState === 'unsupported') {
                    this.message = 'Текущая версия Telegram Web K не предоставляет ожидаемый runtime-интерфейс.';
                } else if (this.viewState === 'empty') {
                    this.message = 'У текущего аккаунта не найдено созданных им активных групп.';
                } else {
                    this.message = '';
                }
            } catch (error) {
                this.groups = [];
                this.viewState = 'error';
                this.message = error instanceof Error
                    ? error.message
                    : 'Не удалось загрузить группы Telegram.';
            } finally {
                this.loadPromise = null;
            }
        })();

        await this.loadPromise;
        await this.updateComplete;
        this.shadowRoot?.querySelector('[data-action="close"]')?.focus();
    }

    retry() {
        void this.load();
    }

    close() {
        this.options?.onClose?.();
    }

    handleFilterInput(event) {
        this.filterQuery = event.currentTarget?.value || '';
    }

    renderState() {
        const isError = this.viewState === 'error';
        const canRetry = isError || this.viewState === 'unsupported';
        const title = this.viewState === 'loading'
            ? 'Загрузка…'
            : this.viewState === 'empty'
                ? 'Групп пока нет'
                : isError
                    ? 'Не удалось загрузить группы'
                    : 'Telegram Web K несовместим';

        return html`
            <div class="state-card ${isError ? 'is-error' : ''}" data-part="empty-state" aria-live="polite">
                <h3>${title}</h3>
                <p>${this.message}</p>
                ${canRetry ? html`
                    <button type="button" data-control @click=${this.retry}>Повторить</button>
                ` : nothing}
            </div>
        `;
    }

    renderFilterEmptyState() {
        return html`
            <div class="state-card filter-empty-state" data-part="filter-empty-state" aria-live="polite">
                <h3>Ничего не найдено</h3>
                <p>Измените фильтр, чтобы снова увидеть подходящие группы.</p>
            </div>
        `;
    }

    renderGroup(group) {
        return html`
            <li class="group-card" data-peer-id=${String(group.peerId)}>
                <div class="group-heading">
                    <strong>${group.title}</strong>
                    <span class="kind">${formatGroupKind(group.kind)}</span>
                </div>
                <div class="metadata">
                    <span>Последняя активность: ${formatActivity(group.lastActivityAt)}</span>
                    <span>${formatSendability(group.canSendText)}</span>
                </div>
            </li>
        `;
    }

    renderReady() {
        const view = createOwnedTelegramGroupsView(this.groups, this.filterQuery);
        const isFiltered = this.filterQuery.trim() !== '';
        const summary = isFiltered
            ? `Показано: ${view.groups.length} из ${this.groups.length}`
            : `Найдено групп: ${this.groups.length}`;

        return html`
            <div class="toolbar">
                <label data-field>
                    <span>Фильтр по названию</span>
                    <input
                        type="search"
                        placeholder="Начните вводить название…"
                        .value=${this.filterQuery}
                        @input=${this.handleFilterInput}
                    >
                </label>
                <p class="summary" aria-live="polite">${summary}</p>
            </div>
            ${view.state === 'filtered-empty' ? this.renderFilterEmptyState() : html`
                <ul class="group-list">
                    ${view.groups.map((group) => this.renderGroup(group))}
                </ul>
            `}
        `;
    }

    render() {
        const isReady = this.viewState === 'ready';
        return html`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="telegram-groups-title">
                    <header class="dialog-header">
                        <div>
                            <p class="eyebrow">Toolfox · Telegram</p>
                            <h2 id="telegram-groups-title">Мои группы</h2>
                            <p class="header-copy">Только активные группы, создателем которых является текущий Telegram-аккаунт.</p>
                        </div>
                        <button class="icon-button" data-control="secondary" type="button" data-action="close" aria-label="Закрыть" @click=${this.close}>×</button>
                    </header>
                    <div class="content">
                        ${isReady ? this.renderReady() : this.renderState()}
                    </div>
                </section>
            </div>
        `;
    }
}

customElements.define(TELEGRAM_OWNED_GROUPS_DIALOG_TAG, TelegramOwnedGroupsDialog);

export {
    TELEGRAM_OWNED_GROUPS_DIALOG_TAG,
    TelegramOwnedGroupsDialog,
    formatActivity,
    formatGroupKind,
    formatSendability
};
