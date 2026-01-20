import { z } from 'zod';

// --- Shared / Primitive Schemas ---

export const documentSchema = z.object({
    id: z.string(),
    title: z.string().nullable().optional(),
    content: z.string().optional(), // Content might be large, sometimes not included in list? List doesn't have it.
    sourceType: z.string().optional(), // 'TEXT' | 'PDF' etc.
    createdAt: z.string().or(z.date()).optional(), // API sends string usually
    updatedAt: z.string().or(z.date()).optional(),
});

export const summarySchema = z.object({
    id: z.string(),
    shortSummary: z.string(),
    detailedSummary: z.string().nullable().optional(),
    highlights: z.array(z.string()).optional().default([]),
    createdAt: z.string().or(z.date()),
});

export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']);
export const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    status: taskStatusSchema.optional().default('TODO'),
    priority: taskPrioritySchema.optional().default('MEDIUM'),
    completedAt: z.string().or(z.date()).nullable().optional(),
    // Add other fields as they become apparent or strict
}).passthrough();


// --- API Response Schemas ---

// GET /documents (List)
// The API returns { ok: true, data: [...] }
// The list item from repository only has id, title, createdAt, updatedAt
export const documentListItemSchema = z.object({
    id: z.string(),
    title: z.string().nullable().optional(),
    createdAt: z.string().or(z.date()),
    updatedAt: z.string().or(z.date()),
});

export const documentsListResponseSchema = z.object({
    ok: z.boolean(),
    data: z.array(documentListItemSchema),
});


// GET /documents/:id (Detail)
// Returns { ok: true, data: { document: ..., latestSummary: ..., tasks: ... } }
export const documentDetailDataSchema = z.object({
    document: documentSchema,
    latestSummary: summarySchema.nullable().optional(),
    tasks: z.array(taskSchema).optional().default([]),
});

export const documentDetailResponseSchema = z.object({
    ok: z.boolean(),
    data: documentDetailDataSchema,
});
