import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { diagnosticEnvelope } from './batch-user-onboarding-diagnostics.js';

describe('diagnosticEnvelope', () => {
    test('retains every retry and complete request and response summaries', () => {
        // Given
        const long = 'x'.repeat(1000);
        const attempts = Array.from({ length: 25 }, (_, index) => ({
            attempt: index + 1,
            requestSummary: { authorization: `Bearer ${index}`, body: long },
            responseSummary: { token: `token-${index}`, values: Array.from({ length: 50 }, (_, value) => value) }
        }));

        // When
        const diagnostics = diagnosticEnvelope('add_users', attempts);

        // Then
        assert.deepEqual(diagnostics.attempts, attempts);
        assert.equal(diagnostics.attempts[24].requestSummary.body, long);
        assert.equal(diagnostics.attempts[24].responseSummary.values.length, 50);
    });
});
