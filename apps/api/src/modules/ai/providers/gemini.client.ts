import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../../config/env';
import { AppError } from '../../../shared/errors/AppError';
import { AiOutput, AiOutputSchema } from '../ai.output.schema';
import { IAIClient } from './IAIClient';

export class GeminiClient implements IAIClient {
    private client: GoogleGenerativeAI;
    private model: string;

    constructor() {
        if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
        this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        this.model = env.AI_MODEL;
    }

    async generateSummaryAndTasks(content: string): Promise<AiOutput> {
        const prompt = `
You are an intelligent assistant. Analyze the following text and extract:
1. A short summary (max 2 sentences).
2. A detailed summary.
3. Key highlights (bullet points).
4. Actionable tasks with title, description, and priority (LOW, MEDIUM, HIGH, URGENT).

Strictly output JSON following this schema:
{
  "shortSummary": "string",
  "detailedSummary": "string",
  "highlights": ["string"],
  "tasks": [
    { "title": "string", "description": "string", "priority": "MEDIUM" }
  ]
}

Text to analyze:
${content}
`;

        try {
            // Get model instance
            const model = this.client.getGenerativeModel({
                model: this.model,
                generationConfig: {
                    responseMimeType: 'application/json',
                },
            });

            // Generate content
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            if (!text) {
                throw new AppError('Gemini returned empty response', 502);
            }

            const parsed = JSON.parse(text);
            return AiOutputSchema.parse(parsed);

        } catch (error: any) {
            if (error instanceof AppError) throw error;
            if (error instanceof SyntaxError) throw new AppError('Invalid JSON from Gemini', 502);

            // SDK specific error handling or generic fallback
            throw new AppError(`Gemini Client Error: ${error.message || 'Unknown error'}`, 500);
        }
    }
}
