import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { redis } from '../../config/redis';
import { hashContent } from '../../shared/utils/hashContent';
import { AppError } from '../../shared/errors/AppError';
import { guestsService } from '../guests/guests.service';
import { CreateAiRunInput } from './ai.types';
import { aiRepository } from './ai.repository';
import { buildAiCacheKey } from './ai.cache';
import { normalizeAiOutput } from './ai.normalize';
import { getAiProvider } from './providers/factory';
import { AiOutput } from './ai.output.schema';

const aiClient = getAiProvider();

export const aiService = {
    async runAi(input: CreateAiRunInput) {
        // 0. Verify Document Ownership if documentId provided
        if (input.documentId && input.userId) {
            const doc = await aiRepository.getDocumentById(input.documentId);
            if (!doc) {
                throw new AppError('Document not found', 404);
            }
            if (doc.userId !== input.userId) {
                throw new AppError('You do not have permission to access this document', 403);
            }
        }

        const contentHash = hashContent(input.text);
        const cacheKey = buildAiCacheKey({
            provider: env.AI_PROVIDER,
            model: env.AI_MODEL,
            contentHash,
            promptVersion: env.AI_PROMPT_VERSION,
        });

        // 1. Check Redis Cache
        if (redis.isOpen) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                logger.info('AI result served from cache', { cacheKey });
                return { ...JSON.parse(cached), cached: true };
            }
        }

        // 2. Run AI Provider
        let output: AiOutput;
        try {
            output = await aiClient.generateSummaryAndTasks(input.text);
        } catch (err: any) {
            logger.error('AI Provider Failed', { err });
            throw new AppError(`AI Provider Failed: ${err.message}`, 502);
        }

        // 3. Normalize Output
        const normalizedOutput = normalizeAiOutput(output);

        // 4. Persistence Logic
        // Scenario A: Guest
        if (input.guestKey && !input.userId) {
            const session = await guestsService.getOrCreateGuestSession(input.guestKey);

            // Create run record but with empty tasks in DB for guest
            const savedData = await aiRepository.createRun(
                { ...input, guestSessionId: session.id },
                {
                    ...normalizedOutput,
                    summary: normalizedOutput.shortSummary,
                    tasks: []
                } as any,
                env.AI_PROVIDER,
                cacheKey
            );

            await guestsService.markFreeRunUsed(input.guestKey, savedData.run.id);

            const response = {
                ...savedData,
                summary: normalizedOutput,
                tasks: normalizedOutput.tasks
            };

            if (redis.isOpen) {
                await redis.set(cacheKey, JSON.stringify(response), { EX: 24 * 60 * 60 });
            }

            return response;
        }

        // Scenario B: Authenticated User
        if (input.userId) {
            const savedData = await aiRepository.createRun(
                input,
                normalizedOutput as any,
                env.AI_PROVIDER,
                cacheKey
            );

            if (redis.isOpen) {
                await redis.set(cacheKey, JSON.stringify(savedData), { EX: 24 * 60 * 60 });
            }
            return savedData;
        }

        throw new AppError('Invalid request: missing user or guest identity', 400);
    }
};
