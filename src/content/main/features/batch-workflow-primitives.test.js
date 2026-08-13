import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
    parseEmailInput,
    validateEmail
} from '#src/content/main/features/batch-workflow-primitives.js';

describe('validateEmail', () => {
    test('accepts an ASCII email address', () => {
        // Given
        const email = 'First.Last+tag@example.com';

        // When
        const result = validateEmail(email);

        // Then
        assert.equal(result.isValid, true);
        assert.equal(result.code, null);
        assert.deepEqual(result.offendingCharacters, []);
    });

    test('identifies a Cyrillic homoglyph in the domain', () => {
        // Given
        const email = 'test@gmail.cоm';

        // When
        const result = validateEmail(email);

        // Then
        assert.equal(result.isValid, false);
        assert.equal(result.code, 'EMAIL_NON_ASCII');
        assert.equal(result.message, 'Недопустимые символы: «о» (кириллица).');
        assert.deepEqual(result.offendingCharacters, [{
            character: 'о',
            index: 12,
            codePoint: 'U+043E',
            script: 'кириллица'
        }]);
    });

    test('reports every non-ASCII character and its source position', () => {
        // Given
        const email = 'té😀st@example.com';

        // When
        const result = validateEmail(email);

        // Then
        assert.equal(result.code, 'EMAIL_NON_ASCII');
        assert.deepEqual(result.offendingCharacters.map((item) => ({
            character: item.character,
            index: item.index,
            codePoint: item.codePoint
        })), [
            { character: 'é', index: 1, codePoint: 'U+00E9' },
            { character: '😀', index: 2, codePoint: 'U+1F600' }
        ]);
    });

    test('distinguishes malformed ASCII syntax', () => {
        // Given
        const email = 'not-an-email';

        // When
        const result = validateEmail(email);

        // Then
        assert.equal(result.isValid, false);
        assert.equal(result.code, 'INVALID_EMAIL_FORMAT');
        assert.equal(result.message, 'Некорректный формат email.');
    });
});

describe('parseEmailInput', () => {
    test('deduplicates inputs and exposes structured invalid entries', () => {
        // Given
        const input = 'USER@example.com; user@example.com; test@gmail.cоm; broken';

        // When
        const result = parseEmailInput(input, { includeItems: true });

        // Then
        assert.deepEqual(result.entries, [{
            input: 'USER@example.com',
            normalized: 'user@example.com'
        }]);
        assert.deepEqual(result.malformed, ['test@gmail.cоm', 'broken']);
        assert.deepEqual(result.invalidEntries.map(({ input: value, code }) => ({ input: value, code })), [
            { input: 'test@gmail.cоm', code: 'EMAIL_NON_ASCII' },
            { input: 'broken', code: 'INVALID_EMAIL_FORMAT' }
        ]);
        assert.equal(result.items[1].validation.code, 'EMAIL_NON_ASCII');
    });
});
