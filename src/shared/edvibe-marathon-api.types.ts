export type EdvibeRequest = Readonly<{
    controller: string;
    method: string;
    projectName: string;
    value: Readonly<Record<string, unknown>>;
}>;

export type EdvibeSendRequest = (
    controller: string,
    method: string,
    projectName: string,
    value: Readonly<Record<string, unknown>>
) => Promise<unknown>;

export type PaginatedResponse<T = Readonly<Record<string, unknown>>> = Readonly<{
    Value?: Readonly<{
        Items?: readonly T[];
        Page?: Readonly<{ Count?: number }>;
    }>;
    value?: Readonly<{
        Items?: readonly T[];
        Page?: Readonly<{ Count?: number }>;
    }>;
}>;

export type MarathonPupil = Readonly<{
    PupilId?: number;
    MarathonPupilId?: number;
    Id?: number;
    Email?: string;
    Moderators?: readonly Readonly<Record<string, unknown>>[];
    [key: string]: unknown;
}>;

export type MarathonLesson = Readonly<{
    LessonId?: number;
    MarathonLessonId?: number;
    Id?: number;
    Number?: number;
    Name?: string;
    IsOpen?: boolean;
    [key: string]: unknown;
}>;

export interface EdvibeMarathonApi {
    loadAllPupils(options: Readonly<{ marathonId: number; pageSize?: number }>): Promise<MarathonPupil[]>;
    loadAllPupilLessons(options: Readonly<{
        marathonId: number;
        pupilId: number;
        pageSize?: number;
    }>): Promise<MarathonLesson[]>;
    loadAllMarathonLessons(options: Readonly<{
        marathonId: number;
        pageSize?: number;
    }>): Promise<MarathonLesson[]>;
    getLessonById(options: Readonly<{ lessonId: number }>): Promise<Readonly<Record<string, unknown>>>;
}
