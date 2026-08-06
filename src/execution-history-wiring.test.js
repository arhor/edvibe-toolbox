const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('manifest loads execution-history infrastructure before UI and features', () => {
    const manifest = JSON.parse(read('manifest.json'));
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const scripts = mainWorld.js;
    const expected = [
        'src/shared/indexeddb.js',
        'src/shared/execution-history-record.js',
        'src/shared/execution-history-repository.js',
        'src/shared/execution-history-retention.js',
        'src/shared/execution-history-export.js',
        'src/shared/chrome-storage-bridge.js',
        'src/shared/execution-history-service.js',
        'src/components/execution-history-dialog.js',
        'src/features/batch-lesson-access.js',
        'src/features/batch-lesson-access-history-model.js',
        'src/features/batch-lesson-access-history-record.js',
        'src/features/batch-lesson-access-history.js',
        'src/features/batch-section-creation.js',
        'src/features/batch-section-creation-history-model.js',
        'src/features/batch-section-creation-history-record.js',
        'src/features/batch-section-creation-history.js',
        'src/features/execution-history.js',
        'src/main.js'
    ];
    for (const script of expected) assert.ok(scripts.includes(script), `${script} should be loaded`);
    assert.deepEqual(expected.map((script) => scripts.indexOf(script)), [...expected.map((script) => scripts.indexOf(script))].sort((a, b) => a - b));
    assert.ok(manifest.web_accessible_resources[0].resources.includes('src/components/execution-history-dialog.css'));
});

test('popup, isolated bridge, main coordinator, and representative batch results are connected', () => {
    const popup = read('popup.js');
    const isolated = read('src/isolated.js');
    const main = read('src/main.js');
    const batchDeletionFeature = read('src/features/batch-section-deletion.js');
    const batchDeletionDialog = read('src/components/batch-section-deletion-dialog.js');
    const batchAccessHistory = read('src/features/batch-lesson-access-history.js');
    const batchAccessHistoryRecord = read('src/features/batch-lesson-access-history-record.js');
    const batchSectionCreationHistory = read('src/features/batch-section-creation-history.js');

    assert.match(popup, /id: 'execution-history'.*command: 'OPEN_EXECUTION_HISTORY'.*requirement: 'edvibe'/s);
    assert.match(isolated, /OPEN_EXECUTION_HISTORY: \['EDVIBE_TOOLBOX_OPEN_EXECUTION_HISTORY'/);
    assert.match(isolated, /ALLOWED_STORAGE_KEYS = new Set\(\['executionHistoryPreferences'\]\)/);
    assert.match(main, /batchAccessHistoryApi\.createHistoryAwareFeature/);
    assert.match(main, /batchSectionCreationHistoryApi\.createHistoryAwareDialog/);
    assert.match(main, /createDialog: createBatchSectionCreationDialog/);
    assert.match(main, /persistExecution: historyService\.persistTerminal/);
    assert.match(main, /openHistory: \(executionId, sourceStylesheetUrl\)/);
    assert.match(batchAccessHistoryRecord, /buildExecutionHistoryInput/);
    assert.match(batchAccessHistory, /Результат сохранён в истории/);
    assert.match(batchAccessHistory, /Экранный результат сохранён, но записать историю не удалось/);
    assert.match(batchSectionCreationHistory, /buildExecutionHistoryInput/);
    assert.match(batchSectionCreationHistory, /Результат сохранён в истории/);
    assert.match(batchSectionCreationHistory, /Экранный результат сохранён, но записать историю не удалось/);
    assert.match(batchDeletionFeature, /buildExecutionHistoryInput/);
    assert.match(batchDeletionDialog, /Open in history/);
    assert.match(batchDeletionDialog, /visible report is intact, but history could not be saved/);
});
