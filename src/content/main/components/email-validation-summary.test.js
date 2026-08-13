import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { buildEmailValidationSummary } from '#src/content/main/components/email-validation-summary.js';
import { parseEmailInput } from '#src/content/main/features/batch-workflow-primitives.js';

describe('buildEmailValidationSummary', () => {
    test('preserves mixed validation failures in input order', () => {
        // Given
        const parsed = parseEmailInput('broken-email; test@gmail.cоm; also-broken');

        // When
        const summary = buildEmailValidationSummary(parsed.invalidEntries);

        // Then
        assert.deepEqual(summary.entries.map(({input, code}) => ({input, code})), [
            {input: 'broken-email', code: 'INVALID_EMAIL_FORMAT'},
            {input: 'test@gmail.cоm', code: 'EMAIL_NON_ASCII'},
            {input: 'also-broken', code: 'INVALID_EMAIL_FORMAT'}
        ]);
        assert.equal(summary.hasNonAscii, true);
    });

    test('preserves repeated and multi-code-unit offending character occurrences', () => {
        // Given
        const parsed = parseEmailInput('😀é😀@example.com');

        // When
        const [entry] = buildEmailValidationSummary(parsed.invalidEntries).entries;

        // Then
        assert.deepEqual(entry.segments, [
            {text: '😀', offending: true},
            {text: 'é', offending: true},
            {text: '😀', offending: true},
            {text: '@example.com', offending: false}
        ]);
        assert.deepEqual(entry.descriptions, [
            '«😀» (не-ASCII символ)',
            '«é» (не-ASCII символ)',
            '«😀» (не-ASCII символ)'
        ]);
    });

    test('requests guidance only when a non-ASCII failure exists', () => {
        // Given
        const formatOnly = parseEmailInput('broken-email').invalidEntries;
        const nonAscii = parseEmailInput('té@example.com').invalidEntries;

        // When
        const formatSummary = buildEmailValidationSummary(formatOnly);
        const nonAsciiSummary = buildEmailValidationSummary(nonAscii);

        // Then
        assert.equal(formatSummary.hasNonAscii, false);
        assert.equal(nonAsciiSummary.hasNonAscii, true);
        assert.doesNotMatch(nonAsciiSummary.entries[0].descriptions.join(' '), /U\+/);
    });
});
