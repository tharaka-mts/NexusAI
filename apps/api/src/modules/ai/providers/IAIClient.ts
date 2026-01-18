import { AiOutput } from '../ai.output.schema';

export interface IAIClient {
    generateSummaryAndTasks(content: string): Promise<AiOutput>;
}
