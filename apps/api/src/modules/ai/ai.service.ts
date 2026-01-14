import crypto from 'crypto';
import { redis } from '../../config/redis';
import { logger } from '../../config/logger';
import { CreateAiRunInput } from './ai.types';
import { MockAIClient } from './providers/mock.client';
import { aiRepository } from './ai.repository';
import { guestsService } from '../guests/guests.service';

const aiClient = new MockAIClient();

const generateCacheKey = (text: string) => {
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    return `ai:hash:${hash}`;
};

export const aiService = {
    async runAi(input: CreateAiRunInput) {
        const cacheKey = generateCacheKey(input.text);

        // 1. Check Redis Cache
        if (redis.isOpen) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                logger.info('AI result served from cache', { cacheKey });
                return JSON.parse(cached);
            }
        }

        // 2. Run AI
        const result = await aiClient.summarizeAndExtract(input.text);

        // 3. Persist to DB
        // We need to resolve guestSessionId if guestKey is provided? 
        // The controller should pass resolved IDs.
        // Actually, GuestSessionId comes from the DB lookup.

        let guestSessionId = input.guestSessionId;
        if (!guestSessionId && input.guestKey) {
            const session = await guestsService.getOrCreateGuestSession(input.guestKey);
            guestSessionId = session.id;
        }

        const savedData = await aiRepository.createRun(
            { ...input, guestSessionId },
            result,
            'MOCK',
            cacheKey
        );

        // 4. Mark Guest Usage
        if (input.guestKey && !input.userId) {
            // If guest, mark as used
            await guestsService.markFreeRunUsed(input.guestKey, savedData.run.id);
        }

        // 5. Cache Result in Redis (TTL: 24h)
        if (redis.isOpen) {
            await redis.set(cacheKey, JSON.stringify(savedData), { EX: 24 * 60 * 60 });
        }

        return savedData;
    }
};
