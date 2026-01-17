import { TaskStatus, TaskPriority } from '@prisma/client';

export interface CreateTaskInput {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string; // ISO date string
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null; // Allow clearing due date
    completedAt?: string | null; // Allow manual setting or clearing
}

export interface TaskFilters {
    status?: TaskStatus;
    priority?: TaskPriority;
    page: number;
    pageSize: number;
}
