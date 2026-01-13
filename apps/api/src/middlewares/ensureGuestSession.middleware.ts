import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';

const GUEST_COOKIE_NAME = 'guestId';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const ensureGuestSession = (req: Request, res: Response, next: NextFunction) => {
    // If user is authenticated, skip (assume req.user is populated by auth middleware if present)
    // Check both location of user property if needed, simplified here
    if ((req as any).user) {
        return next();
    }

    let guestId = req.cookies[GUEST_COOKIE_NAME];

    if (!guestId) {
        guestId = uuidv4();
        res.cookie(GUEST_COOKIE_NAME, guestId, {
            httpOnly: true,
            secure: env.COOKIE_SECURE, // Use env var
            sameSite: 'lax',
            maxAge: THIRTY_DAYS_MS,
            path: '/',
        });
        // Attach to req so downstream can use it immediately
        req.cookies[GUEST_COOKIE_NAME] = guestId;
    }

    // Attach to request object for easy access
    (req as any).guestId = guestId;

    next();
};
