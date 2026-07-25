const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const componentPath = path.resolve(
    __dirname,
    '../src/components/action-recorder-dialog.js'
);
const source = fs.readFileSync(componentPath, 'utf8');
const {
    RECORDER_DIALOG_TAG,
    RECORDER_DIALOG_ID,
    ActionRecorderDialog
} = require(componentPath);

test('exports a browser-safe recorder custom element', () => {
    assert.equal(RECORDER_DIALOG_TAG, 'edvibe-toolbox-action-recorder');
    assert.equal(RECORDER_DIALOG_ID, 'edvibe-toolbox-action-recorder');
    assert.equal(ActionRecorderDialog.name, 'ActionRecorderDialog');
    assert.equal(typeof ActionRecorderDialog.prototype.configure, 'function');
    assert.equal(typeof ActionRecorderDialog.prototype.setState, 'function');
    assert.equal(typeof ActionRecorderDialog.prototype.restore, 'function');
});

test('registers the recorder element in a browser context', () => {
    const constructors = new Map();
    class FakeHTMLElement {
        attachShadow({ mode }) {
            this.shadowRoot = { mode };
        }
    }
    const context = {
        HTMLElement: FakeHTMLElement,
        customElements: {
            get: (name) => constructors.get(name),
            define: (name, constructor) => constructors.set(name, constructor)
        },
        setInterval,
        clearInterval
    };
    context.globalThis = context;
    vm.runInNewContext(source, context);

    const api = context.EdVibeActionRecorderDialog;
    assert.equal(constructors.get(RECORDER_DIALOG_TAG), api.ActionRecorderDialog);
    const element = new api.ActionRecorderDialog();
    assert.equal(element.shadowRoot, undefined);
    assert.doesNotThrow(() => element.connectedCallback());
});

test('keeps rendering, sensitivity warning, and safe controls in the component', () => {
    assert.match(source, /class ActionRecorderDialog extends HTMLElementBase/);
    assert.match(source, /attachShadow\(\{ mode: 'open' \}\)/);
    assert.match(source, /createElement\?\.\('template'\)/);
    assert.match(source, /content\.cloneNode\(true\)/);
    assert.doesNotMatch(source, /shadowRoot\.innerHTML/);
    assert.match(source, /Запись может содержать данные учеников/);
    assert.match(source, /Копировать рецепт/);
    assert.match(source, /Экспорт JSON/);
    assert.doesNotMatch(source, />Replay</);
    assert.doesNotMatch(source, />Run</);
});

test('minimizes rather than closes an active recording', () => {
    assert.match(
        source,
        /if \(this\.state\.status === 'recording'\) \{\s*this\.minimized = true/
    );
    assert.match(source, /this\.callbacks\.onClose\?\.\(\)/);
});

test('fails silently for unavailable DOM and unexpected options', () => {
    const dialog = new ActionRecorderDialog();
    assert.doesNotThrow(() => dialog.connectedCallback());
    assert.doesNotThrow(() => dialog.configure(null));
    assert.doesNotThrow(() => dialog.setState(null));
});
