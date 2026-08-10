import {
    POPUP_COMMANDS,
    isPopupCommandMessage,
    isRuntimeExportStatusMessage
} from '../shared/message-protocol.js';

const TOOL_GROUPS = Object.freeze({ history: 'История', export: 'Экспорт', management: 'Управление', development: 'Разработка' });
const TOOL_DEFINITIONS = Object.freeze([
    { id: 'execution-history', group: 'history', title: 'История операций', description: 'Просмотреть, отфильтровать и скачать сохранённые отчёты.', command: POPUP_COMMANDS.OPEN_EXECUTION_HISTORY, requirement: 'edvibe', busyLabel: 'Открывается…', closeOnSuccess: true },
    { id: 'marathon-export', group: 'export', title: 'Экспорт марафона', description: 'Скачать уроки, материалы и резервный JSON.', command: POPUP_COMMANDS.START_EXPORT, requirement: 'marathon', busyLabel: 'Экспортируется…' },
    { id: 'lesson-reset', group: 'management', title: 'Сброс прогресса учеников', description: 'Очистить сохранённые ответы в выбранных уроках.', command: POPUP_COMMANDS.OPEN_LESSON_RESET, requirement: 'marathon', busyLabel: 'Открывается…', appearance: 'danger', closeOnSuccess: true },
    { id: 'batch-lesson-access', group: 'management', title: 'Открыть доступ к урокам', description: 'Открыть выбранные уроки для списка учеников.', command: POPUP_COMMANDS.OPEN_BATCH_LESSON_ACCESS, requirement: 'marathon', busyLabel: 'Открывается…', closeOnSuccess: true },
    { id: 'batch-user-onboarding', group: 'management', title: 'Добавить пользователей', description: 'Добавить пользователей и назначить выбранного куратора по списку email.', command: POPUP_COMMANDS.OPEN_BATCH_USER_ONBOARDING, requirement: 'marathon', busyLabel: 'Открывается…', closeOnSuccess: true },
    { id: 'batch-section-creation', group: 'management', title: 'Создать раздел в уроках', description: 'Добавить один раздел в несколько выбранных уроков.', command: POPUP_COMMANDS.OPEN_BATCH_SECTION_CREATION, requirement: 'marathon', busyLabel: 'Открывается…', closeOnSuccess: true },
    { id: 'batch-section-deletion', group: 'management', title: 'Удалить раздел из уроков', description: 'Безопасно удалить раздел с точным именем из выбранных уроков.', command: POPUP_COMMANDS.OPEN_BATCH_SECTION_DELETION, requirement: 'marathon', busyLabel: 'Открывается…', appearance: 'danger', closeOnSuccess: true },
    { id: 'batch-user-management', group: 'management', title: 'Управление пользователями', description: 'Снять кураторов и удалить пользователей по списку email.', command: POPUP_COMMANDS.OPEN_BATCH_USER_MANAGEMENT, requirement: 'marathon', busyLabel: 'Открывается…', appearance: 'danger', closeOnSuccess: true },
    { id: 'action-recorder', group: 'development', title: 'Запись действий WebSocket', description: 'Записать запросы и ответы выполненного действия.', command: POPUP_COMMANDS.OPEN_ACTION_RECORDER, requirement: 'edvibe', busyLabel: 'Открывается…', closeOnSuccess: true }
].map(Object.freeze));

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
    if (!isRuntimeExportStatusMessage(message)) {
        return;
    }
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
    const [contextResult, storageResult] = await Promise.allSettled([
        getPageContext(),
        chrome.storage.local.get('exportInProgress')
    ]);

    if (contextResult.status === 'fulfilled') {
        pageContext = contextResult.value;
        activeTab = pageContext.tab || null;
    } else {
        pageContext = { type: 'unavailable' };
    }
    if (storageResult.status === 'fulfilled') {
        exportInProgress = Boolean(storageResult.value.exportInProgress);
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
        return {
            type: 'unsupported',
            tab
        };
    }

    const isEdvibe = url.hostname === 'edvibe.com' || url.hostname.endsWith('.edvibe.com');
    if (!isEdvibe) {
        return {
            type: 'unsupported',
            tab
        };
    }
    const marathonMatch = url.pathname.match(/\/marathon\/(\d+)(?:\/|$)/);
    return marathonMatch
        ? { type: 'marathon', marathonId: marathonMatch[1], tab }
        : { type: 'edvibe', tab };
}

function renderPageContext() {
    const content = ({
        marathon: { title: `Марафон #${pageContext.marathonId}`, description: 'Инструменты марафона доступны' },
        edvibe: { title: 'Страница Edvibe', description: 'Откройте страницу марафона для работы с инструментами' },
        unsupported: { title: 'Не страница Edvibe', description: 'Toolbox работает на страницах edvibe.com' },
        unavailable: { title: 'Страница недоступна', description: 'Не удалось определить активную вкладку' }
    })[pageContext.type] || { title: 'Страница недоступна', description: 'Не удалось определить активную вкладку' };
    pageContextElement.className = `page-context is-${pageContext.type}`;
    pageContextTitle.textContent = content.title;
    pageContextDescription.textContent = content.description;
}

function renderTools() {
    toolGroupsElement.replaceChildren();

    for (const [groupId, groupTitle] of Object.entries(TOOL_GROUPS)) {
        const tools = TOOL_DEFINITIONS.filter((tool) => tool.group === groupId);
        if (!tools.length) {
            continue;
        }
        const group = document.createElement('popup-tool-group');
        group.configure({ title: groupTitle, tools, getState: getToolRenderState, onExecute: executeTool });
        toolGroupsElement.append(group);
    }
}

function getToolRenderState(tool) {
    const unavailableReason = getUnavailableReason(tool);
    const isBusy = tool.id === 'marathon-export' && exportInProgress;
    const isPending = pendingToolId === tool.id;
    const isBlocked = (exportInProgress || pendingToolId !== null) && !isBusy && !isPending;

    return {
        disabled: Boolean(unavailableReason || isBusy || isPending || isBlocked),
        reason: unavailableReason || (isBlocked ? 'Дождитесь завершения другого инструмента.' : ''),
        busy: isBusy || isPending
    };
}

function getUnavailableReason(tool) {
    if (tool.requirement === 'edvibe') {
        return (pageContext.type === 'edvibe' || pageContext.type === 'marathon')
            ? ''
            : 'Откройте страницу Edvibe.';
    } else {
        return (tool.requirement !== 'marathon' || pageContext.type === 'marathon')
            ? ''
            : 'Откройте страницу марафона.';
    }
}

async function executeTool(toolId) {
    const tool = TOOL_DEFINITIONS.find((item) => item.id === toolId);

    if (!tool || getUnavailableReason(tool) || !activeTab?.id || exportInProgress || pendingToolId !== null) {
        return;
    }

    clearStatus(); pendingToolId = tool.id;

    if (tool.id === 'marathon-export') {
        exportInProgress = true;
    }
    renderTools();
    try {
        await sendTabCommand(activeTab.id, tool.command);
        pendingToolId = null; renderTools();
        if (tool.closeOnSuccess) {
            window.close();
        }
    } catch (error) {
        if (tool.id === 'marathon-export') {
            exportInProgress = false;
        }
        pendingToolId = null;
        renderTools();
        showStatus(error.message || 'Не удалось запустить инструмент.', true);
    }
}

function sendTabCommand(tabId, action) {
    const message = { action };

    if (isPopupCommandMessage(message)) {
        new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tabId, message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });

    } else {
        return Promise.reject(new Error('Unsupported Toolbox command.'));
    }
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