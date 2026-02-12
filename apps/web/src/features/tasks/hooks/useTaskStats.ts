import { useQuery } from '@tanstack/react-query';
import { fetchTaskStats } from '../api/tasks.api';

export const useTaskStats = () =>
  useQuery({
    queryKey: ['tasks', 'stats'],
    queryFn: fetchTaskStats,
  });
