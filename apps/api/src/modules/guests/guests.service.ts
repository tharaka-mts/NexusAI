import { guestsRepository } from './guests.repository';
import { redis } from '../../config/redis';
import { logger } from '../../config/logger';

// Redis Key: guest:{guestKey}:freeRunUsed -> "1"
const getRedisKey = (guestKey: string) => `guest:${guestKey}:freeRunUsed`;
const THIRTY_DAYS = 30 * 24 * 60 * 60;

export const guestsService = {
    async getOrCreateGuestSession(guestKey: string) {
        let session = await guestsRepository.findByGuestKey(guestKey);
        if (!session) {
            session = await guestsRepository.create({ guestKey });
            logger.info('Created new guest session', { guestKey, id: session.id });
        }
        return session;
    },

    async canUseFreeRun(guestKey: string): Promise<boolean> {
        // 1. Check Redis first (fast path)
        if (redis.isOpen) {
            const exists = await redis.get(getRedisKey(guestKey));
            if (exists) return false;
        }

        // 2. Check DB (source of truth)
        const session = await guestsRepository.findByGuestKey(guestKey);
        // If no session, they haven't used it (or don't exist yet, effectively allowed)
        if (!session) return true;

        if (session.freeRunUsedAt) {
            // Heal Redis cache if missing
            if (redis.isOpen) {
                await redis.set(getRedisKey(guestKey), '1', { EX: THIRTY_DAYS });
            }
            return false;
        }

        return true;
    },

    async markFreeRunUsed(guestKey: string, aiRunId: string) {
        const session = await guestsRepository.findByGuestKey(guestKey);
        if (!session) {
            // Should catch this before calling markFreeRunUsed, but safety first
            throw new Error('Guest session not found');
        }

        // Update DB
        await guestsRepository.markFreeRunUsed(session.id, aiRunId);

        // Update Redis
        if (redis.isOpen) {
            await redis.set(getRedisKey(guestKey), '1', { EX: THIRTY_DAYS });
        }
    },
};
