const test = require('node:test');
const assert = require('node:assert/strict');

const {
    RESET_DIALOG_TAG,
    RESET_OVERLAY_ID,
    setStylesheetUrl,
    defineResetDialogElement,
    createResetDialogElement
} = require('../src/components/reset-lessons-dialog.js');

function createWebComponentPlatform() {
    let activeDocument = null;

    class FakeNode {
        constructor(tagName = '') {
            this.tagName = tagName.toUpperCase();
            this.children = [];
            this.attributes = new Map();
            this.textContent = '';
        }

        appendChild(child) {
            this.children.push(child);
            return child;
        }

        setAttribute(name, value) {
            this.attributes.set(name, String(value));
        }

        getAttribute(name) {
            return this.attributes.get(name) ?? null;
        }

        querySelector(selector) {
            for (const child of this.children) {
                if (selector === 'style' && child.tagName === 'STYLE') return child;
                const match = child.querySelector?.(selector);
                if (match) return match;
            }
            return null;
        }
    }

    class FakeMarkupNode extends FakeNode {
        constructor(markup) {
            super();
            this.markup = markup;
        }

        querySelector(selector) {
            const attribute = selector.startsWith('.')
                ? 'class'
                : selector.startsWith('#') ? 'id' : null;
            if (!attribute) return null;

            const value = selector.slice(1);
            const tagPattern = new RegExp(
                `<([a-z0-9-]+)([^>]*\\b${attribute}="[^"]*\\b${value}\\b[^"]*"[^>]*)>`,
                'i'
            );
            const match = this.markup.match(tagPattern);
            if (!match) return null;

            const element = new FakeNode(match[1]);
            for (const attributeMatch of match[2].matchAll(/([\w-]+)="([^"]*)"/g)) {
                element.setAttribute(attributeMatch[1], attributeMatch[2]);
            }
            return element;
        }
    }

    class FakeTemplateContent {
        constructor() {
            this.markup = '';
        }

        cloneNode() {
            return new FakeMarkupNode(this.markup);
        }
    }

    class FakeTemplate extends FakeNode {
        constructor() {
            super('template');
            this.content = new FakeTemplateContent();
        }

        set innerHTML(markup) {
            this.content.markup = markup;
        }
    }

    class FakeShadowRoot extends FakeNode {
        constructor(mode) {
            super();
            this.mode = mode;
        }
    }

    class FakeHTMLElement extends FakeNode {
        constructor() {
            super();
            this.ownerDocument = activeDocument;
            this.shadowRoot = null;
        }

        attachShadow({ mode }) {
            this.shadowRoot = new FakeShadowRoot(mode);
            return this.shadowRoot;
        }
    }

    const constructors = new Map();
    let defineCount = 0;
    const customElements = {
        get: (tagName) => constructors.get(tagName),
        define(tagName, constructor) {
            defineCount += 1;
            constructors.set(tagName, constructor);
        }
    };

    const document = {
        head: new FakeNode('head'),
        defaultView: null,
        createElement(tagName) {
            const constructor = constructors.get(tagName);
            if (constructor) {
                activeDocument = document;
                try {
                    const element = new constructor();
                    element.tagName = tagName.toUpperCase();
                    return element;
                } finally {
                    activeDocument = null;
                }
            }
            if (tagName === 'template') return new FakeTemplate();
            return new FakeNode(tagName);
        }
    };
    document.defaultView = { document, customElements, HTMLElement: FakeHTMLElement };

    return {
        document,
        customElements,
        HTMLElement: FakeHTMLElement,
        constructors,
        getDefineCount: () => defineCount
    };
}

test('component module loads without browser globals', () => {
    assert.equal(RESET_DIALOG_TAG, 'edvibe-toolbox-reset-dialog');
    assert.equal(typeof defineResetDialogElement, 'function');
});

test('registers once and creates an open shadow-root dialog', () => {
    const platform = createWebComponentPlatform();
    const stylesheetUrl = 'chrome-extension://test/src/components/reset-lessons-dialog.css';
    setStylesheetUrl(stylesheetUrl);

    const firstConstructor = defineResetDialogElement(platform);
    const secondConstructor = defineResetDialogElement(platform);
    const element = createResetDialogElement(platform);

    assert.equal(firstConstructor, secondConstructor);
    assert.equal(platform.getDefineCount(), 1);
    assert.equal(element.tagName, RESET_DIALOG_TAG.toUpperCase());
    assert.equal(element.id, RESET_OVERLAY_ID);
    assert.equal(element.renderRoot, element.shadowRoot);
    assert.equal(element.shadowRoot.mode, 'open');

    const backdrop = element.shadowRoot.querySelector('.edvibe-reset-overlay');
    const card = element.shadowRoot.querySelector('.edvibe-reset-card');
    assert.ok(backdrop);
    assert.equal(card.getAttribute('role'), 'dialog');
    assert.equal(card.getAttribute('aria-modal'), 'true');
    assert.equal(card.getAttribute('aria-labelledby'), 'edvibe-reset-title');
    assert.ok(element.shadowRoot.querySelector('#edvibe-reset-title'));
    assert.ok(element.shadowRoot.querySelector('.edvibe-reset-status'));
    assert.ok(element.shadowRoot.querySelector('.edvibe-reset-progress'));
    assert.equal(element.shadowRoot.querySelector('.edvibe-reset-row'), null);

    const link = element.shadowRoot.children.find((child) => child.tagName === 'LINK');
    assert.equal(link.getAttribute('rel'), 'stylesheet');
    assert.equal(link.getAttribute('href'), stylesheetUrl);
    assert.equal(platform.document.head.children.length, 0);
});

test('rejects a custom element registered by another implementation', () => {
    const platform = createWebComponentPlatform();
    class ConflictingDialog extends platform.HTMLElement {}
    platform.customElements.define(RESET_DIALOG_TAG, ConflictingDialog);

    assert.throws(
        () => defineResetDialogElement(platform),
        /already registered with an incompatible constructor/
    );
});
