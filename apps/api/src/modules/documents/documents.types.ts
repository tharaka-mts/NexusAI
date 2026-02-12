import { Document, Summary, Task, DocumentSourceType } from '@prisma/client';

export type CreateDocumentInput = {
    title?: string;
    content: string;
    sourceType?: DocumentSourceType;
};

export type DocumentWithDetails = Document & {
    latestSummary?: Summary | null;
    tasks: Task[];
};

export type DocumentListItem = Pick<Document, 'id' | 'title' | 'createdAt' | 'updatedAt'>;

export type DocumentStats = {
    total: number;
};
