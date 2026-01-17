import { apiFetch } from '@/lib/apiClient';
import {
    documentsListResponseSchema,
    documentDetailResponseSchema
} from '../schemas/documents.schemas';
import type { DocumentListItem, DocumentDetail } from '../types/documents.types';

export const fetchDocuments = async (): Promise<DocumentListItem[]> => {
    const response = await apiFetch<unknown>('/documents');

    // Zod Parse
    const result = documentsListResponseSchema.safeParse(response);

    if (!result.success) {
        console.error('Documents API Validation Error:', result.error);
        throw new Error('Invalid response from server');
    }

    return result.data.data;
};

export const fetchDocument = async (id: string): Promise<DocumentDetail> => {
    const response = await apiFetch<unknown>(`/documents/${id}`);

    // Zod Parse
    const result = documentDetailResponseSchema.safeParse(response);

    if (!result.success) {
        console.error('Document Detail API Validation Error:', result.error);
        throw new Error('Invalid response from server');
    }

    return result.data.data;
};
