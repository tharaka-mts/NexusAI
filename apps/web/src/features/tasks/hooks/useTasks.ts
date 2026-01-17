import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/tasks.api';
import type { TasksListParams } from '../types/tasks.types';

export const useTasks = (params: TasksListParams) => {
    return useQuery({
        queryKey: ['tasks', params],
        queryFn: () => fetchTasks(params),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });
};
