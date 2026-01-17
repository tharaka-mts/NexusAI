import { tasksRepository } from './tasks.repository';
import { CreateTaskInput, UpdateTaskInput, TaskFilters } from './tasks.types';
import { AppError } from '@/shared/errors/AppError';
import { TaskStatus } from '@prisma/client';

export const tasksService = {
    async listTasks(userId: string, filters: TaskFilters) {
        return tasksRepository.findMany(userId, filters);
    },

    async updateTask(id: string, userId: string, input: UpdateTaskInput) {
        const task = await tasksRepository.findById(id, userId);

        if (!task || task.userId !== userId) {
            throw new AppError('Task not found', 404);
        }

        // Initialize data, handling completedAt conversion if present
        const data: Omit<UpdateTaskInput, 'completedAt'> & { completedAt?: Date | null } = {
            ...input,
            completedAt: input.completedAt ? new Date(input.completedAt) : (input.completedAt as null | undefined),
        };

        // Handle completedAt logic based on status changes
        if (input.status === TaskStatus.DONE) {
            // If moving to DONE and no explicit completedAt provided, set to now
            if (task.status !== TaskStatus.DONE && !input.completedAt) {
                data.completedAt = new Date();
            }
        } else if (input.status) {
            // If moving AWAY from DONE (and status is provided but not DONE), clear completedAt
            if (task.status === TaskStatus.DONE) {
                data.completedAt = null;
            }
        }

        return tasksRepository.update(id, data);
    },

    async deleteTask(id: string, userId: string) {
        const task = await tasksRepository.findById(id, userId);

        if (!task || task.userId !== userId) {
            throw new AppError('Task not found', 404);
        }

        await tasksRepository.delete(id);
    },
};
