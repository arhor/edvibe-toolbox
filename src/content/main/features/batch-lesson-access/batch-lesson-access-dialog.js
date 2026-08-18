import { LitElement, html, nothing } from 'lit';

import {
    EMAIL_VALIDATION_CODES,
    emailValidationSummaryStyles,
    renderEmailValidationSummary
} from '#src/content/main/components/email-validation-summary.js';
import { batchLessonAccessDialogStyles } from '#src/content/main/features/batch-lesson-access/batch-lesson-access-dialog.styles.js';
import { componentFoundationStyles, dialogFoundationStyles } from '#src/content/main/styles/foundations.js';
import {
    controlStyles,
    dialogShellStyles,
    emptyStateStyles,
    fieldStyles,
    noticeStyles,
    progressStyles
} from '#src/content/main/styles/primitives.js';

const BATCH_ACCESS_DIALOG_TAG = 'edvibe-toolbox-batch-access-dialog';
const BATCH_ACCESS_OVERLAY_ID = 'edvibe-toolbox-batch-access-overlay';

class BatchLessonAccessDialog extends LitElement {
    static styles = [
        componentFoundationStyles,
        dialogFoundationStyles,
        dialogShellStyles,
        controlStyles,
        fieldStyles,
        noticeStyles,
        progressStyles,
        emptyStateStyles,
        emailValidationSummaryStyles,
        batchLessonAccessDialogStyles
    ];

    static properties = {
        lessons: { state: true },
        selectedLessonIds: { state: true },
        emailState: { state: true },
        emailInput: { state: true },
        mode: { state: true },
        statusMessage: { state: true },
        statusError: { state: true },
        errors: { state: true },
        summaryLines: { state: true },
        failures: { state: true },
        progress: { state: true }
    };

    constructor() {
        super();
        this.lessons = [];
        this.selectedLessonIds = new Set();
        this.emailState = { validCount: 0, malformedCount: 0, invalidEntries: [] };
        this.emailInput = '';
        this.mode = 'initializing';
        this.statusMessage = '';
        this.statusError = false;
        this.errors = [];
        this.summaryLines = [];
        this.failures = [];
        this.progress = { visible: false, indeterminate: false, completed: 0, total: 0 };
        this.handleKeydownBound = (event) => this.handleKeydown(event);
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.id) {
            this.id = BATCH_ACCESS_OVERLAY_ID;
        }
        this.ownerDocument?.addEventListener('keydown', this.handleKeydownBound);
    }

    disconnectedCallback() {
        this.ownerDocument?.removeEventListener('keydown', this.handleKeydownBound);
        super.disconnectedCallback();
    }

    configure(options = {}) {
        const normalizedOptions = options && typeof options === 'object' ? options : {};
        if (normalizedOptions.lessons !== undefined || normalizedOptions.emailState !== undefined) {
            this.showConfigure(normalizedOptions);
        }
        return this;
    }

    setEmailState(state = {}) {
        const normalizedState = state && typeof state === 'object' ? state : {};
        this.emailState = {
            validCount: Math.max(0, Number(normalizedState.validCount) || 0),
            malformedCount: Math.max(0, Number(normalizedState.malformedCount) || 0),
            invalidEntries: Array.isArray(normalizedState.invalidEntries) ? [...normalizedState.invalidEntries] : []
        };
        return this;
    }

    showConfigure(options = {}) {
        const normalizedOptions = Array.isArray(options)
            ? { lessons: options }
            : options && typeof options === 'object' ? options : {};
        if (Array.isArray(normalizedOptions.lessons)) {
            this.lessons = normalizedOptions.lessons;
            this.selectedLessonIds = new Set();
        }
        if (normalizedOptions.emailInput !== undefined) {
            this.emailInput = String(normalizedOptions.emailInput || '');
        }
        this.mode = 'configure';
        this.clearMessages();
        this.progress = { visible: false, indeterminate: false, completed: 0, total: 0 };
        if (normalizedOptions.emailState !== undefined) {
            this.setEmailState(normalizedOptions.emailState);
        }
        return this;
    }

    showLoading(message = 'Загружаем уроки…') {
        this.mode = 'loading';
        this.clearMessages();
        this.setStatus(message);
        this.progress = { visible: true, indeterminate: true, completed: 0, total: 0 };
        return this;
    }

    showValidation(message = 'Проверяем данные…') {
        this.mode = 'validating';
        this.clearMessages();
        this.progress = { visible: false, indeterminate: false, completed: 0, total: 0 };
        this.setStatus(message);
        return this;
    }

    showValidationErrors(errors = []) {
        this.mode = 'validation-error';
        const values = Array.isArray(errors) ? errors : [errors];
        const visibleErrors = this.emailState.invalidEntries.length > 0
            ? values.filter((error) => !EMAIL_VALIDATION_CODES.has(error?.code))
            : values;
        this.errors = this.normalizeErrors(visibleErrors);
        this.summaryLines = [];
        this.failures = [];
        this.progress = { visible: false, indeterminate: false, completed: 0, total: 0 };
        this.setStatus('Исправьте ошибки и повторите проверку.', 'error');
        return this;
    }

    showConfirmation(plan = {}) {
        this.mode = 'confirm';
        this.clearMessages();
        const pending = this.count(plan.needsOpening, plan.pendingCount);
        const alreadyOpen = this.count(plan.alreadyOpen, plan.alreadyOpenCount);
        const selectedLessons = this.count(plan.selectedLessons, plan.selectedLessonCount);
        const matchedUsers = this.count(plan.matchedUsers, plan.matchedUserCount);
        this.summaryLines = [
            `${matchedUsers} пользователей сопоставлено`,
            `${selectedLessons} уроков выбрано`,
            `${pending} доступов нужно открыть`,
            `${alreadyOpen} уже открыт${alreadyOpen === 1 ? '' : 'о'} и будет пропущено`
        ];
        this.setStatus('Подтвердите открытие доступа.');
        return this;
    }

    showExecution(progress = {}) {
        this.mode = 'executing';
        const completed = Math.max(0, Number(progress.completed) || 0);
        const total = Math.max(0, Number(progress.total) || 0);
        const opened = Math.max(0, Number(progress.opened) || 0);
        const failures = Math.max(0, Number(progress.failures) || 0);
        const alreadyOpen = Math.max(0, Number(progress.alreadyOpen) || 0);
        this.progress = { visible: true, indeterminate: false, completed, total };
        const current = progress.current?.email && progress.current?.lessonName
            ? ` Сейчас: ${progress.current.email} — ${progress.current.lessonName}.`
            : '';
        this.setStatus(
            `Выполнено: ${completed} из ${total}. Открыто: ${opened}. Ошибок: ${failures}. `
            + `Уже открыто: ${alreadyOpen}.${current}`
        );
        return this;
    }

    showComplete(summary = {}) {
        const failures = Array.isArray(summary.failures) ? summary.failures : [];
        this.mode = failures.length ? 'partial-complete' : 'complete';
        this.clearMessages();
        this.progress = { visible: false, indeterminate: false, completed: 0, total: 0 };
        this.summaryLines = [
            `Email запрошено: ${this.count(summary.requestedEmails, summary.requestedEmailCount)}`,
            `Пользователей сопоставлено: ${this.count(summary.matchedUsers, summary.matchedUserCount)}`,
            `Уроков выбрано: ${this.count(summary.selectedLessons, summary.selectedLessonCount)}`,
            `Доступов открыто: ${this.count(summary.opened, summary.openedCount)}`,
            `Уже открыто: ${this.count(summary.alreadyOpen, summary.alreadyOpenCount)}`,
            `Ошибок: ${this.count(failures, summary.failureCount)}`,
            `Попыток запросов: ${Math.max(0, Number(summary.attempts) || 0)}`
        ];
        this.failures = failures;
        this.setStatus(failures.length
            ? 'Завершено с ошибками. Скопируйте отчёт для подробностей.'
            : 'Готово.');
        return this;
    }

    showFatalError(error) {
        this.mode = 'fatal-error';
        this.clearMessages();
        this.errors = this.normalizeErrors([error]);
        this.setStatus('Не удалось подготовить пакетное открытие доступа.', 'error');
        return this;
    }

    normalizeErrors(errors) {
        const values = Array.isArray(errors) ? errors : [errors];
        return values.map((error) => typeof error === 'string'
            ? error
            : String(error?.message || 'Неизвестная ошибка.'));
    }

    clearMessages() {
        this.errors = [];
        this.summaryLines = [];
        this.failures = [];
        this.statusMessage = '';
        this.statusError = false;
    }

    setStatus(message, state = '') {
        this.statusMessage = String(message || '');
        this.statusError = state === 'error';
    }

    isEditingLocked() {
        return ['validating', 'confirm', 'executing', 'fatal-error'].includes(this.mode);
    }

    isLessonSelectionLocked() {
        return this.mode === 'loading' || this.isEditingLocked();
    }

    canClose() {
        return ['configure', 'validation-error', 'complete', 'partial-complete', 'fatal-error']
            .includes(this.mode);
    }

    canSubmit() {
        return (this.mode === 'configure' || this.mode === 'validation-error')
            && this.emailState.validCount > 0
            && this.selectedLessonIds.size > 0;
    }

    selectLesson(lessonId, selected) {
        if (this.isLessonSelectionLocked()) {
            return;
        }
        const next = new Set(this.selectedLessonIds);
        if (selected) {
            next.add(lessonId);
        } else {
            next.delete(lessonId);
        }
        this.selectedLessonIds = next;
    }

    handleInput(event) {
        this.emailInput = String(event.currentTarget.value || '');
        this.dispatchEvent(new CustomEvent('edvibe-batch-access-input-change', {
            detail: { emailInput: this.emailInput }
        }));
    }

    handleSelectAll(event) {
        if (this.isLessonSelectionLocked()) {
            return;
        }
        this.selectedLessonIds = event.currentTarget.checked
            ? new Set(this.lessons.map((lesson) => lesson.MarathonLessonId))
            : new Set();
    }

    handleClearAll() {
        if (this.isLessonSelectionLocked()) {
            return;
        }
        this.selectedLessonIds = new Set();
    }

    handleSubmit() {
        if (!this.canSubmit()) {
            return;
        }
        this.dispatchEvent(new CustomEvent('edvibe-batch-access-submit', {
            detail: {
                emailInput: this.emailInput,
                selectedLessonIds: [...this.selectedLessonIds]
            }
        }));
    }

    handleConfirm() {
        if (this.mode === 'confirm') {
            this.dispatchEvent(new CustomEvent('edvibe-batch-access-confirm'));
        }
    }

    handleCopy() {
        if (['complete', 'partial-complete'].includes(this.mode)) {
            this.dispatchEvent(new CustomEvent('edvibe-batch-access-copy-report'));
        }
    }

    handleRestart() {
        if (!['complete', 'partial-complete'].includes(this.mode)) {
            return;
        }
        this.mode = 'configure';
        this.selectedLessonIds = new Set();
        this.emailInput = '';
        this.setEmailState({ validCount: 0, malformedCount: 0, invalidEntries: [] });
        this.clearMessages();
        this.progress = { visible: false, indeterminate: false, completed: 0, total: 0 };
        this.dispatchEvent(new CustomEvent('edvibe-batch-access-restart'));
    }

    handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
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
        this.dispatchEvent(new CustomEvent('edvibe-dialog-close'));
        this.remove();
    }

    count(value, fallback) {
        if (Array.isArray(value)) {
            return value.length;
        }
        if (Number.isFinite(Number(value))) {
            return Math.max(0, Number(value));
        }
        return Math.max(0, Number(fallback) || 0);
    }

    renderLesson(lesson, locked) {
        const lessonId = lesson.MarathonLessonId;
        return html`
            <label class="edvibe-batch-access-lesson">
                ${Number(lesson.Number) + 1}. ${lesson.Name || 'Без названия'}
                <input type="checkbox" .value=${String(lessonId)}
                    .checked=${this.selectedLessonIds.has(lessonId)} ?disabled=${locked}
                    @change=${(event) => this.selectLesson(lessonId, event.currentTarget.checked)}>
            </label>
        `;
    }

    renderFailure(failure) {
        const lessonNumber = Math.max(0, Number(failure?.lessonNumber) || 0);
        const attempts = Math.max(0, Number(failure?.attempts) || 0);
        return html`<p class="edvibe-batch-access-failure">
            ${String(failure?.email || 'Email отсутствует')} —
            ${lessonNumber}. ${String(failure?.lessonName || 'Урок без названия')} —
            ${attempts} попытки — ${String(failure?.code || 'UNKNOWN_ERROR')}:
            ${String(failure?.message || 'Неизвестная ошибка.')}
        </p>`;
    }

    render() {
        const editingLocked = this.isEditingLocked();
        const lessonsLocked = this.isLessonSelectionLocked() || this.mode === 'fatal-error';
        const completed = ['complete', 'partial-complete'].includes(this.mode);
        const selected = this.selectedLessonIds.size;
        const lessonCount = this.lessons.length;
        const allSelected = lessonCount > 0 && selected === lessonCount;
        const someSelected = selected > 0 && selected < lessonCount;
        const progressValue = this.progress.indeterminate ? nothing : this.progress.completed;
        const statusClass = `edvibe-batch-access-status${this.statusError ? ' is-error' : ''}`;

        return html`
            <div class="edvibe-batch-access-overlay" data-part="overlay" @click=${this.handleBackdropClick}>
                <section class="edvibe-batch-access-card" data-part="dialog" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-access-title">
                    <header class="edvibe-batch-access-header">
                        <div><h2 id="edvibe-batch-access-title">Открыть доступ к урокам</h2>
                            <p class="edvibe-batch-access-description">Укажите email учеников и выберите уроки.</p></div>
                        <button class="edvibe-batch-access-close" data-control="secondary" type="button" aria-label="Закрыть"
                            ?disabled=${!this.canClose()} @click=${() => this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-access-body">
                        <section class="edvibe-batch-access-configure">
                            <div class="edvibe-batch-access-email-field" data-field>
                                <label for="edvibe-batch-access-emails">Email учеников</label>
                                <textarea id="edvibe-batch-access-emails" class="edvibe-batch-access-emails"
                                    rows="5" placeholder="user@example.com" .value=${this.emailInput}
                                    ?disabled=${editingLocked || this.mode === 'fatal-error'}
                                    @input=${this.handleInput}></textarea>
                                <div class="edvibe-batch-access-email-state" data-part="help" aria-live="polite">
                                    <span class="edvibe-batch-access-email-count">Уникальных email: ${this.emailState.validCount}</span>
                                    <span class="edvibe-batch-access-malformed-count">Некорректных: ${this.emailState.malformedCount}</span>
                                    ${renderEmailValidationSummary(this.emailState.invalidEntries)}
                                </div>
                            </div>
                            <div class="edvibe-batch-access-lesson-heading"><h3>Уроки</h3>
                                <div class="edvibe-batch-access-selection-actions">
                                    <label><input class="edvibe-batch-access-select-all" type="checkbox"
                                        .checked=${allSelected} .indeterminate=${someSelected}
                                        ?disabled=${lessonsLocked || lessonCount === 0}
                                        @change=${this.handleSelectAll}>Выбрать все</label>
                                    <button class="edvibe-batch-access-clear-all" data-control="secondary" type="button"
                                        ?disabled=${editingLocked || selected === 0}
                                        @click=${this.handleClearAll}>Очистить выбор</button>
                                </div>
                            </div>
                            <div class="edvibe-batch-access-lessons" aria-label="Список уроков">
                                ${lessonCount === 0
                                    ? html`<p class="edvibe-batch-access-empty" data-part="empty-state">Уроки не найдены.</p>`
                                    : this.lessons.map((lesson) => this.renderLesson(lesson, lessonsLocked))}
                            </div>
                        </section>
                        <section class="edvibe-batch-access-errors" data-notice="danger" aria-live="polite" ?hidden=${this.errors.length === 0}>
                            ${this.errors.map((error) => html`<p class="edvibe-batch-access-error">${error}</p>`)}
                        </section>
                        <section class="edvibe-batch-access-summary" data-notice aria-live="polite" ?hidden=${this.summaryLines.length === 0}>
                            ${this.summaryLines.join('\n')}
                        </section>
                        <section class="edvibe-batch-access-failures" data-notice="warning" aria-live="polite" ?hidden=${this.failures.length === 0}>
                            ${this.failures.map((failure) => this.renderFailure(failure))}
                        </section>
                    </div>
                    <div class="edvibe-batch-access-live-region">
                        <span class="edvibe-batch-access-loading-indicator" role="img" aria-label="Загрузка уроков"
                            ?hidden=${this.mode !== 'loading'}></span>
                        <p class=${statusClass} data-part="status" role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-access-progress" data-part="progress" max=${this.progress.total}
                            value=${progressValue} ?hidden=${!this.progress.visible}
                            aria-label=${this.progress.indeterminate ? 'Загрузка уроков' : nothing}></progress>
                    </div>
                    <footer class="edvibe-batch-access-footer" data-part="actions">
                        <button class="edvibe-batch-access-copy" data-control="secondary" type="button" ?hidden=${!completed}
                            ?disabled=${!completed} @click=${this.handleCopy}>Копировать отчёт</button>
                        <button class="edvibe-batch-access-restart" data-control="secondary" type="button" ?hidden=${!completed}
                            ?disabled=${!completed} @click=${this.handleRestart}>Запустить другую группу</button>
                        <button class="edvibe-batch-access-confirm" data-control type="button" ?hidden=${this.mode !== 'confirm'}
                            ?disabled=${this.mode !== 'confirm'} @click=${this.handleConfirm}>Подтвердить открытие доступа</button>
                        <button class="edvibe-batch-access-submit" data-control type="button"
                            ?hidden=${!['configure', 'validation-error'].includes(this.mode)}
                            ?disabled=${!this.canSubmit()} @click=${this.handleSubmit}>Проверить и открыть доступ</button>
                    </footer>
                </section>
            </div>
        `;
    }
}

if (!customElements.get(BATCH_ACCESS_DIALOG_TAG)) {
    customElements.define(BATCH_ACCESS_DIALOG_TAG, BatchLessonAccessDialog);
}

export { BATCH_ACCESS_DIALOG_TAG, BATCH_ACCESS_OVERLAY_ID, BatchLessonAccessDialog };
