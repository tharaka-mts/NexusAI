import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env'; // Uses validated env
import { AppError } from '../shared/errors/AppError';
import { authRepository } from '../modules/auth/auth.repository';

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: any; // better: SafeUser
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies[env.AUTH_COOKIE_NAME]; // Uses env value found in src/config/env.ts

        if (!token) {
            return next(new AppError('Unauthorized', 401));
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };

        const user = await authRepository.findById(decoded.id);
        if (!user) {
            return next(new AppError('User not found', 401));
        }

        // Exclude passwordHash
        const { passwordHash, ...safeUser } = user;
        req.user = safeUser;

        next();
    } catch (err) {
        return next(new AppError('Invalid or expired token', 401));
    }
};
