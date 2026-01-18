import { IAIClient } from './IAIClient';
import { AiOutput } from '../ai.output.schema';

export class MockAIClient implements IAIClient {
    async generateSummaryAndTasks(input: string): Promise<AiOutput> {
        // Simulate latency
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
            shortSummary: `[MOCK] Short summary (len ${input.length})`,
            detailedSummary: `[MOCK] Detailed summary of the content. The input text had ${input.length} characters. This is a simulation.`,
            highlights: ['[MOCK] Highlight 1', '[MOCK] Highlight 2'],
            tasks: [
                { title: '[MOCK] Task 1', description: 'Description 1', priority: 'HIGH' },
                { title: '[MOCK] Task 2', description: 'Description 2', priority: 'MEDIUM' },
            ]
        };
    }
}
