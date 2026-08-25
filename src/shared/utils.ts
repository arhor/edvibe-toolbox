export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== undefined
        && value !== null
        && typeof value === 'object'
        && !Array.isArray(value);
}

export function hasOnlyKeys(value: Record<string, unknown>, allowedKeys: ReadonlySet<string>): boolean {
    return Object.keys(value).every((key) => allowedKeys.has(key));
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string'
        && value.length > 0;
}
