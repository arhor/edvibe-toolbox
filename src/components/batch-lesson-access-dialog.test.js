const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const componentPath = path.resolve(
    __dirname,
    '../src/components/batch-lesson-access-dialog.js'
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
            this.tagName = tagName.toUpperCase();
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
            this.listeners.set(type, listener);
        }

        removeEventListener(type) {
            this.listeners.delete(type);
        }

        dispatchEvent(event) {
            event.target ||= this;
            this.listeners.get(event.type)?.(event);
            return true;
        }

        focus() {}

        querySelectorAll(selector) {
            const matches = [];
            const visit = (element) => {
                for (const child of element.children) {
                    if (selector === 'input' && child.tagName === 'INPUT') {
                        matches.push(child);
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
                const element = new FakeElement(
                    selector.includes('textarea') ? 'textarea' : selector.includes('progress')
                        ? 'progress' : 'div'
                );
                if (selector.includes('emails')) {
                    element.tagName = 'TEXTAREA';
                }
                if (selector.includes('select-all')) {
                    element.tagName = 'INPUT';
                }
                this.elements.set(selector, element);
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
        api: harness.context.EdVibeBatchAccessDialogComponent
    };
}

function createDialog() {
    const { api, ...harness } = loadBrowserComponent();
    const dialog = new api.BatchLessonAccessDialog();
    dialog.connectedCallback();
    return { dialog, api, ...harness };
}

function emitted(dialog, type) {
    return dialog.emitted.find((event) => event.type === type);
}

test('registers the batch access custom element and builds the full control template', () => {
    const { api, constructors, templates } = loadBrowserComponent();

    assert.equal(api.BATCH_ACCESS_DIALOG_TAG, 'edvibe-toolbox-batch-access-dialog');
    assert.equal(api.BATCH_ACCESS_OVERLAY_ID, 'edvibe-toolbox-batch-access-overlay');
    assert.equal(
        constructors.get(api.BATCH_ACCESS_DIALOG_TAG),
        api.BatchLessonAccessDialog
    );
    const markup = templates[0].markup;
    for (const control of [
        'edvibe-batch-access-stylesheet', 'edvibe-batch-access-emails',
        'edvibe-batch-access-lessons', 'edvibe-batch-access-select-all',
        'edvibe-batch-access-clear-all', 'edvibe-batch-access-submit',
        'edvibe-batch-access-status', 'edvibe-batch-access-progress',
        'edvibe-batch-access-summary', 'edvibe-batch-access-copy',
        'edvibe-batch-access-restart', 'edvibe-batch-access-confirm',
        'edvibe-batch-access-close'
    ]) {
        assert.match(markup, new RegExp(control));
    }
});

test('starts with no selected lessons and blocks submission without supplied valid emails', () => {
    const { dialog } = createDialog();
    dialog.showConfigure({
        lessons: [{ MarathonLessonId: 10, Number: 0, Name: 'Welcome' }],
        emailState: { validCount: 0, malformedCount: 0 }
    });

    assert.equal(dialog.selectedLessonIds.size, 0);
    assert.equal(dialog.elements.submit.disabled, true);
    assert.equal(dialog.elements.lessonsList.querySelectorAll('input')[0].checked, false);
});

test('shows an explicit loading state while keeping email input available', () => {
    const { dialog } = createDialog();

    dialog.showLoading();

    assert.equal(dialog.mode, 'loading');
    assert.match(dialog.elements.status.textContent, /Загружаем уроки/);
    assert.equal(dialog.elements.progress.hidden, false);
    assert.equal(dialog.elements.progress.getAttribute('aria-label'), 'Загрузка уроков');
    assert.equal(dialog.elements.emails.disabled, false);
    assert.equal(dialog.elements.selectAll.disabled, true);
});

test('retains pasted email state when the lesson catalogue finishes loading', () => {
    const { dialog } = createDialog();
    dialog.showLoading();
    dialog.elements.emails.value = 'first@example.com';
    dialog.setEmailState({ validCount: 1, malformedCount: 0 });

    dialog.showConfigure({
        lessons: [{ MarathonLessonId: 10, Number: 0, Name: 'Welcome' }]
    });
    dialog.selectLesson(10, true);

    assert.equal(dialog.elements.emails.value, 'first@example.com');
    assert.equal(dialog.emailState.validCount, 1);
    assert.equal(dialog.elements.submit.disabled, false);
});

test('renders numbered lessons and uses supplied email state without parsing input', () => {
    const { dialog } = createDialog();
    dialog.showConfigure({
        lessons: [{ MarathonLessonId: 10, Number: 4, Name: 'Practice' }],
        emailState: { validCount: 2, malformedCount: 1 }
    });

    assert.equal(dialog.elements.lessonsList.children[0].textContent, '5. Practice');
    assert.equal(dialog.elements.emailCount.textContent, 'Уникальных email: 2');
    assert.equal(dialog.elements.malformedCount.textContent, 'Некорректных: 1');

    dialog.elements.emails.value = 'first@example.com; invalid';
    dialog.elements.emails.dispatchEvent({ type: 'input' });
    assert.equal(
        JSON.stringify(emitted(dialog, 'edvibe-batch-access-input-change').detail),
        JSON.stringify({ emailInput: 'first@example.com; invalid' })
    );

    dialog.setEmailState({ validCount: 1, malformedCount: 1 });
    assert.equal(dialog.elements.emailCount.textContent, 'Уникальных email: 1');
    assert.equal(dialog.elements.malformedCount.textContent, 'Некорректных: 1');
});

test('select-all and clear-all control the supplied lesson catalogue', () => {
    const { dialog } = createDialog();
    dialog.showConfigure({
        lessons: [
            { MarathonLessonId: 10, Number: 0, Name: 'Welcome' },
            { MarathonLessonId: 11, Number: 1, Name: 'Practice' }
        ],
        emailState: { validCount: 1, malformedCount: 0 }
    });

    dialog.elements.selectAll.checked = true;
    dialog.elements.selectAll.dispatchEvent({ type: 'change' });
    assert.deepEqual([...dialog.selectedLessonIds], [10, 11]);
    assert.equal(dialog.elements.submit.disabled, false);

    dialog.elements.clearAll.dispatchEvent({ type: 'click' });
    assert.deepEqual([...dialog.selectedLessonIds], []);
    assert.equal(dialog.elements.submit.disabled, true);
});

test('submits raw input with selected lesson identifiers', () => {
    const { dialog } = createDialog();
    dialog.showConfigure({
        lessons: [{ MarathonLessonId: 10, Number: 0, Name: 'Welcome' }],
        emailState: { validCount: 1, malformedCount: 0 }
    });
    dialog.elements.emails.value = 'First@Example.com';
    dialog.selectLesson(10, true);
    dialog.elements.submit.dispatchEvent({ type: 'click' });

    assert.equal(
        JSON.stringify(emitted(dialog, 'edvibe-batch-access-submit').detail),
        JSON.stringify({ emailInput: 'First@Example.com', selectedLessonIds: [10] })
    );
});

test('locks editing during validation and execution, then unlocks on validation errors', () => {
    const { dialog } = createDialog();
    dialog.showConfigure({
        lessons: [{ MarathonLessonId: 10, Number: 0, Name: 'Welcome' }],
        emailState: { validCount: 1, malformedCount: 0 }
    });
    dialog.showValidation('Проверяем данные…');
    assert.equal(dialog.elements.emails.disabled, true);
    assert.equal(dialog.elements.lessonsList.querySelectorAll('input')[0].disabled, true);
    assert.equal(dialog.elements.close.disabled, true);

    dialog.showExecution({ completed: 2, total: 4, opened: 1, failures: 1, alreadyOpen: 3 });
    assert.equal(dialog.elements.progress.value, 2);
    assert.equal(dialog.elements.progress.max, 4);
    assert.match(dialog.elements.status.textContent, /Выполнено: 2 из 4/);

    dialog.showValidationErrors(['Некорректный email', 'Урок недоступен']);
    assert.equal(dialog.elements.emails.disabled, false);
    assert.equal(dialog.elements.close.disabled, false);
    assert.deepEqual(
        dialog.elements.errors.children.map((entry) => entry.textContent),
        ['Некорректный email', 'Урок недоступен']
    );
});

test('renders confirmation counts and completion actions, then restarts cleanly', () => {
    const { dialog } = createDialog();
    const lessons = [{ MarathonLessonId: 10, Number: 0, Name: 'Welcome' }];
    dialog.showConfigure({ lessons, emailState: { validCount: 1, malformedCount: 0 } });
    dialog.showConfirmation({ matchedUsers: 12, selectedLessons: [10, 11], needsOpening: [{}, {}, {}], alreadyOpen: [{}] });
    assert.match(dialog.elements.summary.textContent, /12 пользователей сопоставлено/);
    assert.match(dialog.elements.summary.textContent, /3 доступов нужно открыть/);
    assert.match(dialog.elements.summary.textContent, /1 уже открыт/);
    assert.equal(dialog.elements.confirm.hidden, false);

    dialog.showComplete({ requestedEmails: 2, matchedUsers: 2, selectedLessons: [10], opened: [{}], alreadyOpen: [{}], failures: [], attempts: 1 });
    assert.equal(dialog.elements.copy.disabled, false);
    assert.equal(dialog.elements.restart.disabled, false);
    assert.equal(dialog.elements.close.disabled, false);
    dialog.elements.restart.dispatchEvent({ type: 'click' });
    assert.equal(emitted(dialog, 'edvibe-batch-access-restart').detail, undefined);
    assert.equal(dialog.elements.emails.value, '');
    assert.deepEqual([...dialog.selectedLessonIds], []);
    assert.equal(dialog.lessons, lessons);
});

test('locks controls after entering execution even without a prior validation render', () => {
    const { dialog } = createDialog();
    dialog.showConfigure({
        lessons: [{ MarathonLessonId: 10, Number: 0, Name: 'Welcome' }],
        emailState: { validCount: 1, malformedCount: 0 }
    });

    dialog.showExecution({ completed: 0, total: 2, opened: 0, failures: 0, alreadyOpen: 0 });

    assert.equal(dialog.elements.emails.disabled, true);
    assert.equal(dialog.elements.lessonsList.querySelectorAll('input')[0].disabled, true);
    assert.equal(dialog.elements.selectAll.disabled, true);
    assert.equal(dialog.elements.clearAll.disabled, true);
    assert.equal(dialog.elements.close.disabled, true);
});

test('emits confirm and copy events without workflow data', () => {
    const { dialog } = createDialog();
    dialog.showConfirmation({ matchedUsers: 1, selectedLessons: [10], needsOpening: [{}] });
    dialog.elements.confirm.dispatchEvent({ type: 'click' });
    assert.equal(emitted(dialog, 'edvibe-batch-access-confirm').detail, undefined);

    dialog.showComplete({
        requestedEmails: 1,
        matchedUsers: 1,
        selectedLessons: [10],
        opened: [],
        alreadyOpen: [],
        failures: [{
            email: 'first@example.com',
            lessonNumber: 5,
            lessonName: 'Practice',
            attempts: 3,
            code: 'REQUEST_TIMEOUT',
            message: 'Timed out'
        }],
        attempts: 3
    });
    dialog.elements.copy.dispatchEvent({ type: 'click' });
    assert.equal(emitted(dialog, 'edvibe-batch-access-copy-report').detail, undefined);
});

test('allows backdrop and Escape close only from editable or completed states', () => {
    const { dialog } = createDialog();
    dialog.showConfigure({
        lessons: [{ MarathonLessonId: 10, Number: 0, Name: 'Welcome' }],
        emailState: { validCount: 1, malformedCount: 0 }
    });
    dialog.showValidation();
    dialog.elements.backdrop.dispatchEvent({
        type: 'click',
        target: dialog.elements.backdrop
    });
    dialog.handleKeydown({ key: 'Escape' });
    assert.equal(dialog.emitted.filter((event) => event.type === 'edvibe-dialog-close').length, 0);

    dialog.showValidationErrors(['Try again']);
    dialog.elements.backdrop.dispatchEvent({
        type: 'click',
        target: dialog.elements.backdrop
    });
    assert.equal(dialog.emitted.filter((event) => event.type === 'edvibe-dialog-close').length, 1);
    assert.equal(emitted(dialog, 'edvibe-dialog-close').detail, undefined);

    const { dialog: completedDialog } = createDialog();
    completedDialog.showComplete({ failures: [], attempts: 0 });
    completedDialog.handleKeydown({ key: 'Escape' });
    assert.equal(emitted(completedDialog, 'edvibe-dialog-close').detail, undefined);
});

test('renders supplied partial-completion failure details as text nodes', () => {
    const { dialog } = createDialog();
    dialog.showComplete({
        requestedEmails: 1,
        matchedUsers: 1,
        selectedLessons: [10],
        opened: [],
        alreadyOpen: [],
        failures: [{
            email: 'first@example.com',
            lessonNumber: 5,
            lessonName: 'Practice <unsafe>',
            attempts: 3,
            code: 'REQUEST_TIMEOUT',
            message: 'Timed out <unsafe>'
        }],
        attempts: 3
    });

    assert.equal(dialog.mode, 'partial-complete');
    assert.equal(dialog.elements.failures.hidden, false);
    assert.equal(
        dialog.elements.failures.children[0].textContent,
        'first@example.com — 5. Practice <unsafe> — 3 попытки — REQUEST_TIMEOUT: Timed out <unsafe>'
    );
});
