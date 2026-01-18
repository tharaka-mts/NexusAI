import { env } from '../../../config/env';
import { logger } from '../../../config/logger';
import { GeminiClient } from './gemini.client';
import { IAIClient } from './IAIClient';
import { MockAIClient } from './mock.client';
import { OllamaClient } from './ollama.client';

export const getAiProvider = (): IAIClient => {
    logger.info(`Initializing AI Provider: ${env.AI_PROVIDER} (${env.AI_MODEL})`);

    switch (env.AI_PROVIDER) {
        case 'GEMINI':
            return new GeminiClient();
        case 'OLLAMA':
            return new OllamaClient();
        case 'MOCK':
        default:
            return new MockAIClient();
    }
};
