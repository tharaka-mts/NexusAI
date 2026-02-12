import { Router } from 'express';
import { tasksController } from './tasks.controller';
import { validate } from '@/middlewares/validate.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { listTasksSchema, updateTaskSchema, getTaskSchema } from './tasks.validators';

const router = Router();

// Apply auth to all task routes
router.use(authMiddleware);

router.get(
    '/',
    validate(listTasksSchema),
    tasksController.list
);

router.get(
    '/stats',
    tasksController.stats
);

router.patch(
    '/:id',
    validate(updateTaskSchema),
    tasksController.update
);

router.delete(
    '/:id',
    validate(getTaskSchema), // Re-using getTaskSchema just to validate UUID param
    tasksController.delete
);

export const tasksRoutes = router;
