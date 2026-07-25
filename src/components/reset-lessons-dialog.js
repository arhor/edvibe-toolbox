(function initializeResetDialogComponent(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], () => factory(root));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root);
    } else {
        root.EdVibeResetDialogComponent = factory(root);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createResetDialogComponent(root) {
    'use strict';

    const RESET_DIALOG_TAG = 'edvibe-toolbox-reset-dialog';
    const RESET_OVERLAY_ID = 'edvibe-toolbox-reset-overlay';
    
    const HTMLElementBase = root.HTMLElement || class {};
    const resetDialogTemplate = root.document?.createElement?.('template') || null;

    if (resetDialogTemplate) {
        resetDialogTemplate.innerHTML = `
            <link class="edvibe-reset-stylesheet" rel="stylesheet">
            <div class="edvibe-reset-overlay">
                <div class="edvibe-reset-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-reset-title">
                    <div class="edvibe-reset-header">
                        <div>
                            <h2 id="edvibe-reset-title" class="edvibe-reset-title">
                                Сброс уроков
                            </h2>
                            <p class="edvibe-reset-subtitle">
                                <span class="edvibe-reset-step-indicator">Шаг 1 из 2</span>
                                <span class="edvibe-reset-step-description">Выберите пользователя.</span>
                            </p>
                        </div>
                        <button class="edvibe-reset-close" type="button" aria-label="Закрыть">
                            &times;
                        </button>
                    </div>
                    <div class="edvibe-reset-body">
                        <section class="edvibe-reset-user-step" aria-label="Выбор пользователя">
                            <label class="edvibe-reset-label" for="edvibe-reset-search">
                                Поиск по email
                            </label>
                            <input id="edvibe-reset-search" class="edvibe-reset-search" type="search" placeholder="user@example.com" autocomplete="off">
                            <div class="edvibe-reset-pupils-shell">
                                <div class="edvibe-reset-list edvibe-reset-pupils" role="listbox" aria-label="Пользователи марафона"></div>
                                <div class="edvibe-reset-pupils-loading" role="status" aria-live="polite" hidden>
                                    <span class="edvibe-reset-spinner" aria-hidden="true"></span>
                                    <span>Загрузка пользователей...</span>
                                </div>
                            </div>
                        </section>
                        <section class="edvibe-reset-lesson-step" aria-label="Выбор уроков" hidden>
                            <div class="edvibe-reset-label edvibe-reset-selected-pupil"></div>
                            <label class="edvibe-reset-select-all">
                                <input class="edvibe-reset-select-all-input" type="checkbox">
                                Выбрать все уроки
                            </label>
                            <div class="edvibe-reset-list edvibe-reset-lessons" aria-label="Уроки пользователя" tabindex="-1"></div>
                        </section>
                    </div>
                    <div class="edvibe-reset-live-region">
                        <p class="edvibe-reset-status" aria-live="polite"></p>
                        <progress class="edvibe-reset-progress" max="100"
                            value="0"></progress>
                    </div>
                    <div class="edvibe-reset-footer">
                        <button class="edvibe-reset-button edvibe-reset-cancel" type="button">
                            Закрыть
                        </button>
                        <button class="edvibe-reset-button edvibe-reset-back" type="button" hidden>
                            Назад
                        </button>
                        <button class="edvibe-reset-button edvibe-reset-next" type="button" disabled>
                            Далее
                        </button>
                        <button class="edvibe-reset-button edvibe-reset-submit" type="button" disabled hidden>
                            Сбросить прогресс
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    class ResetLessonsDialog extends HTMLElementBase {
        constructor() {
            super();
            this.stylesheetUrl = '';
            this.searchDelay = 1000;
            this.log = () => {};
            this.loadLessons = null;
            this.loadNextPupils = null;

            this.currentStep = 'user';
            this.allPupils = [];
            this.pupilTotal = 0;
            this.selectedPupil = null;
            this.loadedPupilId = null;
            this.lessons = [];
            this.selectedLessonIds = new Set();
            this.locked = false;
            this.loading = false;
            this.finished = false;
            this.closed = false;
            this.pupilPagePromise = null;
            this.pupilPageLoading = false;
            this.searchTimer = null;
            this.searchGeneration = 0;
            this.appliedSearchQuery = '';
            this.searchDebouncing = false;
            this.suppressPupilPageLoading = false;
            this.rendered = false;
            this.listenersConnected = false;

            if (typeof this.attachShadow !== 'function' || !resetDialogTemplate) return;
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.append(resetDialogTemplate.content.cloneNode(true));
            this.cacheElements();
            this.updateStylesheet();
            this.rendered = true;
            this.renderState();
        }

        connectedCallback() {
            if (!this.id) {
                this.id = RESET_OVERLAY_ID;
            }
            this.render();
            this.connectListeners();
        }

        disconnectedCallback() {
            this.disconnectListeners();
        }

        configure(options = {}) {
            options = options && typeof options === 'object' ? options : {};
            const {
                stylesheetUrl = '',
                searchDelay = 1000,
                loadLessons,
                loadNextPupils,
                log = () => {}
            } = options;
            this.stylesheetUrl = String(stylesheetUrl || '');
            this.searchDelay = Number.isFinite(Number(searchDelay))
                ? Math.max(0, Number(searchDelay))
                : 1000;
            this.loadLessons = typeof loadLessons === 'function' ? loadLessons : null;
            this.loadNextPupils = typeof loadNextPupils === 'function'
                ? loadNextPupils
                : null;
            this.log = typeof log === 'function' ? log : () => {};
            this.updateStylesheet();
            return this;
        }

        render() {
            return this.rendered;
        }

        cacheElements() {
            if (!this.shadowRoot) return;
            const find = (selector) => this.shadowRoot.querySelector(selector);
            this.elements = {
                stylesheet: find('.edvibe-reset-stylesheet'),
                backdrop: find('.edvibe-reset-overlay'),
                search: find('.edvibe-reset-search'),
                userStep: find('.edvibe-reset-user-step'),
                lessonStep: find('.edvibe-reset-lesson-step'),
                stepIndicator: find('.edvibe-reset-step-indicator'),
                stepDescription: find('.edvibe-reset-step-description'),
                pupilsShell: find('.edvibe-reset-pupils-shell'),
                pupilsList: find('.edvibe-reset-pupils'),
                pupilsLoading: find('.edvibe-reset-pupils-loading'),
                lessonsList: find('.edvibe-reset-lessons'),
                selectedPupilLabel: find('.edvibe-reset-selected-pupil'),
                selectAll: find('.edvibe-reset-select-all-input'),
                status: find('.edvibe-reset-status'),
                progress: find('.edvibe-reset-progress'),
                close: find('.edvibe-reset-close'),
                cancel: find('.edvibe-reset-cancel'),
                back: find('.edvibe-reset-back'),
                next: find('.edvibe-reset-next'),
                submit: find('.edvibe-reset-submit')
            };
        }

        connectListeners() {
            if (!this.rendered || this.listenersConnected) return;
            this.listenersConnected = true;

            this.handleSearchInput = this.handleSearchInput.bind(this);
            this.handlePupilsScroll = this.handlePupilsScroll.bind(this);
            this.handleSelectAll = this.handleSelectAll.bind(this);
            this.handleNext = this.handleNext.bind(this);
            this.handleBack = this.handleBack.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleClose = this.close.bind(this);
            this.handleBackdropClick = this.handleBackdropClick.bind(this);
            this.handleKeydown = this.handleKeydown.bind(this);

            this.elements.search.addEventListener('input', this.handleSearchInput);
            this.elements.pupilsList.addEventListener('scroll', this.handlePupilsScroll);
            this.elements.selectAll.addEventListener('change', this.handleSelectAll);
            this.elements.next.addEventListener('click', this.handleNext);
            this.elements.back.addEventListener('click', this.handleBack);
            this.elements.submit.addEventListener('click', this.handleSubmit);
            this.elements.close.addEventListener('click', this.handleClose);
            this.elements.cancel.addEventListener('click', this.handleClose);
            this.elements.backdrop.addEventListener('click', this.handleBackdropClick);
            this.ownerDocument.addEventListener('keydown', this.handleKeydown);
        }

        disconnectListeners() {
            if (!this.listenersConnected) return;
            this.listenersConnected = false;
            this.cancelSearch();

            this.elements.search.removeEventListener('input', this.handleSearchInput);
            this.elements.pupilsList.removeEventListener('scroll', this.handlePupilsScroll);
            this.elements.selectAll.removeEventListener('change', this.handleSelectAll);
            this.elements.next.removeEventListener('click', this.handleNext);
            this.elements.back.removeEventListener('click', this.handleBack);
            this.elements.submit.removeEventListener('click', this.handleSubmit);
            this.elements.close.removeEventListener('click', this.handleClose);
            this.elements.cancel.removeEventListener('click', this.handleClose);
            this.elements.backdrop.removeEventListener('click', this.handleBackdropClick);
            this.ownerDocument.removeEventListener('keydown', this.handleKeydown);
        }

        updateStylesheet() {
            if (this.elements?.stylesheet) {
                this.elements.stylesheet.setAttribute('href', this.stylesheetUrl);
            }
        }

        normalizeSearchQuery(value) {
            return String(value || '').trim().toLowerCase();
        }

        filterPupils(query) {
            const normalized = this.normalizeSearchQuery(query);
            if (!normalized) return this.allPupils;
            return this.allPupils.filter((pupil) =>
                String(pupil.Email || '').toLowerCase().includes(normalized)
            );
        }

        hasMorePupils() {
            return this.allPupils.length < this.pupilTotal;
        }

        hasLoadedLessonsForSelectedPupil() {
            return Boolean(this.selectedPupil)
                && this.selectedPupil.PupilId === this.loadedPupilId;
        }

        isPupilLoadingVisible() {
            return this.loading
                || (this.pupilPageLoading && !this.suppressPupilPageLoading);
        }

        getViewState() {
            const blocked = this.loading || this.locked || this.finished;
            const showingUsers = this.currentStep === 'user';
            return {
                showingUsers,
                nextDisabled: blocked || !this.selectedPupil,
                backDisabled: this.loading || this.locked,
                submitDisabled: blocked
                    || !this.selectedPupil
                    || this.selectedLessonIds.size === 0,
                closeDisabled: this.loading || this.locked
            };
        }

        setStatus(message, state = '') {
            if (!this.elements) return;
            this.elements.status.textContent = message;
            this.elements.status.classList.toggle('is-error', state === 'error');
            this.elements.status.classList.toggle('is-success', state === 'success');
        }

        renderState() {
            if (!this.rendered) return;
            const view = this.getViewState();
            const inputsBlocked = this.locked || this.loading || this.finished;

            this.elements.userStep.hidden = !view.showingUsers;
            this.elements.lessonStep.hidden = view.showingUsers;
            this.elements.next.hidden = !view.showingUsers;
            this.elements.next.disabled = view.nextDisabled;
            this.elements.back.hidden = view.showingUsers;
            this.elements.back.disabled = view.backDisabled;
            this.elements.back.textContent = this.finished
                ? 'Сбросить для другого пользователя'
                : 'Назад';
            this.elements.submit.hidden = view.showingUsers;
            this.elements.submit.disabled = view.submitDisabled;
            this.elements.search.disabled = inputsBlocked;
            this.elements.close.disabled = view.closeDisabled;
            this.elements.cancel.disabled = view.closeDisabled;
            this.elements.lessonsList.querySelectorAll('input').forEach((input) => {
                input.disabled = inputsBlocked;
            });
            this.elements.selectAll.disabled = inputsBlocked || this.lessons.length === 0;
            this.elements.stepIndicator.textContent = view.showingUsers
                ? 'Шаг 1 из 2'
                : 'Шаг 2 из 2';
            this.elements.stepDescription.textContent = view.showingUsers
                ? 'Выберите пользователя.'
                : 'Выберите уроки для сброса прогресса.';
            this.renderPupilLoadingState();
        }

        renderPupilLoadingState() {
            const busy = this.isPupilLoadingVisible();
            this.elements.pupilsShell.classList.toggle('is-loading', busy);
            this.elements.pupilsLoading.hidden = !busy;
            this.elements.pupilsList.setAttribute('aria-busy', String(busy));
            this.elements.pupilsList.inert = busy;
            this.elements.pupilsList.querySelectorAll('button').forEach((button) => {
                button.disabled = busy || this.locked || this.finished;
            });
        }

        renderPupils() {
            const list = this.elements.pupilsList;
            list.replaceChildren();
            const visiblePupils = this.filterPupils(this.appliedSearchQuery);

            if (visiblePupils.length === 0) {
                const empty = this.ownerDocument.createElement('p');
                empty.className = 'edvibe-reset-empty';
                empty.textContent = 'Пользователи не найдены.';
                list.appendChild(empty);
                return;
            }

            for (const pupil of visiblePupils) {
                const row = this.ownerDocument.createElement('button');
                row.type = 'button';
                row.className = 'edvibe-reset-row';
                row.setAttribute('role', 'option');
                const selected = pupil.PupilId === this.selectedPupil?.PupilId;
                row.setAttribute('aria-selected', String(selected));
                row.classList.toggle('is-selected', selected);
                row.disabled = this.locked || this.finished || this.isPupilLoadingVisible();

                const copy = this.ownerDocument.createElement('span');
                copy.className = 'edvibe-reset-row-copy';
                const name = this.ownerDocument.createElement('span');
                name.className = 'edvibe-reset-row-name';
                name.textContent = pupil.Name || 'Без имени';
                const email = this.ownerDocument.createElement('span');
                email.className = 'edvibe-reset-row-email';
                email.textContent = pupil.Email || 'Email отсутствует';
                copy.append(name, email);
                row.appendChild(copy);
                row.addEventListener('click', () => this.selectPupil(pupil));
                list.appendChild(row);
            }
        }

        selectPupil(pupil) {
            if (
                this.locked
                || this.finished
                || this.isPupilLoadingVisible()
                || pupil.PupilId === this.selectedPupil?.PupilId
            ) return;

            if (pupil.PupilId !== this.loadedPupilId) {
                this.loadedPupilId = null;
                this.lessons = [];
                this.selectedLessonIds = new Set();
                this.renderLessons();
            }
            this.selectedPupil = pupil;
            this.setStatus(`Выбран пользователь: ${pupil.Email || 'email отсутствует'}`);
            this.renderPupils();
            this.renderState();
        }

        renderLessons() {
            const list = this.elements.lessonsList;
            list.replaceChildren();

            if (this.lessons.length === 0) {
                const empty = this.ownerDocument.createElement('p');
                empty.className = 'edvibe-reset-empty';
                empty.textContent = 'Для пользователя нет уроков.';
                list.appendChild(empty);
            }

            for (const lesson of this.lessons) {
                const label = this.ownerDocument.createElement('label');
                label.className = 'edvibe-reset-row edvibe-reset-lesson';
                const checkbox = this.ownerDocument.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = String(lesson.MarathonLessonId);
                checkbox.checked = this.selectedLessonIds.has(lesson.MarathonLessonId);
                checkbox.disabled = this.locked || this.loading || this.finished;

                const copy = this.ownerDocument.createElement('span');
                copy.className = 'edvibe-reset-row-copy';
                const name = this.ownerDocument.createElement('span');
                name.className = 'edvibe-reset-row-name';
                name.textContent = `${Number(lesson.Number) + 1}. ${lesson.Name}`;
                const requestStatus = this.ownerDocument.createElement('span');
                requestStatus.className = 'edvibe-reset-row-email';
                requestStatus.textContent = lesson.LastRequest
                    ? `Статус последнего запроса: ${lesson.LastRequest.Status}`
                    : 'Нет запросов на проверку';
                copy.append(name, requestStatus);
                label.append(checkbox, copy);
                checkbox.addEventListener('change', () =>
                    this.toggleLesson(lesson.MarathonLessonId, checkbox.checked)
                );
                list.appendChild(label);
            }

            this.elements.selectAll.checked = this.lessons.length > 0
                && this.selectedLessonIds.size === this.lessons.length;
            this.elements.selectAll.indeterminate = this.selectedLessonIds.size > 0
                && this.selectedLessonIds.size < this.lessons.length;
            this.renderState();
        }

        toggleLesson(lessonId, selected) {
            if (selected) this.selectedLessonIds.add(lessonId);
            else this.selectedLessonIds.delete(lessonId);
            this.elements.selectAll.checked = this.lessons.length > 0
                && this.selectedLessonIds.size === this.lessons.length;
            this.elements.selectAll.indeterminate = this.selectedLessonIds.size > 0
                && this.selectedLessonIds.size < this.lessons.length;
            this.renderState();
        }

        handleSelectAll() {
            this.selectedLessonIds = this.elements.selectAll.checked
                ? new Set(this.lessons.map((lesson) => lesson.MarathonLessonId))
                : new Set();
            this.renderLessons();
        }

        handleSearchInput() {
            this.searchGeneration += 1;
            this.cancelSearchTimer();
            this.searchDebouncing = true;
            this.suppressPupilPageLoading = true;
            this.renderPupilLoadingState();
            const query = this.normalizeSearchQuery(this.elements.search.value);
            const generation = this.searchGeneration;
            this.searchTimer = root.setTimeout(async () => {
                if (!this.isCurrentSearch(generation, query)) return;
                this.searchTimer = null;
                const needsRemotePupils = Boolean(
                    query && this.filterPupils(query).length === 0 && this.hasMorePupils()
                );
                this.searchDebouncing = false;
                if (needsRemotePupils || !this.pupilPageLoading) {
                    this.suppressPupilPageLoading = false;
                }
                this.renderPupilLoadingState();
                if (needsRemotePupils && !await this.continueSearch(generation, query)) return;
                if (!this.isCurrentSearch(generation, query)) return;
                this.appliedSearchQuery = query;
                this.renderPupils();
            }, this.searchDelay);
        }

        isCurrentSearch(generation, query) {
            return !this.closed
                && generation === this.searchGeneration
                && query === this.normalizeSearchQuery(this.elements.search.value);
        }

        cancelSearchTimer() {
            if (this.searchTimer === null) return;
            root.clearTimeout(this.searchTimer);
            this.searchTimer = null;
        }

        cancelSearch() {
            this.searchGeneration += 1;
            this.cancelSearchTimer();
        }

        async continueSearch(generation, query) {
            while (
                this.isCurrentSearch(generation, query)
                && this.filterPupils(query).length === 0
                && this.hasMorePupils()
            ) {
                if (!await this.loadNextPupilPage()) return false;
            }
            return true;
        }

        async loadNextPupilPage() {
            if (this.closed || !this.loadNextPupils || !this.hasMorePupils()) return false;
            if (this.pupilPagePromise) return this.pupilPagePromise;

            this.suppressPupilPageLoading = false;
            this.pupilPageLoading = true;
            this.renderPupilLoadingState();
            this.pupilPagePromise = (async () => {
                try {
                    const page = await this.loadNextPupils();
                    if (this.closed) return false;
                    this.allPupils = page.pupils;
                    this.pupilTotal = page.total;
                    this.renderPupils();
                    if (this.currentStep === 'user' && !this.loading) {
                        this.setStatus(
                            `Загружено пользователей: ${this.allPupils.length} `
                            + `из ${this.pupilTotal}`
                        );
                    }
                    return true;
                } catch (error) {
                    if (!this.closed && this.currentStep === 'user' && !this.loading) {
                        this.log(`Failed to load another pupil page (${this.errorType(error)}).`);
                        this.setStatus(error.message, 'error');
                    }
                    return false;
                } finally {
                    this.pupilPagePromise = null;
                    this.pupilPageLoading = false;
                    if (!this.searchDebouncing) this.suppressPupilPageLoading = false;
                    this.renderPupilLoadingState();
                }
            })();
            return this.pupilPagePromise;
        }

        handlePupilsScroll() {
            if (this.searchDebouncing) return;
            const list = this.elements.pupilsList;
            const distanceFromBottom = list.scrollHeight - list.scrollTop - list.clientHeight;
            if (distanceFromBottom <= 24) this.loadNextPupilPage();
        }

        async handleNext() {
            if (this.elements.next.disabled || !this.selectedPupil) return;
            if (this.hasLoadedLessonsForSelectedPupil()) {
                this.currentStep = 'lessons';
                this.renderState();
                this.elements.lessonsList.focus();
                return;
            }
            if (!this.loadLessons) return;

            try {
                this.setLoading(`Загрузка уроков для ${this.selectedPupil.Email}...`);
                const lessons = await this.loadLessons(this.selectedPupil);
                this.showLessons(this.selectedPupil, lessons);
            } catch (error) {
                this.loading = false;
                this.currentStep = 'user';
                this.renderState();
                this.log(
                    `Failed to load lessons for PupilId ${this.selectedPupil.PupilId} `
                    + `(${this.errorType(error)}).`
                );
                this.setStatus(error.message, 'error');
            }
        }

        handleBack() {
            if (this.elements.back.disabled) return;
            if (this.finished) {
                this.resetForAnotherUser();
                return;
            }
            this.currentStep = 'user';
            this.setStatus(
                `Выбран пользователь: ${this.selectedPupil?.Email || 'email отсутствует'}`
            );
            this.renderState();
            this.elements.search.focus();
        }

        handleSubmit() {
            if (this.elements.submit.disabled) return;
            this.dispatchEvent(new root.CustomEvent('edvibe-reset-request', {
                detail: {
                    pupil: this.selectedPupil,
                    lessons: this.lessons.filter((lesson) =>
                        this.selectedLessonIds.has(lesson.MarathonLessonId)
                    )
                }
            }));
        }

        handleBackdropClick(event) {
            if (event.target === this.elements.backdrop) this.close();
        }

        handleKeydown(event) {
            if (event.key === 'Escape') this.close();
        }

        close() {
            if (this.locked || this.loading || this.closed) return;
            this.closed = true;
            this.cancelSearch();
            this.dispatchEvent(new root.CustomEvent('edvibe-dialog-close'));
            this.remove();
        }

        resetForAnotherUser() {
            this.finished = false;
            this.currentStep = 'user';
            this.selectedPupil = null;
            this.loadedPupilId = null;
            this.lessons = [];
            this.selectedLessonIds = new Set();
            this.elements.search.value = '';
            this.appliedSearchQuery = '';
            this.cancelSearch();
            this.searchDebouncing = false;
            this.suppressPupilPageLoading = false;
            this.elements.selectedPupilLabel.textContent = '';
            this.elements.progress.classList.remove('is-visible', 'is-indeterminate');
            this.elements.progress.value = 0;
            this.setStatus(
                `Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`
            );
            this.renderLessons();
            this.renderPupils();
            this.renderState();
            this.elements.search.focus();
        }

        showPupils(options = {}) {
            if (!this.elements) return this;
            options = options && typeof options === 'object' ? options : {};
            const pupils = Array.isArray(options.pupils) ? options.pupils : [];
            const total = Number.isFinite(Number(options.total))
                ? Number(options.total)
                : pupils.length;
            this.allPupils = pupils;
            this.pupilTotal = total;
            this.currentStep = 'user';
            this.loading = false;
            this.setStatus(`Загружено пользователей: ${pupils.length} из ${total}`);
            this.renderPupils();
            this.renderState();
            this.elements.search.focus();
            return this;
        }

        showLessons(pupil, lessons) {
            if (!this.elements || !pupil || typeof pupil !== 'object') return this;
            lessons = Array.isArray(lessons) ? lessons : [];
            const pupilChanged = this.loadedPupilId !== pupil.PupilId;
            this.selectedPupil = pupil;
            this.loadedPupilId = pupil.PupilId;
            this.lessons = lessons;
            if (pupilChanged) this.selectedLessonIds = new Set();
            this.loading = false;
            this.currentStep = 'lessons';
            this.elements.selectedPupilLabel.textContent =
                `${pupil.Name || 'Без имени'} — ${pupil.Email || ''}`;
            this.setStatus(`Загружено уроков: ${lessons.length}`);
            this.renderLessons();
            this.renderState();
            this.elements.lessonsList.focus();
            return this;
        }

        setLoading(message) {
            this.loading = true;
            this.setStatus(message);
            this.renderState();
        }

        lock() {
            this.locked = true;
            this.classList.toggle('is-running', true);
            this.renderLessons();
            this.renderState();
        }

        completeRun() {
            this.locked = false;
            this.finished = true;
            this.classList.toggle('is-running', false);
            this.renderState();
        }

        unlockAfterRun() {
            this.locked = false;
            this.finished = false;
            this.classList.toggle('is-running', false);
            this.renderState();
        }

        showDiscovery(message) {
            this.setStatus(message);
            this.elements.progress.classList.add('is-visible', 'is-indeterminate');
            this.elements.progress.removeAttribute('value');
        }

        showProgress(options = {}) {
            if (!this.elements) return;
            options = options && typeof options === 'object' ? options : {};
            const completed = Number(options.completed) || 0;
            const total = Number(options.total) || 0;
            const lesson = options.lesson && typeof options.lesson === 'object'
                ? options.lesson
                : {};
            const exerciseId = options.exerciseId;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 100;
            const detail = exerciseId ? `Упражнение ${exerciseId}` : 'Удаление запроса урока';
            this.setStatus(`${lesson.Name}\n${detail} — ${completed} / ${total}`);
            this.elements.progress.classList.add('is-visible');
            this.elements.progress.classList.remove('is-indeterminate');
            this.elements.progress.value = percent;
        }

        showComplete(message) {
            this.setStatus(message, 'success');
            this.elements.progress.classList.add('is-visible');
            this.elements.progress.classList.remove('is-indeterminate');
            this.elements.progress.value = 100;
        }

        showError(message) {
            if (!this.locked) {
                this.loading = false;
                this.renderState();
            }
            this.setStatus(message, 'error');
            this.elements.progress.classList.remove('is-indeterminate');
        }

        errorType(error) {
            return typeof error?.name === 'string' ? error.name : 'Error';
        }
    }

    if (root.customElements && root.HTMLElement) {
        const existing = root.customElements.get(RESET_DIALOG_TAG);
        if (!existing) {
            root.customElements.define(RESET_DIALOG_TAG, ResetLessonsDialog);
        }
    }

    return {
        RESET_DIALOG_TAG,
        RESET_OVERLAY_ID,
        ResetLessonsDialog,
    };
});
