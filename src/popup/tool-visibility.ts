import type { PageContext, ToolDefinition, ToolGroup } from '#src/popup/popup-model.js';

function isToolRelevantToPage(tool: ToolDefinition, pageContext: PageContext): boolean {
    if (pageContext.type === 'telegram-web-k') {
        return tool.requirement === 'telegram';
    }
    if (pageContext.type === 'edvibe' || pageContext.type === 'marathon') {
        return tool.requirement === 'edvibe' || tool.requirement === 'marathon';
    }
    return false;
}

function getRelevantTools(
    tools: readonly ToolDefinition[],
    pageContext: PageContext
): readonly ToolDefinition[] {
    return tools.filter((tool) => isToolRelevantToPage(tool, pageContext));
}

function getRelevantToolGroups(
    groups: readonly ToolGroup[],
    pageContext: PageContext
): readonly ToolGroup[] {
    return groups.flatMap((group) => {
        const tools = getRelevantTools(group.tools, pageContext);
        return tools.length === 0
            ? []
            : [Object.freeze({ ...group, tools: Object.freeze([...tools]) })];
    });
}

export {
    getRelevantToolGroups,
    getRelevantTools,
    isToolRelevantToPage
};
