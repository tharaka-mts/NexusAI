import { useMutation } from '@tanstack/react-query';
import { runAi } from '../api/ai.api';

export const useAiRun = () => {
    return useMutation({
        mutationFn: runAi,
        retry: false,
    });
};
