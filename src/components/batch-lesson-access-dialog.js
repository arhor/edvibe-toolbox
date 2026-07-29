(function initializeBatchAccessDialog(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], () => factory(root));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root);
    } else {
        root.EdVibeBatchAccessDialogComponent = factory(root);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createComponent(root) {
    'use strict';

    const BATCH_ACCESS_DIALOG_TAG = 'edvibe-toolbox-batch-access-dialog';
    const BATCH_ACCESS_OVERLAY_ID = 'edvibe-toolbox-batch-access-overlay';
    const HTMLElementBase = root.HTMLElement || class {};
    const batchAccessTemplate = root.document?.createElement?.('template') || null;

    if (batchAccessTemplate) {
        batchAccessTemplate.innerHTML = `
            <link class="edvibe-batch-access-stylesheet" rel="stylesheet">
            <div class="edvibe-batch-access-overlay">
                <section class="edvibe-batch-access-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-access-title">
                    <header class="edvibe-batch-access-header">
                        <div>
                            <h2 id="edvibe-batch-access-title">Открыть доступ к урокам</h2>
                            <p class="edvibe-batch-access-description">
                                Укажите email учеников и выберите уроки.
                            </p>
                        </div>
                        <button class="edvibe-batch-access-close" type="button"
                            aria-label="Закрыть">&times;</button>
                    </header>
                    <div class="edvibe-batch-access-body">
                        <section class="edvibe-batch-access-configure">
                            <label for="edvibe-batch-access-emails">Email учеников</label>
                            <textarea id="edvibe-batch-access-emails"
                                class="edvibe-batch-access-emails" rows="5"
                                placeholder="user@example.com"></textarea>
                            <div class="edvibe-batch-access-email-state" aria-live="polite">
                                <span class="edvibe-batch-access-email-count"></span>
                                <span class="edvibe-batch-access-malformed-count"></span>
                            </div>
                            <div class="edvibe-batch-access-lesson-heading">
                                <h3>Уроки</h3>
                                <div class="edvibe-batch-access-selection-actions">
                                    <label>
                                        <input class="edvibe-batch-access-select-all" type="checkbox">
                                        Выбрать все
                                    </label>
                                    <button class="edvibe-batch-access-clear-all" type="button">
                                        Очистить выбор
                                    </button>
                                </div>
                            </div>
                            <div class="edvibe-batch-access-lessons" aria-label="Список уроков"></div>
                        </section>
                        <section class="edvibe-batch-access-errors" aria-live="polite" hidden></section>
                        <section class="edvibe-batch-access-summary" aria-live="polite" hidden></section>
                        <section class="edvibe-batch-access-failures" aria-live="polite" hidden></section>
                    </div>
                    <div class="edvibe-batch-access-live-region">
                        <p class="edvibe-batch-access-status" role="status" aria-live="polite"></p>
                        <progress class="edvibe-batch-access-progress" max="0" value="0" hidden></progress>
                    </div>
                    <footer class="edvibe-batch-access-footer">
                        <button class="edvibe-batch-access-copy" type="button" disabled hidden>
                            Копировать отчёт
                        </button>
                        <button class="edvibe-batch-access-restart" type="button" disabled hidden>
                            Запустить другую группу
                        </button>
                        <button class="edvibe-batch-access-confirm" type="button" hidden>
                            Подтвердить открытие доступа
                        </button>
                        <button class="edvibe-batch-access-submit" type="button" disabled>
                            Проверить и открыть доступ
                        </button>
                    </footer>
                </section>
            </div>
        `;
    }

    class BatchLessonAccessDialog extends HTMLElementBase {
        constructor() {
            super();
            this.stylesheetUrl = '';
            this.lessons = [];
            this.selectedLessonIds = new Set();
            this.emailState = { validCount: 0, malformedCount: 0 };
            this.mode = 'initializing';
            this.rendered = false;
            this.listenersConnected = false;

            if (typeof this.attachShadow !== 'function' || !batchAccessTemplate) {
                return;
            }
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.append(batchAccessTemplate.content.cloneNode(true));
            this.cacheElements();
            this.updateStylesheet();
            this.rendered = true;
            this.renderState();
        }

        connectedCallback() {
            if (!this.id) {
                this.id = BATCH_ACCESS_OVERLAY_ID;
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
            if (options.lessons !== undefined || options.emailState !== undefined) {
                this.showConfigure(options);
            }
            return this;
        }

        cacheElements() {
            if (!this.shadowRoot) {
                return;
            }
            const find = (selector) => this.shadowRoot.querySelector(selector);
            this.elements = {
                stylesheet: find('.edvibe-batch-access-stylesheet'),
                backdrop: find('.edvibe-batch-access-overlay'),
                emails: find('.edvibe-batch-access-emails'),
                emailCount: find('.edvibe-batch-access-email-count'),
                malformedCount: find('.edvibe-batch-access-malformed-count'),
                lessonsList: find('.edvibe-batch-access-lessons'),
                selectAll: find('.edvibe-batch-access-select-all'),
                clearAll: find('.edvibe-batch-access-clear-all'),
                errors: find('.edvibe-batch-access-errors'),
                summary: find('.edvibe-batch-access-summary'),
                failures: find('.edvibe-batch-access-failures'),
                status: find('.edvibe-batch-access-status'),
                progress: find('.edvibe-batch-access-progress'),
                submit: find('.edvibe-batch-access-submit'),
                confirm: find('.edvibe-batch-access-confirm'),
                copy: find('.edvibe-batch-access-copy'),
                restart: find('.edvibe-batch-access-restart'),
                close: find('.edvibe-batch-access-close')
            };
        }

        connectListeners() {
            if (!this.rendered || this.listenersConnected) {
                return;
            }
            this.listenersConnected = true;
            this.handleInput = this.handleInput.bind(this);
            this.handleSelectAll = this.handleSelectAll.bind(this);
            this.handleClearAll = this.handleClearAll.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleConfirm = this.handleConfirm.bind(this);
            this.handleCopy = this.handleCopy.bind(this);
            this.handleRestart = this.handleRestart.bind(this);
            this.handleClose = this.close.bind(this);
            this.handleBackdropClick = this.handleBackdropClick.bind(this);
            this.handleKeydown = this.handleKeydown.bind(this);

            this.elements.emails.addEventListener('input', this.handleInput);
            this.elements.selectAll.addEventListener('change', this.handleSelectAll);
            this.elements.clearAll.addEventListener('click', this.handleClearAll);
            this.elements.submit.addEventListener('click', this.handleSubmit);
            this.elements.confirm.addEventListener('click', this.handleConfirm);
            this.elements.copy.addEventListener('click', this.handleCopy);
            this.elements.restart.addEventListener('click', this.handleRestart);
            this.elements.close.addEventListener('click', this.handleClose);
            this.elements.backdrop.addEventListener('click', this.handleBackdropClick);
            this.ownerDocument?.addEventListener('keydown', this.handleKeydown);
        }

        disconnectListeners() {
            if (!this.listenersConnected) {
                return;
            }
            this.listenersConnected = false;
            this.elements.emails.removeEventListener('input', this.handleInput);
            this.elements.selectAll.removeEventListener('change', this.handleSelectAll);
            this.elements.clearAll.removeEventListener('click', this.handleClearAll);
            this.elements.submit.removeEventListener('click', this.handleSubmit);
            this.elements.confirm.removeEventListener('click', this.handleConfirm);
            this.elements.copy.removeEventListener('click', this.handleCopy);
            this.elements.restart.removeEventListener('click', this.handleRestart);
            this.elements.close.removeEventListener('click', this.handleClose);
            this.elements.backdrop.removeEventListener('click', this.handleBackdropClick);
            this.ownerDocument?.removeEventListener('keydown', this.handleKeydown);
        }

        updateStylesheet() {
            this.elements?.stylesheet?.setAttribute('href', this.stylesheetUrl);
        }

        setEmailState(state = {}) {
            state = state && typeof state === 'object' ? state : {};
            this.emailState = {
                validCount: Math.max(0, Number(state.validCount) || 0),
                malformedCount: Math.max(0, Number(state.malformedCount) || 0)
            };
            this.renderEmailState();
            this.renderState();
            return this;
        }

        showConfigure(options = {}) {
            if (Array.isArray(options)) {
                options = { lessons: options };
            }
            options = options && typeof options === 'object' ? options : {};
            if (Array.isArray(options.lessons)) {
                this.lessons = options.lessons;
                this.selectedLessonIds = new Set();
            }
            if (options.emailInput !== undefined && this.elements) {
                this.elements.emails.value = String(options.emailInput || '');
            }
            this.mode = 'configure';
            this.clearMessages();
            this.setEmailState(options.emailState || this.emailState);
            this.renderLessons();
            this.renderState();
            return this;
        }

        showValidation(message = 'Проверяем данные…') {
            this.mode = 'validating';
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

        showConfirmation(plan = {}) {
            this.mode = 'confirm';
            this.clearMessages();
            const pending = this.count(plan.needsOpening, plan.pendingCount);
            const alreadyOpen = this.count(plan.alreadyOpen, plan.alreadyOpenCount);
            const selectedLessons = this.count(plan.selectedLessons, plan.selectedLessonCount);
            const matchedUsers = this.count(plan.matchedUsers, plan.matchedUserCount);
            this.renderSummary([
                `${matchedUsers} пользователей сопоставлено`,
                `${selectedLessons} уроков выбрано`,
                `${pending} доступов нужно открыть`,
                `${alreadyOpen} уже открыт${alreadyOpen === 1 ? '' : 'о'} и будет пропущено`
            ]);
            this.setStatus('Подтвердите открытие доступа.');
            this.renderState();
            return this;
        }

        showExecution(progress = {}) {
            this.mode = 'executing';
            const completed = Math.max(0, Number(progress.completed) || 0);
            const total = Math.max(0, Number(progress.total) || 0);
            const opened = Math.max(0, Number(progress.opened) || 0);
            const failures = Math.max(0, Number(progress.failures) || 0);
            const alreadyOpen = Math.max(0, Number(progress.alreadyOpen) || 0);
            if (this.elements) {
                this.elements.progress.hidden = false;
                this.elements.progress.max = total;
                this.elements.progress.value = completed;
            }
            const current = progress.current?.email && progress.current?.lessonName
                ? ` Сейчас: ${progress.current.email} — ${progress.current.lessonName}.`
                : '';
            this.setStatus(
                `Выполнено: ${completed} из ${total}. Открыто: ${opened}. Ошибок: ${failures}. `
                + `Уже открыто: ${alreadyOpen}.${current}`
            );
            this.renderState();
            return this;
        }

        showComplete(summary = {}) {
            const failures = Array.isArray(summary.failures) ? summary.failures : [];
            this.mode = failures.length ? 'partial-complete' : 'complete';
            this.clearMessages();
            if (this.elements) {
                this.elements.progress.hidden = true;
            }
            this.renderSummary([
                `Email запрошено: ${this.count(summary.requestedEmails, summary.requestedEmailCount)}`,
                `Пользователей сопоставлено: ${this.count(summary.matchedUsers, summary.matchedUserCount)}`,
                `Уроков выбрано: ${this.count(summary.selectedLessons, summary.selectedLessonCount)}`,
                `Доступов открыто: ${this.count(summary.opened, summary.openedCount)}`,
                `Уже открыто: ${this.count(summary.alreadyOpen, summary.alreadyOpenCount)}`,
                `Ошибок: ${this.count(failures, summary.failureCount)}`,
                `Попыток запросов: ${Math.max(0, Number(summary.attempts) || 0)}`
            ]);
            this.renderFailures(failures);
            this.setStatus(failures.length
                ? 'Завершено с ошибками. Скопируйте отчёт для подробностей.'
                : 'Готово.');
            this.renderState();
            return this;
        }

        showFatalError(error) {
            this.mode = 'fatal-error';
            this.clearMessages();
            this.renderErrors([error]);
            this.setStatus('Не удалось подготовить пакетное открытие доступа.', 'error');
            this.renderState();
            return this;
        }

        renderEmailState() {
            if (!this.elements) {
                return;
            }
            this.elements.emailCount.textContent = `Уникальных email: ${this.emailState.validCount}`;
            this.elements.malformedCount.textContent = `Некорректных: ${this.emailState.malformedCount}`;
        }

        renderLessons() {
            if (!this.elements) {
                return;
            }
            const list = this.elements.lessonsList;
            list.replaceChildren();
            const document = this.ownerDocument || root.document;
            if (!document?.createElement) {
                return;
            }
            if (this.lessons.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'edvibe-batch-access-empty';
                empty.textContent = 'Уроки не найдены.';
                list.appendChild(empty);
            }
            for (const lesson of this.lessons) {
                const lessonId = lesson.MarathonLessonId;
                const label = document.createElement('label');
                label.className = 'edvibe-batch-access-lesson';
                label.textContent = `${Number(lesson.Number) + 1}. ${lesson.Name || 'Без названия'}`;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = String(lessonId);
                checkbox.checked = this.selectedLessonIds.has(lessonId);
                checkbox.disabled = this.isEditingLocked();
                checkbox.addEventListener('change', () => this.selectLesson(lessonId, checkbox.checked));
                label.appendChild(checkbox);
                list.appendChild(label);
            }
            this.renderSelectionControls();
        }

        renderSelectionControls() {
            if (!this.elements) {
                return;
            }
            const selected = this.selectedLessonIds.size;
            const count = this.lessons.length;
            this.elements.selectAll.checked = count > 0 && selected === count;
            this.elements.selectAll.indeterminate = selected > 0 && selected < count;
        }

        renderErrors(errors) {
            if (!this.elements) {
                return;
            }
            const values = Array.isArray(errors) ? errors : [errors];
            const document = this.ownerDocument || root.document;
            this.elements.errors.replaceChildren();
            for (const error of values) {
                const entry = document?.createElement?.('p');
                if (!entry) {
                    continue;
                }
                entry.className = 'edvibe-batch-access-error';
                entry.textContent = typeof error === 'string'
                    ? error
                    : String(error?.message || 'Неизвестная ошибка.');
                this.elements.errors.appendChild(entry);
            }
            this.elements.errors.hidden = values.length === 0;
        }

        renderSummary(lines) {
            if (!this.elements) {
                return;
            }
            this.elements.summary.textContent = lines.join('\n');
            this.elements.summary.hidden = false;
        }

        renderFailures(failures) {
            if (!this.elements) {
                return;
            }
            const document = this.ownerDocument || root.document;
            this.elements.failures.replaceChildren();
            for (const failure of failures) {
                const entry = document?.createElement?.('p');
                if (!entry) {
                    continue;
                }
                const lessonNumber = Math.max(0, Number(failure?.lessonNumber) || 0);
                const attempts = Math.max(0, Number(failure?.attempts) || 0);
                entry.className = 'edvibe-batch-access-failure';
                entry.textContent = `${String(failure?.email || 'Email отсутствует')} — `
                    + `${lessonNumber}. ${String(failure?.lessonName || 'Урок без названия')} — `
                    + `${attempts} попытки — ${String(failure?.code || 'UNKNOWN_ERROR')}: `
                    + String(failure?.message || 'Неизвестная ошибка.');
                this.elements.failures.appendChild(entry);
            }
            this.elements.failures.hidden = failures.length === 0;
        }

        clearMessages() {
            if (!this.elements) {
                return;
            }
            this.elements.errors.replaceChildren();
            this.elements.errors.hidden = true;
            this.elements.summary.textContent = '';
            this.elements.summary.hidden = true;
            this.elements.failures.replaceChildren();
            this.elements.failures.hidden = true;
        }

        setStatus(message, state = '') {
            if (!this.elements) {
                return;
            }
            this.elements.status.textContent = String(message || '');
            this.elements.status.classList.toggle('is-error', state === 'error');
        }

        isEditingLocked() {
            return ['validating', 'confirm', 'executing', 'fatal-error'].includes(this.mode);
        }

        canClose() {
            return ['configure', 'validation-error', 'complete', 'partial-complete', 'fatal-error']
                .includes(this.mode);
        }

        canSubmit() {
            return this.mode === 'configure' || this.mode === 'validation-error'
                ? this.emailState.validCount > 0 && this.selectedLessonIds.size > 0
                : false;
        }

        renderState() {
            if (!this.elements) {
                return;
            }
            const locked = this.isEditingLocked();
            const completed = ['complete', 'partial-complete'].includes(this.mode);
            this.elements.emails.disabled = locked || this.mode === 'fatal-error';
            this.elements.selectAll.disabled = locked || this.lessons.length === 0;
            this.elements.clearAll.disabled = locked || this.selectedLessonIds.size === 0;
            this.elements.lessonsList.querySelectorAll('input').forEach((input) => {
                input.disabled = locked || this.mode === 'fatal-error';
            });
            this.elements.submit.hidden = !['configure', 'validation-error'].includes(this.mode);
            this.elements.submit.disabled = !this.canSubmit();
            this.elements.confirm.hidden = this.mode !== 'confirm';
            this.elements.confirm.disabled = this.mode !== 'confirm';
            this.elements.copy.hidden = !completed;
            this.elements.copy.disabled = !completed;
            this.elements.restart.hidden = !completed;
            this.elements.restart.disabled = !completed;
            this.elements.close.disabled = !this.canClose();
            if (this.mode !== 'executing') {
                this.elements.progress.hidden = true;
            }
        }

        selectLesson(lessonId, selected) {
            if (this.isEditingLocked()) {
                return;
            }
            if (selected) {
                this.selectedLessonIds.add(lessonId);
            } else {
                this.selectedLessonIds.delete(lessonId);
            }
            this.renderLessons();
            this.renderState();
        }

        handleInput() {
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-access-input-change', {
                detail: { emailInput: this.elements.emails.value }
            }));
        }

        handleSelectAll() {
            if (this.isEditingLocked()) {
                return;
            }
            this.selectedLessonIds = this.elements.selectAll.checked
                ? new Set(this.lessons.map((lesson) => lesson.MarathonLessonId))
                : new Set();
            this.renderLessons();
            this.renderState();
        }

        handleClearAll() {
            if (this.isEditingLocked()) {
                return;
            }
            this.selectedLessonIds = new Set();
            this.renderLessons();
            this.renderState();
        }

        handleSubmit() {
            if (!this.canSubmit()) {
                return;
            }
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-access-submit', {
                detail: {
                    emailInput: this.elements.emails.value,
                    selectedLessonIds: [...this.selectedLessonIds]
                }
            }));
        }

        handleConfirm() {
            if (this.mode === 'confirm') {
                this.dispatchEvent(new root.CustomEvent('edvibe-batch-access-confirm'));
            }
        }

        handleCopy() {
            if (['complete', 'partial-complete'].includes(this.mode)) {
                this.dispatchEvent(new root.CustomEvent('edvibe-batch-access-copy-report'));
            }
        }

        handleRestart() {
            if (!['complete', 'partial-complete'].includes(this.mode)) {
                return;
            }
            this.mode = 'configure';
            this.selectedLessonIds = new Set();
            this.elements.emails.value = '';
            this.setEmailState({ validCount: 0, malformedCount: 0 });
            this.clearMessages();
            this.setStatus('');
            this.renderLessons();
            this.renderState();
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-access-restart'));
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

        count(value, fallback) {
            if (Array.isArray(value)) {
                return value.length;
            }
            if (Number.isFinite(Number(value))) {
                return Math.max(0, Number(value));
            }
            return Math.max(0, Number(fallback) || 0);
        }
    }

    if (root.customElements && !root.customElements.get(BATCH_ACCESS_DIALOG_TAG)) {
        root.customElements.define(BATCH_ACCESS_DIALOG_TAG, BatchLessonAccessDialog);
    }

    return {
        BATCH_ACCESS_DIALOG_TAG,
        BATCH_ACCESS_OVERLAY_ID,
        BatchLessonAccessDialog
    };
});
