import { deepFreeze } from '#src/content/main/features/batch-user-onboarding/batch-user-onboarding-domain.js';

const OPERATION_TYPE = 'batch_user_onboarding';

function inferRowStatus(row) {
    const results = [row.addResult, row.assignResult].filter(Boolean);
    if (row.resolution === 'invalid' || row.resolution === 'ambiguous') return 'rejected';
    if (results.length === 0) return 'skipped';
    if (results.some((result) => result.status === 'failed')) return 'failed';
    if (results.some((result) => result.status === 'not_attempted')) return 'not_attempted';
    if (results.some((result) => result.status === 'rejected')) return 'rejected';
    if (results.some((result) => result.status === 'skipped')) return 'skipped';
    if (results.every((result) => result.status === 'noop')) return 'noop';
    return 'success';
}

function appendDiagnosticReport(lines, diagnostics, indent) {
    for (const attempt of diagnostics?.attempts || []) {
        const route = [attempt.controller, attempt.method].filter(Boolean).join('.');
        const details = [
            `attempt ${attempt.attempt}`,
            route,
            attempt.requestId ? `request ${attempt.requestId}` : null,
            attempt.serverErrorCode != null ? `server ${attempt.serverErrorCode}` : null,
            attempt.serverMessage,
            attempt.elapsedMs != null ? `${attempt.elapsedMs}ms` : null
        ].filter(Boolean);
        if (details.length > 1) lines.push(`${indent}diagnostic: ${details.join(' | ')}`);
    }
}

function formatReport(result) {
    const sharedDiagnostics = new Map((result.diagnostics || []).map((item) => [item.id, item]));
    const lines = [
        'Edvibe Toolbox: batch user onboarding',
        `Requested users: ${result.plan.counts.requested}`,
        `Selected additions: ${result.plan.counts.additions}`,
        `Selected assignments: ${result.plan.counts.assignments}`,
        result.plan.targetModerator
            ? `Target curator: ${result.plan.targetModerator.name || result.plan.targetModerator.email || result.plan.targetModerator.id}`
            : 'Target curator: not selected',
        ''
    ];
    for (const row of result.rows) {
        const label = row.user?.name ? `${row.user.name} <${row.email}>` : row.email;
        lines.push(`[${inferRowStatus(row)}] ${label}`);
        if (row.addResult) {
            lines.push(`  add_user: ${row.addResult.status} ${row.addResult.code} — ${row.addResult.message}`);
            if (!row.addResult.diagnostics?.reference) {
                appendDiagnosticReport(lines, row.addResult.diagnostics, '    ');
            }
        }
        if (row.assignResult) {
            lines.push(`  assign_curator: ${row.assignResult.status} ${row.assignResult.code} — ${row.assignResult.message}`);
            appendDiagnosticReport(lines, row.assignResult.diagnostics, '    ');
        }
        if (!row.addResult && !row.assignResult) {
            lines.push(`  discovery: ${row.resolution} — ${row.message || 'No operation selected.'}`);
        }
    }
    for (const [id, diagnostics] of sharedDiagnostics) {
        lines.push('', `Shared request diagnostic: ${id}`);
        appendDiagnosticReport(lines, diagnostics, '  ');
    }
    if (result.fatalError) {
        lines.push('', `Interrupted: ${result.fatalError.code} — ${result.fatalError.message}`);
        appendDiagnosticReport(lines, result.fatalError.diagnostics, '  ');
    }
    return lines.join('\n');
}

function buildCounts(rows) {
    const statuses = rows.map(inferRowStatus);
    return Object.freeze({
        requested: rows.length,
        eligible: rows.filter((row) =>
            !['invalid', 'ambiguous'].includes(row.resolution)
            && row.selectedOperations.length > 0
        ).length,
        attempted: rows.filter((row) =>
            [row.addResult, row.assignResult]
                .filter(Boolean)
                .some((result) => !['not_attempted', 'rejected'].includes(result.status))
        ).length,
        successful: statuses.filter((status) => status === 'success').length,
        noOp: statuses.filter((status) => status === 'noop').length,
        skipped: statuses.filter((status) => status === 'skipped' || status === 'rejected').length,
        failed: statuses.filter((status) => status === 'failed').length,
        notAttempted: statuses.filter((status) => status === 'not_attempted').length
    });
}

function serializeHistoryOperation(name, result) {
    return result ? Object.freeze({
        name,
        status: result.status,
        attemptCount: Number(result.attempts) || 0,
        code: result.code || null,
        message: result.message || null,
        dependency: result.dependency ? Object.freeze({ ...result.dependency }) : null,
        diagnostics: result.diagnostics ? deepFreeze(result.diagnostics) : null
    }) : null;
}

function buildExecutionHistoryInput({
    marathonId,
    marathonName = null,
    startedAt,
    completedAt,
    result
}) {
    const rows = result.rows || [];
    const counts = buildCounts(rows);
    const operationCounts = {
        selected: 0,
        attempted: 0,
        successful: 0,
        noOp: 0,
        skipped: 0,
        rejected: 0,
        failed: 0,
        notAttempted: 0
    };
    const historyRows = rows.map((row) => {
        const operations = [
            serializeHistoryOperation('add_user', row.addResult),
            serializeHistoryOperation('assign_curator', row.assignResult)
        ].filter(Boolean);
        for (const operation of operations) {
            operationCounts.selected += 1;
            if (!['not_attempted', 'rejected'].includes(operation.status)) operationCounts.attempted += 1;
            if (operation.status === 'success') operationCounts.successful += 1;
            if (operation.status === 'noop') operationCounts.noOp += 1;
            if (operation.status === 'skipped') operationCounts.skipped += 1;
            if (operation.status === 'rejected') operationCounts.rejected += 1;
            if (operation.status === 'failed') operationCounts.failed += 1;
            if (operation.status === 'not_attempted') operationCounts.notAttempted += 1;
        }
        const status = inferRowStatus(row);
        return Object.freeze({
            itemId: row.itemId,
            label: row.email,
            status,
            code: {
                success: 'USER_ONBOARDING_COMPLETED',
                noop: 'USER_ONBOARDING_NOOP',
                skipped: 'USER_ONBOARDING_SKIPPED',
                rejected: 'USER_ONBOARDING_REJECTED',
                failed: 'USER_ONBOARDING_FAILED',
                not_attempted: 'NOT_ATTEMPTED'
            }[status],
            message: operations.map((operation) => operation.message).filter(Boolean).join('; ')
                || row.message
                || 'No operation selected.',
            attempts: operations.reduce((sum, operation) => sum + operation.attemptCount, 0),
            data: Object.freeze({
                submittedInput: row.email,
                normalizedEmail: row.normalizedEmail,
                resolution: row.resolution,
                membershipPreflight: row.membership,
                user: row.user ? Object.freeze({ ...row.user }) : null,
                existingCurators: Object.freeze(
                    row.currentModerators.map((moderator) => Object.freeze({ ...moderator }))
                ),
                targetCurator: row.targetModerator ? Object.freeze({ ...row.targetModerator }) : null,
                selectedOperations: Object.freeze([...row.selectedOperations]),
                operations: Object.freeze(operations)
            })
        });
    });
    return deepFreeze({
        operationType: OPERATION_TYPE,
        startedAt,
        completedAt,
        status: result.fatalError
            ? 'interrupted'
            : counts.failed > 0 || counts.skipped > 0
                ? 'completed_with_failures'
                : 'completed',
        pageContext: { marathonId: String(marathonId), marathonName },
        counts,
        results: historyRows,
        diagnostics: Object.freeze((result.diagnostics || []).map((item) => deepFreeze(item))),
        fatalError: result.fatalError ? deepFreeze(result.fatalError) : null,
        message: JSON.stringify({ userCounts: counts, operationCounts })
    });
}

export {
    OPERATION_TYPE,
    buildCounts,
    buildExecutionHistoryInput,
    formatReport,
    inferRowStatus
};
