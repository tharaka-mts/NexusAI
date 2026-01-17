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
    content: z.string(),
    createdAt: z.string().or(z.date()),
});

// Assuming Task shape briefly here (Part B will define it fully, but we need it for Document Detail)
export const taskSchema = z.object({
    id: z.string(),
    description: z.string(),
    isCompleted: z.boolean(),
    // Add other fields as they become apparent or strict
    // For now allowing passthrough or keeping it simple
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
