import { prisma } from '@/config/prisma';
import { CreateDocumentInput } from './documents.types';

export const documentsRepository = {
    async create(userId: string, input: CreateDocumentInput, contentHash: string) {
        return prisma.document.create({
            data: {
                userId,
                content: input.content,
                title: input.title,
                sourceType: input.sourceType,
                contentHash,
                guestSessionId: null, // Explicitly null for user documents
            },
        });
    },

    async listByUser(userId: string) {
        return prisma.document.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    },

    async countByUser(userId: string) {
        return prisma.document.count({
            where: { userId },
        });
    },

    async findByIdAndUser(id: string, userId: string) {
        return prisma.document.findFirst({
            where: { id, userId },
            include: {
                // Latest summary
                summaries: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                // All tasks
                tasks: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    },
};
