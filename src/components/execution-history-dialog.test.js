import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(import.meta.dirname, 'execution-history-dialog.js');
const source = fs.readFileSync(componentPath, 'utf8');

test('execution history dialog is implemented with Lit and declarative views', () => {
    assert.match(source, /import \{ LitElement, html \} from 'lit';/);
    assert.match(source, /class ExecutionHistoryDialog extends LitElement/);
    assert.match(source, /renderRecord\(record\)/);
    assert.match(source, /renderDetail\(\)/);
    assert.match(source, /renderOutcome\(result\)/);
    assert.doesNotMatch(source, /shadowRoot\.innerHTML/);
    assert.doesNotMatch(source, /replaceChildren\(/);
    assert.doesNotMatch(source, /module\.exports/);
});

test('execution history dialog preserves filtering, retention, and mutation workflows', () => {
    assert.match(source, /get filters\(\)/);
    assert.match(source, /loadRecords\(\)/);
    assert.match(source, /openRecord\(executionId\)/);
    assert.match(source, /loadPreferences\(\)/);
    assert.match(source, /savePreferences\(\)/);
    assert.match(source, /exportFiltered\(this\.filters\)/);
    assert.match(source, /service\.delete\(this\.selectedRecord\.id\)/);
    assert.match(source, /service\.clear\(\)/);
    assert.match(source, /globalThis\.EdVibeExecutionHistoryDialog = executionHistoryDialogApi;/);
});
