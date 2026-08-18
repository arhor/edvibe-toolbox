import { POPUP_COMMANDS } from '#src/shared/message-protocol.js';

function freezeToolGroup(group) {
    return Object.freeze({
        ...group,
        tools: Object.freeze(group.tools.map(Object.freeze))
    });
}

const TOOL_GROUPS = Object.freeze([
    {
        id: 'history',
        title: 'История',
        tools: [
            {
                id: 'execution-history',
                title: 'История операций',
                description: 'Просмотреть, отфильтровать и скачать сохранённые отчёты.',
                command: POPUP_COMMANDS.OPEN_EXECUTION_HISTORY,
                requirement: 'edvibe',
                busyLabel: 'Открывается…',
                closeOnSuccess: true
            }
        ]
    },
    {
        id: 'export',
        title: 'Экспорт',
        tools: [
            {
                id: 'marathon-export',
                title: 'Экспорт марафона',
                description: 'Скачать уроки, материалы и резервный JSON.',
                command: POPUP_COMMANDS.START_EXPORT,
                requirement: 'marathon',
                busyLabel: 'Экспортируется…'
            }
        ]
    },
    {
        id: 'management',
        title: 'Управление',
        tools: [
            {
                id: 'lesson-reset',
                title: 'Сброс прогресса учеников',
                description: 'Очистить сохранённые ответы в выбранных уроках.',
                command: POPUP_COMMANDS.OPEN_LESSON_RESET,
                requirement: 'marathon',
                busyLabel: 'Открывается…',
                appearance: 'danger',
                closeOnSuccess: true
            },
            {
                id: 'batch-lesson-access',
                title: 'Открыть доступ к урокам',
                description: 'Открыть выбранные уроки для списка учеников.',
                command: POPUP_COMMANDS.OPEN_BATCH_LESSON_ACCESS,
                requirement: 'marathon',
                busyLabel: 'Открывается…',
                closeOnSuccess: true
            },
            {
                id: 'batch-user-onboarding',
                title: 'Добавить пользователей',
                description: 'Добавить пользователей и назначить выбранного куратора по списку email.',
                command: POPUP_COMMANDS.OPEN_BATCH_USER_ONBOARDING,
                requirement: 'marathon',
                busyLabel: 'Открывается…',
                closeOnSuccess: true
            },
            {
                id: 'batch-section-creation',
                title: 'Создать раздел в уроках',
                description: 'Добавить один раздел в несколько выбранных уроков.',
                command: POPUP_COMMANDS.OPEN_BATCH_SECTION_CREATION,
                requirement: 'marathon',
                busyLabel: 'Открывается…',
                closeOnSuccess: true
            },
            {
                id: 'youtube-video-attachment',
                title: 'Добавить YouTube-видео',
                description: 'Прикрепить одно видео к выбранным разделам выбранных уроков.',
                command: POPUP_COMMANDS.OPEN_VIDEO_ATTACHMENT,
                requirement: 'marathon',
                busyLabel: 'Открывается…',
                closeOnSuccess: true
            },
            {
                id: 'batch-section-deletion',
                title: 'Удалить раздел из уроков',
                description: 'Безопасно удалить раздел с точным именем из выбранных уроков.',
                command: POPUP_COMMANDS.OPEN_BATCH_SECTION_DELETION,
                requirement: 'marathon',
                busyLabel: 'Открывается…',
                appearance: 'danger',
                closeOnSuccess: true
            },
            {
                id: 'batch-user-management',
                title: 'Управление пользователями',
                description: 'Снять кураторов и удалить пользователей по списку email.',
                command: POPUP_COMMANDS.OPEN_BATCH_USER_MANAGEMENT,
                requirement: 'marathon',
                busyLabel: 'Открывается…',
                appearance: 'danger',
                closeOnSuccess: true
            }
        ]
    },
    {
        id: 'development',
        title: 'Разработка',
        tools: [
            {
                id: 'action-recorder',
                title: 'Запись действий WebSocket',
                description: 'Записать запросы и ответы выполненного действия.',
                command: POPUP_COMMANDS.OPEN_ACTION_RECORDER,
                requirement: 'edvibe',
                busyLabel: 'Открывается…',
                closeOnSuccess: true
            }
        ]
    }
].map(freezeToolGroup));

const PAGE_CONTEXT_CONTENT = Object.freeze({
    loading: Object.freeze({ title: 'Проверяем страницу…', description: 'Определяем доступные инструменты' }),
    edvibe: Object.freeze({ title: 'Страница Edvibe', description: 'Откройте страницу марафона для работы с инструментами' }),
    unsupported: Object.freeze({ title: 'Не страница Edvibe', description: 'Toolbox работает на страницах edvibe.com' }),
    unavailable: Object.freeze({ title: 'Страница недоступна', description: 'Не удалось определить активную вкладку' })
});

function resolvePageContext(tab) {
    if (!tab?.id || !tab.url) {
        return { type: 'unavailable' };
    }

    let url;
    try {
        url = new URL(tab.url);
    } catch (_) {
        return { type: 'unsupported', tabId: tab.id };
    }

    const isEdvibe = url.hostname === 'edvibe.com' || url.hostname.endsWith('.edvibe.com');
    if (!isEdvibe) {
        return { type: 'unsupported', tabId: tab.id };
    }

    const marathonMatch = url.pathname.match(/\/marathon\/(\d+)(?:\/|$)/);
    return marathonMatch
        ? { type: 'marathon', marathonId: marathonMatch[1], tabId: tab.id }
        : { type: 'edvibe', tabId: tab.id };
}

function getPageContextContent(pageContext) {
    if (pageContext?.type === 'marathon') {
        return {
            title: `Марафон #${pageContext.marathonId}`,
            description: 'Инструменты марафона доступны'
        };
    }
    return PAGE_CONTEXT_CONTENT[pageContext?.type] || PAGE_CONTEXT_CONTENT.unavailable;
}

function getUnavailableReason(tool, pageContext) {
    if (tool.requirement === 'edvibe') {
        return pageContext.type === 'edvibe' || pageContext.type === 'marathon'
            ? ''
            : 'Откройте страницу Edvibe.';
    } else {
        return tool.requirement !== 'marathon' || pageContext.type === 'marathon'
            ? ''
            : 'Откройте страницу марафона.';
    }
}

function getToolDefinition(toolId) {
    for (const group of TOOL_GROUPS) {
        const tool = group.tools.find((item) => item.id === toolId);
        if (tool) {
            return tool;
        }
    }
    return undefined;
}

function getToolViewModel(tool, { pageContext, exportInProgress, pendingToolId }) {
    const unavailableReason = getUnavailableReason(tool, pageContext);
    const isBusy = tool.id === 'marathon-export' && exportInProgress;
    const isPending = pendingToolId === tool.id;
    const isBlocked = (exportInProgress || pendingToolId !== null) && !isBusy && !isPending;

    return {
        ...tool,
        disabled: Boolean(unavailableReason || isBusy || isPending || isBlocked),
        reason: unavailableReason || (isBlocked ? 'Дождитесь завершения другого инструмента.' : ''),
        busy: isBusy || isPending
    };
}

export {
    TOOL_GROUPS,
    getPageContextContent,
    getToolDefinition,
    getToolViewModel,
    getUnavailableReason,
    resolvePageContext
};
