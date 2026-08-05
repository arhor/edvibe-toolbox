const test = require('node:test');
const assert = require('node:assert/strict');

const { createLoggerFactory } = require('../src/shared/logger.js');

function captureConsole(t) {
    const calls = [];
    const originalLog = console.log;
    console.log = (...args) => calls.push(args);
    t.after(() => {
        console.log = originalLog;
    });
    return calls;
}

test('creates a world-only logger and forwards every argument', (t) => {
    const calls = captureConsole(t);
    const error = new Error('failure');
    const log = createLoggerFactory('POPUP')();

    log('message', { count: 2 }, error);

    assert.deepEqual(calls, [[
        '[Edvibe Toolbox][POPUP]',
        'message',
        { count: 2 },
        error
    ]]);
});

test('creates independent component loggers for one world', (t) => {
    const calls = captureConsole(t);
    const createMainLog = createLoggerFactory('MAIN');

    createMainLog('Export')('started');
    createMainLog('Transport')('connected');

    assert.deepEqual(calls, [
        ['[Edvibe Toolbox][MAIN][Export]', 'started'],
        ['[Edvibe Toolbox][MAIN][Transport]', 'connected']
    ]);
});

test('keeps factories for different worlds independent', (t) => {
    const calls = captureConsole(t);

    createLoggerFactory('MAIN')()('main');
    createLoggerFactory('ISOLATED')()('isolated');

    assert.deepEqual(calls, [
        ['[Edvibe Toolbox][MAIN]', 'main'],
        ['[Edvibe Toolbox][ISOLATED]', 'isolated']
    ]);
});

test('rejects unsupported worlds and empty component labels', () => {
    assert.throws(() => createLoggerFactory(), /Unsupported logging world/);
    assert.throws(() => createLoggerFactory('PAGE'), /Unsupported logging world/);

    const createMainLog = createLoggerFactory('MAIN');
    assert.throws(() => createMainLog(''), /Component must be a non-empty string/);
    assert.throws(() => createMainLog('   '), /Component must be a non-empty string/);
});

test('trims padded component labels in the log prefix', (t) => {
    const calls = captureConsole(t);
    const log = createLoggerFactory('MAIN')(' Export ');

    log('started');

    assert.deepEqual(calls, [['[Edvibe Toolbox][MAIN][Export]', 'started']]);
});

test('rejects non-string component labels', () => {
    const createMainLog = createLoggerFactory('MAIN');

    assert.throws(() => createMainLog(42), /Component must be a non-empty string/);
    assert.throws(() => createMainLog(null), /Component must be a non-empty string/);
});
