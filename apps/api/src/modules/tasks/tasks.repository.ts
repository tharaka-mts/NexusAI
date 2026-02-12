import { prisma } from '@/config/prisma';
import { UpdateTaskInput, TaskFilters } from './tasks.types';
import { TaskStatus } from '@prisma/client';

export const tasksRepository = {
    async findMany(userId: string, filters: TaskFilters) {
        const skip = (filters.page - 1) * filters.pageSize;

        const where = {
            userId,
            status: filters.status,
            priority: filters.priority,
        };

        const [items, total] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: filters.pageSize,
            }),
            prisma.task.count({ where }),
        ]);

        return { items, total };
    },

    async findById(id: string, userId: string) {
        return prisma.task.findFirst({
            where: { id, userId },
        });
    },

    async update(id: string, data: Omit<UpdateTaskInput, 'completedAt'> & { completedAt?: Date | null }) {
        return prisma.task.update({
            where: { id },
            data,
        });
    },

    async delete(id: string) {
        return prisma.task.delete({
            where: { id },
        });
    },

    async statsByUser(userId: string) {
        const [total, completed] = await Promise.all([
            prisma.task.count({
                where: { userId },
            }),
            prisma.task.count({
                where: { userId, status: TaskStatus.DONE },
            }),
        ]);

        return {
            total,
            completed,
            open: total - completed,
        };
    },
};
