import { createHash } from 'crypto';

/**
 * Computes the SHA-256 hash of the given text content.
 * Used for contentHash field in Documents.
 */
export const hashContent = (text: string): string => {
    return createHash('sha256').update(text).digest('hex');
};
