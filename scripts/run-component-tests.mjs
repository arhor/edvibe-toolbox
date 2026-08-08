import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const testPage = '/src/component-tests/index.html';
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

function createStaticServer() {
    return createServer(async (request, response) => {
        try {
            const requestUrl = new URL(request.url || '/', 'http://localhost');
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
            response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
            response.end(String(error?.message || error));
        }
    });
}

function runBrowser(browser, url) {
    return new Promise((resolveRun, rejectRun) => {
        const child = spawn(browser, [
            '--headless=new',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--dump-dom',
            '--virtual-time-budget=5000',
            url
        ], {stdio: ['ignore', 'pipe', 'pipe']});

        let stdout = '';
        let stderr = '';
        child.stdout.setEncoding('utf-8');
        child.stderr.setEncoding('utf-8');
        child.stdout.on('data', (chunk) => { stdout += chunk; });
        child.stderr.on('data', (chunk) => { stderr += chunk; });

        const timeout = setTimeout(() => {
            child.kill('SIGKILL');
            rejectRun(new Error('Component tests timed out after 15 seconds.'));
        }, 15_000);

        child.on('error', (error) => {
            clearTimeout(timeout);
            rejectRun(error);
        });
        child.on('close', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
                rejectRun(new Error(`Browser exited with code ${code}.\n${stderr}`));
                return;
            }
            resolveRun({stdout, stderr});
        });
    });
}

const server = createStaticServer();
try {
    const browser = findBrowser();
    await new Promise((resolveListen, rejectListen) => {
        server.once('error', rejectListen);
        server.listen(0, '127.0.0.1', resolveListen);
    });

    const address = server.address();
    const url = `http://127.0.0.1:${address.port}${testPage}`;
    const {stdout, stderr} = await runBrowser(browser, url);
    if (!stdout.includes('data-test-status="passed"')) {
        const failure = stdout.match(/<pre id="test-result">([\s\S]*?)<\/pre>/)?.[1];
        throw new Error(
            `Component tests failed${failure ? `: ${failure}` : '.'}\n${stderr}`
        );
    }
    console.log(`Component tests passed in ${browser}.`);
} finally {
    await new Promise((resolveClose) => server.close(resolveClose));
}
