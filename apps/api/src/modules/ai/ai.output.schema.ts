import { z } from 'zod';

export const AiTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM').optional(),
});

export const AiOutputSchema = z.object({
    shortSummary: z.string().min(1),
    detailedSummary: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    tasks: z.array(AiTaskSchema).default([]),
});

export type AiOutput = z.infer<typeof AiOutputSchema>;
export type AiTask = z.infer<typeof AiTaskSchema>;
