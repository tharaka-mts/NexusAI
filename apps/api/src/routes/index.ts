import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { guestRoutes } from '../modules/guests/guest.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { aiRoutes } from '../modules/ai/ai.routes';
import { env } from '../config/env';

import { documentsRoutes } from '@/modules/documents/documents.routes';

const router = Router();

// Health & Debug
router.use('/health', healthRoutes);

router.use('/guest', guestRoutes); 

// Auth Routes
router.use('/auth', authRoutes);

// AI Routes
router.use('/ai', aiRoutes);
router.use('/documents', documentsRoutes);

export const routes = router;
