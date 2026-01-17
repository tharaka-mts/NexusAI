import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const listTasksSchema = z.object({
    query: z.object({
        status: z.nativeEnum(TaskStatus).optional(),
        priority: z.nativeEnum(TaskPriority).optional(),
        page: z.coerce.number().min(1).default(1),
        pageSize: z.coerce.number().min(1).max(100).default(20),
    }),
});

export const updateTaskSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        title: z.string().max(140).optional(),
        description: z.string().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        priority: z.nativeEnum(TaskPriority).optional(),
        dueDate: z.string().datetime().nullable().optional(), // ISO string or null
        completedAt: z.string().datetime().nullable().optional(),
    }),
});

export const getTaskSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});

// Since creation is not explicitly asked for as a standalone endpoint in the prompt (it says "Task CRUD" but prompt details purely focus on LIST, PATCH, DELETE),
// I will include a create schema just in case, or stick to the requested endpoints.
// The prompt "Implement PHASE 8 — Backend Tasks API (Task CRUD for authenticated users)" and "1) GET ... 2) PATCH ... 3) DELETE".
// It implies creation might happen elsewhere (e.g. AI Runs) or is just omitted for brevity, but "CRUD" usually implies Create.
// However, strictly following "2) ENDPOINTS SPEC", only GET/PATCH/DELETE are specified.
// I will adhere to the spec.
