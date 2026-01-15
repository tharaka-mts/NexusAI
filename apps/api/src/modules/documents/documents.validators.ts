import { z } from 'zod';
import { DocumentSourceType } from '@prisma/client';

export const createDocumentSchema = z.object({
    body: z.object({
        content: z.string().min(1).max(200000, 'Content must be between 1 and 200,000 characters'),
        title: z.string().max(120).optional(),
        sourceType: z.nativeEnum(DocumentSourceType).optional().default(DocumentSourceType.PLAIN_TEXT),
    }),
});

export const getDocumentSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid document ID'),
    }),
});
