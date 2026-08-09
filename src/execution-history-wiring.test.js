const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('MAIN composition preserves execution-history infrastructure through direct ESM imports', () => {
    const manifest = JSON.parse(read('manifest.json'));
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const entrypoint = read('src/entrypoints/main.js');
    const main = read('src/runtime/main.js');

    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.equal(mainWorld.run_at, 'document_start');
    assert.match(entrypoint, /import ['"]\.\.\/runtime\/main\.js['"];?/);
    for (const modulePath of [
        '../shared/indexeddb.js',
        '../shared/execution-history-repository.js',
        '../shared/execution-history-retention.js',
        '../shared/execution-history-export.js',
        '../shared/chrome-storage-bridge.js',
        '../shared/execution-history-service.js',
        '../components/execution-history-dialog.js',
        '../features/execution-history.js'
    ]) {
        assert.ok(main.includes(`from '${modulePath}'`) || main.includes(`from "${modulePath}"`), `${modulePath} should be imported by the coordinator`);
    }
    assert.match(main, /createExecutionHistoryService\(/);
    assert.match(main, /createExecutionHistoryFeature\(/);
    assert.doesNotMatch(main, /requireToolboxModule|window\.EdVibe|globalThis\.EdVibe/);
});

test('popup, isolated bridge, main coordinator, and representative batch results are connected', () => {
    const popup = read('src/runtime/popup.js');
    const isolated = read('src/runtime/isolated.js');
    const main = read('src/runtime/main.js');
    const protocol = read('src/shared/message-protocol.js');
    const onboardingFeature = read('src/features/batch-user-onboarding.js');
    const onboardingDialog = read('src/components/batch-user-onboarding-dialog.js');
    const batchDeletionFeature = read('src/features/batch-section-deletion.js');
    const batchDeletionHistory = read('src/features/batch-section-deletion-history.js');
    const batchDeletionDialog = read('src/components/batch-section-deletion-dialog.js');
    const batchAccessHistory = read('src/features/batch-lesson-access-history.js');
    const batchAccessHistoryRecord = read('src/features/batch-lesson-access-history-record.js');
    const batchSectionCreationHistory = read('src/features/batch-section-creation-history.js');

    assert.match(popup, /id: 'execution-history'.*command: POPUP_COMMANDS\.OPEN_EXECUTION_HISTORY.*requirement: 'edvibe'/s);
    assert.match(popup, /id: 'batch-user-onboarding'.*command: POPUP_COMMANDS\.OPEN_BATCH_USER_ONBOARDING.*requirement: 'marathon'/s);
    assert.match(isolated, /createMainCommandMessage\(message\.action\)/);
    assert.match(isolated, /isStorageRequestMessage\(event\.data\)/);
    assert.match(protocol, /OPEN_EXECUTION_HISTORY: 'OPEN_EXECUTION_HISTORY'/);
    assert.match(protocol, /OPEN_BATCH_USER_ONBOARDING: 'OPEN_BATCH_USER_ONBOARDING'/);
    assert.match(protocol, /EXECUTION_HISTORY_PREFERENCES: 'executionHistoryPreferences'/);
    assert.match(main, /batchAccessHistoryApi\.createHistoryAwareFeature/);
    assert.match(main, /batchUserOnboardingApi\.createBatchUserOnboardingFeature/);
    assert.match(main, /batchSectionCreationHistoryApi\.createHistoryAwareDialog/);
    assert.match(main, /batchSectionDeletionApi\.createBatchSectionDeletionFeature/);
    assert.match(main, /persistExecution: historyService\.persistTerminal/);
    assert.match(main, /openHistory: \(executionId\) => executionHistoryFeature\.open\(\{ executionId \}\)/);
    assert.doesNotMatch(main, /sourceStylesheetUrl|stylesheetUrl/);
    assert.match(onboardingFeature, /operationType: OPERATION_TYPE/);
    assert.match(onboardingFeature, /buildExecutionHistoryInput/);
    assert.match(onboardingFeature, /history = await persistExecution/);
    assert.match(onboardingDialog, /Результат сохранён в истории/);
    assert.match(onboardingDialog, /Видимый отчёт сохранён, но историю записать не удалось/);
    assert.match(batchAccessHistoryRecord, /buildExecutionHistoryInput/);
    assert.match(batchAccessHistory, /Результат сохранён в истории/);
    assert.match(batchAccessHistory, /Экранный результат сохранён, но записать историю не удалось/);
    assert.match(batchSectionCreationHistory, /buildExecutionHistoryInput/);
    assert.match(batchSectionCreationHistory, /Результат сохранён в истории/);
    assert.match(batchSectionCreationHistory, /Экранный результат сохранён, но записать историю не удалось/);
    assert.match(batchDeletionHistory, /buildExecutionHistoryInput/);
    assert.match(batchDeletionHistory, /installHistoryAwareFeature/);
    assert.match(batchDeletionHistory, /createBatchSectionDeletionFeature\(options = \{\}\)/);
    assert.doesNotMatch(batchDeletionHistory, /root\.EdVibeBatchSectionDeletion|globalThis\.EdVibeBatchSectionDeletion/);
    assert.match(batchDeletionHistory, /visible preflight is intact, but history could not be saved/i);
    assert.match(batchDeletionDialog, /Open in history/);
    assert.match(batchDeletionDialog, /visible report is intact, but history could not be saved/);
    assert.match(batchDeletionFeature, /persistExecution/);
});