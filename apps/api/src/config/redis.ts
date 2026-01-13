import { createClient } from 'redis';
import { env } from './env';
import { logger } from './logger';

export const redis = createClient({
    url: env.REDIS_URL,
});

redis.on('error', (err) => logger.error('Redis Client Error', { err }));
redis.on('connect', () => logger.info('Redis Client Connected'));
redis.on('ready', () => logger.info('Redis Client Ready'));

// Connect immediately
(async () => {
    try {
        await redis.connect();
    } catch (err) {
        // If redis fails, we log it but don't crash, unless strict requirement?
        // Requirement said: allow graceful "redis disabled" mode if REDIS_URL not set (do not crash in dev)
        // But here we rely on env.REDIS_URL which has a default.
        // We will log error but process continues.
        logger.error('Failed to connect to Redis', { err });
    }
})();
