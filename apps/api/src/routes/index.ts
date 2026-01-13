import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { guestRoutes } from '../modules/guests/guest.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { aiRoutes } from '../modules/ai/ai.routes';
import { env } from '../config/env';

const router = Router();

// Health & Debug
router.use('/health', healthRoutes);

// Guest Routes (Dev/Temp)
router.use('/guest', guestRoutes);

// Auth Routes
router.use('/auth', authRoutes);

// AI Routes
router.use('/ai', aiRoutes);

export const routes = router;
