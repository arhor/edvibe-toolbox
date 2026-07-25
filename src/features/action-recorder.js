(function initializeActionRecorder(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.EdVibeActionRecorder = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : window, function createActionRecorderModule() {
    'use strict';

    const DEFAULT_LIMITS = Object.freeze({
        maxFrames: 1000,
        maxStoredBytes: 5 * 1024 * 1024,
        maxDurationMs: 10 * 60 * 1000
    });
    const REDACTED_VALUE = '[REDACTED_BY_TOOLBOX]';
    const SENSITIVE_KEYS = new Set([
        'authorization',
        'accesstoken',
        'refreshtoken',
        'token',
        'cookie',
        'password',
        'secret'
    ]);

    function parseJson(value) {
        if (typeof value !== 'string') {
            return { parsed: false, value };
        }
        try {
            return { parsed: true, value: JSON.parse(value) };
        } catch (_) {
            return { parsed: false, value };
        }
    }

    function redactValue(value, path = '', redactions = []) {
        if (Array.isArray(value)) {
            return value.map((item, index) =>
                redactValue(item, `${path}[${index}]`, redactions)
            );
        }
        if (!value || typeof value !== 'object') {
            return value;
        }

        const redacted = {};
        for (const [key, entry] of Object.entries(value)) {
            const entryPath = path ? `${path}.${key}` : key;
            if (SENSITIVE_KEYS.has(key.toLowerCase())) {
                redacted[key] = REDACTED_VALUE;
                redactions.push(entryPath);
            } else {
                redacted[key] = redactValue(entry, entryPath, redactions);
            }
        }
        return redacted;
    }

    function parseEnvelope(rawText, redactions) {
        const outer = parseJson(rawText);
        if (!outer.parsed || !outer.value || typeof outer.value !== 'object') {
            return { parsed: false, value: rawText };
        }

        const envelope = { ...outer.value };
        const nested = parseJson(envelope.Value);
        if (nested.parsed) {
            envelope.Value = nested.value;
        }
        return {
            parsed: true,
            value: redactValue(envelope, '', redactions)
        };
    }

    function pickExtra(envelope, knownKeys) {
        const extra = {};
        for (const [key, value] of Object.entries(envelope)) {
            if (!knownKeys.has(key)) {
                extra[key] = value;
            }
        }
        return Object.keys(extra).length > 0 ? extra : undefined;
    }

    function operationKey(socketId, requestId) {
        return `${socketId}:${String(requestId)}`;
    }

    function safePageContext(locationObject) {
        const pathname = String(locationObject?.pathname || '');
        const marathonMatch = pathname.match(/\/marathon\/(\d+)(?:\/|$)/);
        return {
            origin: String(locationObject?.origin || ''),
            pathname,
            marathonId: marathonMatch ? Number(marathonMatch[1]) : null
        };
    }

    function sanitizeIsoForFilename(isoDate) {
        return isoDate.replace(/[:.]/g, '-');
    }

    function makeRequestSnippet(operation) {
        const serializedValue = JSON.stringify(
            operation.requestValue === undefined ? null : operation.requestValue,
            null,
            4
        );
        return [
            'await sendRequest(',
            `    ${JSON.stringify(operation.controller || '')},`,
            `    ${JSON.stringify(operation.method || '')},`,
            `    ${JSON.stringify(operation.projectName || '')},`,
            serializedValue
                .split('\n')
                .map((line) => `    ${line}`)
                .join('\n'),
            ');'
        ].join('\n');
    }

    function makeRecipe(operations) {
        const pageOperations = operations.filter((operation) =>
            operation.origin === 'page'
        );
        const lines = [
            '// Recorded from Edvibe UI. Review IDs, ordering, and mutation effects before use.',
            '// This code is intentionally not executable by the recorder.',
            ''
        ];

        pageOperations.forEach((operation, index) => {
            if (index > 0) {
                const previous = pageOperations[index - 1];
                const gap = operation.startedAfterMs - previous.startedAfterMs;
                if (gap >= 250) {
                    lines.push(`await wait(${Math.round(gap)});`, '');
                }
            }
            lines.push(makeRequestSnippet(operation), '');
        });
        return lines.join('\n').trimEnd();
    }

    function createBrowserDownload(filename, text) {
        const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function createActionRecorderFeature({
        subscribeFrames,
        createPanel,
        getPageContext = () => safePageContext(window.location),
        downloadText = createBrowserDownload,
        copyText = (text) => navigator.clipboard.writeText(text),
        createId = () => crypto.randomUUID(),
        now = Date.now,
        setTimeoutFn = setTimeout,
        clearTimeoutFn = clearTimeout,
        limits = DEFAULT_LIMITS,
        log = () => {}
    }) {
        if (typeof subscribeFrames !== 'function') {
            throw new Error('Action recorder requires a frame subscription.');
        }
        if (typeof createPanel !== 'function') {
            throw new Error('Action recorder requires a panel factory.');
        }

        const configuredLimits = { ...DEFAULT_LIMITS, ...limits };
        let status = 'idle';
        let session = null;
        let pendingOperations = new Map();
        let durationTimer = null;
        let panel = null;
        let stylesheetUrl = '';
        let copyFallback = '';
        let notice = '';

        function getState() {
            return {
                status,
                session,
                copyFallback,
                notice,
                limits: configuredLimits
            };
        }

        function render() {
            panel?.setState?.(getState());
        }

        function finish(nextStatus, reason = '') {
            if (status !== 'recording') {
                return;
            }
            clearTimeoutFn(durationTimer);
            durationTimer = null;
            status = nextStatus;
            session.stoppedAt = new Date(now()).toISOString();
            if (reason) {
                session.limits.limitReached = true;
                session.limits.reason = reason;
                notice = `Recording stopped: ${reason}.`;
            }
            render();
        }

        function start() {
            if (status === 'recording') {
                return;
            }
            const startedAtMs = now();
            status = 'recording';
            copyFallback = '';
            notice = '';
            pendingOperations = new Map();
            session = {
                schemaVersion: 1,
                sessionId: createId(),
                startedAt: new Date(startedAtMs).toISOString(),
                stoppedAt: null,
                page: getPageContext(),
                limits: {
                    maxFrames: configuredLimits.maxFrames,
                    maxStoredBytes: configuredLimits.maxStoredBytes,
                    maxDurationMs: configuredLimits.maxDurationMs,
                    limitReached: false
                },
                frameCount: 0,
                storedBytes: 0,
                operations: [],
                otherFrames: [],
                anomalies: [],
                redactions: [],
                _startedAtMs: startedAtMs
            };
            durationTimer = setTimeoutFn(() => {
                finish('limit-reached', 'duration limit reached');
            }, configuredLimits.maxDurationMs);
            render();
        }

        function stop() {
            finish('stopped');
        }

        function clear() {
            if (status === 'recording') {
                clearTimeoutFn(durationTimer);
                durationTimer = null;
            }
            status = 'idle';
            session = null;
            pendingOperations = new Map();
            copyFallback = '';
            notice = '';
            render();
        }

        function limitReason(frame) {
            if (session.frameCount + 1 > configuredLimits.maxFrames) {
                return 'frame limit reached';
            }
            const nextBytes = session.storedBytes
                + (frame.dataType === 'text' ? Number(frame.byteLength || 0) : 0);
            if (nextBytes > configuredLimits.maxStoredBytes) {
                return 'size limit reached';
            }
            return '';
        }

        function storeOtherFrame(frame, envelope, rawText) {
            const otherFrame = {
                sequence: session.frameCount,
                direction: frame.direction,
                socketId: frame.socketId,
                origin: frame.origin,
                capturedAfterMs: frame.capturedAt - session._startedAtMs,
                dataType: frame.dataType,
                byteLength: frame.byteLength
            };
            if (envelope !== undefined) {
                otherFrame.envelope = envelope;
            }
            if (rawText !== undefined) {
                otherFrame.rawText = rawText;
            }
            session.otherFrames.push(otherFrame);
        }

        function storeOutbound(frame, envelope) {
            const requestId = envelope.RequestId;
            const isRequest = requestId !== undefined && (
                envelope.Controller !== undefined
                || envelope.Method !== undefined
                || envelope.ProjectName !== undefined
            );
            if (!isRequest) {
                storeOtherFrame(frame, envelope);
                return;
            }

            const key = operationKey(frame.socketId, requestId);
            if (pendingOperations.has(key)) {
                session.anomalies.push({
                    type: 'duplicate-outbound-request',
                    socketId: frame.socketId,
                    requestId
                });
                storeOtherFrame(frame, envelope);
                return;
            }

            const operation = {
                sequence: session.operations.length + 1,
                socketId: frame.socketId,
                origin: frame.origin,
                requestId,
                startedAfterMs: frame.capturedAt - session._startedAtMs,
                durationMs: null,
                controller: envelope.Controller || '',
                method: envelope.Method || '',
                projectName: envelope.ProjectName || '',
                requestValue: envelope.Value,
                response: null,
                extra: pickExtra(envelope, new Set([
                    'Controller', 'Method', 'ProjectName', 'RequestId', 'Value'
                ])),
                _capturedAt: frame.capturedAt
            };
            session.operations.push(operation);
            pendingOperations.set(key, operation);
        }

        function storeInbound(frame, envelope) {
            const requestId = envelope.RequestId;
            const key = requestId === undefined
                ? ''
                : operationKey(frame.socketId, requestId);
            const operation = pendingOperations.get(key);
            if (!operation) {
                storeOtherFrame(frame, envelope);
                return;
            }

            operation.durationMs = Math.max(0, frame.capturedAt - operation._capturedAt);
            operation.response = {
                isSuccess: typeof envelope.IsSuccess === 'boolean'
                    ? envelope.IsSuccess
                    : null,
                errorCode: envelope.ErrorCode ?? null,
                value: envelope.Value,
                extra: pickExtra(envelope, new Set([
                    'RequestId', 'IsSuccess', 'ErrorCode', 'Value'
                ]))
            };
            pendingOperations.delete(key);
        }

        function handleFrame(frame) {
            if (status !== 'recording' || !session) {
                return;
            }
            const reason = limitReason(frame);
            if (reason) {
                finish('limit-reached', reason);
                return;
            }

            session.frameCount += 1;
            if (frame.dataType === 'text') {
                session.storedBytes += Number(frame.byteLength || 0);
            }

            if (frame.dataType !== 'text') {
                storeOtherFrame(frame);
                render();
                return;
            }

            const frameRedactions = [];
            const parsed = parseEnvelope(frame.data, frameRedactions);
            session.redactions.push(...frameRedactions.map((path) => ({
                frame: session.frameCount,
                path
            })));

            if (!parsed.parsed) {
                storeOtherFrame(frame, undefined, parsed.value);
            } else if (frame.direction === 'outbound') {
                storeOutbound(frame, parsed.value);
            } else {
                storeInbound(frame, parsed.value);
            }
            render();
        }

        function buildExport() {
            if (!session) {
                return null;
            }
            return {
                schemaVersion: session.schemaVersion,
                sessionId: session.sessionId,
                startedAt: session.startedAt,
                stoppedAt: session.stoppedAt,
                page: session.page,
                limits: session.limits,
                frameCount: session.frameCount,
                storedBytes: session.storedBytes,
                operations: session.operations.map((operation) => {
                    const { _capturedAt, ...exported } = operation;
                    return exported;
                }),
                otherFrames: session.otherFrames,
                anomalies: session.anomalies,
                redactions: session.redactions
            };
        }

        function exportJson() {
            const exported = buildExport();
            if (!exported) {
                return;
            }
            const filename = `edvibe-ws-recording-${
                sanitizeIsoForFilename(exported.startedAt)
            }.json`;
            downloadText(filename, JSON.stringify(exported, null, 2));
            notice = `Saved ${filename}.`;
            render();
        }

        async function copy(content) {
            copyFallback = '';
            try {
                await copyText(content);
                notice = 'Copied to clipboard.';
            } catch (error) {
                log('Clipboard copy failed:', error);
                copyFallback = content;
                notice = 'Clipboard unavailable. Copy the text below.';
            }
            render();
        }

        function copyRequest(sequence) {
            const operation = session?.operations.find((entry) =>
                entry.sequence === sequence
            );
            if (operation) {
                return copy(makeRequestSnippet(operation));
            }
            return Promise.resolve();
        }

        function copyRecipe() {
            if (!session) {
                return Promise.resolve();
            }
            return copy(makeRecipe(session.operations));
        }

        function closePanel() {
            panel?.remove?.();
            panel = null;
        }

        function open(options = {}) {
            stylesheetUrl = options.stylesheetUrl || stylesheetUrl;
            if (!panel) {
                panel = createPanel();
                panel.configure?.({
                    stylesheetUrl,
                    onStart: start,
                    onStop: stop,
                    onClear: clear,
                    onExport: exportJson,
                    onCopyRequest: copyRequest,
                    onCopyRecipe: copyRecipe,
                    onClose: closePanel
                });
                panel.mount?.();
            } else {
                panel.configure?.({ stylesheetUrl });
                panel.restore?.();
            }
            render();
        }

        subscribeFrames(handleFrame);

        return {
            open,
            start,
            stop,
            clear,
            exportJson,
            copyRequest,
            copyRecipe,
            buildExport,
            getState
        };
    }

    return {
        DEFAULT_LIMITS,
        REDACTED_VALUE,
        createActionRecorderFeature,
        makeRecipe,
        makeRequestSnippet,
        parseEnvelope,
        redactValue,
        safePageContext
    };
});
