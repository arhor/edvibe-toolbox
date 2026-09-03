import { LitElement, html, nothing } from 'lit';

import { reconcileDeletedOwnedGroups } from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-deletion.js';
import { telegramOwnedGroupsDialogStyles } from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-dialog.styles.js';
import {
    createOwnedTelegramGroupsView,
    getSelectedOwnedGroups,
    toggleOwnedGroupSelection
} from '#src/content/main/features/telegram-owned-groups/telegram-owned-groups-service.js';
import {
    componentFoundationStyles,
    dialogFoundationStyles
} from '#src/content/main/styles/foundations.js';
import {
    controlStyles,
    dialogShellStyles,
    fieldStyles,
    noticeStyles
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

function formatDeleteStatus(status) {
    switch (status) {
        case 'deleted': return 'Удалена';
        case 'deleting': return 'Удаляется…';
        case 'failed': return 'Ошибка';
        case 'not-attempted': return 'Не выполнено';
        default: return 'Ожидает';
    }
}

class TelegramOwnedGroupsDialog extends LitElement {
    static styles = [
        componentFoundationStyles,
        dialogFoundationStyles,
        dialogShellStyles,
        controlStyles,
        fieldStyles,
        noticeStyles,
        telegramOwnedGroupsDialogStyles
    ];

    static properties = {
        options: { state: true },
        groups: { state: true },
        viewState: { state: true },
        message: { state: true },
        filterQuery: { state: true },
        actionStage: { state: true },
        selectionAction: { state: true },
        selectedPeerIds: { state: true },
        deleteProgress: { state: true },
        operationError: { state: true }
    };

    constructor() {
        super();
        this.options = null;
        this.groups = [];
        this.viewState = 'loading';
        this.message = 'Загружаем группы текущего аккаунта…';
        this.filterQuery = '';
        this.actionStage = 'browse';
        this.selectionAction = null;
        this.selectedPeerIds = [];
        this.deleteProgress = null;
        this.operationError = '';
        this.loadPromise = null;
        this.handleKeydownBound = (event) => {
            if (event.key !== 'Escape') {
                return;
            }
            if (this.actionStage === 'running') {
                return;
            }
            if (this.actionStage === 'confirm') {
                this.cancelConfirmation();
                return;
            }
            if (this.actionStage === 'select') {
                this.cancelSelection();
                return;
            }
            if (this.actionStage === 'results') {
                this.finishDeleteResults();
                return;
            }
            this.close();
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

    resetActionState() {
        this.actionStage = 'browse';
        this.selectionAction = null;
        this.selectedPeerIds = [];
        this.deleteProgress = null;
        this.operationError = '';
    }

    async load() {
        if (!this.options?.onLoad || this.loadPromise) {
            return this.loadPromise;
        }

        this.viewState = 'loading';
        this.groups = [];
        this.message = 'Загружаем группы текущего аккаунта…';
        this.resetActionState();
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
        if (this.actionStage !== 'running') {
            this.options?.onClose?.();
        }
    }

    handleFilterInput(event) {
        this.filterQuery = event.currentTarget?.value || '';
    }

    startSelection(action) {
        this.selectionAction = action;
        this.selectedPeerIds = [];
        this.actionStage = 'select';
        this.deleteProgress = null;
        this.operationError = '';
    }

    cancelSelection() {
        this.resetActionState();
    }

    handleSelectionChange(event, peerId) {
        this.selectedPeerIds = toggleOwnedGroupSelection(
            this.selectedPeerIds,
            peerId,
            Boolean(event.currentTarget?.checked)
        );
    }

    requestDeleteConfirmation() {
        if (
            this.selectionAction !== 'delete'
            || getSelectedOwnedGroups(this.groups, this.selectedPeerIds).length === 0
        ) {
            return;
        }
        this.actionStage = 'confirm';
    }

    cancelConfirmation() {
        this.actionStage = 'select';
    }

    async confirmDelete() {
        const selectedGroups = getSelectedOwnedGroups(this.groups, this.selectedPeerIds);
        if (selectedGroups.length === 0 || typeof this.options?.onDelete !== 'function') {
            return;
        }

        this.actionStage = 'running';
        this.operationError = '';
        try {
            const result = await this.options.onDelete(selectedGroups, {
                confirmed: true,
                onProgress: (progress) => {
                    this.deleteProgress = progress;
                }
            });
            this.deleteProgress = result;
            this.groups = [...reconcileDeletedOwnedGroups(this.groups, result.results)];
        } catch (error) {
            this.operationError = error instanceof Error
                ? error.message
                : 'Не удалось выполнить удаление групп.';
        } finally {
            this.selectedPeerIds = [];
            this.actionStage = 'results';
        }
    }

    finishDeleteResults() {
        this.resetActionState();
        this.viewState = this.groups.length > 0 ? 'ready' : 'empty';
        if (this.viewState === 'empty') {
            this.message = 'У текущего аккаунта не найдено созданных им активных групп.';
        }
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

    renderGroup(group, { selectable = false } = {}) {
        const selected = this.selectedPeerIds.includes(group.peerId);
        return html`
            <li class="group-card ${selected ? 'is-selected' : ''}" data-peer-id=${String(group.peerId)}>
                ${selectable ? html`
                    <label class="selection-control">
                        <input
                            type="checkbox"
                            .checked=${selected}
                            aria-label=${`Выбрать ${group.title}`}
                            @change=${(event) => this.handleSelectionChange(event, group.peerId)}
                        >
                    </label>
                ` : nothing}
                <div class="group-body">
                    <div class="group-heading">
                        <strong>${group.title}</strong>
                        <span class="kind">${formatGroupKind(group.kind)}</span>
                    </div>
                    <div class="metadata">
                        <span>Последняя активность: ${formatActivity(group.lastActivityAt)}</span>
                        <span>${formatSendability(group.canSendText)}</span>
                    </div>
                </div>
            </li>
        `;
    }

    renderFilterToolbar(view) {
        const isFiltered = this.filterQuery.trim() !== '';
        const selectedCount = this.selectedPeerIds.length;
        const resultSummary = isFiltered
            ? `Показано: ${view.groups.length} из ${this.groups.length}`
            : `Найдено групп: ${this.groups.length}`;
        const summary = this.actionStage === 'select'
            ? `Выбрано: ${selectedCount} · ${resultSummary}`
            : resultSummary;

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
        `;
    }

    renderBrowseActions() {
        return html`
            <div class="group-actions" data-part="actions">
                <button
                    type="button"
                    data-control="danger"
                    @click=${() => this.startSelection('delete')}
                >Удалить группы</button>
            </div>
        `;
    }

    renderSelectionActions() {
        const selectedCount = this.selectedPeerIds.length;
        return html`
            <div class="selection-actions" data-part="actions">
                <button type="button" data-control="secondary" @click=${this.cancelSelection}>Отмена</button>
                <button
                    type="button"
                    data-control="danger"
                    ?disabled=${selectedCount === 0}
                    @click=${this.requestDeleteConfirmation}
                >Проверить удаление (${selectedCount})</button>
            </div>
        `;
    }

    renderDeleteConfirmation() {
        const selectedGroups = getSelectedOwnedGroups(this.groups, this.selectedPeerIds);
        return html`
            <div class="operation-panel confirmation-panel">
                <div data-notice="danger">
                    <strong>Необратимое действие.</strong>
                    Эти группы будут удалены для всех участников. Уже удалённую группу нельзя восстановить через Toolfox.
                </div>
                <div>
                    <h3>Удалить групп: ${selectedGroups.length}?</h3>
                    <p class="operation-copy">Проверьте список перед подтверждением.</p>
                </div>
                <ul class="review-list">
                    ${selectedGroups.map((group) => html`
                        <li>
                            <strong>${group.title}</strong>
                            <span>${formatGroupKind(group.kind)}</span>
                        </li>
                    `)}
                </ul>
                <div data-part="actions">
                    <button type="button" data-control="secondary" @click=${this.cancelConfirmation}>Назад</button>
                    <button type="button" data-control="danger" @click=${this.confirmDelete}>
                        Да, удалить ${selectedGroups.length}
                    </button>
                </div>
            </div>
        `;
    }

    renderDeleteResultItem(result) {
        const hasError = result.status === 'failed' || result.status === 'not-attempted';
        return html`
            <li class="result-card result-${result.status}">
                <div class="result-heading">
                    <strong>${result.title}</strong>
                    <span>${formatDeleteStatus(result.status)}</span>
                </div>
                ${hasError ? html`
                    <p class="result-error">
                        ${result.errorCode ? `${result.errorCode}: ` : ''}${result.errorMessage || 'Неизвестная ошибка.'}
                    </p>
                ` : nothing}
            </li>
        `;
    }

    renderDeleteProgress() {
        const progress = this.deleteProgress;
        const isRunning = this.actionStage === 'running';
        const counts = progress?.counts || {
            deleted: 0,
            failed: 0,
            notAttempted: 0,
            pending: 0,
            total: 0
        };
        const title = isRunning ? 'Удаляем группы…' : 'Удаление завершено';

        return html`
            <div class="operation-panel" aria-live="polite">
                <div>
                    <h3>${title}</h3>
                    <p class="operation-copy">
                        Удалено: ${counts.deleted} · Ошибок: ${counts.failed} · Не выполнено: ${counts.notAttempted} · Всего: ${counts.total}
                    </p>
                </div>
                ${this.operationError ? html`
                    <div data-notice="danger">${this.operationError}</div>
                ` : nothing}
                ${progress?.results?.length ? html`
                    <ul class="result-list">
                        ${progress.results.map((result) => this.renderDeleteResultItem(result))}
                    </ul>
                ` : nothing}
                ${!isRunning ? html`
                    <div data-part="actions">
                        <button type="button" data-control @click=${this.finishDeleteResults}>Вернуться к группам</button>
                    </div>
                ` : nothing}
            </div>
        `;
    }

    renderGroupList() {
        const view = createOwnedTelegramGroupsView(this.groups, this.filterQuery);
        const selecting = this.actionStage === 'select';
        return html`
            ${this.renderFilterToolbar(view)}
            ${view.state === 'filtered-empty' ? this.renderFilterEmptyState() : html`
                <ul class="group-list">
                    ${view.groups.map((group) => this.renderGroup(group, { selectable: selecting }))}
                </ul>
            `}
            ${selecting ? this.renderSelectionActions() : this.renderBrowseActions()}
        `;
    }

    renderReady() {
        if (this.actionStage === 'confirm') {
            return this.renderDeleteConfirmation();
        }
        if (this.actionStage === 'running' || this.actionStage === 'results') {
            return this.renderDeleteProgress();
        }
        return this.renderGroupList();
    }

    render() {
        const isReady = this.viewState === 'ready';
        const isRunning = this.actionStage === 'running';
        return html`
            <div class="overlay" data-part="overlay">
                <section class="dialog" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="telegram-groups-title">
                    <header class="dialog-header">
                        <div>
                            <p class="eyebrow">Toolfox · Telegram</p>
                            <h2 id="telegram-groups-title">Мои группы</h2>
                            <p class="header-copy">Только активные группы, создателем которых является текущий Telegram-аккаунт.</p>
                        </div>
                        <button
                            class="icon-button"
                            data-control="secondary"
                            type="button"
                            data-action="close"
                            aria-label="Закрыть"
                            ?disabled=${isRunning}
                            @click=${this.close}
                        >×</button>
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
    formatDeleteStatus,
    formatGroupKind,
    formatSendability
};
