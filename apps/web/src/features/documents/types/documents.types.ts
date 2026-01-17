import { z } from 'zod';
import {
    documentSchema,
    documentListItemSchema,
    documentDetailDataSchema,
    summarySchema
} from '../schemas/documents.schemas';

export type Document = z.infer<typeof documentSchema>;
export type DocumentListItem = z.infer<typeof documentListItemSchema>;
export type DocumentDetail = z.infer<typeof documentDetailDataSchema>;
export type Summary = z.infer<typeof summarySchema>;

// Re-export specific input types if we had mutations (none for now in this refactor scope except implicit creation which is not in this task A)
