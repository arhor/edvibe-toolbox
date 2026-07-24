(function initializeResetDialogComponent(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeResetDialogComponent = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createResetDialogComponent() {
    'use strict';

    const RESET_DIALOG_TAG = 'edvibe-toolbox-reset-dialog';
    const RESET_OVERLAY_ID = 'edvibe-toolbox-reset-overlay';
    const componentConstructors = new WeakSet();
    let stylesheetUrl = '';

    function getResetModalMarkup() {
        return `
            <div class="edvibe-reset-card" role="dialog" aria-modal="true" aria-labelledby="edvibe-reset-title">
                <div class="edvibe-reset-header"><div>
                    <h2 id="edvibe-reset-title" class="edvibe-reset-title">Сброс уроков</h2>
                    <p class="edvibe-reset-subtitle"><span class="edvibe-reset-step-indicator">Шаг 1 из 2</span>
                        <span class="edvibe-reset-step-description">Выберите пользователя.</span></p>
                </div><button class="edvibe-reset-close" type="button" aria-label="Закрыть">&times;</button></div>
                <div class="edvibe-reset-body">
                    <section class="edvibe-reset-user-step" aria-label="Выбор пользователя">
                        <label class="edvibe-reset-label" for="edvibe-reset-search">Поиск по email</label>
                        <input id="edvibe-reset-search" class="edvibe-reset-search" type="search" placeholder="user@example.com" autocomplete="off">
                        <div class="edvibe-reset-pupils-shell"><div class="edvibe-reset-list edvibe-reset-pupils" role="listbox" aria-label="Пользователи марафона"></div>
                            <div class="edvibe-reset-pupils-loading" role="status" aria-live="polite" hidden><span class="edvibe-reset-spinner" aria-hidden="true"></span><span>Загрузка пользователей...</span></div></div>
                    </section>
                    <section class="edvibe-reset-lesson-step" aria-label="Выбор уроков" hidden>
                        <div class="edvibe-reset-label edvibe-reset-selected-pupil"></div>
                        <label class="edvibe-reset-select-all"><input class="edvibe-reset-select-all-input" type="checkbox"> Выбрать все уроки</label>
                        <div class="edvibe-reset-list edvibe-reset-lessons" aria-label="Уроки пользователя" tabindex="-1"></div>
                    </section>
                </div>
                <div class="edvibe-reset-live-region"><p class="edvibe-reset-status" aria-live="polite"></p>
                    <div class="edvibe-reset-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="edvibe-reset-progress-bar"></div></div>
                </div>
                <div class="edvibe-reset-footer"><button class="edvibe-reset-button edvibe-reset-cancel" type="button">Закрыть</button>
                    <button class="edvibe-reset-button edvibe-reset-back" type="button" hidden>Назад</button>
                    <button class="edvibe-reset-button edvibe-reset-next" type="button" disabled>Далее</button>
                    <button class="edvibe-reset-button edvibe-reset-submit" type="button" disabled hidden>Сбросить прогресс</button></div>
            </div>`;
    }

    function getResetDialogMarkup() {
        return `<div class="edvibe-reset-overlay">${getResetModalMarkup()}</div>`;
    }

    function setStylesheetUrl(url) {
        stylesheetUrl = String(url || '');
    }

    function resolvePlatform(platform) {
        const candidate = platform || {};
        const doc = candidate.document || (candidate.window && candidate.window.document)
            || (typeof document !== 'undefined' ? document : null);
        const view = candidate.window || doc?.defaultView || (typeof window !== 'undefined' ? window : null);
        return { document: doc, customElements: candidate.customElements || view?.customElements
            || (typeof customElements !== 'undefined' ? customElements : null),
        HTMLElement: candidate.HTMLElement || view?.HTMLElement
            || (typeof HTMLElement !== 'undefined' ? HTMLElement : null) };
    }

    function createConstructor(HTMLElementBase) {
        return class EdVibeResetDialogElement extends HTMLElementBase {
            constructor() {
                super();
                const root = this.attachShadow({ mode: 'open' });
                const link = this.ownerDocument?.createElement('link') || document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('href', stylesheetUrl);
                root.appendChild(link);
                const template = this.ownerDocument?.createElement('template');
                if (template && 'content' in template) {
                    template.innerHTML = getResetDialogMarkup();
                    root.appendChild(template.content.cloneNode(true));
                } else {
                    const container = this.ownerDocument?.createElement('div') || document.createElement('div');
                    container.innerHTML = getResetDialogMarkup();
                    while (container.firstChild) root.appendChild(container.firstChild);
                }
                Object.defineProperty(this, 'renderRoot', { value: root, enumerable: true });
            }
        };
    }

    function defineResetDialogElement(platform) {
        const resolved = resolvePlatform(platform);
        if (!resolved.customElements || !resolved.HTMLElement) {
            throw new Error('Reset dialog requires customElements and HTMLElement.');
        }
        const existing = resolved.customElements.get(RESET_DIALOG_TAG);
        if (existing) {
            if (!componentConstructors.has(existing)) {
                throw new Error(`Custom element ${RESET_DIALOG_TAG} is already registered with an incompatible constructor.`);
            }
            return existing;
        }
        const constructor = createConstructor(resolved.HTMLElement);
        componentConstructors.add(constructor);
        resolved.customElements.define(RESET_DIALOG_TAG, constructor);
        return constructor;
    }

    function createResetDialogElement(platform) {
        const resolved = resolvePlatform(platform);
        if (!resolved.document) throw new Error('Reset dialog requires a document.');
        if (resolved.customElements && resolved.HTMLElement) {
            defineResetDialogElement(resolved);
            const element = resolved.document.createElement(RESET_DIALOG_TAG);
            element.id = RESET_OVERLAY_ID;
            return element;
        }
        // Small-DOM compatibility for Node-level controller tests; browsers always use the component above.
        const element = resolved.document.createElement('div');
        element.id = RESET_OVERLAY_ID;
        element.renderRoot = element;
        element.innerHTML = getResetModalMarkup();
        return element;
    }

    return { RESET_DIALOG_TAG, RESET_OVERLAY_ID, setStylesheetUrl, getResetModalMarkup,
        getResetDialogMarkup, defineResetDialogElement, createResetDialogElement };
});
