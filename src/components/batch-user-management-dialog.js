(function initializeBatchUserManagementDialog(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], () => factory(root));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root);
    } else {
        root.EdVibeBatchUserManagementDialog = factory(root);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createComponent(root) {
    'use strict';

    const USER_MANAGEMENT_DIALOG_TAG = 'edvibe-toolbox-batch-user-management-dialog';
    const USER_MANAGEMENT_OVERLAY_ID = 'edvibe-toolbox-batch-user-management-overlay';
    const HTMLElementBase = root.HTMLElement || class {};
    const template = root.document?.createElement?.('template') || null;

    if (template) {
        template.innerHTML = `
            <link class="edvibe-batch-user-management-stylesheet" rel="stylesheet">
            <div class="edvibe-batch-user-management-overlay">
                <section class="edvibe-batch-user-management-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-user-management-title">
                    <header class="edvibe-batch-user-management-header">
                        <div>
                            <h2 id="edvibe-batch-user-management-title">Управление пользователями</h2>
                            <p class="edvibe-batch-user-management-description">
                                Снимите кураторов и удалите пользователей по списку email.
                            </p>
                        </div>
                        <button class="edvibe-batch-user-management-close" type="button"
                            aria-label="Закрыть">&times;</button>
                    </header>
                    <div class="edvibe-batch-user-management-body">
                        <section class="edvibe-batch-user-management-configure">
                            <label for="edvibe-batch-user-management-emails">Email пользователей</label>
                            <textarea id="edvibe-batch-user-management-emails"
                                class="edvibe-batch-user-management-emails" rows="5"
                                placeholder="user@example.com"></textarea>
                            <div class="edvibe-batch-user-management-email-state" aria-live="polite">
                                <span class="edvibe-batch-user-management-email-count"></span>
                                <span class="edvibe-batch-user-management-malformed-count"></span>
                            </div>
                        </section>
                        <section class="edvibe-batch-user-management-errors" aria-live="polite" hidden></section>
                        <section class="edvibe-batch-user-management-table-wrap" hidden>
                            <table class="edvibe-batch-user-management-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Пользователь</th>
                                        <th scope="col">
                                            Снять куратора
                                            <button class="edvibe-batch-user-management-select-all-unassign"
                                                type="button">Выбрать все</button>
                                        </th>
                                        <th scope="col">
                                            Удалить пользователя
                                            <button class="edvibe-batch-user-management-select-all-delete"
                                                type="button">Выбрать все</button>
                                        </th>
                                        <th scope="col">Результат</th>
                                    </tr>
                                </thead>
                                <tbody class="edvibe-batch-user-management-table-body"></tbody>
                            </table>
                        </section>
                    </div>
                    <div class="edvibe-batch-user-management-live-region">
                        <p class="edvibe-batch-user-management-status" role="status" aria-live="polite"></p>
                        <progress class="edvibe-batch-user-management-progress" max="0" value="0" hidden></progress>
                    </div>
                    <footer class="edvibe-batch-user-management-footer">
                        <button class="edvibe-batch-user-management-restart" type="button" disabled hidden>
                            Запустить другую группу
                        </button>
                        <button class="edvibe-batch-user-management-start" type="button" disabled>
                            Начать обработку
                        </button>
                        <button class="edvibe-batch-user-management-check" type="button">
                            Проверить пользователей
                        </button>
                    </footer>
                </section>
            </div>
        `;
    }

    class BatchUserManagementDialog extends HTMLElementBase {
        constructor() {
            super();
            this.stylesheetUrl = '';
            this.rows = [];
            this.emailState = { validCount: 0, malformedCount: 0 };
            this.mode = 'configure';
            this.rendered = false;
            this.listenersConnected = false;

            if (typeof this.attachShadow !== 'function' || !template) {
                return;
            }
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.append(template.content.cloneNode(true));
            this.cacheElements();
            this.rendered = true;
            this.updateStylesheet();
            this.renderState();
        }

        connectedCallback() {
            if (!this.id) {
                this.id = USER_MANAGEMENT_OVERLAY_ID;
            }
            this.connectListeners();
            this.renderState();
        }

        disconnectedCallback() {
            this.disconnectListeners();
        }

        configure(options = {}) {
            options = options && typeof options === 'object' ? options : {};
            if (options.stylesheetUrl !== undefined) {
                this.stylesheetUrl = String(options.stylesheetUrl || '');
            }
            this.updateStylesheet();
            return this;
        }

        cacheElements() {
            const find = (selector) => this.shadowRoot.querySelector(selector);
            this.elements = {
                stylesheet: find('.edvibe-batch-user-management-stylesheet'),
                backdrop: find('.edvibe-batch-user-management-overlay'),
                emails: find('.edvibe-batch-user-management-emails'),
                emailCount: find('.edvibe-batch-user-management-email-count'),
                malformedCount: find('.edvibe-batch-user-management-malformed-count'),
                errors: find('.edvibe-batch-user-management-errors'),
                tableWrap: find('.edvibe-batch-user-management-table-wrap'),
                tableBody: find('.edvibe-batch-user-management-table-body'),
                selectAllUnassign: find('.edvibe-batch-user-management-select-all-unassign'),
                selectAllDelete: find('.edvibe-batch-user-management-select-all-delete'),
                status: find('.edvibe-batch-user-management-status'),
                progress: find('.edvibe-batch-user-management-progress'),
                start: find('.edvibe-batch-user-management-start'),
                check: find('.edvibe-batch-user-management-check'),
                restart: find('.edvibe-batch-user-management-restart'),
                close: find('.edvibe-batch-user-management-close')
            };
        }

        connectListeners() {
            if (!this.rendered || this.listenersConnected) {
                return;
            }
            this.listenersConnected = true;
            this.handleInput = this.handleInput.bind(this);
            this.handleCheck = this.handleCheck.bind(this);
            this.handleStart = this.handleStart.bind(this);
            this.handleRestart = this.handleRestart.bind(this);
            this.handleClose = this.close.bind(this);
            this.handleBackdropClick = this.handleBackdropClick.bind(this);
            this.handleKeydown = this.handleKeydown.bind(this);
            this.handleSelectAllUnassign = this.handleSelectAllUnassign.bind(this);
            this.handleSelectAllDelete = this.handleSelectAllDelete.bind(this);

            this.elements.emails.addEventListener('input', this.handleInput);
            this.elements.check.addEventListener('click', this.handleCheck);
            this.elements.start.addEventListener('click', this.handleStart);
            this.elements.restart.addEventListener('click', this.handleRestart);
            this.elements.close.addEventListener('click', this.handleClose);
            this.elements.backdrop.addEventListener('click', this.handleBackdropClick);
            this.elements.selectAllUnassign.addEventListener('click', this.handleSelectAllUnassign);
            this.elements.selectAllUnassign.addEventListener('change', this.handleSelectAllUnassign);
            this.elements.selectAllDelete.addEventListener('click', this.handleSelectAllDelete);
            this.elements.selectAllDelete.addEventListener('change', this.handleSelectAllDelete);
            this.ownerDocument?.addEventListener('keydown', this.handleKeydown);
        }

        disconnectListeners() {
            if (!this.listenersConnected) {
                return;
            }
            this.listenersConnected = false;
            this.elements.emails.removeEventListener('input', this.handleInput);
            this.elements.check.removeEventListener('click', this.handleCheck);
            this.elements.start.removeEventListener('click', this.handleStart);
            this.elements.restart.removeEventListener('click', this.handleRestart);
            this.elements.close.removeEventListener('click', this.handleClose);
            this.elements.backdrop.removeEventListener('click', this.handleBackdropClick);
            this.elements.selectAllUnassign.removeEventListener('click', this.handleSelectAllUnassign);
            this.elements.selectAllUnassign.removeEventListener('change', this.handleSelectAllUnassign);
            this.elements.selectAllDelete.removeEventListener('click', this.handleSelectAllDelete);
            this.elements.selectAllDelete.removeEventListener('change', this.handleSelectAllDelete);
            this.ownerDocument?.removeEventListener('keydown', this.handleKeydown);
        }

        updateStylesheet() {
            this.elements?.stylesheet?.setAttribute('href', this.stylesheetUrl);
        }

        setEmailState(state = {}) {
            this.emailState = {
                validCount: Math.max(0, Number(state.validCount) || 0),
                malformedCount: Math.max(0, Number(state.malformedCount) || 0)
            };
            if (this.elements) {
                this.elements.emailCount.textContent = `Уникальных email: ${this.emailState.validCount}`;
                this.elements.malformedCount.textContent = `Некорректных: ${this.emailState.malformedCount}`;
            }
            this.renderState();
            return this;
        }

        showConfigure() {
            this.mode = 'configure';
            this.clearMessages();
            this.renderState();
            return this;
        }

        showChecking(message = 'Проверяем пользователей…') {
            this.mode = 'checking';
            this.clearMessages();
            this.setStatus(message);
            this.renderState();
            return this;
        }

        showValidationErrors(errors = []) {
            this.mode = 'validation-error';
            this.renderErrors(errors);
            this.setStatus('Исправьте ошибки и повторите проверку.', 'error');
            this.renderState();
            return this;
        }

        showReview({ rows = [] } = {}) {
            this.mode = 'review';
            this.rows = rows.map((row) => ({
                ...row,
                result: { ...(row.result || { status: 'pending', message: 'Not started' }) }
            }));
            this.clearMessages();
            this.renderTable();
            this.setStatus('Выберите операции для пользователей.');
            this.renderState();
            return this;
        }

        showExecution(progress = {}) {
            this.mode = 'executing';
            const completed = Math.max(0, Number(progress.completed) || 0);
            const total = Math.max(0, Number(progress.total) || 0);
            const successes = Math.max(0, Number(progress.successes) || 0);
            const failures = Math.max(0, Number(progress.failures) || 0);
            if (this.elements) {
                this.elements.progress.hidden = false;
                this.elements.progress.max = total;
                this.elements.progress.value = completed;
            }
            const operationLabels = {
                unassign: 'снятие куратора',
                delete: 'удаление пользователя'
            };
            const current = progress.current?.email && progress.current?.operation
                ? ` Сейчас: ${progress.current.email} — `
                    + `${operationLabels[progress.current.operation] || progress.current.operation}.`
                : '';
            this.setStatus(
                `Выполнено: ${completed} из ${total}. Успешно: ${successes}. `
                + `Ошибок: ${failures}.${current}`
            );
            this.renderState();
            return this;
        }

        showComplete(summary = {}) {
            const rows = Array.isArray(summary.rows) ? summary.rows : this.rows;
            this.rows = rows.map((row) => ({
                ...row,
                result: { ...(row.result || { status: 'pending', message: 'Not started' }) }
            }));
            const failures = Math.max(0, Number(summary.failures) || 0);
            this.mode = failures > 0 ? 'partial-complete' : 'complete';
            this.clearMessages();
            this.renderTable();
            this.setStatus(failures > 0
                ? `Завершено с ошибками. Успешно: ${Math.max(0, Number(summary.successes) || 0)}.`
                : 'Готово.');
            this.renderState();
            return this;
        }

        showFatalError(error) {
            this.mode = 'fatal-error';
            this.clearMessages();
            this.renderErrors([error]);
            this.setStatus('Не удалось загрузить пользователей.', 'error');
            this.renderState();
            return this;
        }

        renderErrors(errors) {
            const values = Array.isArray(errors) ? errors : [errors];
            this.elements.errors.replaceChildren();
            const document = this.ownerDocument || root.document;
            for (const error of values) {
                const entry = document?.createElement?.('p');
                if (!entry) {
                    continue;
                }
                entry.className = 'edvibe-batch-user-management-error';
                entry.textContent = typeof error === 'string'
                    ? error
                    : String(error?.message || 'Неизвестная ошибка.');
                this.elements.errors.appendChild(entry);
            }
            this.elements.errors.hidden = values.length === 0;
        }

        renderTable() {
            const tableBody = this.elements?.tableBody;
            const document = this.ownerDocument || root.document;
            if (!tableBody || !document?.createElement) {
                return;
            }
            tableBody.replaceChildren();
            for (const row of this.rows) {
                const tableRow = document.createElement('tr');
                const userCell = document.createElement('td');
                userCell.className = 'edvibe-batch-user-management-user';
                const name = row.pupil?.Name ? `${row.pupil.Name} — ` : '';
                userCell.textContent = `${name}${row.email}`;

                const unassignCell = document.createElement('td');
                const unassign = document.createElement('input');
                unassign.type = 'checkbox';
                unassign.checked = Boolean(row.unassignSelected);
                unassign.disabled = !row.actionable || this.isLocked();
                unassign.addEventListener('change', () => this.selectOperation(row, 'unassign', unassign.checked));
                unassignCell.appendChild(unassign);

                const deleteCell = document.createElement('td');
                const remove = document.createElement('input');
                remove.type = 'checkbox';
                remove.checked = Boolean(row.deleteSelected);
                remove.disabled = !row.actionable || this.isLocked();
                remove.addEventListener('change', () => this.selectOperation(row, 'delete', remove.checked));
                deleteCell.appendChild(remove);

                const resultCell = document.createElement('td');
                resultCell.className = 'edvibe-batch-user-management-result';
                resultCell.textContent = String(row.result?.message || row.message || '');

                tableRow.append(userCell, unassignCell, deleteCell, resultCell);
                tableBody.appendChild(tableRow);
            }
            this.elements.tableWrap.hidden = this.rows.length === 0;
            this.renderSelectionControls();
        }

        renderSelectionControls() {
            const actionableRows = this.rows.filter((row) => row.actionable !== false);
            const allSelected = (operation) => actionableRows.length > 0
                && actionableRows.every((row) => row[`${operation}Selected`]);
            this.elements.selectAllUnassign.checked = allSelected('unassign');
            this.elements.selectAllDelete.checked = allSelected('delete');
        }

        selectOperation(row, operation, selected) {
            if (this.isLocked() || row.actionable === false) {
                return;
            }
            row[`${operation}Selected`] = Boolean(selected);
            this.renderTable();
            this.renderState();
            this.dispatchSelectionChange();
        }

        selectAll(operation, selected) {
            if (this.isLocked()) {
                return;
            }
            for (const row of this.rows) {
                if (row.actionable !== false) {
                    row[`${operation}Selected`] = selected;
                }
            }
            this.renderTable();
            this.renderState();
            this.dispatchSelectionChange();
        }

        handleSelectAllUnassign(event) {
            const selected = event.type === 'change'
                ? Boolean(this.elements.selectAllUnassign.checked)
                : !this.rows.filter((row) => row.actionable !== false)
                    .every((row) => row.unassignSelected);
            this.selectAll('unassign', selected);
        }

        handleSelectAllDelete(event) {
            const selected = event.type === 'change'
                ? Boolean(this.elements.selectAllDelete.checked)
                : !this.rows.filter((row) => row.actionable !== false)
                    .every((row) => row.deleteSelected);
            this.selectAll('delete', selected);
        }

        dispatchSelectionChange() {
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-user-management-selection-change', {
                detail: { rows: this.copyRows() }
            }));
        }

        handleInput() {
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-user-management-input-change', {
                detail: { emailInput: this.elements.emails.value }
            }));
        }

        handleCheck() {
            if (!this.canCheck()) {
                return;
            }
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-user-management-check', {
                detail: { emailInput: this.elements.emails.value }
            }));
        }

        handleStart() {
            if (!this.canStart()) {
                return;
            }
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-user-management-start', {
                detail: { rows: this.copyRows() }
            }));
        }

        handleRestart() {
            if (!['complete', 'partial-complete'].includes(this.mode)) {
                return;
            }
            this.rows = [];
            this.mode = 'configure';
            this.elements.emails.value = '';
            this.setEmailState({ validCount: 0, malformedCount: 0 });
            this.clearMessages();
            this.renderTable();
            this.renderState();
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-user-management-restart'));
        }

        handleBackdropClick(event) {
            if (event.target === this.elements.backdrop) {
                this.close();
            }
        }

        handleKeydown(event) {
            if (event.key === 'Escape') {
                this.close();
            }
        }

        close() {
            if (!this.canClose()) {
                return;
            }
            this.dispatchEvent(new root.CustomEvent('edvibe-dialog-close'));
            this.remove?.();
        }

        copyRows() {
            return this.rows.map((row) => ({
                ...row,
                result: { ...(row.result || {}) }
            }));
        }

        clearMessages() {
            if (!this.elements) {
                return;
            }
            this.elements.errors.replaceChildren();
            this.elements.errors.hidden = true;
            this.elements.progress.hidden = true;
            this.setStatus('');
        }

        setStatus(message, state = '') {
            if (!this.elements) {
                return;
            }
            this.elements.status.textContent = String(message || '');
            this.elements.status.classList.toggle('is-error', state === 'error');
        }

        isLocked() {
            return [
                'checking',
                'executing',
                'complete',
                'partial-complete'
            ].includes(this.mode);
        }

        canCheck() {
            return ['configure', 'validation-error'].includes(this.mode)
                && this.elements.emails.value.trim().length > 0;
        }

        canStart() {
            return this.mode === 'review'
                && this.rows.some((row) =>
                    row.actionable !== false && (row.unassignSelected || row.deleteSelected)
                );
        }

        canClose() {
            return ['configure', 'validation-error', 'review', 'complete', 'partial-complete', 'fatal-error']
                .includes(this.mode);
        }

        renderState() {
            if (!this.elements) {
                return;
            }
            const completed = ['complete', 'partial-complete'].includes(this.mode);
            const locked = this.isLocked();
            this.elements.emails.disabled = locked || completed || this.mode === 'fatal-error';
            this.elements.check.hidden = !['configure', 'validation-error'].includes(this.mode);
            this.elements.check.disabled = locked || !this.canCheck();
            this.elements.start.hidden = !['review'].includes(this.mode);
            this.elements.start.disabled = locked || !this.canStart();
            this.elements.restart.hidden = !completed;
            this.elements.restart.disabled = !completed;
            this.elements.close.disabled = !this.canClose();
            this.elements.selectAllUnassign.disabled = locked || this.rows.length === 0;
            this.elements.selectAllDelete.disabled = locked || this.rows.length === 0;
            this.elements.tableBody.querySelectorAll('input').forEach((input) => {
                input.disabled = input.disabled || locked;
            });
            if (!['executing'].includes(this.mode)) {
                this.elements.progress.hidden = true;
            }
        }
    }

    if (root.customElements && !root.customElements.get(USER_MANAGEMENT_DIALOG_TAG)) {
        root.customElements.define(USER_MANAGEMENT_DIALOG_TAG, BatchUserManagementDialog);
    }

    return {
        USER_MANAGEMENT_DIALOG_TAG,
        USER_MANAGEMENT_OVERLAY_ID,
        BatchUserManagementDialog
    };
});
