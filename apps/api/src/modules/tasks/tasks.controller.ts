import { Request, Response, NextFunction } from 'express';
import { tasksService } from './tasks.service';
import { TaskFilters } from './tasks.types';

export const tasksController = {
    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id; // authMiddleware guarantees this
            const filters: TaskFilters = {
                status: req.query.status as any,
                priority: req.query.priority as any,
                page: Number(req.query.page),
                pageSize: Number(req.query.pageSize),
            };

            const { items, total } = await tasksService.listTasks(userId, filters);

            res.json({
                items,
                page: filters.page,
                pageSize: filters.pageSize,
                total,
                totalPages: Math.ceil(total / filters.pageSize),
            });
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const updatedTask = await tasksService.updateTask(id, userId, req.body);

            res.json(updatedTask);
        } catch (error) {
            next(error);
        }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            await tasksService.deleteTask(id, userId);

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};
