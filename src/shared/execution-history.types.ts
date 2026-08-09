import { EXECUTION_RECORD_SCHEMA_VERSION } from './execution-history-record.js';

export type ExecutionTerminalStatus =
    | 'completed'
    | 'completed_with_failures'
    | 'cancelled'
    | 'interrupted';

export type ExecutionCountKey =
    | 'requested'
    | 'eligible'
    | 'attempted'
    | 'successful'
    | 'noOp'
    | 'skipped'
    | 'failed'
    | 'notAttempted';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | readonly JsonValue[] | { readonly [key: string]: JsonValue };

export type ExecutionPageContext = Readonly<{
    marathonId: string | null;
    marathonName: string | null;
}>;

export type ExecutionCounts = Readonly<Record<ExecutionCountKey, number>>;

export type ExecutionResult = Readonly<{
    order: number;
    itemId: string | null;
    label: string;
    status: string;
    code: string;
    message: string;
    attempts: number;
    data: Readonly<Record<string, JsonValue>>;
}>;

export type ExecutionRecord = Readonly<{
    schemaVersion: typeof EXECUTION_RECORD_SCHEMA_VERSION;
    id: string;
    operationType: string;
    startedAt: string;
    completedAt: string;
    status: ExecutionTerminalStatus;
    pageContext: ExecutionPageContext;
    counts: ExecutionCounts;
    results: readonly ExecutionResult[];
    message: string | null;
}>;

export type ExecutionRecordInput = Readonly<{
    id?: string;
    operationType: string;
    startedAt: string | Date;
    completedAt?: string | Date;
    status: ExecutionTerminalStatus;
    pageContext?: Readonly<{
        marathonId?: string | number | null;
        marathonName?: string | null;
    }>;
    counts?: Partial<Record<ExecutionCountKey, number>>;
    results: readonly Readonly<{
        itemId?: string | null;
        label?: string;
        status: string;
        code: string;
        message: string;
        attempts?: number;
        data?: Readonly<Record<string, JsonValue>>;
    }>[];
    message?: string | null;
}>;

export type ExecutionHistoryFilters = Readonly<{
    operationType?: string;
    status?: ExecutionTerminalStatus;
    marathonId?: string | number;
    from?: string | Date;
    to?: string | Date;
}>;

export interface ExecutionHistoryRepository {
    persist(record: ExecutionRecord): Promise<ExecutionRecord>;
    get(executionId: string): Promise<ExecutionRecord | null>;
    list(filters?: ExecutionHistoryFilters): Promise<ExecutionRecord[]>;
    delete(executionId: string): Promise<void>;
    clear(): Promise<void>;
    count(): Promise<number>;
    close(): void;
}