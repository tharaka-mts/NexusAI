import { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service';

export const aiController = {
    async createRun(req: Request, res: Response, next: NextFunction) {
        try {
            const { text, title, documentId } = req.body;
            const user = (req as any).user;
            const guestKey = (req as any).guestId; // from ensureGuestSession middleware

            const result = await aiService.runAi({
                text,
                title,
                documentId,
                userId: user?.id,
                guestKey: user ? undefined : guestKey,
            });

            res.status(201).json({
                ok: true,
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
};
