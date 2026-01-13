import { Router } from 'express';
import { env } from '../config/env';
import { prisma } from '../config/prisma';

const router = Router();

// Health Check
router.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date(), env: env.NODE_ENV, requestId: req.requestId });
});

// DB connection check TEMP route
router.get('/db-check', async (req, res, next) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

export const healthRoutes = router;
