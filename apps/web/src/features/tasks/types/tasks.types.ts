import { z } from 'zod';
import {
    taskSchema,
    tasksListResponseSchema,
    tasksListParamsSchema,
    updateTaskSchema,
    taskStatsSchema
} from '../schemas/tasks.schemas';

export type Task = z.infer<typeof taskSchema>;
export type TasksListResponse = z.infer<typeof tasksListResponseSchema>;
export type TasksListParams = z.infer<typeof tasksListParamsSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskStats = z.infer<typeof taskStatsSchema>;

// Enums (Standardized for UI)
export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    BLOCKED = 'BLOCKED',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}
