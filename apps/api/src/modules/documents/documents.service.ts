import { hashContent } from '@/shared/utils/hashContent';
import { documentsRepository } from './documents.repository';
import { CreateDocumentInput } from './documents.types';
import { AppError } from '@/shared/errors/AppError';

export const documentsService = {
    async createDocument(userId: string, input: CreateDocumentInput) {
        // Compute content hash server-side
        const contentHash = hashContent(input.content);

        // Persist
        const doc = await documentsRepository.create(userId, input, contentHash);
        return doc;
    },

    async listDocuments(userId: string) {
        return documentsRepository.listByUser(userId);
    },

    async getDocument(id: string, userId: string) {
        const doc = await documentsRepository.findByIdAndUser(id, userId);

        if (!doc || doc.userId !== userId) {
            // Document not found or belongs to another user
            throw new AppError('Document not found', 404);
        }

        // Shape the response
        const latestSummary = doc.summaries[0] || null;

        // Remove summaries array from the returned object to keep it cleaner? 
        // Or return as part of a shaped object as per requirements

        return {
            document: {
                id: doc.id,
                title: doc.title,
                content: doc.content,
                sourceType: doc.sourceType,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            },
            latestSummary,
            tasks: doc.tasks,
        };
    },
};
