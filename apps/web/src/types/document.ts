export interface Document {
    id: string;
    userId: string;
    title: string;
    content: string;
    summary?: string;
    status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    createdAt: string;
    updatedAt: string;
}

export interface CreateDocumentDto {
    title?: string;
    content: string;
}
