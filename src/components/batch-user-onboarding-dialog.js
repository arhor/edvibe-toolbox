(function initializeBatchUserOnboardingDialog(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.EdVibeBatchUserOnboardingDialog = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createModule(root) {
    'use strict';

    const BATCH_USER_ONBOARDING_DIALOG_TAG = 'edvibe-toolbox-batch-user-onboarding-dialog';
    const HTMLElementBase = root.HTMLElement || class {};
    const template = root.document?.createElement?.('template') || null;

    if (template) {
        template.innerHTML = `
            <link class="stylesheet" rel="stylesheet">
            <div class="overlay">
                <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="batch-user-onboarding-title">
                    <header class="header">
                        <div>
                            <p class="eyebrow">Edvibe Toolbox</p>
                            <h2 id="batch-user-onboarding-title">Добавить пользователей и назначить куратора</h2>
                            <p class="description">Проверьте весь список, подготовьте неизменяемый план и только потом подтвердите запись.</p>
                        </div>
                        <button class="icon close" type="button" aria-label="Закрыть">×</button>
                    </header>
                    <main class="body">
                        <section class="configure">
                            <label class="field">
                                <span>Email пользователей</span>
                                <textarea class="emails" rows="5" placeholder="user@example.com"></textarea>
                            </label>
                            <div class="email-state" aria-live="polite">
                                <span class="valid-count">Уникальных email: 0</span>
                                <span class="invalid-count">Некорректных: 0</span>
                            </div>
                            <label class="field curator-field">
                                <span>Целевой куратор</span>
                                <select class="curator"><option value="">Не выбран</option></select>
                                <small>Нужен только для строк с операцией назначения.</small>
                            </label>
                        </section>

                        <section class="errors" aria-live="polite" hidden></section>

                        <section class="review" hidden>
                            <div class="review-toolbar">
                                <strong class="review-count"></strong>
                                <span>Все операции по умолчанию выключены.</span>
                            </div>
                            <div class="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Пользователь</th>
                                            <th>Статус</th>
                                            <th>Текущие кураторы</th>
                                            <th>Добавить<button class="select-all-add" type="button">Выбрать все</button></th>
                                            <th>Назначить<button class="select-all-assign" type="button">Выбрать все</button></th>
                                            <th>Проверка / результат</th>
                                        </tr>
                                    </thead>
                                    <tbody class="rows"></tbody>
                                </table>
                            </div>
                        </section>

                        <section class="preflight" hidden></section>

                        <section class="result" hidden>
                            <label class="field"><span>Отчёт</span><textarea class="report" rows="12" readonly></textarea></label>
                            <div class="result-actions">
                                <button class="copy secondary" type="button">Скопировать отчёт</button>
                                <button class="history secondary" type="button" hidden>Открыть в истории</button>
                            </div>
                        </section>
                    </main>

                    <div class="live-region">
                        <p class="status" role="status" aria-live="polite"></p>
                        <progress class="progress" max="1" value="0" hidden></progress>
                    </div>

                    <footer class="footer">
                        <button class="restart secondary" type="button" hidden>Запустить другую группу</button>
                        <button class="edit secondary" type="button" hidden>Изменить выбор</button>
                        <button class="discover primary" type="button">Проверить пользователей</button>
                        <button class="prepare primary" type="button" hidden>Подготовить план</button>
                        <button class="execute primary" type="button" hidden>Подтвердить и выполнить</button>
                    </footer>
                </section>
            </div>`;
    }

    class BatchUserOnboardingDialog extends HTMLElementBase {
        constructor() {
            super();
            this.options = null;
            this.rows = [];
            this.plan = null;
            this.mode = 'loading';
            this.executionId = null;
            this.connection = null;
            this.elements = null;
            if (typeof this.attachShadow !== 'function' || !template) {
                return;
            }
            this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));
            this.cacheElements();
        }

        connectedCallback() {
            this.connectListeners();
            this.renderState();
        }

        disconnectedCallback() {
            this.connection?.abort();
            this.connection = null;
        }

        configure(options = {}) {
            this.options = options;
            this.elements?.stylesheet?.setAttribute('href', String(options.stylesheetUrl || ''));
            this.renderModerators();
            this.renderState();
            return this;
        }

        cacheElements() {
            const find = (selector) => this.shadowRoot.querySelector(selector);
            this.elements = {
                stylesheet: find('.stylesheet'),
                overlay: find('.overlay'),
                close: find('.close'),
                emails: find('.emails'),
                validCount: find('.valid-count'),
                invalidCount: find('.invalid-count'),
                curator: find('.curator'),
                errors: find('.errors'),
                review: find('.review'),
                reviewCount: find('.review-count'),
                rows: find('.rows'),
                selectAllAdd: find('.select-all-add'),
                selectAllAssign: find('.select-all-assign'),
                preflight: find('.preflight'),
                result: find('.result'),
                report: find('.report'),
                copy: find('.copy'),
                history: find('.history'),
                status: find('.status'),
                progress: find('.progress'),
                restart: find('.restart'),
                edit: find('.edit'),
                discover: find('.discover'),
                prepare: find('.prepare'),
                execute: find('.execute')
            };
        }

        connectListeners() {
            if (!this.elements || this.connection) {
                return;
            }
            this.connection = new AbortController();
            const signal = this.connection.signal;
            this.elements.emails.addEventListener('input', () => this.updateEmailCounts(), { signal });
            this.elements.discover.addEventListener('click', () => this.discover(), { signal });
            this.elements.prepare.addEventListener('click', () => this.preparePlan(), { signal });
            this.elements.execute.addEventListener('click', () => this.execute(), { signal });
            this.elements.edit.addEventListener('click', () => this.returnToReview(), { signal });
            this.elements.restart.addEventListener('click', () => this.restart(), { signal });
            this.elements.selectAllAdd.addEventListener('click', () => this.selectAll('addSelected'), { signal });
            this.elements.selectAllAssign.addEventListener('click', () => this.selectAll('assignSelected'), { signal });
            this.elements.rows.addEventListener('change', (event) => this.handleRowSelection(event), { signal });
            this.elements.copy.addEventListener('click', () => this.options?.onCopy?.(this.elements.report.value), { signal });
            this.elements.history.addEventListener('click', () => {
                if (this.executionId) this.options?.onOpenHistory?.(this.executionId);
            }, { signal });
            this.elements.close.addEventListener('click', () => this.close(), { signal });
            this.elements.overlay.addEventListener('click', (event) => {
                if (event.target === this.elements.overlay) this.close();
            }, { signal });
            this.ownerDocument?.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') this.close();
            }, { signal });
        }

        showLoading(message = 'Загрузка…') {
            this.mode = 'loading';
            this.showStatus(message);
            this.renderState();
            return this;
        }

        showConfigure() {
            this.mode = 'configure';
            this.plan = null;
            this.executionId = null;
            this.clearErrors();
            this.showStatus('Введите email пользователей и проверьте список.');
            this.updateEmailCounts();
            this.renderState();
            return this;
        }

        renderModerators() {
            if (!this.elements || !this.options) return;
            const selected = this.elements.curator.value;
            this.elements.curator.replaceChildren();
            const empty = this.ownerDocument.createElement('option');
            empty.value = '';
            empty.textContent = 'Не выбран';
            this.elements.curator.append(empty);
            for (const moderator of this.options.moderators || []) {
                const option = this.ownerDocument.createElement('option');
                option.value = String(moderator.id);
                option.textContent = moderator.name
                    ? `${moderator.name}${moderator.email ? ` · ${moderator.email}` : ''}`
                    : moderator.email || `Moderator #${moderator.id}`;
                this.elements.curator.append(option);
            }
            if ([...this.elements.curator.options].some((option) => option.value === selected)) {
                this.elements.curator.value = selected;
            }
        }

        updateEmailCounts() {
            if (!this.options?.parseEmailInput) return;
            const parsed = this.options.parseEmailInput(this.elements.emails.value);
            this.elements.validCount.textContent = `Уникальных email: ${parsed.entries.length}`;
            this.elements.invalidCount.textContent = `Некорректных: ${parsed.malformed.length}`;
        }

        async discover() {
            if (!this.options?.onDiscover || this.mode === 'executing') return;
            this.clearErrors();
            this.setBusy(true, 'Проверяем пользователей…');
            try {
                this.rows = (await this.options.onDiscover({ emailInput: this.elements.emails.value }))
                    .map((row) => ({ ...row, addSelected: false, assignSelected: false }));
                this.plan = null;
                this.mode = 'review';
                this.renderRows();
                this.showStatus('Проверьте найденные состояния и выберите операции.');
            } catch (error) {
                this.showError(error);
                this.mode = 'configure';
            } finally {
                this.setBusy(false);
                this.renderState();
            }
        }

        renderRows() {
            const documentApi = this.ownerDocument;
            this.elements.rows.replaceChildren();
            this.elements.reviewCount.textContent = `${this.rows.length} строк`;
            for (const row of this.rows) {
                const tr = documentApi.createElement('tr');
                tr.dataset.email = row.normalizedEmail;

                const identity = documentApi.createElement('td');
                const name = documentApi.createElement('strong');
                name.textContent = row.user?.name || row.email;
                const email = documentApi.createElement('small');
                email.textContent = row.user?.name ? row.email : '';
                identity.append(name, email);

                const membership = documentApi.createElement('td');
                membership.textContent = {
                    in_marathon: 'В марафоне',
                    resolvable_not_in_marathon: 'Можно добавить по email',
                    ambiguous: 'Неоднозначно',
                    invalid: 'Некорректный email'
                }[row.resolution] || row.resolution;

                const curators = documentApi.createElement('td');
                if (!row.moderatorStateSafe && row.membership === 'in_marathon') {
                    curators.textContent = 'Нельзя безопасно прочитать';
                    curators.classList.add('is-error');
                } else {
                    curators.textContent = row.currentModerators?.length
                        ? row.currentModerators.map((moderator) => moderator.name || moderator.email || `#${moderator.id}`).join(', ')
                        : 'Нет';
                }

                const addCell = documentApi.createElement('td');
                addCell.append(this.createCheckbox(row, 'addSelected', row.actionable));

                const assignCell = documentApi.createElement('td');
                assignCell.append(this.createCheckbox(row, 'assignSelected', this.canAssign(row)));

                const status = documentApi.createElement('td');
                status.className = 'row-status';
                status.textContent = row.message || 'Готово к выбору.';

                tr.append(identity, membership, curators, addCell, assignCell, status);
                this.elements.rows.append(tr);
            }
        }

        createCheckbox(row, field, enabled) {
            const input = this.ownerDocument.createElement('input');
            input.type = 'checkbox';
            input.dataset.field = field;
            input.dataset.email = row.normalizedEmail;
            input.checked = Boolean(row[field]);
            input.disabled = !enabled;
            input.setAttribute('aria-label', `${field === 'addSelected' ? 'Добавить' : 'Назначить куратора'} ${row.email}`);
            return input;
        }

        canAssign(row) {
            if (!row.actionable || !row.moderatorStateSafe) return false;
            if (row.membership === 'in_marathon') return true;
            return row.membership === 'not_in_marathon' && Boolean(row.addSelected);
        }

        handleRowSelection(event) {
            const input = event.target;
            if (!(input instanceof root.HTMLInputElement) || input.type !== 'checkbox') return;
            const row = this.rows.find((item) => item.normalizedEmail === input.dataset.email);
            if (!row) return;
            row[input.dataset.field] = input.checked;
            if (input.dataset.field === 'addSelected' && !input.checked && row.membership === 'not_in_marathon') {
                row.assignSelected = false;
            }
            this.plan = null;
            this.renderRows();
            this.renderState();
        }

        selectAll(field) {
            if (this.mode !== 'review') return;
            for (const row of this.rows) {
                if (field === 'addSelected' && row.actionable) {
                    row.addSelected = true;
                }
                if (field === 'assignSelected' && this.canAssign(row)) {
                    row.assignSelected = true;
                }
            }
            this.plan = null;
            this.renderRows();
            this.renderState();
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
                    targetModeratorId: this.elements.curator.value
                });
                this.mode = 'preflight';
                this.renderPreflight();
                this.showStatus('План зафиксирован. Проверьте его и подтвердите выполнение.');
            } catch (error) {
                this.showError(error);
            }
            this.renderState();
        }

        renderPreflight() {
            const documentApi = this.ownerDocument;
            this.elements.preflight.replaceChildren();
            const heading = documentApi.createElement('h3');
            heading.textContent = 'Неизменяемый план';
            const summary = documentApi.createElement('p');
            summary.textContent = `Строк: ${this.plan.counts.requested}. Добавлений: ${this.plan.counts.additions}. `
                + `Назначений: ${this.plan.counts.assignments}. Предсказанных no-op: ${this.plan.counts.noOps}. `
                + `Отклонённых операций: ${this.plan.counts.rejectedOperations}.`;
            const list = documentApi.createElement('ul');
            for (const row of this.plan.rows) {
                if (row.selectedOperations.length === 0 && !['invalid', 'ambiguous'].includes(row.resolution)) continue;
                const item = documentApi.createElement('li');
                const pieces = [];
                if (row.add) pieces.push(`add: ${row.add.status} (${row.add.code})`);
                if (row.assign) pieces.push(`assign: ${row.assign.status} (${row.assign.code})`);
                if (pieces.length === 0) pieces.push(row.message || row.resolution);
                item.textContent = `${row.email}: ${pieces.join('; ')}`;
                list.append(item);
            }
            this.elements.preflight.append(heading, summary, list);
        }

        returnToReview() {
            if (this.mode !== 'preflight') return;
            this.plan = null;
            this.mode = 'review';
            this.elements.preflight.replaceChildren();
            this.showStatus('Измените выбор и подготовьте новый план.');
            this.renderState();
        }

        async execute() {
            if (!this.plan || !this.options?.onExecute || this.mode !== 'preflight') return;
            this.mode = 'executing';
            this.setBusy(true, 'Выполняем подтверждённый план…');
            this.elements.progress.hidden = false;
            try {
                const result = await this.options.onExecute(this.plan, (progress) => this.showProgress(progress));
                this.elements.report.value = result.report || '';
                this.executionId = result.history?.stored ? result.history.record?.id || null : null;
                this.elements.history.hidden = !this.executionId;
                this.mode = result.fatalError ? 'partial-complete' : 'complete';
                const historyMessage = result.history?.stored
                    ? ' Результат сохранён в истории.'
                    : result.history?.persistenceError
                        ? ' Видимый отчёт сохранён, но историю записать не удалось.'
                        : '';
                this.showStatus(
                    `${result.fatalError ? 'Операция прервана, частичные результаты сохранены.' : 'Обработка завершена.'}${historyMessage}`
                );
            } catch (error) {
                this.mode = 'partial-complete';
                this.showError(error);
            } finally {
                this.setBusy(false);
                this.renderState();
            }
        }

        showProgress(progress = {}) {
            const completed = Math.max(0, Number(progress.completed) || 0);
            const total = Math.max(0, Number(progress.total) || 0);
            this.elements.progress.max = Math.max(total, 1);
            this.elements.progress.value = Math.min(completed, Math.max(total, 1));
            this.elements.progress.hidden = false;
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
            this.elements.emails.value = '';
            this.elements.curator.value = '';
            this.elements.rows.replaceChildren();
            this.elements.preflight.replaceChildren();
            this.elements.report.value = '';
            this.elements.history.hidden = true;
            this.mode = 'configure';
            this.updateEmailCounts();
            this.showStatus('Введите следующую группу пользователей.');
            this.renderState();
        }

        close() {
            if (this.mode === 'executing' || this.mode === 'loading') return;
            this.options?.onClose?.();
        }

        setBusy(busy, message = '') {
            if (message) this.showStatus(message);
            if (!this.elements) return;
            for (const element of this.shadowRoot.querySelectorAll('button, textarea, select, input')) {
                element.disabled = Boolean(busy);
            }
            if (!busy) this.renderState();
        }

        renderState() {
            if (!this.elements) return;
            const reviewVisible = ['review', 'preflight', 'executing', 'complete', 'partial-complete'].includes(this.mode) && this.rows.length > 0;
            this.elements.review.hidden = !reviewVisible;
            this.elements.preflight.hidden = !['preflight', 'executing'].includes(this.mode);
            this.elements.result.hidden = !['complete', 'partial-complete'].includes(this.mode);
            this.elements.discover.hidden = this.mode !== 'configure';
            this.elements.prepare.hidden = this.mode !== 'review';
            this.elements.execute.hidden = this.mode !== 'preflight';
            this.elements.edit.hidden = this.mode !== 'preflight';
            this.elements.restart.hidden = !['complete', 'partial-complete'].includes(this.mode);
            this.elements.close.disabled = ['loading', 'executing'].includes(this.mode);
            this.elements.emails.disabled = this.mode !== 'configure';
            this.elements.curator.disabled = !['configure', 'review'].includes(this.mode);
            this.elements.selectAllAdd.disabled = this.mode !== 'review';
            this.elements.selectAllAssign.disabled = this.mode !== 'review';
            for (const input of this.elements.rows.querySelectorAll('input[type="checkbox"]')) {
                const row = this.rows.find((item) => item.normalizedEmail === input.dataset.email);
                const enabled = input.dataset.field === 'addSelected'
                    ? row?.actionable
                    : row ? this.canAssign(row) : false;
                input.disabled = this.mode !== 'review' || !enabled;
            }
            if (this.mode !== 'executing') {
                this.elements.progress.hidden = true;
            }
        }

        showStatus(message) {
            if (this.elements) this.elements.status.textContent = String(message || '');
        }

        clearErrors() {
            if (!this.elements) return;
            this.elements.errors.replaceChildren();
            this.elements.errors.hidden = true;
        }

        showError(error) {
            if (!this.elements) return;
            this.clearErrors();
            const entry = this.ownerDocument.createElement('p');
            entry.textContent = error?.message || String(error || 'Неизвестная ошибка.');
            this.elements.errors.append(entry);
            this.elements.errors.hidden = false;
            this.showStatus(entry.textContent);
        }
    }

    if (root.customElements && root.HTMLElement && !root.customElements.get(BATCH_USER_ONBOARDING_DIALOG_TAG)) {
        root.customElements.define(BATCH_USER_ONBOARDING_DIALOG_TAG, BatchUserOnboardingDialog);
    }

    return Object.freeze({
        BATCH_USER_ONBOARDING_DIALOG_TAG,
        BatchUserOnboardingDialog
    });
});