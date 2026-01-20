import { apiFetch } from '@/lib/apiClient';
import { RunAiResponse, RunAiResponseSchema } from '../schemas/ai.schemas';

interface RunAiPayload {
    text: string;
    title?: string;
    documentId?: string;
}

export const runAi = async (payload: RunAiPayload): Promise<RunAiResponse> => {
    const response = await apiFetch<unknown>('/ai/runs', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    return RunAiResponseSchema.parse(response);
};
