import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { guestsService } from '../modules/guests/guests.service';

export const guestLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // If user is authenticated, allow
    if ((req as any).user) {
        return next();
    }

    const guestId = (req as any).guestId || req.cookies['guestId'];

    if (!guestId) {
        // Should depend on ensureGuestSession, but just in case
        return next(new AppError('Guest session missing', 400));
    }

    try {
        const allowed = await guestsService.canUseFreeRun(guestId);
        if (!allowed) {
            return next(new AppError('Free run limit reached. Please sign up to continue.', 403));
        }

        // Ensure session exists in DB so we can track usage later
        await guestsService.getOrCreateGuestSession(guestId);

        next();
    } catch (err) {
        next(err);
    }
};
