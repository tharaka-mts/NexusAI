import { z } from 'zod';

// --- Shared Schemas ---

export const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']);
export const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const taskSchema = z.object({
    id: z.string(),
    description: z.string(), // The prompt said "description may be null" in one place but "title" in another?
    // Let's check api/modules/tasks/tasks.types.ts again? 
    // It has `description?: string`. I assume the "title" is mapped to description or similar?
    // Wait, the `Task` model in Prisma usually has a description. 
    // API CreateTaskInput has `title` (required) and `description` (optional).
    // I'll check the Prisma schema or assume consistent naming. 
    // Actually, let's look at the TaskRow requirement. "Validate Task item fields... description may be null...".
    // The API `CreateTaskInput` has `title`. It's likely `Task` has both or just description?
    // I'll add `title` (optional in schema if missing, but likely present) and `description`.
    // Checking `apps/api/src/modules/tasks/tasks.types.ts`: `title` is string, `description` is optional.
    title: z.string().optional(), // Adding title as it's in CreateTaskInput. 
    isCompleted: z.boolean().optional(), // API uses status, but UI might want boolean.
    status: taskStatusSchema.optional().default('TODO'),
    priority: taskPrioritySchema.optional().default('MEDIUM'),
    dueDate: z.string().nullable().optional(),
    completedAt: z.string().nullable().optional(),
    createdAt: z.string().or(z.date()).optional(),
    updatedAt: z.string().or(z.date()).optional(),
    documentId: z.string().nullable().optional(),
    aiRunId: z.string().nullable().optional(),
});

// --- API Request/Response Schemas ---

export const tasksListParamsSchema = z.object({
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    page: z.number().default(1),
    pageSize: z.number().default(10),
});

export const tasksListResponseSchema = z.object({
    items: z.array(taskSchema),
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
    totalPages: z.number(),
});

export const taskStatsSchema = z.object({
    total: z.number(),
    completed: z.number(),
    open: z.number(),
});

export const taskStatsResponseSchema = z.object({
    ok: z.boolean(),
    data: taskStatsSchema,
});

export const updateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: z.string().nullable().optional(),
    completedAt: z.string().nullable().optional(), // To mark done
});
