import { LitElement, html } from 'lit';
import {
    componentFoundationStyles,
    dialogFoundationStyles
} from '../../styles/foundations.js';
import { actionRecorderDialogStyles } from './action-recorder-dialog.styles.js';

const RECORDER_DIALOG_TAG = 'edvibe-toolbox-action-recorder';
const RECORDER_DIALOG_ID = 'edvibe-toolbox-action-recorder';

class ActionRecorderDialog extends LitElement {
    static styles = [
        componentFoundationStyles,
        dialogFoundationStyles,
        actionRecorderDialogStyles,
    ];

    static properties = {
        state: { state: true },
        minimized: { state: true },
        showToolbox: { state: true },
        elapsedLabel: { state: true }
    };

    constructor() {
        super();
        this.callbacks = {};
        this.state = { status: 'idle', session: null };
        this.minimized = false;
        this.showToolbox = false;
        this.elapsedLabel = '';
        this.elapsedTimer = null;
    }

    connectedCallback() {
        super.connectedCallback();
        if (!this.id) {
            this.id = RECORDER_DIALOG_ID;
        }
        this.syncElapsedTimer();
    }

    disconnectedCallback() {
        this.stopElapsedTimer();
        super.disconnectedCallback();
    }

    configure(options = {}) {
        options = options && typeof options === 'object' ? options : {};
        for (const name of [
            'onStart', 'onStop', 'onClear', 'onExport',
            'onCopyRequest', 'onCopyRecipe', 'onClose'
        ]) {
            if (typeof options[name] === 'function') {
                this.callbacks[name] = options[name];
            }
        }
        return this;
    }

    mount() {
        if (!this.isConnected && globalThis.document?.body) {
            globalThis.document.body.appendChild(this);
        }
    }

    restore() {
        this.minimized = false;
    }

    setState(state) {
        this.state =
            (state && typeof state === 'object')
                ? state
                : { status: 'idle', session: null };
        this.elapsedLabel = this.calculateElapsed();
        this.syncElapsedTimer();
        return this;
    }

    confirm(message) {
        return globalThis.confirm(message);
    }

    handleStart() {
        if (this.state.session && !this.confirm('Удалить предыдущую запись и начать новую?')) {
            return;
        }
        this.callbacks.onStart?.();
    }

    handleClear() {
        if (!this.state.session || this.confirm('Удалить текущую запись?')) {
            this.callbacks.onClear?.();
        }
    }

    handleClose() {
        if (this.state.status === 'recording') {
            this.minimized = true;
            return;
        }
        this.callbacks.onClose?.();
    }

    formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} Б`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КиБ`;
        return `${(bytes / 1024 / 1024).toFixed(1)} МиБ`;
    }

    operationStatus(operation) {
        if (!operation.response) return 'Ожидается';
        if (operation.response.isSuccess === true) return 'Успешно';
        if (operation.response.isSuccess === false) return 'Ошибка';
        return 'Ответ получен';
    }

    visibleOperations() {
        return (this.state.session?.operations || []).filter(
            (operation) => this.showToolbox || operation.origin === 'page'
        );
    }

    calculateElapsed() {
        const startedAt = this.state.session?.startedAt;
        if (!startedAt) return '';
        const started = Date.parse(startedAt);
        if (Number.isNaN(started)) return '';
        const end = this.state.session.stoppedAt
            ? Date.parse(this.state.session.stoppedAt)
            : Date.now();
        const elapsedSeconds = Math.max(0, Math.floor((end - started) / 1000));
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = String(elapsedSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    syncElapsedTimer() {
        this.stopElapsedTimer();
        if (this.state.status !== 'recording' || !this.isConnected) return;
        this.elapsedTimer = globalThis.setInterval(() => {
            this.elapsedLabel = this.calculateElapsed();
        }, 1000);
    }

    stopElapsedTimer() {
        if (this.elapsedTimer !== null) {
            globalThis.clearInterval(this.elapsedTimer);
            this.elapsedTimer = null;
        }
    }

    renderJsonBlock(label, value) {
        return html`<div><strong>${label}</strong><pre>${JSON.stringify(value, null, 2)}</pre></div>`;
    }

    renderOperation(operation) {
        const resultClass = `operation-result is-${operation.response?.isSuccess === false ? 'error' : 'normal'
            }`;
        return html`
            <details class="operation">
                <summary>
                    <span class="operation-sequence">${String(operation.sequence).padStart(2, '0')}</span>
                    <strong class="operation-name">${operation.controller}.${operation.method}</strong>
                    <span class="operation-duration">${operation.durationMs === null ? '—' : `${operation.durationMs} мс`}</span>
                    <span class=${resultClass}>${this.operationStatus(operation)}</span>
                </summary>
                <div class="operation-content">
                    <p>${[
                `Project: ${operation.projectName || '—'}`,
                `RequestId: ${operation.requestId}`,
                `Origin: ${operation.origin}`
            ].join(' · ')}</p>
                    ${this.renderJsonBlock('Запрос Value', operation.requestValue)}
                    ${this.renderJsonBlock('Ответ', operation.response)}
                    <button type="button" class="button copy-request"
                        @click=${() => this.callbacks.onCopyRequest?.(operation.sequence)}>
                        Копировать запрос
                    </button>
                </div>
            </details>
        `;
    }

    render() {
        const recording = this.state.status === 'recording';
        const hasSession = Boolean(this.state.session);
        const operations = this.state.session?.operations || [];
        const visibleOperations = this.visibleOperations();
        const otherFrames = this.state.session?.otherFrames || [];
        const labels = {
            idle: 'Готово к записи',
            recording: 'Идёт запись',
            stopped: 'Запись остановлена',
            'limit-reached': 'Достигнут лимит'
        };
        const indicatorClass = `recorder-indicator${recording ? ' is-recording' : ''}`;
        const copyFallback = String(this.state.copyFallback || '');

        return html`
            <button class=${indicatorClass} type="button" ?hidden=${!this.minimized}
                aria-label="Открыть запись WebSocket" title="Открыть запись WebSocket" @click=${() => this.restore()}>
                <span></span><strong>REC</strong>
                <span class="indicator-count">${visibleOperations.length}</span>
            </button>
            <div class="recorder-overlay" ?hidden=${this.minimized}>
                <section class="recorder-panel" role="dialog" aria-labelledby="recorder-title">
                    <header class="recorder-header">
                        <div>
                            <h2 id="recorder-title">Запись действий WebSocket</h2>
                            <p class="recorder-subtitle">Выполните одно действие в Edvibe и изучите обмен сообщениями.</p>
                        </div>
                        <div class="header-actions">
                            <button class="icon-button recorder-minimize" type="button" aria-label="Свернуть" @click=${() => { this.minimized = true; }}>
                                -
                            </button>
                            <button class="icon-button recorder-close" type="button" aria-label="Закрыть" @click=${() => this.handleClose()}>
                                &times;
                            </button>
                        </div>
                    </header>
                    <div class="recorder-toolbar">
                        <div class="recorder-state" data-status=${this.state.status}>
                            <span class="state-dot"></span>
                            <strong class="state-label">${labels[this.state.status] || labels.idle}</strong>
                            <span class="elapsed">${this.elapsedLabel}</span>
                        </div>
                        <div class="toolbar-actions">
                            <button class="button primary recorder-start" type="button" ?hidden=${recording} @click=${() => this.handleStart()}>
                                Начать запись
                            </button>
                            <button class="button danger recorder-stop" type="button" ?hidden=${!recording} @click=${() => this.callbacks.onStop?.()}>
                                Остановить
                            </button>
                            <button class="button recorder-clear" type="button" ?disabled=${!hasSession} @click=${() => this.handleClear()}>
                                Очистить
                            </button>
                            <button class="button recorder-copy" type="button" ?disabled=${!hasSession || operations.length === 0} @click=${() => this.callbacks.onCopyRecipe?.()}>
                                Копировать рецепт
                            </button>
                            <button class="button recorder-export" type="button" ?disabled=${!hasSession} @click=${() => this.callbacks.onExport?.()}>
                                Экспорт JSON
                            </button>
                        </div>
                    </div>
                    <div class="recorder-body">
                        <aside class="privacy-warning">
                            Запись может содержать данные учеников, уроки, ответы и идентификаторы.
                            Проверьте файл перед отправкой или коммитом.
                        </aside>
                        <div class="recorder-summary">
                            <span><strong class="operation-count">${visibleOperations.length}</strong> операций</span>
                            <span><strong class="frame-count">${this.state.session?.frameCount || 0}</strong> кадров</span>
                            <span><strong class="byte-count">${this.formatBytes(this.state.session?.storedBytes || 0)}</strong> текста</span>
                            <label>
                                <input class="show-toolbox" type="checkbox" .checked=${this.showToolbox} @change=${(event) => { this.showToolbox = event.currentTarget.checked; }}>
                                Показать трафик Toolbox
                            </label>
                        </div>
                        <p class="recorder-notice" role="status" ?hidden=${!this.state.notice}>${this.state.notice || ''}</p>
                        <section>
                            <h3>Операции</h3>
                            <div class="operation-list">${visibleOperations.map((operation) => this.renderOperation(operation))}</div>
                            <p class="empty-operations" ?hidden=${visibleOperations.length > 0}> Запустите запись и выполните действие в Edvibe.</p>
                        </section>
                        <details class="other-section">
                            <summary>Другие кадры (<span class="other-count">${otherFrames.length}</span>)</summary>
                            <div class="other-list">${otherFrames.map((frame) => html`<pre>${JSON.stringify(frame, null, 2)}</pre>`)}</div>
                        </details>
                        <label class="copy-fallback" ?hidden=${!copyFallback}>
                            Скопируйте текст вручную
                            <textarea readonly .value=${copyFallback}></textarea>
                        </label>
                    </div>
                </section>
            </div>
        `;
    }
}

if (!customElements.get(RECORDER_DIALOG_TAG)) {
    customElements.define(RECORDER_DIALOG_TAG, ActionRecorderDialog);
}

export { RECORDER_DIALOG_TAG, RECORDER_DIALOG_ID, ActionRecorderDialog };
