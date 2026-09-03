import type { PageContext, ToolDefinition } from '#src/popup/popup-model.js';

function isToolRelevantToPage(tool: ToolDefinition, pageContext: PageContext): boolean {
    if (pageContext.type === 'telegram-web-k') {
        return tool.requirement === 'telegram';
    }
    if (pageContext.type === 'edvibe' || pageContext.type === 'marathon') {
        return tool.requirement === 'edvibe' || tool.requirement === 'marathon';
    }
    return false;
}

function getRelevantTools(tools: readonly ToolDefinition[], pageContext: PageContext): readonly ToolDefinition[] {
    return tools.filter((tool) => isToolRelevantToPage(tool, pageContext));
}

export { getRelevantTools, isToolRelevantToPage };
