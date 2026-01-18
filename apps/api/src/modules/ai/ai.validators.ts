import { z } from 'zod';

export const aiRunSchema = z.object({
    body: z.object({
        text: z.string().min(10).max(100000, 'Text to analyze must be between 10 and 100k characters'),
        title: z.string().optional(),
        documentId: z.string().uuid().optional(),
    }),
});
