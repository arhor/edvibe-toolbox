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

function parseEnvelope(rawText) {
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
        value: envelope
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
    log = () => {}
}) {
    if (typeof subscribeFrames !== 'function') {
        throw new Error('Action recorder requires a frame subscription.');
    }
    if (typeof createPanel !== 'function') {
        throw new Error('Action recorder requires a panel factory.');
    }

    let status = 'idle';
    let session = null;
    let pendingOperations = new Map();
    let panel = null;
    let copyFallback = '';
    let notice = '';

    function getState() {
        return {
            status,
            session,
            copyFallback,
            notice
        };
    }

    function render() {
        panel?.setState?.(getState());
    }

    function finish(nextStatus) {
        if (status !== 'recording') {
            return;
        }
        status = nextStatus;
        session.stoppedAt = new Date(now()).toISOString();
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
            schemaVersion: 2,
            sessionId: createId(),
            startedAt: new Date(startedAtMs).toISOString(),
            stoppedAt: null,
            page: getPageContext(),
            frameCount: 0,
            storedBytes: 0,
            operations: [],
            otherFrames: [],
            anomalies: [],
            _startedAtMs: startedAtMs
        };
        render();
    }

    function stop() {
        finish('stopped');
    }

    function clear() {
        status = 'idle';
        session = null;
        pendingOperations = new Map();
        copyFallback = '';
        notice = '';
        render();
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
        session.frameCount += 1;
        if (frame.dataType === 'text') {
            session.storedBytes += Number(frame.byteLength || 0);
        }

        if (frame.dataType !== 'text') {
            storeOtherFrame(frame);
            render();
            return;
        }

        const parsed = parseEnvelope(frame.data);

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
            frameCount: session.frameCount,
            storedBytes: session.storedBytes,
            operations: session.operations.map((operation) => {
                const { _capturedAt, ...exported } = operation;
                return exported;
            }),
            otherFrames: session.otherFrames,
            anomalies: session.anomalies
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

    function open() {
        if (!panel) {
            panel = createPanel();
            panel.configure?.({
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
            panel.configure?.();
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

export {
    createActionRecorderFeature,
    makeRecipe,
    makeRequestSnippet,
    parseEnvelope,
    safePageContext
};
