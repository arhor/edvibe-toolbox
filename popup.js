const createPopupLog = EdVibeLogger.createLoggerFactory('POPUP');
const log = createPopupLog();

const TOOL_GROUPS = Object.freeze({
    export: 'Экспорт',
    management: 'Управление'
});

const TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: 'marathon-export',
        group: 'export',
        title: 'Экспорт марафона',
        description: 'Скачать уроки, материалы и резервный JSON.',
        command: 'START_FULL_AUTOMATION',
        requirement: 'marathon',
        actionLabel: 'Экспортировать',
        busyLabel: 'Экспортируется…'
    }),
    Object.freeze({
        id: 'lesson-reset',
        group: 'management',
        title: 'Сброс прогресса учеников',
        description: 'Очистить сохранённые ответы в выбранных уроках.',
        command: 'OPEN_LESSON_RESET',
        requirement: 'marathon',
        actionLabel: 'Открыть мастер',
        busyLabel: 'Открывается…',
        appearance: 'danger',
        closeOnSuccess: true
    })
]);

const pageContextElement = document.getElementById('pageContext');
const pageContextTitle = document.getElementById('pageContextTitle');
const pageContextDescription = document.getElementById('pageContextDescription');
const toolGroupsElement = document.getElementById('toolGroups');
const popupStatusElement = document.getElementById('popupStatus');

let activeTab = null;
let pageContext = { type: 'loading' };
let exportInProgress = false;
let pendingToolId = null;

chrome.runtime.onMessage.addListener((message) => {
    if (message?.action !== 'EXPORT_STATUS') {
        return;
    }

    log(`Received export status: ${message.state}.`);
    exportInProgress = message.state === 'started';
    renderTools();

    if (message.state === 'complete') {
        showStatus('Экспорт завершён.');
    } else if (message.state === 'error') {
        showStatus(message.message || 'Не удалось экспортировать марафон.', true);
    }
});

initializePopup();

async function initializePopup() {
    log('Popup initialized.');

    const [contextResult, storageResult] = await Promise.allSettled([
        getPageContext(),
        chrome.storage.local.get('exportInProgress')
    ]);

    if (contextResult.status === 'fulfilled') {
        pageContext = contextResult.value;
        activeTab = pageContext.tab || null;
    } else {
        log('Failed to determine page context:', contextResult.reason);
        pageContext = { type: 'unavailable' };
    }

    if (storageResult.status === 'fulfilled') {
        exportInProgress = Boolean(storageResult.value.exportInProgress);
        log(`Restored export state: ${exportInProgress}.`);
    } else {
        log('Failed to restore export state:', storageResult.reason);
    }

    renderPageContext();
    renderTools();
}

async function getPageContext() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id || !tab.url) {
        return { type: 'unavailable' };
    }

    let url;
    try {
        url = new URL(tab.url);
    } catch (_) {
        return { type: 'unsupported', tab };
    }

    const isEdvibe = url.hostname === 'edvibe.com'
        || url.hostname.endsWith('.edvibe.com');

    if (!isEdvibe) {
        return { type: 'unsupported', tab };
    }

    const marathonMatch = url.pathname.match(/\/marathon\/(\d+)(?:\/|$)/);
    if (!marathonMatch) {
        return { type: 'edvibe', tab };
    }

    return {
        type: 'marathon',
        marathonId: marathonMatch[1],
        tab
    };
}

function renderPageContext() {
    const contextContent = {
        marathon: {
            title: `Марафон #${pageContext.marathonId}`,
            description: 'Инструменты марафона доступны'
        },
        edvibe: {
            title: 'Страница Edvibe',
            description: 'Откройте страницу марафона для работы с инструментами'
        },
        unsupported: {
            title: 'Не страница Edvibe',
            description: 'Toolbox работает на страницах edvibe.com'
        },
        unavailable: {
            title: 'Страница недоступна',
            description: 'Не удалось определить активную вкладку'
        }
    };
    const content = contextContent[pageContext.type] || contextContent.unavailable;

    pageContextElement.className = `page-context is-${pageContext.type}`;
    pageContextTitle.textContent = content.title;
    pageContextDescription.textContent = content.description;
}

function renderTools() {
    toolGroupsElement.replaceChildren();

    for (const [groupId, groupTitle] of Object.entries(TOOL_GROUPS)) {
        const tools = TOOL_DEFINITIONS.filter((tool) => tool.group === groupId);
        if (tools.length === 0) continue;

        const section = document.createElement('section');
        const title = document.createElement('h2');
        const list = document.createElement('div');

        title.className = 'tool-group-title';
        title.textContent = groupTitle;
        list.className = 'tool-list';

        for (const tool of tools) {
            list.append(createToolCard(tool));
        }

        section.append(title, list);
        toolGroupsElement.append(section);
    }
}

function createToolCard(tool) {
    const card = document.createElement('article');
    const header = document.createElement('div');
    const copy = document.createElement('div');
    const title = document.createElement('h3');
    const description = document.createElement('p');
    const button = document.createElement('button');
    const unavailableReason = getUnavailableReason(tool);
    const isExportTool = tool.id === 'marathon-export';
    const isBusy = isExportTool && exportInProgress;
    const isPending = pendingToolId === tool.id;
    const isBlocked = (exportInProgress || pendingToolId !== null)
        && !isBusy
        && !isPending;

    card.className = 'tool-card';
    card.dataset.toolId = tool.id;
    card.dataset.disabled = String(Boolean(
        unavailableReason || isBusy || isPending || isBlocked
    ));
    header.className = 'tool-card-header';
    copy.className = 'tool-copy';
    title.className = 'tool-title';
    title.textContent = tool.title;
    description.className = 'tool-description';
    description.textContent = tool.description;
    button.className = 'tool-action';
    button.type = 'button';
    button.textContent = isBusy || isPending ? tool.busyLabel : tool.actionLabel;
    button.disabled = Boolean(unavailableReason || isBusy || isPending || isBlocked);

    if (tool.appearance === 'danger') {
        button.classList.add('is-danger');
    }

    button.addEventListener('click', () => executeTool(tool.id));
    copy.append(title, description);

    const reason = unavailableReason || (isBlocked
        ? 'Дождитесь завершения другого инструмента.'
        : '');
    if (reason) {
        const requirement = document.createElement('p');
        requirement.className = 'tool-requirement';
        requirement.textContent = reason;
        copy.append(requirement);
    }

    header.append(copy, button);
    card.append(header);
    return card;
}

function getUnavailableReason(tool) {
    if (tool.requirement !== 'marathon' || pageContext.type === 'marathon') {
        return '';
    }
    return 'Откройте страницу марафона.';
}

async function executeTool(toolId) {
    const tool = TOOL_DEFINITIONS.find((definition) => definition.id === toolId);
    if (
        !tool
        || getUnavailableReason(tool)
        || !activeTab?.id
        || exportInProgress
        || pendingToolId !== null
    ) {
        return;
    }

    clearStatus();
    pendingToolId = tool.id;
    if (tool.id === 'marathon-export') {
        exportInProgress = true;
    }
    renderTools();

    try {
        log(`Sending ${tool.command} to tab ${activeTab.id}.`);
        const response = await sendTabCommand(activeTab.id, tool.command);
        log(`${tool.command} acknowledged: ${response?.status || 'unknown'}.`);
        pendingToolId = null;
        renderTools();

        if (tool.closeOnSuccess) {
            window.close();
        }
    } catch (error) {
        log(`Failed to execute ${tool.id}:`, error);
        if (tool.id === 'marathon-export') {
            exportInProgress = false;
        }
        pendingToolId = null;
        renderTools();
        showStatus(error.message || 'Не удалось запустить инструмент.', true);
    }
}

function sendTabCommand(tabId, action) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, { action }, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            resolve(response);
        });
    });
}

function showStatus(message, isError = false) {
    popupStatusElement.textContent = message;
    popupStatusElement.classList.toggle('is-error', isError);
    popupStatusElement.hidden = false;
}

function clearStatus() {
    popupStatusElement.textContent = '';
    popupStatusElement.classList.remove('is-error');
    popupStatusElement.hidden = true;
}
