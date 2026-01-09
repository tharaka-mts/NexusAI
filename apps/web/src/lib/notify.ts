import { toast } from 'sonner';

export const notify = {
    success: (message: string) => toast.success(message),
    error: (message: string, error?: any) => {
        console.error(error);
        toast.error(message);
    },
    info: (message: string) => toast.info(message),
    promise: <T>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error: string },
    ) => toast.promise(promise, messages),
};
