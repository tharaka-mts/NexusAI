export interface CacheKeyInput {
    provider: string;
    model: string;
    contentHash: string;
    promptVersion: string;
}

export const buildAiCacheKey = ({ provider, model, contentHash, promptVersion }: CacheKeyInput): string => {
    return `ai:${provider}:${model}:${promptVersion}:${contentHash}`;
};
