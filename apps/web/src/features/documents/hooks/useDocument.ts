import { useQuery } from '@tanstack/react-query';
import { fetchDocument } from '../api/documents.api';

export const useDocument = (id: string) => {
    return useQuery({
        queryKey: ['documents', id],
        queryFn: () => fetchDocument(id),
        enabled: !!id,
    });
};
