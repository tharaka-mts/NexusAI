import { prisma } from '../../config/prisma';
import { AiResult } from './providers/IAIClient';
import { CreateAiRunInput } from './ai.types';

export const aiRepository = {
    async createRun(input: CreateAiRunInput, result: AiResult, provider: 'MOCK', cacheKey: string) {
        return prisma.$transaction(async (tx) => {
            // 1. Create Document (Content snapshot)
            const document = await tx.document.create({
                data: {
                    content: input.text,
                    contentHash: cacheKey, // Using cacheKey as hash for simplicity
                    userId: input.userId,
                    guestSessionId: input.guestSessionId,
                    sourceType: 'PLAIN_TEXT',
                    title: 'AI Run Input',
                },
            });

            // 2. Create AI Run
            const run = await tx.aiRun.create({
                data: {
                    userId: input.userId,
                    guestSessionId: input.guestSessionId,
                    documentId: document.id,
                    provider: 'OLLAMA', // Using OLLAMA enum logic or MOCK if added. Schema has GEMINI, OLLAMA. Mapping MOCK to OLLAMA or adding to schema? schema is fixed. Let's use 'OLLAMA' as placeholder for Mock or 'GEMINI'. I'll use 'GEMINI' as default.
                    model: 'mock-model',
                    status: 'SUCCEEDED',
                    cacheKey: cacheKey,
                    promptTokens: result.usage?.promptTokens,
                    completionTokens: result.usage?.completionTokens,
                    totalTokens: result.usage?.totalTokens,
                    finishedAt: new Date(),
                    startedAt: new Date(),
                },
            });

            // 3. Create Summary
            const summary = await tx.summary.create({
                data: {
                    documentId: document.id,
                    aiRunId: run.id,
                    shortSummary: result.summary,
                },
            });

            // 4. Create Tasks (ONLY FOR AUTHENTICATED USERS)
            const tasksOpts = result.tasks.map((t) => ({
                userId: input.userId!, // only used if input.userId exists
                documentId: document.id,
                aiRunId: run.id,
                title: t,
                status: 'TODO' as const,
            }));

            let createdTasks: any[] = [];
            if (input.userId && tasksOpts.length > 0) {
                // CreateMany is faster
                await tx.task.createMany({
                    data: tasksOpts,
                });
                // Fetch them back to return
                createdTasks = await tx.task.findMany({
                    where: { aiRunId: run.id },
                });
            }

            // For guests, we return the task objects but don't save them.
            if (!input.userId) {
                createdTasks = result.tasks.map(t => ({ title: t, status: 'TODO' }));
            }

            return {
                run,
                summary,
                tasks: createdTasks,
            };
        });
    },
};
