import { useQuery } from '@tanstack/react-query';
import { fetchDocumentStats } from '../api/documents.api';

export const useDocumentStats = () =>
  useQuery({
    queryKey: ['documents', 'stats'],
    queryFn: fetchDocumentStats,
  });
