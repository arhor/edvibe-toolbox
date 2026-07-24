const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const componentPath = path.resolve(
    __dirname,
    '../src/components/reset-lessons-dialog.js'
);
const source = fs.readFileSync(componentPath, 'utf8');
const {
    RESET_DIALOG_TAG,
    RESET_OVERLAY_ID,
    ResetLessonsDialog
} = require(componentPath);

test('exports a named custom element class without requiring browser globals', () => {
    assert.equal(RESET_DIALOG_TAG, 'edvibe-toolbox-reset-dialog');
    assert.equal(RESET_OVERLAY_ID, 'edvibe-toolbox-reset-overlay');
    assert.equal(ResetLessonsDialog.name, 'ResetLessonsDialog');
    assert.equal(typeof ResetLessonsDialog.prototype.render, 'function');
    assert.equal(typeof ResetLessonsDialog.prototype.configure, 'function');
    assert.equal(typeof ResetLessonsDialog.prototype.showPupils, 'function');
    assert.equal(typeof ResetLessonsDialog.prototype.showLessons, 'function');
});

test('registers the named class automatically in a browser context', () => {
    const constructors = new Map();

    class FakeHTMLElement {
        attachShadow({ mode }) {
            this.shadowRoot = { mode };
            return this.shadowRoot;
        }
    }

    const context = {
        HTMLElement: FakeHTMLElement,
        customElements: {
            get: (tagName) => constructors.get(tagName),
            define: (tagName, constructor) => constructors.set(tagName, constructor)
        },
        CustomEvent: class {},
        setTimeout,
        clearTimeout
    };
    context.globalThis = context;
    vm.runInNewContext(source, context);

    const api = context.EdVibeResetDialogComponent;
    assert.equal(constructors.get(RESET_DIALOG_TAG), api.ResetLessonsDialog);
    const element = new api.ResetLessonsDialog();
    assert.equal(element.id, undefined);
    assert.equal(element.shadowRoot.mode, 'open');
});

test('keeps markup, rendering, and dialog state inside the component class', () => {
    assert.match(source, /class ResetLessonsDialog extends HTMLElementBase/);
    assert.match(source, /render\(\)\s*\{/);
    assert.match(source, /renderPupils\(\)\s*\{/);
    assert.match(source, /renderLessons\(\)\s*\{/);
    assert.match(source, /renderState\(\)\s*\{/);
    assert.match(source, /role="dialog"/);
    assert.match(source, /aria-modal="true"/);
    assert.match(source, /class="edvibe-reset-live-region"/);
    assert.match(source, /class="edvibe-reset-lesson-step"[\s\S]*hidden/);
});

test('owns case-insensitive pupil filtering and wizard state calculation', () => {
    const dialog = new ResetLessonsDialog();
    const pupils = [
        { PupilId: 1, Email: 'first@example.com' },
        { PupilId: 2, Email: 'OTHER@EXAMPLE.COM' },
        { PupilId: 3, Email: null }
    ];
    dialog.allPupils = pupils;

    assert.deepEqual(dialog.filterPupils('other@'), [pupils[1]]);
    assert.equal(dialog.filterPupils(''), pupils);

    dialog.selectedPupil = pupils[0];
    dialog.selectedLessonIds = new Set([10]);
    dialog.currentStep = 'lessons';
    assert.deepEqual(dialog.getViewState(), {
        showingUsers: false,
        nextDisabled: false,
        backDisabled: false,
        submitDisabled: false,
        closeDisabled: false
    });
});

test('does not expose test-platform or markup factory abstractions', () => {
    assert.doesNotMatch(source, /function resolvePlatform/);
    assert.doesNotMatch(source, /function createConstructor/);
    assert.doesNotMatch(source, /function getResetModalMarkup/);
    assert.doesNotMatch(source, /function getResetDialogMarkup/);
    assert.doesNotMatch(source, /createResetDialogElement/);
});

test('owns lifecycle cleanup and emits host-level workflow events', () => {
    assert.match(source, /connectedCallback\(\)/);
    assert.match(source, /this\.id = RESET_OVERLAY_ID/);
    assert.match(source, /disconnectedCallback\(\)/);
    assert.match(source, /disconnectListeners\(\)/);
    assert.match(source, /new root\.CustomEvent\('edvibe-dialog-close'/);
    assert.match(source, /new root\.CustomEvent\('edvibe-reset-request'/);
});
