import { POPUP_COMMANDS } from '#src/shared/messaging/index.js';

import type { PopupCommand } from '#src/shared/messaging/model.js';

type ToolRequirement = 'edvibe' | 'marathon' | 'telegram';
type ToolAppearance = 'danger';

interface ToolDefinition {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly command: PopupCommand;
    readonly requirement: ToolRequirement;
    readonly busyLabel: string;
    readonly appearance?: ToolAppearance;
    readonly closeOnSuccess?: boolean;
}

interface ToolGroup {
    readonly id: string;
    readonly title: string;
    readonly tools: readonly ToolDefinition[];
}

type PageContext =
    | { readonly type: 'loading' }
    | { readonly type: 'unavailable' }
    | { readonly type: 'unsupported'; readonly tabId: number }
    | { readonly type: 'edvibe'; readonly tabId: number }
    | { readonly type: 'marathon'; readonly marathonId: string; readonly tabId: number }
    | { readonly type: 'telegram-web-k'; readonly tabId: number };

interface PageContextContent {
    readonly title: string;
    readonly description: string;
}

interface ToolViewState {
    readonly pageContext: PageContext;
    readonly exportInProgress: boolean;
    readonly pendingToolId: string | null;
}

interface ToolViewModel extends ToolDefinition {
    readonly disabled: boolean;
    readonly reason: string;
    readonly busy: boolean;
}

function freezeToolGroup(group: { id: string; title: string; tools: ToolDefinition[] }): ToolGroup {
    return Object.freeze({
        ...group,
        tools: Object.freeze(group.tools.map((tool) => Object.freeze(tool)))
    });
}

function defineToolGroups(groups: Array<{ id: string; title: string; tools: ToolDefinition[] }>): readonly ToolGroup[] {
    return Object.freeze(groups.map(freezeToolGroup));
}

const TOOL_GROUPS = defineToolGroups([
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
        id: 'telegram',
        title: 'Telegram',
        tools: [
            {
                id: 'telegram-owned-groups',
                title: 'Мои группы',
                description: 'Показать группы, созданные текущим Telegram-аккаунтом.',
                command: POPUP_COMMANDS.OPEN_TELEGRAM_GROUP_BROWSER,
                requirement: 'telegram',
                busyLabel: 'Открывается…',
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
]);

const PAGE_CONTEXT_CONTENT: Readonly<Record<'loading' | 'edvibe' | 'telegram-web-k' | 'unsupported' | 'unavailable', PageContextContent>> = Object.freeze({
    loading: Object.freeze({ title: 'Проверяем страницу…', description: 'Определяем доступные инструменты' }),
    edvibe: Object.freeze({ title: 'Страница Edvibe', description: 'Откройте страницу марафона для работы с инструментами' }),
    'telegram-web-k': Object.freeze({ title: 'Telegram Web K', description: 'Инструменты Telegram доступны для текущего аккаунта' }),
    unsupported: Object.freeze({ title: 'Неподдерживаемая страница', description: 'Toolfox работает на Edvibe и Telegram Web K' }),
    unavailable: Object.freeze({ title: 'Страница недоступна', description: 'Не удалось определить активную вкладку' })
});

function resolvePageContext(tab: Pick<chrome.tabs.Tab, 'id' | 'url'> | null | undefined): PageContext {
    if (!tab?.id || !tab.url) {
        return { type: 'unavailable' };
    }

    let url;
    try {
        url = new URL(tab.url);
    } catch (_) {
        return { type: 'unsupported', tabId: tab.id };
    }

    if (url.hostname === 'web.telegram.org' && (url.pathname === '/k' || url.pathname.startsWith('/k/'))) {
        return { type: 'telegram-web-k', tabId: tab.id };
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

function getPageContextContent(pageContext: PageContext | null | undefined): PageContextContent {
    if (pageContext?.type === 'marathon') {
        return {
            title: `Марафон #${pageContext.marathonId}`,
            description: 'Инструменты марафона доступны'
        };
    }
    return pageContext?.type === 'loading'
        || pageContext?.type === 'edvibe'
        || pageContext?.type === 'telegram-web-k'
        || pageContext?.type === 'unsupported'
        || pageContext?.type === 'unavailable'
        ? PAGE_CONTEXT_CONTENT[pageContext.type]
        : PAGE_CONTEXT_CONTENT.unavailable;
}

function getUnavailableReason(tool: ToolDefinition, pageContext: PageContext): string {
    if (tool.requirement === 'edvibe') {
        return pageContext.type === 'edvibe' || pageContext.type === 'marathon'
            ? ''
            : 'Откройте страницу Edvibe.';
    }
    if (tool.requirement === 'marathon') {
        return pageContext.type === 'marathon'
            ? ''
            : 'Откройте страницу марафона.';
    }
    return pageContext.type === 'telegram-web-k'
        ? ''
        : 'Откройте Telegram Web K.';
}

function getToolDefinition(toolId: string): ToolDefinition | undefined {
    for (const group of TOOL_GROUPS) {
        const tool = group.tools.find((item) => item.id === toolId);
        if (tool) {
            return tool;
        }
    }
    return undefined;
}

function getToolViewModel(
    tool: ToolDefinition,
    { pageContext, exportInProgress, pendingToolId }: ToolViewState
): ToolViewModel {
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
    resolvePageContext,
};

export type {
    PageContext,
    PageContextContent,
    ToolDefinition,
    ToolGroup,
    ToolViewModel,
    ToolViewState,
};
