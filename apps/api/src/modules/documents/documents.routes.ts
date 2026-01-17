import { Router } from 'express';
import { documentsController } from './documents.controller';
import { validate } from '@/middlewares/validate.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { createDocumentSchema, getDocumentSchema } from './documents.validators';

const router = Router();

// Buffer between path and handler for cleaner reading
router.post(
    '/',
    authMiddleware,
    validate(createDocumentSchema),
    documentsController.create
);

router.get(
    '/',
    authMiddleware,
    documentsController.list
);

router.get(
    '/:id',
    authMiddleware,
    validate(getDocumentSchema),
    documentsController.getOne
);

export const documentsRoutes = router;
