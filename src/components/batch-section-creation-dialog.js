(function initializeBatchSectionCreationDialog(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], () => factory(root));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root);
    } else {
        root.EdVibeBatchSectionCreationDialog = factory(root);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createComponent(root) {
    'use strict';

    const BATCH_SECTION_DIALOG_TAG = 'edvibe-toolbox-batch-section-creation-dialog';
    const BATCH_SECTION_OVERLAY_ID = 'edvibe-toolbox-batch-section-creation-overlay';
    const HTMLElementBase = root.HTMLElement || class {};
    const template = root.document?.createElement?.('template') || null;

    if (template) {
        template.innerHTML = `
            <link class="edvibe-batch-section-stylesheet" rel="stylesheet">
            <div class="edvibe-batch-section-overlay">
                <section class="edvibe-batch-section-card" role="dialog" aria-modal="true"
                    aria-labelledby="edvibe-batch-section-title">
                    <header class="edvibe-batch-section-header">
                        <div>
                            <p class="edvibe-batch-section-eyebrow">Edvibe Toolbox</p>
                            <h2 id="edvibe-batch-section-title">Создать раздел в нескольких уроках</h2>
                            <p class="edvibe-batch-section-description">
                                Соберите раздел один раз, проверьте план и примените его к выбранным урокам.
                            </p>
                        </div>
                        <button class="edvibe-batch-section-close" type="button"
                            aria-label="Закрыть">&times;</button>
                    </header>
                    <div class="edvibe-batch-section-body">
                        <section class="edvibe-batch-section-configure">
                            <div class="edvibe-batch-section-grid">
                                <div class="edvibe-batch-section-column">
                                    <label class="edvibe-batch-section-field">
                                        <span>Название раздела</span>
                                        <input class="edvibe-batch-section-name" type="text"
                                            maxlength="200" autocomplete="off"
                                            placeholder="Например, Летняя акция">
                                    </label>
                                    <div class="edvibe-batch-section-heading-row">
                                        <div>
                                            <h3>Уроки</h3>
                                            <p>Выберите все уроки, куда нужно добавить раздел.</p>
                                        </div>
                                        <div class="edvibe-batch-section-selection-actions">
                                            <button class="edvibe-batch-section-select-all" type="button">Выбрать все</button>
                                            <button class="edvibe-batch-section-clear-all" type="button">Очистить</button>
                                        </div>
                                    </div>
                                    <div class="edvibe-batch-section-lessons"
                                        aria-label="Список уроков"></div>
                                </div>
                                <div class="edvibe-batch-section-column">
                                    <div class="edvibe-batch-section-heading-row">
                                        <div>
                                            <h3>Конструктор</h3>
                                            <p>Порядок блоков сохранится при выполнении.</p>
                                        </div>
                                    </div>
                                    <div class="edvibe-batch-section-add-actions" role="group"
                                        aria-label="Добавить блок">
                                        <button type="button" data-add-block="image">+ Баннер</button>
                                        <button type="button" data-add-block="text">+ Текст</button>
                                        <button type="button" data-add-block="link">+ Ссылка</button>
                                    </div>
                                    <div class="edvibe-batch-section-blocks"></div>
                                    <section class="edvibe-batch-section-preview" aria-live="polite">
                                        <h3>Предпросмотр структуры</h3>
                                        <p class="edvibe-batch-section-preview-name">Название не задано</p>
                                        <ol class="edvibe-batch-section-preview-blocks"></ol>
                                    </section>
                                </div>
                            </div>
                        </section>
                        <section class="edvibe-batch-section-protocol" hidden></section>
                        <section class="edvibe-batch-section-errors" aria-live="polite" hidden></section>
                        <section class="edvibe-batch-section-summary" aria-live="polite" hidden></section>
                        <section class="edvibe-batch-section-results" aria-live="polite" hidden></section>
                    </div>
                    <div class="edvibe-batch-section-live-region">
                        <span class="edvibe-batch-section-spinner" role="img"
                            aria-label="Выполняется операция" hidden></span>
                        <p class="edvibe-batch-section-status" role="status" aria-live="polite"></p>
                        <progress class="edvibe-batch-section-progress" max="0" value="0" hidden></progress>
                    </div>
                    <footer class="edvibe-batch-section-footer">
                        <button class="edvibe-batch-section-copy" type="button" hidden>Копировать отчёт</button>
                        <button class="edvibe-batch-section-restart" type="button" hidden>Создать другой раздел</button>
                        <button class="edvibe-batch-section-confirm" type="button" hidden>Подтвердить создание</button>
                        <button class="edvibe-batch-section-preflight" type="button" disabled>Проверить план</button>
                    </footer>
                </section>
            </div>
        `;
    }

    class BatchSectionCreationDialog extends HTMLElementBase {
        constructor() {
            super();
            this.stylesheetUrl = '';
            this.lessons = [];
            this.selectedLessonIds = new Set();
            this.blocks = [];
            this.nextBlockId = 1;
            this.mode = 'initializing';
            this.recipeReady = false;
            this.recipeErrors = [];
            this.currentPlan = null;
            this.connected = false;
            this.rendered = false;

            if (typeof this.attachShadow !== 'function' || !template) {
                return;
            }
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.append(template.content.cloneNode(true));
            this.cacheElements();
            this.rendered = true;
            this.renderState();
        }

        connectedCallback() {
            if (!this.id) {
                this.id = BATCH_SECTION_OVERLAY_ID;
            }
            this.connectListeners();
            this.renderState();
        }

        disconnectedCallback() {
            this.disconnectListeners();
        }

        configure(options = {}) {
            if (options.stylesheetUrl !== undefined) {
                this.stylesheetUrl = String(options.stylesheetUrl || '');
                this.elements?.stylesheet?.setAttribute('href', this.stylesheetUrl);
            }
            return this;
        }

        cacheElements() {
            const find = (selector) => this.shadowRoot.querySelector(selector);
            this.elements = {
                stylesheet: find('.edvibe-batch-section-stylesheet'),
                backdrop: find('.edvibe-batch-section-overlay'),
                configure: find('.edvibe-batch-section-configure'),
                name: find('.edvibe-batch-section-name'),
                lessons: find('.edvibe-batch-section-lessons'),
                selectAll: find('.edvibe-batch-section-select-all'),
                clearAll: find('.edvibe-batch-section-clear-all'),
                addActions: find('.edvibe-batch-section-add-actions'),
                blocks: find('.edvibe-batch-section-blocks'),
                previewName: find('.edvibe-batch-section-preview-name'),
                previewBlocks: find('.edvibe-batch-section-preview-blocks'),
                protocol: find('.edvibe-batch-section-protocol'),
                errors: find('.edvibe-batch-section-errors'),
                summary: find('.edvibe-batch-section-summary'),
                results: find('.edvibe-batch-section-results'),
                spinner: find('.edvibe-batch-section-spinner'),
                status: find('.edvibe-batch-section-status'),
                progress: find('.edvibe-batch-section-progress'),
                close: find('.edvibe-batch-section-close'),
                preflight: find('.edvibe-batch-section-preflight'),
                confirm: find('.edvibe-batch-section-confirm'),
                copy: find('.edvibe-batch-section-copy'),
                restart: find('.edvibe-batch-section-restart')
            };
            this.elements.stylesheet.setAttribute('href', this.stylesheetUrl);
        }

        connectListeners() {
            if (!this.rendered || this.connected) {
                return;
            }
            this.connected = true;
            this.onInput = this.onInput.bind(this);
            this.onLessonChange = this.onLessonChange.bind(this);
            this.onSelectAll = this.onSelectAll.bind(this);
            this.onClearAll = this.onClearAll.bind(this);
            this.onAddBlock = this.onAddBlock.bind(this);
            this.onBlockClick = this.onBlockClick.bind(this);
            this.onPreflight = this.onPreflight.bind(this);
            this.onConfirm = this.onConfirm.bind(this);
            this.onCopy = this.onCopy.bind(this);
            this.onRestart = this.onRestart.bind(this);
            this.close = this.close.bind(this);
            this.onBackdrop = this.onBackdrop.bind(this);
            this.onKeydown = this.onKeydown.bind(this);

            this.elements.name.addEventListener('input', this.onInput);
            this.elements.lessons.addEventListener('change', this.onLessonChange);
            this.elements.selectAll.addEventListener('click', this.onSelectAll);
            this.elements.clearAll.addEventListener('click', this.onClearAll);
            this.elements.addActions.addEventListener('click', this.onAddBlock);
            this.elements.blocks.addEventListener('input', this.onInput);
            this.elements.blocks.addEventListener('click', this.onBlockClick);
            this.elements.preflight.addEventListener('click', this.onPreflight);
            this.elements.confirm.addEventListener('click', this.onConfirm);
            this.elements.copy.addEventListener('click', this.onCopy);
            this.elements.restart.addEventListener('click', this.onRestart);
            this.elements.close.addEventListener('click', this.close);
            this.elements.backdrop.addEventListener('click', this.onBackdrop);
            this.ownerDocument?.addEventListener('keydown', this.onKeydown);
        }

        disconnectListeners() {
            if (!this.connected) {
                return;
            }
            this.connected = false;
            this.elements.name.removeEventListener('input', this.onInput);
            this.elements.lessons.removeEventListener('change', this.onLessonChange);
            this.elements.selectAll.removeEventListener('click', this.onSelectAll);
            this.elements.clearAll.removeEventListener('click', this.onClearAll);
            this.elements.addActions.removeEventListener('click', this.onAddBlock);
            this.elements.blocks.removeEventListener('input', this.onInput);
            this.elements.blocks.removeEventListener('click', this.onBlockClick);
            this.elements.preflight.removeEventListener('click', this.onPreflight);
            this.elements.confirm.removeEventListener('click', this.onConfirm);
            this.elements.copy.removeEventListener('click', this.onCopy);
            this.elements.restart.removeEventListener('click', this.onRestart);
            this.elements.close.removeEventListener('click', this.close);
            this.elements.backdrop.removeEventListener('click', this.onBackdrop);
            this.ownerDocument?.removeEventListener('keydown', this.onKeydown);
        }

        showLoading(message = 'Загрузка…') {
            this.mode = 'loading';
            this.clearMessages();
            this.setStatus(message);
            this.renderState();
            return this;
        }

        showConfigure({ lessons = this.lessons, recipeReady = false, recipeErrors = [] } = {}) {
            this.mode = 'configure';
            this.lessons = Array.isArray(lessons) ? lessons : [];
            this.recipeReady = Boolean(recipeReady);
            this.recipeErrors = Array.isArray(recipeErrors) ? recipeErrors : [];
            this.selectedLessonIds.clear();
            this.currentPlan = null;
            this.clearMessages();
            this.renderLessons();
            this.renderBlocks();
            this.renderPreview();
            this.renderRecipeState();
            this.setStatus('Настройте раздел и выберите уроки.');
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

        showConfirmation(plan) {
            this.mode = 'confirm';
            this.currentPlan = plan;
            this.clearMessages();
            this.renderSummary(plan);
            this.renderRecipeState();
            this.setStatus(plan.eligible.length
                ? 'Проверка завершена. Подтвердите создание.'
                : 'Нет уроков, подходящих для создания.', 'warning');
            this.renderState();
            return this;
        }

        showExecution(progress = {}) {
            this.mode = 'executing';
            const completed = Math.max(0, Number(progress.completed) || 0);
            const total = Math.max(0, Number(progress.total) || 0);
            this.elements.progress.hidden = false;
            this.elements.progress.max = total;
            this.elements.progress.value = completed;
            const lesson = progress.lesson
                ? ` Сейчас: ${progress.lesson.number}. ${progress.lesson.name}.`
                : '';
            this.setStatus(`Выполнено ${completed} из ${total}.${lesson}`);
            this.renderState();
            return this;
        }

        showComplete(result = {}, fatalError = null) {
            this.mode = 'complete';
            this.clearMessages();
            this.renderResults(result, fatalError);
            this.setStatus(fatalError
                ? 'Операция остановлена. Частичный результат сохранён.'
                : 'Пакетная операция завершена.', fatalError ? 'error' : '');
            this.renderState();
            return this;
        }

        showFatalError(error) {
            this.mode = 'fatal-error';
            this.clearMessages();
            this.renderErrors([error]);
            this.setStatus('Не удалось открыть инструмент.', 'error');
            this.renderState();
            return this;
        }

        clearMessages() {
            for (const element of [
                this.elements.errors,
                this.elements.summary,
                this.elements.results
            ]) {
                element.replaceChildren();
                element.hidden = true;
            }
        }

        renderRecipeState() {
            const section = this.elements.protocol;
            section.replaceChildren();
            section.hidden = this.recipeReady;
            if (this.recipeReady) {
                return;
            }
            const document = this.ownerDocument || root.document;
            const strong = document.createElement('strong');
            strong.textContent = 'Запись WebSocket ещё не подключена.';
            const text = document.createElement('p');
            text.textContent = this.recipeErrors[0]?.message
                || 'Создание будет заблокировано, пока запись не преобразована в проверенный рецепт.';
            section.append(strong, text);
        }

        renderLessons() {
            const document = this.ownerDocument || root.document;
            this.elements.lessons.replaceChildren();
            if (this.lessons.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'edvibe-batch-section-empty';
                empty.textContent = 'Уроки не найдены.';
                this.elements.lessons.appendChild(empty);
                return;
            }
            for (const lesson of this.lessons) {
                const label = document.createElement('label');
                label.className = 'edvibe-batch-section-lesson';
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.value = String(lesson.lessonId);
                input.checked = this.selectedLessonIds.has(Number(lesson.lessonId));
                const text = document.createElement('span');
                text.textContent = `${lesson.number || '?'}. ${lesson.name}`;
                label.append(input, text);
                this.elements.lessons.appendChild(label);
            }
        }

        createBlock(type) {
            const block = { id: `block-${this.nextBlockId++}`, type };
            if (type === 'image') {
                return { ...block, url: '', alt: '' };
            }
            if (type === 'text') {
                return { ...block, text: '' };
            }
            return { ...block, label: '', url: '' };
        }

        blockLabel(type) {
            return { image: 'Баннер', text: 'Текст', link: 'Ссылка' }[type] || type;
        }

        appendField(container, labelText, field, value, multiline = false) {
            const document = this.ownerDocument || root.document;
            const label = document.createElement('label');
            label.className = 'edvibe-batch-section-field';
            const title = document.createElement('span');
            title.textContent = labelText;
            const input = document.createElement(multiline ? 'textarea' : 'input');
            if (!multiline) {
                input.type = 'text';
            }
            input.dataset.blockField = field;
            input.value = value || '';
            label.append(title, input);
            container.appendChild(label);
        }

        renderBlocks() {
            const document = this.ownerDocument || root.document;
            this.elements.blocks.replaceChildren();
            if (this.blocks.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'edvibe-batch-section-empty';
                empty.textContent = 'Добавьте баннер, текст или ссылку.';
                this.elements.blocks.appendChild(empty);
                return;
            }
            this.blocks.forEach((block, index) => {
                const article = document.createElement('article');
                article.className = 'edvibe-batch-section-block';
                article.dataset.blockId = block.id;
                const header = document.createElement('header');
                const title = document.createElement('strong');
                title.textContent = `${index + 1}. ${this.blockLabel(block.type)}`;
                const actions = document.createElement('div');
                actions.className = 'edvibe-batch-section-block-actions';
                for (const [action, label, disabled] of [
                    ['up', '↑', index === 0],
                    ['down', '↓', index === this.blocks.length - 1],
                    ['remove', 'Удалить', false]
                ]) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.dataset.blockAction = action;
                    button.dataset.originalDisabled = disabled ? 'true' : 'false';
                    button.disabled = disabled;
                    button.textContent = label;
                    actions.appendChild(button);
                }
                header.append(title, actions);
                article.appendChild(header);

                if (block.type === 'image') {
                    this.appendField(article, 'URL изображения', 'url', block.url);
                    this.appendField(article, 'Альтернативный текст', 'alt', block.alt);
                } else if (block.type === 'text') {
                    this.appendField(article, 'Текст или HTML', 'text', block.text, true);
                } else {
                    this.appendField(article, 'Подпись кнопки', 'label', block.label);
                    this.appendField(article, 'URL', 'url', block.url);
                }
                this.elements.blocks.appendChild(article);
            });
        }

        renderPreview() {
            const document = this.ownerDocument || root.document;
            this.elements.previewName.textContent = this.elements.name.value.trim()
                || 'Название не задано';
            this.elements.previewBlocks.replaceChildren();
            if (this.blocks.length === 0) {
                const item = document.createElement('li');
                item.textContent = 'Блоки не добавлены';
                this.elements.previewBlocks.appendChild(item);
                return;
            }
            this.blocks.forEach((block, index) => {
                const item = document.createElement('li');
                const detail = block.type === 'image'
                    ? block.url || 'URL не указан'
                    : block.type === 'text'
                        ? block.text || 'Текст не указан'
                        : `${block.label || 'Без подписи'} → ${block.url || 'URL не указан'}`;
                item.textContent = `${index + 1}. ${this.blockLabel(block.type)}: ${detail}`;
                this.elements.previewBlocks.appendChild(item);
            });
        }

        renderErrors(errors) {
            const document = this.ownerDocument || root.document;
            const section = this.elements.errors;
            section.replaceChildren();
            section.hidden = false;
            const title = document.createElement('h3');
            title.textContent = 'Что нужно исправить';
            const list = document.createElement('ul');
            for (const error of errors) {
                const item = document.createElement('li');
                item.textContent = `${error?.code || 'ERROR'}: ${error?.message || String(error)}`;
                list.appendChild(item);
            }
            section.append(title, list);
        }

        renderSummary(plan) {
            const document = this.ownerDocument || root.document;
            const section = this.elements.summary;
            section.replaceChildren();
            section.hidden = false;
            const title = document.createElement('h3');
            title.textContent = 'Предварительный план';
            const overview = document.createElement('ul');
            for (const text of [
                `Выбрано уроков: ${plan.selectedLessonIds.length}`,
                `Готово к созданию: ${plan.eligible.length}`,
                `Отклонено проверкой: ${plan.rejected.length}`,
                `Раздел: ${plan.definition.name}`,
                `Блоков: ${plan.definition.blocks.length}`
            ]) {
                const item = document.createElement('li');
                item.textContent = text;
                overview.appendChild(item);
            }
            section.append(title, overview);
            section.appendChild(this.createSummaryGroup(
                'Будут обработаны',
                plan.eligible,
                (lesson) => `${lesson.number}. ${lesson.name}`
            ));
            section.appendChild(this.createSummaryGroup(
                'Отклонены',
                plan.rejected,
                (lesson) => `${lesson.number}. ${lesson.name} — ${lesson.code}: ${lesson.message}`
            ));
        }

        createSummaryGroup(titleText, lessons, format) {
            const document = this.ownerDocument || root.document;
            const group = document.createElement('div');
            group.className = 'edvibe-batch-section-summary-group';
            const title = document.createElement('h4');
            title.textContent = `${titleText} (${lessons.length})`;
            const list = document.createElement('ul');
            if (lessons.length === 0) {
                const empty = document.createElement('li');
                empty.textContent = 'Нет';
                list.appendChild(empty);
            } else {
                lessons.forEach((lesson) => {
                    const item = document.createElement('li');
                    item.textContent = format(lesson);
                    list.appendChild(item);
                });
            }
            group.append(title, list);
            return group;
        }

        renderResults(result, fatalError) {
            const document = this.ownerDocument || root.document;
            const section = this.elements.results;
            section.replaceChildren();
            section.hidden = false;
            const title = document.createElement('h3');
            title.textContent = fatalError ? 'Частичный результат' : 'Результат';
            section.appendChild(title);
            const list = document.createElement('div');
            list.className = 'edvibe-batch-section-result-list';
            for (const entry of result.results || []) {
                const row = document.createElement('article');
                row.className = `edvibe-batch-section-result is-${entry.status}`;
                const heading = document.createElement('strong');
                heading.textContent = `${entry.lessonNumber || '?'}. ${entry.lessonName}`;
                const status = document.createElement('span');
                status.textContent = this.resultStatusLabel(entry.status);
                const message = document.createElement('p');
                message.textContent = entry.code
                    ? `${entry.code}: ${entry.message || ''}`
                    : entry.message || 'Готово';
                row.append(heading, status, message);
                if (entry.cleanup) {
                    const cleanup = document.createElement('small');
                    cleanup.textContent = `Очистка: ${entry.cleanup.status}`;
                    row.appendChild(cleanup);
                }
                list.appendChild(row);
            }
            section.appendChild(list);
            if (fatalError) {
                const fatal = document.createElement('p');
                fatal.className = 'edvibe-batch-section-fatal-note';
                fatal.textContent = `${fatalError.code || 'INTERNAL_ERROR'}: ${fatalError.message}`;
                section.appendChild(fatal);
            }
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

        setStatus(message, state = '') {
            this.elements.status.textContent = message;
            this.elements.status.dataset.state = state;
        }

        collectDefinition() {
            return {
                name: this.elements.name.value,
                blocks: this.blocks.map((block) => ({ ...block }))
            };
        }

        onInput(event) {
            const article = event.target.closest?.('[data-block-id]');
            const field = event.target.dataset?.blockField;
            if (article && field) {
                const block = this.blocks.find((entry) => entry.id === article.dataset.blockId);
                if (block) {
                    block[field] = event.target.value;
                }
            }
            this.renderPreview();
            this.renderState();
        }

        onLessonChange(event) {
            if (event.target.type !== 'checkbox') {
                return;
            }
            const lessonId = Number(event.target.value);
            if (event.target.checked) {
                this.selectedLessonIds.add(lessonId);
            } else {
                this.selectedLessonIds.delete(lessonId);
            }
            this.renderState();
        }

        onSelectAll() {
            this.selectedLessonIds = new Set(this.lessons.map((lesson) => Number(lesson.lessonId)));
            this.renderLessons();
            this.renderState();
        }

        onClearAll() {
            this.selectedLessonIds.clear();
            this.renderLessons();
            this.renderState();
        }

        onAddBlock(event) {
            const type = event.target.dataset?.addBlock;
            if (!type) {
                return;
            }
            this.blocks.push(this.createBlock(type));
            this.renderBlocks();
            this.renderPreview();
            this.renderState();
        }

        onBlockClick(event) {
            const action = event.target.dataset?.blockAction;
            const article = event.target.closest?.('[data-block-id]');
            if (!action || !article) {
                return;
            }
            const index = this.blocks.findIndex((block) => block.id === article.dataset.blockId);
            if (index < 0) {
                return;
            }
            if (action === 'remove') {
                this.blocks.splice(index, 1);
            } else if (action === 'up' && index > 0) {
                const [block] = this.blocks.splice(index, 1);
                this.blocks.splice(index - 1, 0, block);
            } else if (action === 'down' && index < this.blocks.length - 1) {
                const [block] = this.blocks.splice(index, 1);
                this.blocks.splice(index + 1, 0, block);
            }
            this.renderBlocks();
            this.renderPreview();
            this.renderState();
        }

        onPreflight() {
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-section-preflight', {
                bubbles: true,
                composed: true,
                detail: {
                    definition: this.collectDefinition(),
                    selectedLessonIds: [...this.selectedLessonIds]
                }
            }));
        }

        onConfirm() {
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-section-confirm', {
                bubbles: true,
                composed: true
            }));
        }

        onCopy() {
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-section-copy', {
                bubbles: true,
                composed: true
            }));
        }

        onRestart() {
            this.elements.name.value = '';
            this.blocks = [];
            this.selectedLessonIds.clear();
            this.dispatchEvent(new root.CustomEvent('edvibe-batch-section-restart', {
                bubbles: true,
                composed: true
            }));
        }

        close() {
            this.dispatchEvent(new root.CustomEvent('edvibe-dialog-close', {
                bubbles: true,
                composed: true
            }));
            this.remove?.();
        }

        onBackdrop(event) {
            if (event.target === this.elements.backdrop && !this.isBusy()) {
                this.close();
            }
        }

        onKeydown(event) {
            if (event.key === 'Escape' && !this.isBusy()) {
                this.close();
            }
        }

        isBusy() {
            return ['loading', 'executing'].includes(this.mode);
        }

        renderState() {
            if (!this.rendered) {
                return;
            }
            const configurable = ['configure', 'validation-error'].includes(this.mode);
            const busy = this.isBusy();
            const canPreflight = configurable
                && this.selectedLessonIds.size > 0
                && this.elements.name.value.trim().length > 0
                && this.blocks.length > 0;

            this.elements.spinner.hidden = !busy;
            this.elements.configure.hidden = !configurable;
            this.elements.name.disabled = !configurable;
            this.elements.selectAll.disabled = !configurable;
            this.elements.clearAll.disabled = !configurable;
            this.elements.lessons.querySelectorAll('input').forEach((input) => {
                input.disabled = !configurable;
            });
            this.elements.addActions.querySelectorAll('button').forEach((button) => {
                button.disabled = !configurable;
            });
            this.elements.blocks.querySelectorAll('input, textarea, button').forEach((control) => {
                const boundaryDisabled = control.dataset?.originalDisabled === 'true';
                control.disabled = !configurable || boundaryDisabled;
            });
            this.elements.preflight.hidden = !configurable;
            this.elements.preflight.disabled = !canPreflight;
            this.elements.confirm.hidden = this.mode !== 'confirm';
            this.elements.confirm.disabled = !this.recipeReady || !this.currentPlan?.eligible?.length;
            this.elements.copy.hidden = this.mode !== 'complete';
            this.elements.restart.hidden = this.mode !== 'complete';
            this.elements.close.disabled = busy;
            if (this.mode !== 'executing') {
                this.elements.progress.hidden = true;
            }
        }
    }

    if (root.customElements && !root.customElements.get(BATCH_SECTION_DIALOG_TAG)) {
        root.customElements.define(BATCH_SECTION_DIALOG_TAG, BatchSectionCreationDialog);
    }

    return {
        BatchSectionCreationDialog,
        BATCH_SECTION_DIALOG_TAG,
        BATCH_SECTION_OVERLAY_ID
    };
});
