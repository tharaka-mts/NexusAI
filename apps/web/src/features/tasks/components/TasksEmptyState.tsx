import { ClipboardList } from 'lucide-react';

export const TasksEmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-muted-foreground/25 bg-muted/50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                There are no tasks matching your current filters.
            </p>
        </div>
    );
};
