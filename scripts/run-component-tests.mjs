import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const testPage = '/src/component-tests/index.html';
const resultPath = '/__component-test-result';
const mimeTypes = new Map([
    ['.html', 'text/html; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.mjs', 'text/javascript; charset=utf-8'],
    ['.css', 'text/css; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8']
]);

function browserCandidates() {
    return [
        process.env.CHROME_BIN,
        process.env.CHROME_PATH,
        'google-chrome-stable',
        'google-chrome',
        'chromium',
        'chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        process.env.PROGRAMFILES
            ? `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`
            : null,
        process.env['PROGRAMFILES(X86)']
            ? `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`
            : null
    ].filter(Boolean);
}

function findBrowser() {
    for (const candidate of browserCandidates()) {
        const result = spawnSync(candidate, ['--version'], {
            encoding: 'utf-8',
            stdio: 'ignore'
        });
        if (!result.error && result.status === 0) {
            return candidate;
        }
    }
    throw new Error(
        'Chrome or Chromium is required for component tests. Set CHROME_BIN to the browser executable.'
    );
}

function createStaticServer(onTestResult) {
    return createServer(async (request, response) => {
        try {
            const requestUrl = new URL(request.url || '/', 'http://localhost');
            if (request.method === 'POST' && requestUrl.pathname === resultPath) {
                let body = '';
                request.setEncoding('utf-8');
                for await (const chunk of request) {
                    body += chunk;
                    if (body.length > 1_000_000) {
                        throw new Error('Component test result payload is too large.');
                    }
                }
                const result = JSON.parse(body);
                response.writeHead(204);
                response.end(() => onTestResult(result));
                return;
            }

            const pathname = requestUrl.pathname === '/' ? testPage : requestUrl.pathname;
            const relativePath = decodeURIComponent(pathname).replace(/^\/+/, '');
            const filePath = resolve(repositoryRoot, relativePath);
            if (!filePath.startsWith(repositoryRoot)) {
                response.writeHead(403).end('Forbidden');
                return;
            }

            const body = await readFile(filePath);
            response.writeHead(200, {
                'Content-Type': mimeTypes.get(extname(filePath)) || 'application/octet-stream',
                'Cache-Control': 'no-store'
            });
            response.end(body);
        } catch (error) {
            response.writeHead(400, {'Content-Type': 'text/plain; charset=utf-8'});
            response.end(String(error?.message || error));
        }
    });
}

function launchBrowser(browser, url) {
    const child = spawn(browser, [
        '--headless=new',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        url
    ], {stdio: ['ignore', 'ignore', 'pipe']});

    let stderr = '';
    child.stderr.setEncoding('utf-8');
    child.stderr.on('data', (chunk) => { stderr += chunk; });

    return {child, getStderr: () => stderr};
}

let resolveTestResult;
const testResultPromise = new Promise((resolveResult) => {
    resolveTestResult = resolveResult;
});
const server = createStaticServer(resolveTestResult);
let browserProcess = null;

try {
    const browser = findBrowser();
    await new Promise((resolveListen, rejectListen) => {
        server.once('error', rejectListen);
        server.listen(0, '127.0.0.1', resolveListen);
    });

    const address = server.address();
    if (!address || typeof address === 'string') {
        throw new Error('Unable to determine the component-test server port.');
    }

    const url = `http://127.0.0.1:${address.port}${testPage}`;
    browserProcess = launchBrowser(browser, url);

    const browserExitPromise = new Promise((_, rejectExit) => {
        browserProcess.child.once('error', rejectExit);
        browserProcess.child.once('close', (code, signal) => {
            rejectExit(new Error(
                `Browser exited before reporting component test results `
                + `(code ${String(code)}, signal ${String(signal)}).\n`
                + browserProcess.getStderr()
            ));
        });
    });
    const timeoutPromise = new Promise((_, rejectTimeout) => {
        setTimeout(
            () => rejectTimeout(new Error(
                `Component tests timed out after 60 seconds.\n${browserProcess.getStderr()}`
            )),
            60_000
        );
    });

    const result = await Promise.race([
        testResultPromise,
        browserExitPromise,
        timeoutPromise
    ]);
    if (result?.status !== 'passed') {
        throw new Error(`Component tests failed: ${result?.message || 'Unknown failure.'}`);
    }

    console.log(`Component tests passed in ${browser}.`);
} finally {
    if (browserProcess?.child && browserProcess.child.exitCode === null) {
        browserProcess.child.kill('SIGKILL');
    }
    await new Promise((resolveClose) => server.close(resolveClose));
}
