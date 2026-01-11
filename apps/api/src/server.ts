import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/prisma';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Shutting down gracefully`);

    // Stop accepting new requests
    server.close(async () => {
        logger.info('HTTP server closed');

        try {
            // Disconnect Prisma
            await prisma.$disconnect();
            logger.info('Prisma disconnected');

            logger.info('Process terminated');
            process.exit(0);
        } catch (err) {
            logger.error('Error during shutdown', { err });
            process.exit(1);
        }
    });
};

// Graceful shutdown signals
process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
    void shutdown('SIGINT');
});
