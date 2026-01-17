import { useQuery } from '@tanstack/react-query';
import { fetchDocuments } from '../api/documents.api';

export const useDocuments = () => {
    return useQuery({
        queryKey: ['documents'],
        queryFn: fetchDocuments,
    });
};
