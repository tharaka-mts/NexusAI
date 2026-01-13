import { Router } from 'express';
import { healthRoutes } from './health.routes';
import { guestRoutes } from '../modules/guests/guest.routes';
import { env } from '../config/env';

const router = Router();

// Health & Debug
router.use('/health', healthRoutes);

// Guest Routes (Dev/Temp)
// Only enable if needed or explicitly mounted. 
// User instruction: Example mounting paths: /guest
router.use('/guest', guestRoutes);

export const routes = router;
