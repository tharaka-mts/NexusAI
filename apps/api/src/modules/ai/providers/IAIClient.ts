export type AiResult = {
    summary: string;
    tasks: string[];
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
};

export interface IAIClient {
    summarizeAndExtract(input: string): Promise<AiResult>;
}
