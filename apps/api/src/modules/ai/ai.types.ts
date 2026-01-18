import { AiRun, Summary, Task } from '@prisma/client';

export type CreateAiRunInput = {
    text: string;
    userId?: string;
    guestSessionId?: string;
    guestKey?: string;
    title?: string;
    documentId?: string;
};

export type AiRunResponse = {
    run: AiRun;
    summary: Summary | null;
    tasks: Task[];
};
