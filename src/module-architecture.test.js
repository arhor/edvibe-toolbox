const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const protocol = require('./shared/message-protocol.js');

const manifestPromise = import(pathToFileURL(
    path.resolve(__dirname, '..', 'manifest.config.mjs')
).href).then(({ default: manifest }) => manifest);

test('manifest preserves separate document-start MAIN and ISOLATED runtime worlds', async () => {
    const manifest = await manifestPromise;
    const mainWorld = manifest.content_scripts.find((entry) => entry.world === 'MAIN');
    const isolatedWorld = manifest.content_scripts.find((entry) => entry.world === 'ISOLATED');

    assert.ok(mainWorld, 'MAIN content-script entry must exist');
    assert.ok(isolatedWorld, 'ISOLATED content-script entry must exist');
    assert.equal(mainWorld.run_at, 'document_start');
    assert.equal(isolatedWorld.run_at, 'document_start');
    assert.deepEqual(mainWorld.matches, isolatedWorld.matches);
    assert.deepEqual(mainWorld.js, ['src/entrypoints/main.js']);
    assert.deepEqual(isolatedWorld.js, ['src/entrypoints/isolated.js']);
});

test('every supported popup command produces a validated minimal MAIN message', () => {
    for (const action of Object.values(protocol.POPUP_COMMANDS)) {
        const popupMessage = { action };
        const route = protocol.getCommandRoute(action);
        const mainMessage = protocol.createMainCommandMessage(action);

        assert.equal(protocol.isPopupCommandMessage(popupMessage), true, `${action} must be a supported popup command`);
        assert.ok(route, `${action} must have a MAIN route`);
        assert.equal(mainMessage.type, route.type);
        assert.equal(protocol.isMainCommandMessage(mainMessage), true);
        assert.deepEqual(Object.keys(mainMessage), ['type']);
    }
});

test('cross-world protocol rejects unknown commands and over-shared metadata', () => {
    assert.equal(protocol.isPopupCommandMessage({ action: 'UNKNOWN_COMMAND' }), false);
    assert.equal(protocol.isPopupCommandMessage({
        action: protocol.POPUP_COMMANDS.OPEN_LESSON_RESET,
        internalState: { pupils: ['private@example.com'] }
    }), false);
    assert.equal(protocol.isMainCommandMessage({
        type: protocol.WINDOW_MESSAGE_TYPES.OPEN_LESSON_RESET,
        stylesheetUrl: 'legacy.css'
    }), false);
    assert.equal(protocol.isMainCommandMessage({
        type: protocol.WINDOW_MESSAGE_TYPES.OPEN_BATCH_USER_MANAGEMENT,
        operations: [{ userId: 42 }]
    }), false);
});

test('execution-history command allows only its intentional optional identifier', () => {
    const message = protocol.createMainCommandMessage(
        protocol.POPUP_COMMANDS.OPEN_EXECUTION_HISTORY,
        { executionId: 'execution-42' }
    );

    assert.deepEqual(message, {
        type: protocol.WINDOW_MESSAGE_TYPES.OPEN_EXECUTION_HISTORY,
        executionId: 'execution-42'
    });
    assert.equal(protocol.isMainCommandMessage(message), true);
    assert.equal(protocol.isMainCommandMessage({ ...message, sourceStylesheetUrl: 'legacy.css' }), false);
});
