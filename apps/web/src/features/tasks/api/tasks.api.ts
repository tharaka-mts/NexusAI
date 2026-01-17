import { apiFetch } from '@/lib/apiClient';
import {
    tasksListResponseSchema,
    taskSchema
} from '../schemas/tasks.schemas';
import type {
    TasksListResponse,
    TasksListParams,
    UpdateTaskInput,
    Task
} from '../types/tasks.types';

export const fetchTasks = async (params: TasksListParams): Promise<TasksListResponse> => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    query.append('page', params.page.toString());
    query.append('pageSize', params.pageSize.toString());

    const response = await apiFetch<unknown>(`/tasks?${query.toString()}`);

    const result = tasksListResponseSchema.safeParse(response);
    if (!result.success) {
        console.error('Tasks List Validation Error:', result.error);
        throw new Error('Invalid response from server');
    }

    return result.data;
};

export const updateTask = async (id: string, data: UpdateTaskInput): Promise<Task> => {
    const response = await apiFetch<unknown>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });

    const result = taskSchema.safeParse(response);
    if (!result.success) {
        console.error('Update Task Validation Error:', result.error);
        throw new Error('Invalid response from server');
    }

    return result.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await apiFetch(`/tasks/${id}`, {
        method: 'DELETE',
    });
};
