import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask } from '../api/tasks.api';
import { toast } from 'sonner';

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task updated');
        },
        onError: (error) => {
            toast.error(`Failed to update task: ${(error as Error).message}`);
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task deleted');
        },
        onError: (error) => {
            toast.error(`Failed to delete task: ${(error as Error).message}`);
        },
    });
};
