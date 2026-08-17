import { LitElement, html, nothing } from 'lit';

import { resetLessonsDialogStyles } from '#src/content/main/features/reset-lessons/reset-lessons-dialog.styles.js';
import {
    componentFoundationStyles,
    dialogFoundationStyles
} from '#src/content/main/styles/foundations.js';
import {
    controlStyles,
    dialogShellStyles,
    emptyStateStyles,
    fieldStyles,
    progressStyles
} from '#src/content/main/styles/primitives.js';

const RESET_DIALOG_TAG = 'edvibe-toolbox-reset-dialog';
const RESET_OVERLAY_ID = 'edvibe-toolbox-reset-overlay';

class ResetLessonsDialog extends LitElement {
    static styles = [
        componentFoundationStyles,
        dialogFoundationStyles,
        dialogShellStyles,
        controlStyles,
        fieldStyles,
        progressStyles,
        emptyStateStyles,
        resetLessonsDialogStyles
    ];

    static properties = {
        currentStep: { state: true },
        allPupils: { state: true },
        pupilTotal: { state: true },
        selectedPupil: { state: true },
        lessons: { state: true },
        selectedLessonIds: { state: true },
        locked: { state: true },
        loading: { state: true },
        finished: { state: true },
        pupilPageLoading: { state: true },
        appliedSearchQuery: { state: true },
        searchDebouncing: { state: true },
        suppressPupilPageLoading: { state: true },
        searchValue: { state: true },
        statusMessage: { state: true },
        statusState: { state: true },
        progressVisible: { state: true },
        progressIndeterminate: { state: true },
        progressValue: { state: true }
    };

    constructor() {
        super();
        this.searchDelay = 1000;
        this.log = () => { };
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
        this.searchValue = '';
        this.statusMessage = '';
        this.statusState = '';
        this.progressVisible = false;
        this.progressIndeterminate = false;
        this.progressValue = 0;
        this.elements = null;
        this.handleKeydownBound = (event) => this.handleKeydown(event);
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.id) this.id = RESET_OVERLAY_ID;
        this.ownerDocument?.addEventListener('keydown', this.handleKeydownBound);
    }

    disconnectedCallback() {
        this.cancelSearch();
        this.ownerDocument?.removeEventListener('keydown', this.handleKeydownBound);
        super.disconnectedCallback();
    }

    configure(options = {}) {
        const normalizedOptions = options && typeof options === 'object' ? options : {};
        const { searchDelay = 1000, loadLessons, loadNextPupils, log = () => { } } = normalizedOptions;
        this.searchDelay = Number.isFinite(Number(searchDelay)) ? Math.max(0, Number(searchDelay)) : 1000;
        this.loadLessons = typeof loadLessons === 'function' ? loadLessons : null;
        this.loadNextPupils = typeof loadNextPupils === 'function' ? loadNextPupils : null;
        this.log = typeof log === 'function' ? log : () => { };
        return this;
    }

    updated() { this.cacheElements(); }

    cacheElements() {
        if (!this.shadowRoot) { this.elements = null; return; }
        const find = (selector) => this.shadowRoot.querySelector(selector);
        this.elements = {
            backdrop: find('.edvibe-reset-overlay'), search: find('.edvibe-reset-search'),
            userStep: find('.edvibe-reset-user-step'), lessonStep: find('.edvibe-reset-lesson-step'), pupilsShell: find('.edvibe-reset-pupils-shell'),
            pupilsList: find('.edvibe-reset-pupils'), pupilsLoading: find('.edvibe-reset-pupils-loading'), lessonsList: find('.edvibe-reset-lessons'),
            selectAll: find('.edvibe-reset-select-all-input'), status: find('.edvibe-reset-status'), progress: find('.edvibe-reset-progress'),
            close: find('.edvibe-reset-close'), cancel: find('.edvibe-reset-cancel'), back: find('.edvibe-reset-back'),
            next: find('.edvibe-reset-next'), submit: find('.edvibe-reset-submit')
        };
    }

    normalizeSearchQuery(value) { return String(value || '').trim().toLowerCase(); }
    filterPupils(query) {
        const normalized = this.normalizeSearchQuery(query);
        return normalized ? this.allPupils.filter((pupil) => String(pupil.Email || '').toLowerCase().includes(normalized)) : this.allPupils;
    }
    hasMorePupils() { return this.allPupils.length < this.pupilTotal; }
    hasLoadedLessonsForSelectedPupil() { return Boolean(this.selectedPupil) && this.selectedPupil.PupilId === this.loadedPupilId; }
    isPupilLoadingVisible() { return this.loading || (this.pupilPageLoading && !this.suppressPupilPageLoading); }
    getViewState() {
        const blocked = this.loading || this.locked || this.finished;
        const showingUsers = this.currentStep === 'user';
        return {
            showingUsers, nextDisabled: blocked || !this.selectedPupil, backDisabled: this.loading || this.locked,
            submitDisabled: blocked || !this.selectedPupil || this.selectedLessonIds.size === 0,
            closeDisabled: this.loading || this.locked
        };
    }
    setStatus(message, state = '') { this.statusMessage = String(message || ''); this.statusState = state === 'error' || state === 'success' ? state : ''; }
    renderState() { this.requestUpdate(); }
    renderPupilLoadingState() { this.requestUpdate(); }
    renderPupils() { this.requestUpdate(); }

    selectPupil(pupil) {
        if (this.locked || this.finished || this.isPupilLoadingVisible() || pupil.PupilId === this.selectedPupil?.PupilId) return;
        if (pupil.PupilId !== this.loadedPupilId) { this.loadedPupilId = null; this.lessons = []; this.selectedLessonIds = new Set(); }
        this.selectedPupil = pupil;
        this.setStatus(`Выбран пользователь: ${pupil.Email || 'email отсутствует'}`);
    }
    renderLessons() { this.requestUpdate(); }
    toggleLesson(lessonId, selected) {
        if (selected) this.selectedLessonIds.add(lessonId); else this.selectedLessonIds.delete(lessonId);
        this.requestUpdate();
    }
    handleSelectAll(event) {
        const checked = event?.currentTarget?.checked ?? this.elements?.selectAll?.checked;
        this.selectedLessonIds = checked ? new Set(this.lessons.map((lesson) => lesson.MarathonLessonId)) : new Set();
    }
    handleSearchInput(event) {
        this.searchValue = String(event?.currentTarget?.value ?? this.searchValue);
        this.searchGeneration += 1;
        this.cancelSearchTimer();
        this.searchDebouncing = true;
        this.suppressPupilPageLoading = true;
        const query = this.normalizeSearchQuery(this.searchValue);
        const generation = this.searchGeneration;
        this.searchTimer = globalThis.setTimeout(async () => {
            if (!this.isCurrentSearch(generation, query)) return;
            this.searchTimer = null;
            const needsRemotePupils = Boolean(query && this.filterPupils(query).length === 0 && this.hasMorePupils());
            this.searchDebouncing = false;
            if (needsRemotePupils || !this.pupilPageLoading) this.suppressPupilPageLoading = false;
            if (needsRemotePupils && !await this.continueSearch(generation, query)) return;
            if (!this.isCurrentSearch(generation, query)) return;
            this.appliedSearchQuery = query;
        }, this.searchDelay);
    }
    isCurrentSearch(generation, query) { return !this.closed && generation === this.searchGeneration && query === this.normalizeSearchQuery(this.searchValue); }
    cancelSearchTimer() { if (this.searchTimer !== null) { globalThis.clearTimeout(this.searchTimer); this.searchTimer = null; } }
    cancelSearch() { this.searchGeneration += 1; this.cancelSearchTimer(); }
    async continueSearch(generation, query) {
        while (this.isCurrentSearch(generation, query) && this.filterPupils(query).length === 0 && this.hasMorePupils()) {
            if (!await this.loadNextPupilPage()) return false;
        }
        return true;
    }
    async loadNextPupilPage() {
        if (this.closed || !this.loadNextPupils || !this.hasMorePupils()) return false;
        if (this.pupilPagePromise) return this.pupilPagePromise;
        this.suppressPupilPageLoading = false;
        this.pupilPageLoading = true;
        this.pupilPagePromise = (async () => {
            try {
                const page = await this.loadNextPupils();
                if (this.closed) return false;
                this.allPupils = Array.isArray(page?.pupils) ? page.pupils : [];
                this.pupilTotal = Number(page?.total) || 0;
                if (this.currentStep === 'user' && !this.loading) this.setStatus(`Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`);
                return true;
            } catch (error) {
                if (!this.closed && this.currentStep === 'user' && !this.loading) { this.log(`Failed to load another pupil page (${this.errorType(error)}).`); this.setStatus(error.message, 'error'); }
                return false;
            } finally {
                this.pupilPagePromise = null; this.pupilPageLoading = false; if (!this.searchDebouncing) this.suppressPupilPageLoading = false;
            }
        })();
        return this.pupilPagePromise;
    }
    handlePupilsScroll(event) {
        if (this.searchDebouncing) return;
        const list = event?.currentTarget || this.elements?.pupilsList;
        if (!list) return;
        if (list.scrollHeight - list.scrollTop - list.clientHeight <= 24) this.loadNextPupilPage();
    }
    async handleNext() {
        if (this.getViewState().nextDisabled || !this.selectedPupil) return;
        if (this.hasLoadedLessonsForSelectedPupil()) {
            this.currentStep = 'lessons';
            await this.updateComplete;
            this.shadowRoot?.querySelector('.edvibe-reset-lessons')?.focus();
            return;
        }
        if (!this.loadLessons) return;
        try {
            this.setLoading(`Загрузка уроков для ${this.selectedPupil.Email}...`);
            const lessons = await this.loadLessons(this.selectedPupil);
            this.showLessons(this.selectedPupil, lessons);
        } catch (error) {
            this.loading = false; this.currentStep = 'user';
            this.log(`Failed to load lessons for PupilId ${this.selectedPupil.PupilId} (${this.errorType(error)}).`);
            this.setStatus(error.message, 'error');
        }
    }
    handleBack() {
        if (this.getViewState().backDisabled) return;
        if (this.finished) { this.resetForAnotherUser(); return; }
        this.currentStep = 'user';
        this.setStatus(`Выбран пользователь: ${this.selectedPupil?.Email || 'email отсутствует'}`);
        this.updateComplete.then(() => this.shadowRoot?.querySelector('.edvibe-reset-search')?.focus());
    }
    handleSubmit() {
        if (this.getViewState().submitDisabled) return;
        this.dispatchEvent(new CustomEvent('edvibe-reset-request', { detail: { pupil: this.selectedPupil, lessons: this.lessons.filter((lesson) => this.selectedLessonIds.has(lesson.MarathonLessonId)) } }));
    }
    handleBackdropClick(event) { if (event.target === event.currentTarget) this.close(); }
    handleKeydown(event) { if (event.key === 'Escape') this.close(); }
    close() {
        if (this.locked || this.loading || this.closed) return;
        this.closed = true; this.cancelSearch(); this.dispatchEvent(new CustomEvent('edvibe-dialog-close')); this.remove();
    }
    resetForAnotherUser() {
        this.finished = false; this.currentStep = 'user'; this.selectedPupil = null; this.loadedPupilId = null; this.lessons = [];
        this.selectedLessonIds = new Set(); this.searchValue = ''; this.appliedSearchQuery = ''; this.cancelSearch(); this.searchDebouncing = false;
        this.suppressPupilPageLoading = false; this.progressVisible = false; this.progressIndeterminate = false; this.progressValue = 0;
        this.setStatus(`Загружено пользователей: ${this.allPupils.length} из ${this.pupilTotal}`);
        this.updateComplete.then(() => this.shadowRoot?.querySelector('.edvibe-reset-search')?.focus());
    }
    showPupils(options = {}) {
        const normalizedOptions = options && typeof options === 'object' ? options : {};
        const pupils = Array.isArray(normalizedOptions.pupils) ? normalizedOptions.pupils : [];
        const total = Number.isFinite(Number(normalizedOptions.total)) ? Number(normalizedOptions.total) : pupils.length;
        this.allPupils = pupils; this.pupilTotal = total; this.currentStep = 'user'; this.loading = false;
        this.setStatus(`Загружено пользователей: ${pupils.length} из ${total}`);
        this.updateComplete.then(() => this.shadowRoot?.querySelector('.edvibe-reset-search')?.focus());
        return this;
    }
    showLessons(pupil, lessons) {
        if (!pupil || typeof pupil !== 'object') return this;
        const normalizedLessons = Array.isArray(lessons) ? lessons : [];
        const pupilChanged = this.loadedPupilId !== pupil.PupilId;
        this.selectedPupil = pupil; this.loadedPupilId = pupil.PupilId; this.lessons = normalizedLessons;
        if (pupilChanged) this.selectedLessonIds = new Set();
        this.loading = false; this.currentStep = 'lessons'; this.setStatus(`Загружено уроков: ${normalizedLessons.length}`);
        this.updateComplete.then(() => this.shadowRoot?.querySelector('.edvibe-reset-lessons')?.focus());
        return this;
    }
    setLoading(message) { this.loading = true; this.setStatus(message); }
    lock() { this.locked = true; this.classList.toggle('is-running', true); }
    completeRun() { this.locked = false; this.finished = true; this.classList.toggle('is-running', false); }
    unlockAfterRun() { this.locked = false; this.finished = false; this.classList.toggle('is-running', false); }
    showDiscovery(message) { this.setStatus(message); this.progressVisible = true; this.progressIndeterminate = true; }
    showProgress(options = {}) {
        const normalizedOptions = options && typeof options === 'object' ? options : {};
        const completed = Number(normalizedOptions.completed) || 0; const total = Number(normalizedOptions.total) || 0;
        const lesson = normalizedOptions.lesson && typeof normalizedOptions.lesson === 'object' ? normalizedOptions.lesson : {}; const exerciseId = normalizedOptions.exerciseId;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 100;
        const detail = exerciseId ? `Упражнение ${exerciseId}` : 'Удаление запроса урока';
        this.setStatus(`${lesson.Name || ''}\n${detail} — ${completed} / ${total}`);
        this.progressVisible = true; this.progressIndeterminate = false; this.progressValue = percent;
    }
    showComplete(message) { this.setStatus(message, 'success'); this.progressVisible = true; this.progressIndeterminate = false; this.progressValue = 100; }
    showError(message) { if (!this.locked) this.loading = false; this.setStatus(message, 'error'); this.progressIndeterminate = false; }
    errorType(error) { return typeof error?.name === 'string' ? error.name : 'Error'; }

    renderPupilRows() {
        const visiblePupils = this.filterPupils(this.appliedSearchQuery);
        if (visiblePupils.length === 0) return html`<p class="edvibe-reset-empty" data-part="empty-state">Пользователи не найдены.</p>`;
        const busy = this.isPupilLoadingVisible();
        return visiblePupils.map((pupil) => {
            const selected = pupil.PupilId === this.selectedPupil?.PupilId;
            const rowClass = `edvibe-reset-row${selected ? ' is-selected' : ''}`;
            return html`<button type="button" class=${rowClass} role="option" aria-selected=${String(selected)} ?disabled=${busy || this.locked || this.finished} @click=${() => this.selectPupil(pupil)}><span class="edvibe-reset-row-copy"><span class="edvibe-reset-row-name">${pupil.Name || 'Без имени'}</span><span class="edvibe-reset-row-email">${pupil.Email || 'Email отсутствует'}</span></span></button>`;
        });
    }
    renderLessonRows(inputsBlocked) {
        if (this.lessons.length === 0) return html`<p class="edvibe-reset-empty" data-part="empty-state">Для пользователя нет уроков.</p>`;
        return this.lessons.map((lesson) => html`<label class="edvibe-reset-row edvibe-reset-lesson"><input type="checkbox" .value=${String(lesson.MarathonLessonId)} .checked=${this.selectedLessonIds.has(lesson.MarathonLessonId)} ?disabled=${inputsBlocked} @change=${(event) => this.toggleLesson(lesson.MarathonLessonId, event.currentTarget.checked)}><span class="edvibe-reset-row-copy"><span class="edvibe-reset-row-name">${Number(lesson.Number) + 1}. ${lesson.Name}</span><span class="edvibe-reset-row-email">${lesson.LastRequest ? `Статус последнего запроса: ${lesson.LastRequest.Status}` : 'Нет запросов на проверку'}</span></span></label>`);
    }
    render() {
        const view = this.getViewState(); const inputsBlocked = this.locked || this.loading || this.finished; const pupilBusy = this.isPupilLoadingVisible();
        const selectAllChecked = this.lessons.length > 0 && this.selectedLessonIds.size === this.lessons.length;
        const selectAllIndeterminate = this.selectedLessonIds.size > 0 && this.selectedLessonIds.size < this.lessons.length;
        const statusClass = `edvibe-reset-status${this.statusState === 'error' ? ' is-error' : this.statusState === 'success' ? ' is-success' : ''}`;
        const progressClass = `edvibe-reset-progress${this.progressVisible ? ' is-visible' : ''}${this.progressIndeterminate ? ' is-indeterminate' : ''}`;
        const progressValue = this.progressIndeterminate ? nothing : this.progressValue;
        const selectedPupilLabel = this.selectedPupil ? `${this.selectedPupil.Name || 'Без имени'} — ${this.selectedPupil.Email || ''}` : '';
        return html`
            <div class="edvibe-reset-overlay" data-part="overlay" @click=${this.handleBackdropClick}>
                <div class="edvibe-reset-card" data-part="dialog" role="dialog" aria-modal="true" aria-labelledby="edvibe-reset-title">
                    <div class="edvibe-reset-header"><div><h2 id="edvibe-reset-title" class="edvibe-reset-title">Сброс уроков</h2><p class="edvibe-reset-subtitle"><span class="edvibe-reset-step-indicator">${view.showingUsers ? 'Шаг 1 из 2' : 'Шаг 2 из 2'}</span><span class="edvibe-reset-step-description">${view.showingUsers ? 'Выберите пользователя.' : 'Выберите уроки для сброса прогресса.'}</span></p></div><button class="edvibe-reset-close" data-control="secondary" type="button" aria-label="Закрыть" ?disabled=${view.closeDisabled} @click=${() => this.close()}>&times;</button></div>
                    <div class="edvibe-reset-body">
                        <section class="edvibe-reset-user-step" aria-label="Выбор пользователя" ?hidden=${!view.showingUsers}><div class="edvibe-reset-search-field" data-field><label class="edvibe-reset-label" for="edvibe-reset-search">Поиск по email</label><input id="edvibe-reset-search" class="edvibe-reset-search" type="search" placeholder="user@example.com" autocomplete="off" .value=${this.searchValue} ?disabled=${inputsBlocked} @input=${this.handleSearchInput}></div><div class=${`edvibe-reset-pupils-shell${pupilBusy ? ' is-loading' : ''}`}><div class="edvibe-reset-list edvibe-reset-pupils" role="listbox" aria-label="Пользователи марафона" aria-busy=${String(pupilBusy)} .inert=${pupilBusy} @scroll=${this.handlePupilsScroll}>${this.renderPupilRows()}</div><div class="edvibe-reset-pupils-loading" role="status" aria-live="polite" ?hidden=${!pupilBusy}><span class="edvibe-reset-spinner" aria-hidden="true"></span><span>Загрузка пользователей...</span></div></div></section>
                        <section class="edvibe-reset-lesson-step" aria-label="Выбор уроков" ?hidden=${view.showingUsers}><div class="edvibe-reset-label edvibe-reset-selected-pupil">${selectedPupilLabel}</div><label class="edvibe-reset-select-all"><input class="edvibe-reset-select-all-input" type="checkbox" .checked=${selectAllChecked} .indeterminate=${selectAllIndeterminate} ?disabled=${inputsBlocked || this.lessons.length === 0} @change=${this.handleSelectAll}>Выбрать все уроки</label><div class="edvibe-reset-list edvibe-reset-lessons" aria-label="Уроки пользователя" tabindex="-1">${this.renderLessonRows(inputsBlocked)}</div></section>
                    </div>
                    <div class="edvibe-reset-live-region"><p class=${statusClass} data-part="status" aria-live="polite">${this.statusMessage}</p><progress class=${progressClass} data-part="progress" max="100" value=${progressValue}></progress></div>
                    <div class="edvibe-reset-footer" data-part="actions"><button class="edvibe-reset-button edvibe-reset-cancel" data-control="secondary" type="button" ?disabled=${view.closeDisabled} @click=${() => this.close()}>Закрыть</button><button class="edvibe-reset-button edvibe-reset-back" data-control="secondary" type="button" ?hidden=${view.showingUsers} ?disabled=${view.backDisabled} @click=${this.handleBack}>${this.finished ? 'Сбросить для другого пользователя' : 'Назад'}</button><button class="edvibe-reset-button edvibe-reset-next" data-control type="button" ?hidden=${!view.showingUsers} ?disabled=${view.nextDisabled} @click=${this.handleNext}>Далее</button><button class="edvibe-reset-button edvibe-reset-submit" data-control="danger" type="button" ?hidden=${view.showingUsers} ?disabled=${view.submitDisabled} @click=${this.handleSubmit}>Сбросить прогресс</button></div>
                </div>
            </div>`;
    }
}

if (!customElements.get(RESET_DIALOG_TAG)) customElements.define(RESET_DIALOG_TAG, ResetLessonsDialog);

export { RESET_DIALOG_TAG, RESET_OVERLAY_ID, ResetLessonsDialog };
