import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '@/middlewares/validate.middleware';
import { registerSchema, loginSchema } from './auth.validators';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);

export const authRoutes = router;
