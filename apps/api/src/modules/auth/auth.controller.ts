import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { env } from '../../config/env';
import { authRepository } from './auth.repository';

// Cookie options
const getCookieOptions = () => ({
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax' as const,
    path: '/',
});

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, token } = await authService.register(req.body);

            res.cookie(env.AUTH_COOKIE_NAME, token, getCookieOptions());

            res.status(201).json({
                ok: true,
                data: user,
            });
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, token } = await authService.login(req.body);

            res.cookie(env.AUTH_COOKIE_NAME, token, getCookieOptions());

            res.status(200).json({
                ok: true,
                data: user,
            });
        } catch (err) {
            next(err);
        }
    },

    async logout(req: Request, res: Response) {
        res.clearCookie(env.AUTH_COOKIE_NAME, {
            ...getCookieOptions(),
            maxAge: 0,
        });
        res.status(200).json({ ok: true });
    },

    async me(req: Request, res: Response, next: NextFunction) {
        // This will be protected by authMiddleware, so req.user exists
        const user = (req as any).user;
        res.json({ ok: true, data: user });
    }
};
