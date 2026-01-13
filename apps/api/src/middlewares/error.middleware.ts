import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../shared/errors/AppError';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorCode = 'APP_ERROR';
    } else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorCode = 'VALIDATION_ERROR';
        // Simplified validation error message for the response
        const issues = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
        message = `${message}: ${issues.join(', ')}`;
    } else if (
        err instanceof Prisma.PrismaClientKnownRequestError ||
        err instanceof Prisma.PrismaClientValidationError
    ) {
        statusCode = 400;
        message = 'Database Error';
        errorCode = 'DATABASE_ERROR';
        // Don't leak too much DB info in prod
        if (env.NODE_ENV === 'development') {
            message += `: ${err.message}`;
        }
    }

    // Log everything
    logger.error(message, {
        errorCode,
        requestId: req.requestId,
        stack: err.stack,
        originalError: err,
    });

    res.status(statusCode).json({
        errorCode,
        message,
        requestId: req.requestId,
    });
};
