import { LitElement, html, nothing } from 'lit';
import { componentFoundationStyles, dialogFoundationStyles } from './styles/foundations.js';
import { batchUserOnboardingDialogStyles } from './batch-user-onboarding-dialog.styles.js';

const BATCH_USER_ONBOARDING_DIALOG_TAG = 'edvibe-toolbox-batch-user-onboarding-dialog';

class BatchUserOnboardingDialog extends LitElement {
    static styles = [componentFoundationStyles, dialogFoundationStyles, batchUserOnboardingDialogStyles];

    static properties = {
        options: {state: true},
        rows: {state: true},
        plan: {state: true},
        mode: {state: true},
        executionId: {state: true},
        emailInput: {state: true},
        targetModeratorId: {state: true},
        emailCounts: {state: true},
        errors: {state: true},
        report: {state: true},
        statusMessage: {state: true},
        progress: {state: true}
    };

    constructor() {
        super();
        this.options = null;
        this.rows = [];
        this.plan = null;
        this.mode = 'loading';
        this.executionId = null;
        this.emailInput = '';
        this.targetModeratorId = '';
        this.emailCounts = {valid: 0, invalid: 0};
        this.errors = [];
        this.report = '';
        this.statusMessage = '';
        this.progress = {visible: false, completed: 0, total: 1};
        this.handleKeydownBound = (event) => {
            if (event.key === 'Escape') this.close();
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.ownerDocument?.addEventListener('keydown', this.handleKeydownBound);
    }

    disconnectedCallback() {
        this.ownerDocument?.removeEventListener('keydown', this.handleKeydownBound);
        super.disconnectedCallback();
    }

    configure(options = {}) {
        this.options = options && typeof options === 'object' ? options : {};
        return this;
    }

    showLoading(message = 'Загрузка…') {
        this.mode = 'loading';
        this.showStatus(message);
        return this;
    }

    showConfigure() {
        this.mode = 'configure';
        this.plan = null;
        this.executionId = null;
        this.clearErrors();
        this.report = '';
        this.progress = {visible: false, completed: 0, total: 1};
        this.showStatus('Введите email пользователей и проверьте список.');
        this.updateEmailCounts();
        return this;
    }

    updateEmailCounts() {
        if (!this.options?.parseEmailInput) return;
        const parsed = this.options.parseEmailInput(this.emailInput);
        this.emailCounts = {
            valid: parsed.entries?.length || 0,
            invalid: parsed.malformed?.length || 0
        };
    }

    async discover() {
        if (!this.options?.onDiscover || this.mode === 'executing') return;
        this.clearErrors();
        this.mode = 'loading';
        this.showStatus('Проверяем пользователей…');
        try {
            const discovered = await this.options.onDiscover({emailInput: this.emailInput});
            this.rows = discovered.map((row) => ({...row, addSelected: false, assignSelected: false}));
            this.plan = null;
            this.mode = 'review';
            this.showStatus('Проверьте найденные состояния и выберите операции.');
        } catch (error) {
            this.showError(error);
            this.mode = 'configure';
        }
    }

    canAssign(row) {
        if (!row.actionable || !row.moderatorStateSafe) return false;
        if (row.membership === 'in_marathon') return true;
        return row.membership === 'not_in_marathon' && Boolean(row.addSelected);
    }

    setRowSelection(normalizedEmail, field, checked) {
        if (this.mode !== 'review') return;
        this.rows = this.rows.map((row) => {
            if (row.normalizedEmail !== normalizedEmail) return row;
            const next = {...row, [field]: Boolean(checked)};
            if (field === 'addSelected' && !checked && row.membership === 'not_in_marathon') {
                next.assignSelected = false;
            }
            return next;
        });
        this.plan = null;
    }

    selectAll(field) {
        if (this.mode !== 'review') return;
        this.rows = this.rows.map((row) => {
            if (field === 'addSelected' && row.actionable) return {...row, addSelected: true};
            if (field === 'assignSelected' && this.canAssign(row)) return {...row, assignSelected: true};
            return row;
        });
        this.plan = null;
    }

    async preparePlan() {
        if (!this.options?.onPreflight || this.mode !== 'review') return;
        this.clearErrors();
        try {
            this.plan = await this.options.onPreflight({
                rows: this.rows.map((row) => ({
                    normalizedEmail: row.normalizedEmail,
                    addSelected: Boolean(row.addSelected),
                    assignSelected: Boolean(row.assignSelected)
                })),
                targetModeratorId: this.targetModeratorId
            });
            this.mode = 'preflight';
            this.showStatus('План зафиксирован. Проверьте его и подтвердите выполнение.');
        } catch (error) {
            this.showError(error);
        }
    }

    returnToReview() {
        if (this.mode !== 'preflight') return;
        this.plan = null;
        this.mode = 'review';
        this.showStatus('Измените выбор и подготовьте новый план.');
    }

    async execute() {
        if (!this.plan || !this.options?.onExecute || this.mode !== 'preflight') return;
        this.mode = 'executing';
        this.showStatus('Выполняем подтверждённый план…');
        this.progress = {visible: true, completed: 0, total: 1};
        try {
            const result = await this.options.onExecute(this.plan, (progress) => this.showProgress(progress));
            this.report = result.report || '';
            this.executionId = result.history?.stored ? result.history.record?.id || null : null;
            this.mode = result.fatalError ? 'partial-complete' : 'complete';
            const historyMessage = result.history?.stored
                ? ' Результат сохранён в истории.'
                : result.history?.persistenceError
                    ? ' Видимый отчёт сохранён, но историю записать не удалось.'
                    : '';
            this.showStatus(`${result.fatalError
                ? 'Операция прервана, частичные результаты сохранены.'
                : 'Обработка завершена.'}${historyMessage}`);
        } catch (error) {
            this.mode = 'partial-complete';
            this.showError(error);
        } finally {
            this.progress = {...this.progress, visible: false};
        }
    }

    showProgress(progress = {}) {
        const completed = Math.max(0, Number(progress.completed) || 0);
        const total = Math.max(0, Number(progress.total) || 0);
        this.progress = {visible: true, completed: Math.min(completed, Math.max(total, 1)), total: Math.max(total, 1)};
        const current = progress.current?.operation
            ? ` Сейчас: ${progress.current.email ? `${progress.current.email}, ` : ''}${progress.current.operation}.`
            : '';
        this.showStatus(`Готово операций: ${completed}/${total}. Успешных/no-op: ${progress.successes || 0}. Проблем: ${progress.failures || 0}.${current}`);
    }

    restart() {
        if (this.mode === 'executing') return;
        this.rows = [];
        this.plan = null;
        this.executionId = null;
        this.emailInput = '';
        this.targetModeratorId = '';
        this.report = '';
        this.mode = 'configure';
        this.updateEmailCounts();
        this.showStatus('Введите следующую группу пользователей.');
    }

    close() {
        if (this.mode === 'executing' || this.mode === 'loading') return;
        this.options?.onClose?.();
    }

    clearErrors() {
        this.errors = [];
    }

    showError(error) {
        const message = error?.message || String(error || 'Неизвестная ошибка.');
        this.errors = [message];
        this.showStatus(message);
    }

    showStatus(message) {
        this.statusMessage = String(message || '');
    }

    membershipLabel(row) {
        return {
            in_marathon: 'В марафоне',
            resolvable_not_in_marathon: 'Можно добавить по email',
            ambiguous: 'Неоднозначно',
            invalid: 'Некорректный email'
        }[row.resolution] || row.resolution;
    }

    curatorLabel(row) {
        if (!row.moderatorStateSafe && row.membership === 'in_marathon') return 'Нельзя безопасно прочитать';
        return row.currentModerators?.length
            ? row.currentModerators.map((moderator) => moderator.name || moderator.email || `#${moderator.id}`).join(', ')
            : 'Нет';
    }

    renderRow(row) {
        return html`
            <tr data-email=${row.normalizedEmail}>
                <td><strong>${row.user?.name || row.email}</strong><small>${row.user?.name ? row.email : ''}</small></td>
                <td>${this.membershipLabel(row)}</td>
                <td class=${!row.moderatorStateSafe && row.membership === 'in_marathon' ? 'is-error' : ''}>${this.curatorLabel(row)}</td>
                <td><input class="add-selected" type="checkbox" .checked=${Boolean(row.addSelected)}
                    ?disabled=${this.mode !== 'review' || !row.actionable}
                    aria-label=${`Добавить ${row.email}`}
                    @change=${(event) => this.setRowSelection(row.normalizedEmail, 'addSelected', event.currentTarget.checked)}></td>
                <td><input class="assign-selected" type="checkbox" .checked=${Boolean(row.assignSelected)}
                    ?disabled=${this.mode !== 'review' || !this.canAssign(row)}
                    aria-label=${`Назначить куратора ${row.email}`}
                    @change=${(event) => this.setRowSelection(row.normalizedEmail, 'assignSelected', event.currentTarget.checked)}></td>
                <td class="row-status">${row.message || 'Готово к выбору.'}</td>
            </tr>`;
    }

    renderPreflight() {
        if (!this.plan) return nothing;
        return html`
            <section class="preflight" ?hidden=${!['preflight', 'executing'].includes(this.mode)}>
                <h3>Неизменяемый план</h3>
                <p>Строк: ${this.plan.counts.requested}. Добавлений: ${this.plan.counts.additions}. Назначений: ${this.plan.counts.assignments}. Предсказанных no-op: ${this.plan.counts.noOps}. Отклонённых операций: ${this.plan.counts.rejectedOperations}.</p>
                <ul>${this.plan.rows.map((row) => {
                    const pieces = [];
                    if (row.add) pieces.push(`add: ${row.add.status} (${row.add.code})`);
                    if (row.assign) pieces.push(`assign: ${row.assign.status} (${row.assign.code})`);
                    if (pieces.length === 0) pieces.push(row.message || row.resolution);
                    return html`<li>${row.email}: ${pieces.join('; ')}</li>`;
                })}</ul>
            </section>`;
    }

    render() {
        const reviewVisible = ['review', 'preflight', 'executing', 'complete', 'partial-complete'].includes(this.mode) && this.rows.length > 0;
        const completed = ['complete', 'partial-complete'].includes(this.mode);
        return html`
<div class="overlay" @click=${(event) => { if (event.target === event.currentTarget) this.close(); }}>
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="batch-user-onboarding-title">
                    <header class="header"><div><p class="eyebrow">Edvibe Toolbox</p><h2 id="batch-user-onboarding-title">Добавить пользователей и назначить куратора</h2><p class="description">Проверьте весь список, подготовьте неизменяемый план и только потом подтвердите запись.</p></div>
                        <button class="icon close" type="button" aria-label="Закрыть" ?disabled=${['loading', 'executing'].includes(this.mode)} @click=${() => this.close()}>×</button></header>
                    <main class="body">
                        <section class="configure">
                            <label class="field"><span>Email пользователей</span><textarea class="emails" rows="5" placeholder="user@example.com"
                                .value=${this.emailInput} ?disabled=${this.mode !== 'configure'}
                                @input=${(event) => { this.emailInput = event.currentTarget.value; this.updateEmailCounts(); }}></textarea></label>
                            <div class="email-state" aria-live="polite"><span class="valid-count">Уникальных email: ${this.emailCounts.valid}</span><span class="invalid-count">Некорректных: ${this.emailCounts.invalid}</span></div>
                            <label class="field curator-field"><span>Целевой куратор</span>
                                <select class="curator" .value=${this.targetModeratorId} ?disabled=${!['configure', 'review'].includes(this.mode)}
                                    @change=${(event) => { this.targetModeratorId = event.currentTarget.value; this.plan = null; }}>
                                    <option value="">Не выбран</option>
                                    ${(this.options?.moderators || []).map((moderator) => html`<option value=${String(moderator.id)}>${moderator.name ? `${moderator.name}${moderator.email ? ` · ${moderator.email}` : ''}` : moderator.email || `Moderator #${moderator.id}`}</option>`)}
                                </select><small>Нужен только для строк с операцией назначения.</small></label>
                        </section>
                        <section class="errors" aria-live="polite" ?hidden=${this.errors.length === 0}>${this.errors.map((error) => html`<p>${error}</p>`)}</section>
                        <section class="review" ?hidden=${!reviewVisible}><div class="review-toolbar"><strong class="review-count">${this.rows.length} строк</strong><span>Все операции по умолчанию выключены.</span></div>
                            <div class="table-wrap"><table><thead><tr><th>Пользователь</th><th>Статус</th><th>Текущие кураторы</th><th>Добавить<button class="select-all-add" type="button" ?disabled=${this.mode !== 'review'} @click=${() => this.selectAll('addSelected')}>Выбрать все</button></th><th>Назначить<button class="select-all-assign" type="button" ?disabled=${this.mode !== 'review'} @click=${() => this.selectAll('assignSelected')}>Выбрать все</button></th><th>Проверка / результат</th></tr></thead><tbody class="rows">${this.rows.map((row) => this.renderRow(row))}</tbody></table></div>
                        </section>
                        ${this.renderPreflight()}
                        <section class="result" ?hidden=${!completed}><label class="field"><span>Отчёт</span><textarea class="report" rows="12" readonly .value=${this.report}></textarea></label>
                            <div class="result-actions"><button class="copy secondary" type="button" @click=${() => this.options?.onCopy?.(this.report)}>Скопировать отчёт</button><button class="history secondary" type="button" ?hidden=${!this.executionId} @click=${() => this.executionId && this.options?.onOpenHistory?.(this.executionId)}>Открыть в истории</button></div></section>
                    </main>
                    <div class="live-region"><p class="status" role="status" aria-live="polite">${this.statusMessage}</p><progress class="progress" max=${this.progress.total} value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress></div>
                    <footer class="footer">
                        <button class="restart secondary" type="button" ?hidden=${!completed} @click=${this.restart}>Запустить другую группу</button>
                        <button class="edit secondary" type="button" ?hidden=${this.mode !== 'preflight'} @click=${this.returnToReview}>Изменить выбор</button>
                        <button class="discover primary" type="button" ?hidden=${this.mode !== 'configure'} @click=${this.discover}>Проверить пользователей</button>
                        <button class="prepare primary" type="button" ?hidden=${this.mode !== 'review'} @click=${this.preparePlan}>Подготовить план</button>
                        <button class="execute primary" type="button" ?hidden=${this.mode !== 'preflight'} @click=${this.execute}>Подтвердить и выполнить</button>
                    </footer>
                </section>
            </div>`;
    }
}

if (!customElements.get(BATCH_USER_ONBOARDING_DIALOG_TAG)) {
    customElements.define(BATCH_USER_ONBOARDING_DIALOG_TAG, BatchUserOnboardingDialog);
}

const batchUserOnboardingDialogApi = Object.freeze({BATCH_USER_ONBOARDING_DIALOG_TAG, BatchUserOnboardingDialog});
globalThis.EdVibeBatchUserOnboardingDialog = batchUserOnboardingDialogApi;

export {BATCH_USER_ONBOARDING_DIALOG_TAG, BatchUserOnboardingDialog};
