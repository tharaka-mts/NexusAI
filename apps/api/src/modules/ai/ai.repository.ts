import { Prisma, AiProvider } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreateAiRunInput } from './ai.types';
import { AiOutput } from './ai.output.schema';

export const aiRepository = {
    async getDocumentById(id: string) {
        return prisma.document.findUnique({ where: { id } });
    },

    async createRun(
        input: CreateAiRunInput & { guestSessionId?: string },
        result: AiOutput,
        provider: string,
        cacheKey: string
    ) {
        return prisma.$transaction(async (tx) => {
            // 1. Create or Reuse Document
            let documentId = input.documentId;
            let documentTitle = input.title || 'AI Run Input';

            // Determine owner (for new docs)
            const ownerData = input.userId
                ? { userId: input.userId }
                : { guestSessionId: input.guestSessionId };

            if (!documentId) {
                const newDoc = await tx.document.create({
                    data: {
                        content: input.text,
                        contentHash: cacheKey.split(':').pop() || 'hash',
                        sourceType: 'PLAIN_TEXT',
                        title: documentTitle,
                        ...ownerData,
                    },
                });
                documentId = newDoc.id;
            }

            // 2. Map Provider to Enum
            let dbProvider: AiProvider = 'GEMINI';
            if (provider === 'OLLAMA') dbProvider = 'OLLAMA';
            if (provider === 'GEMINI') dbProvider = 'GEMINI';

            // 3. Create AI Run
            const run = await tx.aiRun.create({
                data: {
                    ...ownerData,
                    documentId: documentId!,
                    provider: dbProvider,
                    model: 'default',
                    status: 'SUCCEEDED',
                    cacheKey: cacheKey,
                    finishedAt: new Date(),
                    startedAt: new Date(),
                },
            });

            // 4. Create Summary
            const summary = await tx.summary.create({
                data: {
                    documentId: documentId!,
                    aiRunId: run.id,
                    shortSummary: result.shortSummary,
                    detailedSummary: result.detailedSummary,
                    highlights: result.highlights,
                },
            });

            // 5. Create Tasks (ONLY FOR AUTHENTICATED USERS)
            let createdTasks: any[] = [];
            if (input.userId && result.tasks.length > 0) {
                const tasksData: Prisma.TaskCreateManyInput[] = result.tasks.map((t) => ({
                    userId: input.userId!,
                    documentId: documentId,
                    aiRunId: run.id,
                    title: t.title,
                    description: t.description,
                    priority: t.priority || 'MEDIUM',
                    status: 'TODO',
                }));

                await tx.task.createMany({
                    data: tasksData,
                });

                createdTasks = await tx.task.findMany({
                    where: { aiRunId: run.id },
                });
            } else {
                // Return un-persisted objects
                createdTasks = result.tasks.map(t => ({
                    ...t,
                    status: 'TODO'
                }));
            }

            return {
                run,
                summary,
                tasks: createdTasks,
            };
        });
    },
};
