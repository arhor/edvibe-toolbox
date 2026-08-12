import { LitElement, html, nothing } from 'lit';
import { componentFoundationStyles, dialogFoundationStyles } from '../../../../components/styles/foundations.js';
import { batchSectionCreationDialogStyles } from './batch-section-creation-dialog.styles.js';
import { batchSectionImageUploadStyles } from './image-upload/batch-section-image-upload.styles.js';
import {
    controller as defaultImageController,
    formatFileSize,
} from './image-upload/batch-section-image-upload.js';

const BATCH_SECTION_DIALOG_TAG = 'edvibe-toolbox-batch-section-creation-dialog';
const BATCH_SECTION_OVERLAY_ID = 'edvibe-toolbox-batch-section-creation-overlay';

class BatchSectionCreationDialog extends LitElement {
    static styles = [componentFoundationStyles, dialogFoundationStyles, batchSectionCreationDialogStyles, batchSectionImageUploadStyles];

    static properties = {
        lessons: {state: true},
        selectedLessonIds: {state: true},
        blocks: {state: true},
        sectionName: {state: true},
        mode: {state: true},
        recipeReady: {state: true},
        recipeErrors: {state: true},
        currentPlan: {state: true},
        errors: {state: true},
        result: {state: true},
        fatalResultError: {state: true},
        statusMessage: {state: true},
        statusState: {state: true},
        progress: {state: true}
    };

    constructor() {
        super();
        this.imageController = defaultImageController;
        this.lessons = [];
        this.selectedLessonIds = new Set();
        this.blocks = [];
        this.sectionName = '';
        this.nextBlockId = 1;
        this.mode = 'initializing';
        this.recipeReady = false;
        this.recipeErrors = [];
        this.currentPlan = null;
        this.errors = [];
        this.result = null;
        this.fatalResultError = null;
        this.statusMessage = '';
        this.statusState = '';
        this.progress = {visible: false, completed: 0, total: 0};
        this.onKeydownBound = (event) => this.onKeydown(event);
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.id) this.id = BATCH_SECTION_OVERLAY_ID;
        this.ownerDocument?.addEventListener('keydown', this.onKeydownBound);
    }

    disconnectedCallback() {
        this.releaseImageFiles();
        this.ownerDocument?.removeEventListener('keydown', this.onKeydownBound);
        super.disconnectedCallback();
    }

    configure(options = {}) {
        options = options && typeof options === 'object' ? options : {};
        if (options.imageController) {
            this.imageController = options.imageController;
        }
        return this;
    }

    showLoading(message = 'Загрузка…') {
        this.mode = 'loading';
        this.clearMessages();
        this.setStatus(message);
        return this;
    }

    showConfigure({lessons = this.lessons, recipeReady = false, recipeErrors = []} = {}) {
        this.mode = 'configure';
        this.lessons = Array.isArray(lessons) ? lessons : [];
        this.recipeReady = Boolean(recipeReady);
        this.recipeErrors = Array.isArray(recipeErrors) ? recipeErrors : [];
        this.selectedLessonIds = new Set();
        this.currentPlan = null;
        this.progress = {visible: false, completed: 0, total: 0};
        this.clearMessages();
        this.setStatus('Настройте раздел и выберите уроки.');
        return this;
    }

    showValidationErrors(errors = []) {
        this.mode = 'validation-error';
        this.errors = this.normalizeErrors(errors);
        this.currentPlan = null;
        this.result = null;
        this.setStatus('Исправьте ошибки и повторите проверку.', 'error');
        return this;
    }

    showConfirmation(plan) {
        this.mode = 'confirm';
        this.currentPlan = plan;
        this.clearMessages();
        this.setStatus(plan?.eligible?.length
            ? 'Проверка завершена. Подтвердите создание.'
            : 'Нет уроков, подходящих для создания.', 'warning');
        return this;
    }

    showExecution(progress = {}) {
        this.mode = 'executing';
        const completed = Math.max(0, Number(progress.completed) || 0);
        const total = Math.max(0, Number(progress.total) || 0);
        this.progress = {visible: true, completed, total};
        const lesson = progress.lesson
            ? ` Сейчас: ${progress.lesson.number}. ${progress.lesson.name}.`
            : '';
        this.setStatus(`Выполнено ${completed} из ${total}.${lesson}`);
        return this;
    }

    showComplete(result = {}, fatalError = null) {
        this.mode = 'complete';
        this.clearMessages();
        this.result = result;
        this.fatalResultError = fatalError;
        this.progress = {visible: false, completed: 0, total: 0};
        this.setStatus(fatalError
            ? 'Операция остановлена. Частичный результат сохранён.'
            : 'Пакетная операция завершена.', fatalError ? 'error' : '');
        return this;
    }

    showFatalError(error) {
        this.mode = 'fatal-error';
        this.clearMessages();
        this.errors = this.normalizeErrors([error]);
        this.setStatus('Не удалось открыть инструмент.', 'error');
        return this;
    }

    clearMessages() {
        this.errors = [];
        this.result = null;
        this.fatalResultError = null;
        this.statusMessage = '';
        this.statusState = '';
    }

    normalizeErrors(errors) {
        const list = Array.isArray(errors) ? errors : [errors];
        return list.map((error) => ({
            code: error?.code || 'ERROR',
            message: error?.message || String(error)
        }));
    }

    setStatus(message, state = '') {
        this.statusMessage = String(message || '');
        this.statusState = String(state || '');
    }

    createBlock(type) {
        const block = {id: `block-${this.nextBlockId++}`, type};
        if (type === 'image') {
            return this.imageController.createBlock({...block, url: '', alt: ''});
        }
        if (type === 'text') return {...block, text: ''};
        return {...block, label: '', url: ''};
    }

    blockLabel(type) {
        return {image: 'Баннер', text: 'Текст', link: 'Ссылка'}[type] || type;
    }

    collectDefinition() {
        return {
            name: this.sectionName,
            blocks: this.blocks.map((block) => ({...block}))
        };
    }

    updateBlock(blockId, field, value) {
        this.blocks = this.blocks.map((block) => block.id === blockId
            ? {...block, [field]: value}
            : block);
    }

    replaceBlock(blockId, replacement) {
        this.blocks = this.blocks.map((block) => block.id === blockId ? replacement : block);
    }

    onImageFileChange(block, event) {
        const file = event.currentTarget.files?.[0] || null;
        this.replaceBlock(block.id, this.imageController.selectFile(block, file));
        event.currentTarget.value = '';
    }

    onClearImage(block) {
        this.replaceBlock(block.id, this.imageController.clearFile(block));
    }

    releaseImageFiles() {
        if (!this.imageController || this.blocks.length === 0) return;
        this.blocks = this.imageController.releaseAll(this.blocks);
    }

    onLessonChange(event) {
        const lessonId = Number(event.currentTarget.value);
        const next = new Set(this.selectedLessonIds);
        if (event.currentTarget.checked) next.add(lessonId);
        else next.delete(lessonId);
        this.selectedLessonIds = next;
    }

    onSelectAll() {
        this.selectedLessonIds = new Set(this.lessons.map((lesson) => Number(lesson.lessonId)));
    }

    onClearAll() {
        this.selectedLessonIds = new Set();
    }

    onAddBlock(type) {
        if (!['image', 'text', 'link'].includes(type)) return;
        this.blocks = [...this.blocks, this.createBlock(type)];
    }

    onBlockAction(blockId, action) {
        const index = this.blocks.findIndex((block) => block.id === blockId);
        if (index < 0) return;
        const next = [...this.blocks];
        if (action === 'remove') {
            const [removed] = next.splice(index, 1);
            if (removed?.type === 'image') this.imageController.releaseBlock(removed);
        } else if (action === 'up' && index > 0) {
            const [block] = next.splice(index, 1);
            next.splice(index - 1, 0, block);
        } else if (action === 'down' && index < next.length - 1) {
            const [block] = next.splice(index, 1);
            next.splice(index + 1, 0, block);
        }
        this.blocks = next;
    }

    canPreflight() {
        return ['configure', 'validation-error'].includes(this.mode)
            && this.selectedLessonIds.size > 0
            && this.sectionName.trim().length > 0
            && this.blocks.length > 0
            && this.imageController.canSubmit(this.blocks);
    }

    onPreflight() {
        if (!this.canPreflight()) return;
        this.dispatchEvent(new CustomEvent('edvibe-batch-section-preflight', {
            bubbles: true,
            composed: true,
            detail: {
                definition: this.collectDefinition(),
                selectedLessonIds: [...this.selectedLessonIds]
            }
        }));
    }

    onConfirm() {
        this.dispatchEvent(new CustomEvent('edvibe-batch-section-confirm', {
            bubbles: true,
            composed: true
        }));
    }

    onCopy() {
        this.dispatchEvent(new CustomEvent('edvibe-batch-section-copy', {
            bubbles: true,
            composed: true
        }));
    }

    onRestart() {
        this.releaseImageFiles();
        this.sectionName = '';
        this.blocks = [];
        this.selectedLessonIds = new Set();
        this.dispatchEvent(new CustomEvent('edvibe-batch-section-restart', {
            bubbles: true,
            composed: true
        }));
    }

    close() {
        this.releaseImageFiles();
        this.dispatchEvent(new CustomEvent('edvibe-dialog-close', {
            bubbles: true,
            composed: true
        }));
        this.remove();
    }

    onBackdrop(event) {
        if (event.target === event.currentTarget && !this.isBusy()) this.close();
    }

    onKeydown(event) {
        if (event.key === 'Escape' && !this.isBusy()) this.close();
    }

    isBusy() {
        return ['loading', 'executing'].includes(this.mode);
    }

    resultStatusLabel(status) {
        return {
            created: 'Создано',
            rejected: 'Отклонено',
            failed: 'Ошибка',
            partially_created: 'Нужна ручная проверка',
            not_attempted: 'Не выполнено'
        }[status] || status;
    }

    renderLesson(lesson, configurable) {
        const lessonId = Number(lesson.lessonId);
        return html`
            <label class="edvibe-batch-section-lesson">
                <input type="checkbox" .value=${String(lessonId)}
                    .checked=${this.selectedLessonIds.has(lessonId)}
                    ?disabled=${!configurable} @change=${this.onLessonChange}>
                <span>${lesson.number || '?'}. ${lesson.name}</span>
            </label>
        `;
    }

    renderBlockField(block, labelText, field, multiline, configurable) {
        return html`
            <label class="edvibe-batch-section-field">
                <span>${labelText}</span>
                ${multiline
                    ? html`<textarea data-block-field=${field} .value=${block[field] || ''}
                        ?disabled=${!configurable}
                        @input=${(event) => this.updateBlock(block.id, field, event.currentTarget.value)}></textarea>`
                    : html`<input type="text" data-block-field=${field} .value=${block[field] || ''}
                        ?disabled=${!configurable}
                        @input=${(event) => this.updateBlock(block.id, field, event.currentTarget.value)}>`}
            </label>
        `;
    }

    renderImageFields(block, configurable) {
        return html`
            <label class="edvibe-batch-section-field">
                <span>Файл изображения</span>
                <input class="edvibe-batch-section-file-input" type="file" accept="image/*"
                    ?disabled=${!configurable}
                    @change=${(event) => this.onImageFileChange(block, event)}>
            </label>
            ${block.fileName ? html`
                <div class="edvibe-batch-section-file-details">
                    <span>${block.fileName} · ${formatFileSize(block.fileSize)}</span>
                    <button type="button" ?disabled=${!configurable}
                        @click=${() => this.onClearImage(block)}>Убрать файл</button>
                </div>
            ` : nothing}
            ${block.fileError ? html`<p class="edvibe-batch-section-file-error">${block.fileError}</p>` : nothing}
            ${block.previewUrl ? html`
                <img class="edvibe-batch-section-image-preview" src=${block.previewUrl}
                    alt=${block.alt || 'Предпросмотр изображения'}>
            ` : nothing}
            ${this.renderBlockField(block, 'Альтернативный текст', 'alt', false, configurable)}
        `;
    }

    renderBlock(block, index, configurable) {
        return html`
            <article class="edvibe-batch-section-block" data-block-id=${block.id}>
                <header>
                    <strong>${index + 1}. ${this.blockLabel(block.type)}</strong>
                    <div class="edvibe-batch-section-block-actions">
                        <button type="button" data-block-action="up" ?disabled=${!configurable || index === 0}
                            @click=${() => this.onBlockAction(block.id, 'up')}>↑</button>
                        <button type="button" data-block-action="down"
                            ?disabled=${!configurable || index === this.blocks.length - 1}
                            @click=${() => this.onBlockAction(block.id, 'down')}>↓</button>
                        <button type="button" data-block-action="remove" ?disabled=${!configurable}
                            @click=${() => this.onBlockAction(block.id, 'remove')}>Удалить</button>
                    </div>
                </header>
                ${block.type === 'image' ? this.renderImageFields(block, configurable)
                    : block.type === 'text' ? html`
                        ${this.renderBlockField(block, 'Текст или HTML', 'text', true, configurable)}
                    ` : html`
                        ${this.renderBlockField(block, 'Подпись кнопки', 'label', false, configurable)}
                        ${this.renderBlockField(block, 'URL', 'url', false, configurable)}
                    `}
            </article>
        `;
    }

    previewDetail(block) {
        if (block.type === 'image') return block.fileName || 'Файл не выбран';
        if (block.type === 'text') return block.text || 'Текст не указан';
        return `${block.label || 'Без подписи'} → ${block.url || 'URL не указан'}`;
    }

    renderRecipeState() {
        if (this.recipeReady) return nothing;
        return html`
            <section class="edvibe-batch-section-protocol">
                <strong>Запись WebSocket ещё не подключена.</strong>
                <p>${this.recipeErrors[0]?.message
                    || 'Создание будет заблокировано, пока запись не преобразована в проверенный рецепт.'}</p>
            </section>
        `;
    }

    renderErrors() {
        if (this.errors.length === 0) return nothing;
        return html`
            <section class="edvibe-batch-section-errors" aria-live="polite">
                <h3>Что нужно исправить</h3>
                <ul>${this.errors.map((error) => html`<li>${error.code}: ${error.message}</li>`)}</ul>
            </section>
        `;
    }

    renderSummaryGroup(title, lessons, formatter) {
        return html`
            <div class="edvibe-batch-section-summary-group">
                <h4>${title} (${lessons.length})</h4>
                <ul>${lessons.length
                    ? lessons.map((lesson) => html`<li>${formatter(lesson)}</li>`)
                    : html`<li>Нет</li>`}</ul>
            </div>
        `;
    }

    renderPlan() {
        const plan = this.currentPlan;
        if (!plan) return nothing;
        return html`
            <section class="edvibe-batch-section-summary" aria-live="polite">
                <h3>Предварительный план</h3>
                <ul>
                    <li>Выбрано уроков: ${plan.selectedLessonIds.length}</li>
                    <li>Готово к созданию: ${plan.eligible.length}</li>
                    <li>Отклонено проверкой: ${plan.rejected.length}</li>
                    <li>Раздел: ${plan.definition.name}</li>
                    <li>Блоков: ${plan.definition.blocks.length}</li>
                </ul>
                ${this.renderSummaryGroup('Будут обработаны', plan.eligible,
                    (lesson) => `${lesson.number}. ${lesson.name}`)}
                ${this.renderSummaryGroup('Отклонены', plan.rejected,
                    (lesson) => `${lesson.number}. ${lesson.name} — ${lesson.code}: ${lesson.message}`)}
            </section>
        `;
    }

    renderResults() {
        if (!this.result) return nothing;
        return html`
            <section class="edvibe-batch-section-results" aria-live="polite">
                <h3>${this.fatalResultError ? 'Частичный результат' : 'Результат'}</h3>
                <div class="edvibe-batch-section-result-list">
                    ${(this.result.results || []).map((entry) => html`
                        <article class=${`edvibe-batch-section-result is-${entry.status}`}>
                            <strong>${entry.lessonNumber || '?'}. ${entry.lessonName}</strong>
                            <span>${this.resultStatusLabel(entry.status)}</span>
                            <p>${entry.code ? `${entry.code}: ${entry.message || ''}` : entry.message || 'Готово'}</p>
                            ${entry.cleanup ? html`<small>Очистка: ${entry.cleanup.status}</small>` : nothing}
                        </article>
                    `)}
                </div>
                ${this.fatalResultError ? html`
                    <p class="edvibe-batch-section-fatal-note">
                        ${this.fatalResultError.code || 'INTERNAL_ERROR'}: ${this.fatalResultError.message}
                    </p>
                ` : nothing}
            </section>
        `;
    }

    render() {
        const configurable = ['configure', 'validation-error'].includes(this.mode);
        const busy = this.isBusy();
        const canPreflight = this.canPreflight();

        return html`
<div class="edvibe-batch-section-overlay" @click=${this.onBackdrop}>
                <section class="edvibe-batch-section-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-section-title">
                    <header class="edvibe-batch-section-header">
                        <div><p class="edvibe-batch-section-eyebrow">Edvibe Toolbox</p>
                            <h2 id="edvibe-batch-section-title">Создать раздел в нескольких уроках</h2>
                            <p class="edvibe-batch-section-description">Соберите раздел один раз, проверьте план и примените его к выбранным урокам.</p></div>
                        <button class="edvibe-batch-section-close" type="button" aria-label="Закрыть"
                            ?disabled=${busy} @click=${() => this.close()}>&times;</button>
                    </header>
                    <div class="edvibe-batch-section-body">
                        <section class="edvibe-batch-section-configure" ?hidden=${!configurable}>
                            <div class="edvibe-batch-section-grid">
                                <div class="edvibe-batch-section-column">
                                    <label class="edvibe-batch-section-field"><span>Название раздела</span>
                                        <input class="edvibe-batch-section-name" type="text" maxlength="200"
                                            autocomplete="off" placeholder="Например, Летняя акция"
                                            .value=${this.sectionName} ?disabled=${!configurable}
                                            @input=${(event) => { this.sectionName = event.currentTarget.value; }}></label>
                                    <div class="edvibe-batch-section-heading-row"><div><h3>Уроки</h3><p>Выберите все уроки, куда нужно добавить раздел.</p></div>
                                        <div class="edvibe-batch-section-selection-actions">
                                            <button class="edvibe-batch-section-select-all" type="button" ?disabled=${!configurable} @click=${this.onSelectAll}>Выбрать все</button>
                                            <button class="edvibe-batch-section-clear-all" type="button" ?disabled=${!configurable} @click=${this.onClearAll}>Очистить</button>
                                        </div></div>
                                    <div class="edvibe-batch-section-lessons" aria-label="Список уроков">
                                        ${this.lessons.length
                                            ? this.lessons.map((lesson) => this.renderLesson(lesson, configurable))
                                            : html`<p class="edvibe-batch-section-empty">Уроки не найдены.</p>`}
                                    </div>
                                </div>
                                <div class="edvibe-batch-section-column">
                                    <div class="edvibe-batch-section-heading-row"><div><h3>Конструктор</h3><p>Порядок блоков сохранится при выполнении.</p></div></div>
                                    <div class="edvibe-batch-section-add-actions" role="group" aria-label="Добавить блок">
                                        ${[['image', '+ Баннер'], ['text', '+ Текст'], ['link', '+ Ссылка']].map(([type, label]) => html`
                                            <button type="button" data-add-block=${type} ?disabled=${!configurable}
                                                @click=${() => this.onAddBlock(type)}>${label}</button>`)}
                                    </div>
                                    <div class="edvibe-batch-section-blocks">
                                        ${this.blocks.length
                                            ? this.blocks.map((block, index) => this.renderBlock(block, index, configurable))
                                            : html`<p class="edvibe-batch-section-empty">Добавьте баннер, текст или ссылку.</p>`}
                                    </div>
                                    <section class="edvibe-batch-section-preview" aria-live="polite">
                                        <h3>Предпросмотр структуры</h3>
                                        <p class="edvibe-batch-section-preview-name">${this.sectionName.trim() || 'Название не задано'}</p>
                                        <ol class="edvibe-batch-section-preview-blocks">
                                            ${this.blocks.length
                                                ? this.blocks.map((block, index) => html`<li>${index + 1}. ${this.blockLabel(block.type)}: ${this.previewDetail(block)}</li>`)
                                                : html`<li>Блоки не добавлены</li>`}
                                        </ol>
                                    </section>
                                </div>
                            </div>
                        </section>
                        ${this.renderRecipeState()}
                        ${this.renderErrors()}
                        ${this.renderPlan()}
                        ${this.renderResults()}
                    </div>
                    <div class="edvibe-batch-section-live-region">
                        <span class="edvibe-batch-section-spinner" role="img" aria-label="Выполняется операция" ?hidden=${!busy}></span>
                        <p class="edvibe-batch-section-status" data-state=${this.statusState} role="status" aria-live="polite">${this.statusMessage}</p>
                        <progress class="edvibe-batch-section-progress" max=${this.progress.total}
                            value=${this.progress.completed} ?hidden=${!this.progress.visible}></progress>
                    </div>
                    <footer class="edvibe-batch-section-footer">
                        <button class="edvibe-batch-section-copy" type="button" ?hidden=${this.mode !== 'complete'} @click=${this.onCopy}>Копировать отчёт</button>
                        <button class="edvibe-batch-section-restart" type="button" ?hidden=${this.mode !== 'complete'} @click=${this.onRestart}>Создать другой раздел</button>
                        <button class="edvibe-batch-section-confirm" type="button" ?hidden=${this.mode !== 'confirm'}
                            ?disabled=${!this.recipeReady || !this.currentPlan?.eligible?.length} @click=${this.onConfirm}>Подтвердить создание</button>
                        <button class="edvibe-batch-section-preflight" type="button" ?hidden=${!configurable}
                            ?disabled=${!canPreflight} @click=${this.onPreflight}>Проверить план</button>
                    </footer>
                </section>
            </div>
        `;
    }
}

if (!customElements.get(BATCH_SECTION_DIALOG_TAG)) {
    customElements.define(BATCH_SECTION_DIALOG_TAG, BatchSectionCreationDialog);
}

const batchSectionCreationDialogApi = {
    BatchSectionCreationDialog,
    BATCH_SECTION_DIALOG_TAG,
    BATCH_SECTION_OVERLAY_ID
};
globalThis.EdVibeBatchSectionCreationDialog = batchSectionCreationDialogApi;

export {BatchSectionCreationDialog, BATCH_SECTION_DIALOG_TAG, BATCH_SECTION_OVERLAY_ID};
