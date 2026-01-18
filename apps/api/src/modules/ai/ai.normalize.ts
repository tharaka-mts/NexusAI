import { AiOutput } from './ai.output.schema';

const LIMITS = {
    SUMMARY_MAX: 5000,
    TASK_TITLE_MAX: 140,
    TASK_DESC_MAX: 1000,
};

const normalizeString = (str: string | undefined, maxLength: number): string | undefined => {
    if (!str) return undefined;
    const trimmed = str.trim();
    if (trimmed.length === 0) return undefined;
    return trimmed.slice(0, maxLength);
};

export const normalizeAiOutput = (output: AiOutput): AiOutput => {
    return {
        shortSummary: normalizeString(output.shortSummary, LIMITS.SUMMARY_MAX) || 'Summary unavailable',
        detailedSummary: normalizeString(output.detailedSummary, LIMITS.SUMMARY_MAX),
        highlights: Array.isArray(output.highlights)
            ? output.highlights
                .map((h) => normalizeString(h, 500)) // Cap highlights at 500
                .filter((h): h is string => !!h)
            : [],
        tasks: Array.isArray(output.tasks)
            ? output.tasks.map((t) => ({
                title: normalizeString(t.title, LIMITS.TASK_TITLE_MAX) || 'Untitled Task',
                description: normalizeString(t.description, LIMITS.TASK_DESC_MAX),
                priority: t.priority || 'MEDIUM',
            }))
            : [],
    };
};
