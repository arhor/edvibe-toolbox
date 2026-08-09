const test = require('node:test');
const assert = require('node:assert/strict');

const {
    appendPage,
    createFeatureError,
    parseEmailInput,
    parseMarathonId,
    runWithRetry
} = require('./batch-workflow-primitives.js');

test('parses marathon context with one shared numeric-path rule', () => {
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508'), 18508);
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508/lessons'), 18508);
    assert.equal(parseMarathonId('https://app.edvibe.com/marathon/18508x'), null);
    assert.equal(parseMarathonId('https://app.edvibe.com/dashboard'), null);
});

test('parses and deduplicates email input with optional row metadata', () => {
    assert.deepEqual(
        parseEmailInput(' First@Example.com;bad address\nfirst@example.com '),
        {
            entries: [{ input: 'First@Example.com', normalized: 'first@example.com' }],
            malformed: ['bad address']
        }
    );
    assert.deepEqual(
        parseEmailInput(' First@Example.com;bad address\nfirst@example.com ', { includeItems: true }),
        {
            entries: [{ input: 'First@Example.com', normalized: 'first@example.com' }],
            malformed: ['bad address'],
            items: [
                { input: 'First@Example.com', normalized: 'first@example.com', isValid: true },
                { input: 'bad address', normalized: 'bad address', isValid: false }
            ]
        }
    );
});

test('pagination validation rejects inconsistent or stalled responses', () => {
    assert.deepEqual(appendPage([1], 2, [2], 2, 'Example'), { items: [1, 2], total: 2 });
    assert.throws(() => appendPage([], null, [], 1, 'Example'), (error) => {
        assert.equal(error.code, 'INVALID_RESPONSE');
        assert.match(error.message, /Example returned invalid pagination data/);
        return true;
    });
});

test('shared feature errors retain stable codes and details', () => {
    const error = createFeatureError('INVALID_RESPONSE', 'Bad response', { itemId: 42 });
    assert.equal(error.code, 'INVALID_RESPONSE');
    assert.equal(error.itemId, 42);
});

test('retry policy retries transient failures and preserves attempt metadata', async () => {
    const waits = [];
    let calls = 0;
    const result = await runWithRetry(async () => {
        calls += 1;
        if (calls < 3) throw createFeatureError('REQUEST_TIMEOUT', 'retry');
        return 'done';
    }, {
        wait: async (delay) => waits.push(delay),
        getConnectionState: () => ({ isOpen: true }),
        retryDelays: [10, 20]
    });

    assert.deepEqual(result, { value: 'done', attempts: 3 });
    assert.deepEqual(waits, [10, 20]);
});