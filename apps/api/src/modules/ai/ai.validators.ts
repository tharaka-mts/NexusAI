import { z } from 'zod';

export const aiRunSchema = z.object({
    body: z.object({
        text: z.string().min(10).max(100000, 'Text is too long'),
    }),
});
