const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const componentPath = path.resolve(
    __dirname,
    '../src/components/batch-user-management-dialog.js'
);

function createDomHarness() {
    const constructors = new Map();
    const templates = [];

    class FakeClassList {
        constructor() {
            this.values = new Set();
        }

        toggle(name, force) {
            if (force === undefined ? !this.values.has(name) : force) {
                this.values.add(name);
            } else {
                this.values.delete(name);
            }
        }

        contains(name) {
            return this.values.has(name);
        }
    }

    class FakeElement {
        constructor(tagName = 'div') {
            this.tagName = String(tagName).toUpperCase();
            this.children = [];
            this.listeners = new Map();
            this.classList = new FakeClassList();
            this.attributes = new Map();
            this.hidden = false;
            this.disabled = false;
            this.checked = false;
            this.indeterminate = false;
            this.value = '';
            this.textContent = '';
            this.dataset = {};
        }

        set className(value) {
            this._className = value;
            this.classList = new FakeClassList();
            String(value || '').split(/\s+/).filter(Boolean).forEach((name) => {
                this.classList.values.add(name);
            });
        }

        get className() {
            return this._className || '';
        }

        append(...children) {
            this.children.push(...children);
        }

        appendChild(child) {
            this.children.push(child);
            return child;
        }

        replaceChildren(...children) {
            this.children = children;
        }

        setAttribute(name, value) {
            this.attributes.set(name, String(value));
        }

        getAttribute(name) {
            return this.attributes.get(name) || null;
        }

        addEventListener(type, listener) {
            const listeners = this.listeners.get(type) || [];
            listeners.push(listener);
            this.listeners.set(type, listeners);
        }

        removeEventListener(type, listener) {
            const listeners = this.listeners.get(type) || [];
            this.listeners.set(type, listeners.filter((item) => item !== listener));
        }

        dispatchEvent(event) {
            event.target ||= this;
            for (const listener of this.listeners.get(event.type) || []) {
                listener(event);
            }
            return true;
        }

        querySelectorAll(selector) {
            const matches = [];
            const visit = (element) => {
                for (const child of element.children) {
                    if (
                        selector === 'input'
                        && child.tagName === 'INPUT'
                    ) {
                        matches.push(child);
                    }
                    if (selector.startsWith('.')) {
                        const className = selector.slice(1);
                        if (child.classList.contains(className)) {
                            matches.push(child);
                        }
                    }
                    visit(child);
                }
            };
            visit(this);
            return matches;
        }
    }

    class FakeTemplate extends FakeElement {
        set innerHTML(value) {
            this.markup = value;
        }

        get content() {
            return {
                cloneNode: () => ({ markup: this.markup })
            };
        }
    }

    class FakeShadowRoot {
        constructor() {
            this.elements = new Map();
        }

        append(fragment) {
            this.markup = fragment.markup;
        }

        querySelector(selector) {
            if (!this.elements.has(selector)) {
                const tagName = selector.includes('textarea')
                    ? 'textarea'
                    : selector.includes('progress')
                        ? 'progress'
                        : selector.includes('input')
                            ? 'input'
                            : selector.includes('button')
                                ? 'button'
                                : 'div';
                this.elements.set(selector, new FakeElement(tagName));
            }
            return this.elements.get(selector);
        }
    }

    class FakeHTMLElement extends FakeElement {
        constructor() {
            super('host');
            this.ownerDocument = document;
            this.emitted = [];
        }

        attachShadow({ mode }) {
            this.shadowRoot = new FakeShadowRoot();
            this.shadowRoot.mode = mode;
            return this.shadowRoot;
        }

        dispatchEvent(event) {
            this.emitted.push(event);
            return super.dispatchEvent(event);
        }

        remove() {
            this.removed = true;
        }
    }

    const document = {
        createElement(tagName) {
            if (tagName === 'template') {
                const template = new FakeTemplate(tagName);
                templates.push(template);
                return template;
            }
            return new FakeElement(tagName);
        },
        addEventListener() {},
        removeEventListener() {}
    };

    const context = {
        HTMLElement: FakeHTMLElement,
        document,
        CustomEvent: class {
            constructor(type, options = {}) {
                this.type = type;
                this.detail = options.detail;
            }
        },
        customElements: {
            get: (tagName) => constructors.get(tagName),
            define: (tagName, constructor) => constructors.set(tagName, constructor)
        }
    };
    context.globalThis = context;
    return { context, constructors, templates };
}

function loadBrowserComponent() {
    const source = fs.readFileSync(componentPath, 'utf8');
    const harness = createDomHarness();
    vm.runInNewContext(source, harness.context);
    return {
        ...harness,
        api: harness.context.EdVibeBatchUserManagementDialog
    };
}

function createDialog() {
    const { api, ...harness } = loadBrowserComponent();
    const dialog = new api.BatchUserManagementDialog();
    dialog.connectedCallback();
    return { dialog, api, ...harness };
}

function matchedRow(email, overrides = {}) {
    return {
        email,
        normalizedEmail: email.toLowerCase(),
        pupil: { MarathonPupilId: 22, Email: email, Name: 'User' },
        marathonPupilId: 22,
        hasCurator: true,
        actionable: true,
        status: 'matched',
        message: '',
        unassignSelected: false,
        deleteSelected: false,
        result: { status: 'pending', message: 'Not started' },
        ...overrides
    };
}

function emitted(dialog, type) {
    return dialog.emitted.find((event) => event.type === type);
}

test('registers the custom element and includes the full table control template', () => {
    const { api, constructors, templates } = loadBrowserComponent();

    assert.equal(api.USER_MANAGEMENT_DIALOG_TAG, 'edvibe-toolbox-batch-user-management-dialog');
    assert.equal(api.USER_MANAGEMENT_OVERLAY_ID, 'edvibe-toolbox-batch-user-management-overlay');
    assert.equal(
        constructors.get(api.USER_MANAGEMENT_DIALOG_TAG),
        api.BatchUserManagementDialog
    );
    const markup = templates[0].markup;
    for (const control of [
        'edvibe-batch-user-management-stylesheet',
        'edvibe-batch-user-management-emails',
        'edvibe-batch-user-management-check',
        'edvibe-batch-user-management-table',
        'edvibe-batch-user-management-select-all-unassign',
        'edvibe-batch-user-management-select-all-delete',
        'edvibe-batch-user-management-start',
        'edvibe-batch-user-management-progress',
        'edvibe-batch-user-management-restart',
        'edvibe-batch-user-management-close'
    ]) {
        assert.match(markup, new RegExp(control));
    }
    assert.match(markup, /Пользователь/);
    assert.match(markup, /Снять куратора/);
    assert.match(markup, /Удалить пользователя/);
    assert.match(markup, /Результат/);
});

test('review starts with all operation checkboxes unchecked and start disabled', () => {
    const { dialog } = createDialog();
    dialog.showConfigure();
    dialog.showReview({
        rows: [
            matchedRow('first@example.com'),
            {
                email: 'missing@example.com',
                normalizedEmail: 'missing@example.com',
                pupil: null,
                marathonPupilId: null,
                hasCurator: false,
                actionable: false,
                status: 'missing',
                message: 'No marathon pupil found.',
                unassignSelected: false,
                deleteSelected: false,
                result: { status: 'pending', message: 'No marathon pupil found.' }
            }
        ]
    });

    assert.equal(dialog.mode, 'review');
    assert.equal(dialog.elements.start.disabled, true);
    assert.equal(dialog.rows[0].unassignSelected, false);
    assert.equal(dialog.rows[0].deleteSelected, false);
    assert.equal(dialog.rows[1].actionable, false);
    assert.equal(dialog.elements.tableBody.querySelectorAll('input').length, 4);
    assert.equal(
        dialog.elements.tableBody.querySelectorAll('input').every((input) => input.checked === false),
        true
    );
});

test('column select-all selects only actionable rows and emits selected rows', () => {
    const { dialog } = createDialog();
    dialog.showReview({
        rows: [
            matchedRow('first@example.com'),
            matchedRow('second@example.com', { hasCurator: false }),
            matchedRow('missing@example.com', {
                pupil: null,
                marathonPupilId: null,
                actionable: false,
                status: 'missing',
                message: 'No marathon pupil found.'
            })
        ]
    });

    dialog.elements.selectAllUnassign.checked = true;
    dialog.elements.selectAllUnassign.dispatchEvent({ type: 'change' });
    assert.deepEqual(dialog.rows.map((row) => row.unassignSelected), [true, true, false]);
    assert.equal(dialog.elements.start.disabled, false);
    assert.equal(emitted(dialog, 'edvibe-batch-user-management-selection-change').detail.rows.length, 3);

    dialog.elements.selectAllUnassign.dispatchEvent({ type: 'click' });
    assert.deepEqual(dialog.rows.map((row) => row.unassignSelected), [false, false, false]);
});

test('start emits selected rows and execution locks the modal', () => {
    const { dialog } = createDialog();
    dialog.showReview({ rows: [matchedRow('first@example.com')] });
    const checkbox = dialog.elements.tableBody.querySelectorAll('input')[0];
    checkbox.checked = true;
    checkbox.dispatchEvent({ type: 'change' });
    dialog.elements.start.dispatchEvent({ type: 'click' });

    assert.equal(emitted(dialog, 'edvibe-batch-user-management-start').detail.rows[0].unassignSelected, true);

    dialog.showExecution({
        completed: 0,
        total: 1,
        successes: 0,
        failures: 0,
        current: { email: 'first@example.com', operation: 'unassign' }
    });
    assert.equal(dialog.mode, 'executing');
    assert.equal(dialog.elements.emails.disabled, true);
    assert.equal(dialog.elements.start.disabled, true);
    assert.equal(dialog.elements.close.disabled, true);
    assert.equal(dialog.elements.progress.value, 0);
    assert.match(dialog.elements.status.textContent, /first@example.com/);
});

test('completion preserves every row and enables restart', () => {
    const { dialog } = createDialog();
    const rows = [
        matchedRow('done@example.com', {
            unassignSelected: true,
            unassign: { status: 'success', attempts: 1 },
            result: { status: 'success', message: 'Curator removed' }
        }),
        matchedRow('failed@example.com', {
            result: { status: 'failed', message: 'One or more selected operations failed.' }
        })
    ];
    dialog.showComplete({ rows, successes: 1, failures: 1, attempts: 1 });

    assert.equal(dialog.mode, 'partial-complete');
    assert.equal(dialog.rows.length, 2);
    assert.equal(dialog.elements.restart.disabled, false);
    assert.equal(dialog.elements.close.disabled, false);
    assert.equal(dialog.elements.tableBody.querySelectorAll('input').every((input) => input.disabled), true);
    assert.match(dialog.elements.tableBody.children[0].children[3].textContent, /Curator removed/);
});
