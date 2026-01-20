import { z } from 'zod';

export const RunAiResponseSchema = z.object({
    ok: z.boolean(),
    data: z.object({
        run: z.object({
            id: z.string(),
            documentId: z.string(),
            userId: z.string().nullable().optional(),
            guestSessionId: z.string().nullable().optional(),
        }),
        summary: z.object({
            shortSummary: z.string(),
            detailedSummary: z.string().optional(),
            highlights: z.array(z.string()).optional(),
        }),
        tasks: z.array(
            z.object({
                title: z.string(),
                description: z.string().optional(),
                priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
            })
        ).optional(),
    }),
});

export type RunAiResponse = z.infer<typeof RunAiResponseSchema>;
