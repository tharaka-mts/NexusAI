import { env } from '../../../config/env';
import { AppError } from '../../../shared/errors/AppError';
import { AiOutput, AiOutputSchema } from '../ai.output.schema';
import { IAIClient } from './IAIClient';

export class OllamaClient implements IAIClient {
    private baseUrl: string;
    private model: string;

    constructor() {
        if (!env.OLLAMA_BASE_URL) throw new Error('OLLAMA_BASE_URL is not set');
        this.baseUrl = env.OLLAMA_BASE_URL;
        this.model = env.AI_MODEL;
    }

    async generateSummaryAndTasks(content: string): Promise<AiOutput> {
        const prompt = `
You are an intelligent assistant. Analyze the text and return valid JSON.
Schema:
{
  "shortSummary": "string",
  "detailedSummary": "string",
  "highlights": ["string"],
  "tasks": [
    { "title": "string", "description": "string", "priority": "MEDIUM" }
  ]
}

Text:
${content}
`;

        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    format: 'json',
                    stream: false,
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new AppError(`Ollama API Error: ${response.statusText} - ${errText}`, 502);
            }

            const data = await response.json();

            // Ollama returns { response: "{ ... }" }
            const rawText = data.response;
            if (!rawText) {
                throw new AppError('Ollama returned empty response', 502);
            }

            const parsed = JSON.parse(rawText);
            return AiOutputSchema.parse(parsed);

        } catch (error) {
            if (error instanceof AppError) throw error;
            if (error instanceof SyntaxError) throw new AppError('Invalid JSON from Ollama', 502);
            // @ts-ignore
            throw new AppError(`Ollama Client Error: ${error.message}`, 500);
        }
    }
}
