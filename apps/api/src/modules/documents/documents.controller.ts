import { Request, Response, NextFunction } from 'express';
import { documentsService } from './documents.service';


export const documentsController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const doc = await documentsService.createDocument(userId, req.body);

            res.status(201).json({
                ok: true,
                data: {
                    id: doc.id,
                    title: doc.title,
                    createdAt: doc.createdAt,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const docs = await documentsService.listDocuments(userId);

            res.json({
                ok: true,
                data: docs,
            });
        } catch (error) {
            next(error);
        }
    },

    async stats(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const stats = await documentsService.getStats(userId);

            res.json({
                ok: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    },

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            const result = await documentsService.getDocument(id, userId);

            res.json({
                ok: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
};
