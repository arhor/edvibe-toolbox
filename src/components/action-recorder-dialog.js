(function initializeActionRecorderDialog(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], () => factory(root));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(root);
    } else {
        root.EdVibeActionRecorderDialog = factory(root);
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createRecorderDialogModule(root) {
    'use strict';

    const RECORDER_DIALOG_TAG = 'edvibe-toolbox-action-recorder';
    const RECORDER_DIALOG_ID = 'edvibe-toolbox-action-recorder';
    const HTMLElementBase = root.HTMLElement || class {};
    const recorderTemplate = root.document?.createElement?.('template') || null;

    if (recorderTemplate) {
        recorderTemplate.innerHTML = `
            <link class="recorder-stylesheet" rel="stylesheet">
            <button class="recorder-indicator" type="button" hidden
                aria-label="Открыть запись WebSocket">
                <span></span>
                <strong>REC</strong>
                <span class="indicator-count">0</span>
            </button>
            <div class="recorder-overlay">
                <section class="recorder-panel" role="dialog"
                    aria-labelledby="recorder-title">
                    <header class="recorder-header">
                        <div>
                            <h2 id="recorder-title">Запись действий WebSocket</h2>
                            <p class="recorder-subtitle">
                                Выполните одно действие в Edvibe и изучите обмен сообщениями.
                            </p>
                        </div>
                        <div class="header-actions">
                            <button class="icon-button recorder-minimize"
                                type="button" aria-label="Свернуть">−</button>
                            <button class="icon-button recorder-close"
                                type="button" aria-label="Закрыть">&times;</button>
                        </div>
                    </header>
                    <div class="recorder-toolbar">
                        <div class="recorder-state">
                            <span class="state-dot"></span>
                            <strong class="state-label">Готово к записи</strong>
                            <span class="elapsed"></span>
                        </div>
                        <div class="toolbar-actions">
                            <button class="button primary recorder-start"
                                type="button">Начать запись</button>
                            <button class="button danger recorder-stop"
                                type="button" hidden>Остановить</button>
                            <button class="button recorder-clear"
                                type="button" disabled>Очистить</button>
                            <button class="button recorder-copy"
                                type="button" disabled>Копировать рецепт</button>
                            <button class="button recorder-export"
                                type="button" disabled>Экспорт JSON</button>
                        </div>
                    </div>
                    <div class="recorder-body">
                        <aside class="privacy-warning">
                            Запись может содержать данные учеников, уроки, ответы и
                            идентификаторы. Проверьте файл перед отправкой или коммитом.
                        </aside>
                        <div class="recorder-summary">
                            <span><strong class="operation-count">0</strong> операций</span>
                            <span><strong class="frame-count">0</strong> кадров</span>
                            <span><strong class="byte-count">0 Б</strong> текста</span>
                            <label>
                                <input class="show-toolbox" type="checkbox">
                                Показать трафик Toolbox
                            </label>
                        </div>
                        <p class="recorder-notice" role="status" hidden></p>
                        <section>
                            <h3>Операции</h3>
                            <div class="operation-list"></div>
                            <p class="empty-operations">
                                Запустите запись и выполните действие в Edvibe.
                            </p>
                        </section>
                        <details class="other-section">
                            <summary>
                                Другие кадры (<span class="other-count">0</span>)
                            </summary>
                            <div class="other-list"></div>
                        </details>
                        <label class="copy-fallback" hidden>
                            Скопируйте текст вручную
                            <textarea readonly></textarea>
                        </label>
                    </div>
                </section>
            </div>
        `;
    }

    class ActionRecorderDialog extends HTMLElementBase {
        constructor() {
            super();
            this.stylesheetUrl = '';
            this.callbacks = {};
            this.state = { status: 'idle', session: null };
            this.minimized = false;
            this.showToolbox = false;
            this.elapsedTimer = null;
            this.rendered = false;
            this.listenersConnected = false;
            if (typeof this.attachShadow !== 'function' || !recorderTemplate) {
                return;
            }
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.append(recorderTemplate.content.cloneNode(true));
            this.cacheElements();
            this.updateStylesheet();
            this.rendered = true;
        }

        connectedCallback() {
            if (!this.id) {
                this.id = RECORDER_DIALOG_ID;
            }
            this.render();
            this.connectListeners();
            this.renderState();
        }

        disconnectedCallback() {
            this.disconnectListeners();
            this.stopElapsedTimer();
        }

        configure(options = {}) {
            options = options && typeof options === 'object' ? options : {};
            if (options.stylesheetUrl !== undefined) {
                this.stylesheetUrl = String(options.stylesheetUrl || '');
            }
            for (const name of [
                'onStart', 'onStop', 'onClear', 'onExport',
                'onCopyRequest', 'onCopyRecipe', 'onClose'
            ]) {
                if (typeof options[name] === 'function') {
                    this.callbacks[name] = options[name];
                }
            }
            this.updateStylesheet();
            return this;
        }

        mount() {
            if (!this.isConnected && root.document?.body) {
                root.document.body.appendChild(this);
            }
        }

        restore() {
            this.minimized = false;
            this.renderState();
        }

        setState(state) {
            this.state = state && typeof state === 'object'
                ? state
                : { status: 'idle', session: null };
            this.renderState();
            return this;
        }

        render() {
            return this.rendered;
        }

        cacheElements() {
            if (!this.shadowRoot) {
                return;
            }
            const find = (selector) => this.shadowRoot.querySelector(selector);
            this.elements = {
                stylesheet: find('.recorder-stylesheet'),
                overlay: find('.recorder-overlay'),
                indicator: find('.recorder-indicator'),
                indicatorCount: find('.indicator-count'),
                minimize: find('.recorder-minimize'),
                close: find('.recorder-close'),
                start: find('.recorder-start'),
                stop: find('.recorder-stop'),
                clear: find('.recorder-clear'),
                copy: find('.recorder-copy'),
                export: find('.recorder-export'),
                state: find('.recorder-state'),
                stateLabel: find('.state-label'),
                elapsed: find('.elapsed'),
                operationCount: find('.operation-count'),
                frameCount: find('.frame-count'),
                byteCount: find('.byte-count'),
                showToolbox: find('.show-toolbox'),
                notice: find('.recorder-notice'),
                operationList: find('.operation-list'),
                empty: find('.empty-operations'),
                otherCount: find('.other-count'),
                otherList: find('.other-list'),
                copyFallback: find('.copy-fallback'),
                copyFallbackText: find('.copy-fallback textarea')
            };
        }

        connectListeners() {
            if (!this.rendered || this.listenersConnected) {
                return;
            }
            this.listenersConnected = true;
            this.handleStart = () => {
                if (
                    this.state.session
                    && !root.confirm('Удалить предыдущую запись и начать новую?')
                ) return;
                this.callbacks.onStart?.();
            };
            this.handleStop = () => this.callbacks.onStop?.();
            this.handleClear = () => {
                if (!this.state.session || root.confirm('Удалить текущую запись?')) {
                    this.callbacks.onClear?.();
                }
            };
            this.handleCopy = () => this.callbacks.onCopyRecipe?.();
            this.handleExport = () => this.callbacks.onExport?.();
            this.handleMinimize = () => {
                this.minimized = true;
                this.renderState();
            };
            this.handleClose = () => {
                if (this.state.status === 'recording') {
                    this.minimized = true;
                    this.renderState();
                    return;
                }
                this.callbacks.onClose?.();
            };
            this.handleRestore = () => this.restore();
            this.handleToolboxToggle = () => {
                this.showToolbox = this.elements.showToolbox.checked;
                this.renderOperations();
            };

            this.elements.start.addEventListener('click', this.handleStart);
            this.elements.stop.addEventListener('click', this.handleStop);
            this.elements.clear.addEventListener('click', this.handleClear);
            this.elements.copy.addEventListener('click', this.handleCopy);
            this.elements.export.addEventListener('click', this.handleExport);
            this.elements.minimize.addEventListener('click', this.handleMinimize);
            this.elements.close.addEventListener('click', this.handleClose);
            this.elements.indicator.addEventListener('click', this.handleRestore);
            this.elements.showToolbox.addEventListener('change', this.handleToolboxToggle);
        }

        disconnectListeners() {
            if (!this.listenersConnected) {
                return;
            }
            this.listenersConnected = false;
            this.elements.start.removeEventListener('click', this.handleStart);
            this.elements.stop.removeEventListener('click', this.handleStop);
            this.elements.clear.removeEventListener('click', this.handleClear);
            this.elements.copy.removeEventListener('click', this.handleCopy);
            this.elements.export.removeEventListener('click', this.handleExport);
            this.elements.minimize.removeEventListener('click', this.handleMinimize);
            this.elements.close.removeEventListener('click', this.handleClose);
            this.elements.indicator.removeEventListener('click', this.handleRestore);
            this.elements.showToolbox.removeEventListener('change', this.handleToolboxToggle);
        }

        updateStylesheet() {
            this.elements?.stylesheet?.setAttribute('href', this.stylesheetUrl);
        }

        formatBytes(bytes) {
            if (bytes < 1024) {
                return `${bytes} Б`;
            }
            if (bytes < 1024 * 1024) {
                return `${(bytes / 1024).toFixed(1)} КиБ`;
            }
            return `${(bytes / 1024 / 1024).toFixed(1)} МиБ`;
        }

        operationStatus(operation) {
            if (!operation.response) {
                return 'Ожидается';
            }
            if (operation.response.isSuccess === true) {
                return 'Успешно';
            }
            if (operation.response.isSuccess === false) {
                return 'Ошибка';
            }
            return 'Ответ получен';
        }

        createJsonBlock(label, value) {
            const wrapper = root.document.createElement('div');
            const heading = root.document.createElement('strong');
            const pre = root.document.createElement('pre');
            heading.textContent = label;
            pre.textContent = JSON.stringify(value, null, 2);
            wrapper.append(heading, pre);
            return wrapper;
        }

        renderOperations() {
            if (!this.rendered) {
                return;
            }
            const operations = (this.state.session?.operations || []).filter(
                (operation) => this.showToolbox || operation.origin === 'page'
            );
            this.elements.operationList.replaceChildren();
            this.elements.empty.hidden = operations.length > 0;

            for (const operation of operations) {
                const details = root.document.createElement('details');
                const summary = root.document.createElement('summary');
                const sequence = root.document.createElement('span');
                const name = root.document.createElement('strong');
                const duration = root.document.createElement('span');
                const result = root.document.createElement('span');
                const content = root.document.createElement('div');
                const metadata = root.document.createElement('p');
                const copy = root.document.createElement('button');

                details.className = 'operation';
                sequence.textContent = String(operation.sequence).padStart(2, '0');
                sequence.className = 'operation-sequence';
                name.textContent = `${operation.controller}.${operation.method}`;
                name.className = 'operation-name';
                duration.textContent = operation.durationMs === null
                    ? '—'
                    : `${operation.durationMs} мс`;
                duration.className = 'operation-duration';
                result.textContent = this.operationStatus(operation);
                result.className = `operation-result is-${
                    operation.response?.isSuccess === false ? 'error' : 'normal'
                }`;
                summary.append(sequence, name, duration, result);

                content.className = 'operation-content';
                metadata.textContent = [
                    `Project: ${operation.projectName || '—'}`,
                    `RequestId: ${operation.requestId}`,
                    `Origin: ${operation.origin}`
                ].join(' · ');
                content.append(
                    metadata,
                    this.createJsonBlock('Запрос Value', operation.requestValue),
                    this.createJsonBlock('Ответ', operation.response)
                );
                copy.type = 'button';
                copy.className = 'button copy-request';
                copy.textContent = 'Копировать запрос';
                copy.addEventListener('click', () =>
                    this.callbacks.onCopyRequest?.(operation.sequence)
                );
                content.append(copy);
                details.append(summary, content);
                this.elements.operationList.append(details);
            }
        }

        renderOtherFrames() {
            if (!this.rendered) {
                return;
            }
            const frames = this.state.session?.otherFrames || [];
            this.elements.otherCount.textContent = String(frames.length);
            this.elements.otherList.replaceChildren();
            for (const frame of frames) {
                const pre = root.document.createElement('pre');
                pre.textContent = JSON.stringify(frame, null, 2);
                this.elements.otherList.append(pre);
            }
        }

        updateElapsed() {
            if (!this.rendered) {
                return;
            }
            const startedAt = this.state.session?.startedAt;
            if (!startedAt) {
                this.elements.elapsed.textContent = '';
                return;
            }
            const end = this.state.session.stoppedAt
                ? Date.parse(this.state.session.stoppedAt)
                : Date.now();
            const elapsedSeconds = Math.max(
                0,
                Math.floor((end - Date.parse(startedAt)) / 1000)
            );
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = String(elapsedSeconds % 60).padStart(2, '0');
            this.elements.elapsed.textContent = `${minutes}:${seconds}`;
        }

        startElapsedTimer() {
            this.stopElapsedTimer();
            if (this.state.status !== 'recording') {
                return;
            }
            this.elapsedTimer = root.setInterval?.(() => this.updateElapsed(), 1000);
        }

        stopElapsedTimer() {
            if (this.elapsedTimer !== null) {
                root.clearInterval?.(this.elapsedTimer);
                this.elapsedTimer = null;
            }
        }

        renderState() {
            if (!this.rendered) {
                return;
            }
            const recording = this.state.status === 'recording';
            const hasSession = Boolean(this.state.session);
            const operations = this.state.session?.operations || [];
            const visibleCount = operations.filter((operation) =>
                this.showToolbox || operation.origin === 'page'
            ).length;
            const labels = {
                idle: 'Готово к записи',
                recording: 'Идёт запись',
                stopped: 'Запись остановлена',
                'limit-reached': 'Достигнут лимит'
            };

            this.elements.overlay.hidden = this.minimized;
            this.elements.indicator.hidden = !this.minimized;
            this.elements.indicator.classList.toggle('is-recording', recording);
            this.elements.indicatorCount.textContent = String(visibleCount);
            this.elements.state.dataset.status = this.state.status;
            this.elements.stateLabel.textContent = labels[this.state.status] || labels.idle;
            this.elements.start.hidden = recording;
            this.elements.stop.hidden = !recording;
            this.elements.clear.disabled = !hasSession;
            this.elements.copy.disabled = !hasSession || operations.length === 0;
            this.elements.export.disabled = !hasSession;
            this.elements.operationCount.textContent = String(visibleCount);
            this.elements.frameCount.textContent = String(
                this.state.session?.frameCount || 0
            );
            this.elements.byteCount.textContent = this.formatBytes(
                this.state.session?.storedBytes || 0
            );
            this.elements.notice.textContent = this.state.notice || '';
            this.elements.notice.hidden = !this.state.notice;
            this.elements.copyFallback.hidden = !this.state.copyFallback;
            this.elements.copyFallbackText.value = this.state.copyFallback || '';
            this.updateElapsed();
            this.startElapsedTimer();
            this.renderOperations();
            this.renderOtherFrames();
        }
    }

    if (root.customElements && !root.customElements.get(RECORDER_DIALOG_TAG)) {
        root.customElements.define(RECORDER_DIALOG_TAG, ActionRecorderDialog);
    }

    return {
        RECORDER_DIALOG_TAG,
        RECORDER_DIALOG_ID,
        ActionRecorderDialog
    };
});
