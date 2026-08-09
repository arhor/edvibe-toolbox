const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const componentPath = path.resolve(__dirname, 'action-recorder-dialog.js');
const source = fs.readFileSync(componentPath, 'utf8');

test('action recorder dialog uses Lit for recorder state and operation rendering', () => {
    assert.match(source, /import \{ LitElement, html \} from 'lit';/);
    assert.match(source, /class ActionRecorderDialog extends LitElement/);
    assert.match(source, /renderOperation\(operation\)/);
    assert.match(source, /visibleOperations\(\)/);
    assert.match(source, /render\(\) \{/);
    assert.doesNotMatch(source, /createElement\?\.\('template'\)/);
    assert.doesNotMatch(source, /replaceChildren\(/);
    assert.doesNotMatch(source, /module\.exports/);
});

test('action recorder preserves safe recorder controls and minimize behavior', () => {
    assert.match(source, /Запись может содержать данные учеников/);
    assert.match(source, /Копировать рецепт/);
    assert.match(source, /Экспорт JSON/);
    assert.match(source, /if \(this\.state\.status === 'recording'\) \{\s*this\.minimized = true;/);
    assert.match(source, /this\.callbacks\.onClose\?\.\(\)/);
    assert.match(source, /syncElapsedTimer\(\)/);
    assert.match(source, /globalThis\.EdVibeActionRecorderDialog = actionRecorderDialogApi;/);
    assert.doesNotMatch(source, />Replay</);
    assert.doesNotMatch(source, />Run</);
});