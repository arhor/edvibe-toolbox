import { LitElement, html } from 'lit';
import { componentFoundationStyles, dialogFoundationStyles } from '#src/content/main/styles/foundations.js';
import {
    controlStyles,
    dialogShellStyles,
    fieldStyles,
    noticeStyles,
    progressStyles
} from '#src/content/main/styles/primitives.js';
import { batchUserManagementDialogStyles } from '#src/content/main/features/batch-user-management/batch-user-management-dialog.styles.js';
import {
    emailValidationSummaryStyles,
    renderEmailValidationSummary
} from '#src/content/main/components/email-validation-summary.js';

const USER_MANAGEMENT_DIALOG_TAG = 'edvibe-toolbox-batch-user-management-dialog';
const USER_MANAGEMENT_OVERLAY_ID = 'edvibe-toolbox-batch-user-management-overlay';

class BatchUserManagementDialog extends LitElement {
    static styles = [
        componentFoundationStyles,
        dialogFoundationStyles,
        dialogShellStyles,
        controlStyles,
        fieldStyles,
        noticeStyles,
        progressStyles,
        emailValidationSummaryStyles,
        batchUserManagementDialogStyles
    ];

    static properties = {
        rows: {state: true},
        emailState: {state: true},
        emailInput: {state: true},
        mode: {state: true},
        errors: {state: true},
        statusMessage: {state: true},
        statusError: {state: true},
        progress: {state: true}
    };

    constructor() {
        super();
        this.rows = [];
        this.emailState = {validCount: 0, malformedCount: 0, invalidEntries: []};
        this.emailInput = '';
        this.mode = 'configure';
        this.errors = [];
        this.statusMessage = '';
        this.statusError = false;
        this.progress = {visible: false, completed: 0, total: 0};
        this.handleKeydownBound = (event) => this.handleKeydown(event);
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.id) this.id = USER_MANAGEMENT_OVERLAY_ID;
        this.ownerDocument?.addEventListener('keydown', this.handleKeydownBound);
    }

    disconnectedCallback() {
        this.ownerDocument?.removeEventListener('keydown', this.handleKeydownBound);
        super.disconnectedCallback();
    }

    configure() {
        return this;
    }

    setEmailState(state = {}) {
        this.emailState = {
            validCount: Math.max(0, Number(state?.validCount) || 0),
            malformedCount: Math.max(0, Number(state?.malformedCount) || 0),
            invalidEntries: Array.isArray(state?.invalidEntries) ? [...state.invalidEntries] : []
        };
        return this;
    }

    showConfigure() {
        this.mode = 'configure';
        this.clearMessages();
        return this;
    }

    showChecking(message = 'Проверяем пользователей…') {
        this.mode = 'checking';
        this.clearMessages();
        this.setStatus(message);
        return this;
    }

    showValidationErrors(errors = []) {
        this.mode = 'validation-error';
        this.errors = this.normalizeErrors(errors);
        this.progress = {visible: false, completed: 0, total: 0};
        this.setStatus('Исправьте ошибки и повторите проверку.', 'error');
        return this;
    }

    showReview({rows = []} = {}) {
        this.mode = 'review';
        this.rows = this.normalizeRows(rows);
        this.clearMessages();
        this.setStatus('Выберите операции для пользователей.');
        return this;
    }

    showExecution(progress = {}) {
        this.mode = 'executing';
        const completed = Math.max(0, Number(progress.completed) || 0);
        const total = Math.max(0, Number(progress.total) || 0);
        const successes = Math.max(0, Number(progress.successes) || 0);
        const failures = Math.max(0, Number(progress.failures) || 0);
        this.progress = {visible: true, completed, total};
        const labels = {unassign: 'снятие куратора', delete: 'удаление пользователя'};
        const current = progress.current?.email && progress.current?.operation
            ? ` Сейчас: ${progress.current.email} — ${labels[progress.current.operation] || progress.current.operation}.`
            : '';
        this.setStatus(`Выполнено: ${completed} из ${total}. Успешно: ${successes}. Ошибок: ${failures}.${current}`);
        return this;
    }

    showComplete(summary = {}) {
        this.rows = this.normalizeRows(Array.isArray(summary.rows) ? summary.rows : this.rows);
        const failures = Math.max(0, Number(summary.failures) || 0);
        this.mode = failures > 0 ? 'partial-complete' : 'complete';
        this.clearMessages();
        this.setStatus(failures > 0
            ? `Завершено с ошибками. Успешно: ${Math.max(0, Number(summary.successes) || 0)}.`
            : 'Готово.');
        return this;
    }

    showFatalError(error) {
        this.mode = 'fatal-error';
        this.clearMessages();
        this.errors = this.normalizeErrors([error]);
        this.setStatus('Не удалось загрузить пользователей.', 'error');
        return this;
    }

    normalizeRows(rows) {
        return rows.map((row) => ({
            ...row,
            result: {...(row.result || {status: 'pending', message: 'Not started'})}
        }));
    }

    normalizeErrors(errors) {
        const values = Array.isArray(errors) ? errors : [errors];
        return values.map((error) => typeof error === 'string'
            ? error
            : String(error?.message || 'Неизвестная ошибка.'));
    }

    selectOperation(row, operation, selected) {
        if (this.isLocked() || row.actionable === false) return;
        this.rows = this.rows.map((item) => item === row
            ? {...item, [`${operation}Selected`]: Boolean(selected), result: {...(item.result || {})}}
            : item);
        this.dispatchSelectionChange();
    }

    selectAll(operation, selected) {
        if (this.isLocked()) return;
        this.rows = this.rows.map((row) => row.actionable === false
            ? row
            : {...row, [`${operation}Selected`]: Boolean(selected), result: {...(row.result || {})}});
        this.dispatchSelectionChange();
    }

    allSelected(operation) {
        const actionable = this.rows.filter((row) => row.actionable !== false);
        return actionable.length > 0 && actionable.every((row) => row[`${operation}Selected`]);
    }

    dispatchSelectionChange() {
        this.dispatchEvent(new CustomEvent('edvibe-batch-user-management-selection-change', {
            detail: {rows: this.copyRows()}
        }));
    }

    handleInput(event) {
        this.emailInput = String(event.currentTarget.value || '');
        this.dispatchEvent(new CustomEvent('edvibe-batch-user-management-input-change', {
            detail: {emailInput: this.emailInput}
        }));
    }

    handleCheck() {
        if (!this.canCheck()) return;
        this.dispatchEvent(new CustomEvent('edvibe-batch-user-management-check', {
            detail: {emailInput: this.emailInput}
        }));
    }

    handleStart() {
        if (!this.canStart()) return;
        this.dispatchEvent(new CustomEvent('edvibe-batch-user-management-start', {
            detail: {rows: this.copyRows()}
        }));
    }

    handleRestart() {
        if (!['complete', 'partial-complete'].includes(this.mode)) return;
        this.rows = [];
        this.mode = 'configure';
        this.emailInput = '';
        this.setEmailState({validCount: 0, malformedCount: 0, invalidEntries: []});
        this.clearMessages();
        this.dispatchEvent(new CustomEvent('edvibe-batch-user-management-restart'));
    }

    handleBackdropClick(event) {
        if (event.target === event.currentTarget) this.close();
    }

    handleKeydown(event) {
        if (event.key === 'Escape') this.close();
    }

    close() {
        if (!this.canClose()) return;
        this.dispatchEvent(new CustomEvent('edvibe-dialog-close'));
        this.remove();
    }

    copyRows() {
        return this.rows.map((row) => ({...row, result: {...(row.result || {})}}));
    }

    clearMessages() {
        this.errors = [];
        this.progress = {visible: false, completed: 0, total: 0};
        this.setStatus('');
    }

    setStatus(message, state = '') {
        this.statusMessage = String(message || '');
        this.statusError = state === 'error';
    }

    isLocked() {
        return ['checking', 'executing', 'complete', 'partial-complete'].includes(this.mode);
    }

    canCheck() {
        return ['configure', 'validation-error'].includes(this.mode) && this.emailInput.trim().length > 0;
    }

    canStart() {
        return this.mode === 'review'
            && this.rows.some((row) => row.actionable !== false && (row.unassignSelected || row.deleteSelected));
    }

    canClose() {
        return ['configure', 'validation-error', 'review', 'complete', 'partial-complete', 'fatal-error'].includes(this.mode);
    }

    renderRow(row) {
        const locked = this.isLocked();
        const name = row.pupil?.Name ? `${row.pupil.Name} — ` : '';
        return html`
            <tr>
                <td class="edvibe-batch-user-management-user">${name}${row.email}</td>
                <td><input class="operation-unassign" type="checkbox"
                    .checked=${Boolean(row.unassignSelected)} ?disabled=${row.actionable === false || locked}
                    @change=${(event) => this.selectOperation(row, 'unassign', event.currentTarget.checked)}></td>
                <td><input class="operation-delete" type="checkbox"
                    .checked=${Boolean(row.deleteSelected)} ?disabled=${row.actionable === false || locked}
                    @change=${(event) => this.selectOperation(row, 'delete', event.currentTarget.checked)}></td>
                <td class="edvibe-batch-user-management-result">${String(row.result?.message || row.message || '')}</td>
            </tr>
        `;
    }

    render() {
        const completed = ['complete', 'partial-complete'].includes(this.mode);
        const locked = this.isLocked();
        const statusClass = `edvibe-batch-user-management-status${this.statusError ? ' is-error' : ''}`;
        return html`
            <div class="edvibe-batch-user-management-overlay" data-part="overlay" @click=${this.handleBackdropClick}>
                <section class="edvibe-batch-user-management-card" data-part="dialog" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-user-management-title">
                    <header class="edvibe-batch-user-management-header">
                        <div><h2 id="edvibe-batch-user-management-title">Управление пользователями</h2>
                            <p class="edvibe-batch-user-management-description">Снимите кураторов и удалите пользователей по списку email.</p></div>
                        <button class="edvibe-batch-user-management-close" data-control="secondary" type="button" aria-label="Закрыть"
                            ?disabled=${!this.canClose()} @click=${() => this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-user-management-body">
                        <section class="edvibe-batch-user-management-configure">
                            <div class="edvibe-batch-user-management-email-field" data-field>
                                <label for="edvibe-batch-user-management-emails">Email пользователей</label>
                                <textarea id="edvibe-batch-user-management-emails" class="edvibe-batch-user-management-emails"
                                    rows="5" placeholder="user@example.com" .value=${this.emailInput}
                                    ?disabled=${locked || completed || this.mode === 'fatal-error'} @input=${this.handleInput}></textarea>
                                <div class="edvibe-batch-user-management-email-state" data-part="help" aria-live="polite">
                                    <span class="edvibe-batch-user-management-email-count">Уникальных email: ${this.emailState.validCount}</span>
                                    <span class="edvibe-batch-user-management-malformed-count">Некорректных: ${this.emailState.malformedCount}</span>
                                    ${renderEmailValidationSummary(this.emailState.invalidEntries)}
                                </div>
                            </div>
                        </section>
                        <section class="edvibe-batch-user-management-errors" data-notice="danger" aria-live="polite" ?hidden=${this.errors.length === 0}>
                            ${this.errors.map((error) => html`<p class="edvibe-batch-user-management-error">${error}</p>`)}
                        </section>
                        <section class="edvibe-batch-user-management-table-wrap" ?hidden=${this.rows.length === 0}>
                            <table class="edvibe-batch-user-management-table">
                                <thead><tr><th scope="col">Пользователь</th>
                                    <th scope="col">Снять куратора <button class="edvibe-batch-user-management-select-all-unassign" data-control="secondary" type="button"
                                        ?disabled=${locked || this.rows.length === 0} @click=${() => this.selectAll('unassign', !this.allSelected('unassign'))}>Выбрать все</button></th>
                                    <th scope="col">Удалить пользователя <button class="edvibe-batch-user-management-select-all-delete" data-control="secondary" type="button"
                                        ?disabled=${locked || this.rows.length === 0} @click=${() => this.selectAll('delete', !this.allSelected('delete'))}>Выбрать все</button></th>
                                    <th scope="col">Результат</th></tr></thead>
                                <tbody class="edvibe-batch-user-management-table-body">${this.rows.map((row) => this.renderRow(row))}</tbody>
                            </table>
                        </section>
                    </div>
                    <div class="edvibe-batch-user-management-live-region">
                        <p class=${statusClass} data-part="status" role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-user-management-progress" data-part="progress" max=${this.progress.total}
                            value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress>
                    </div>
                    <footer class="edvibe-batch-user-management-footer" data-part="actions">
                        <button class="edvibe-batch-user-management-restart" data-control="secondary" type="button" ?hidden=${!completed}
                            ?disabled=${!completed} @click=${this.handleRestart}>Запустить другую группу</button>
                        <button class="edvibe-batch-user-management-start" data-control type="button" ?hidden=${this.mode !== 'review'}
                            ?disabled=${!this.canStart()} @click=${this.handleStart}>Начать обработку</button>
                        <button class="edvibe-batch-user-management-check" data-control type="button"
                            ?hidden=${!['configure', 'validation-error'].includes(this.mode)} ?disabled=${!this.canCheck()}
                            @click=${this.handleCheck}>Проверить пользователей</button>
                    </footer>
                </section>
            </div>
        `;
    }
}

if (!customElements.get(USER_MANAGEMENT_DIALOG_TAG)) {
    customElements.define(USER_MANAGEMENT_DIALOG_TAG, BatchUserManagementDialog);
}

export {USER_MANAGEMENT_DIALOG_TAG, USER_MANAGEMENT_OVERLAY_ID, BatchUserManagementDialog};
