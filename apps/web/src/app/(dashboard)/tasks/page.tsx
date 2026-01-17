"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { TaskList } from "@/features/tasks/components/TaskList";
import { TasksToolbar } from "@/features/tasks/components/TasksToolbar";
import { Button } from "@/components/ui/Button";
import { CheckSquare, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/features/tasks/types/tasks.types";

const TasksPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Parse params
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = 10;

    const { data, isLoading, isError, error } = useTasks({
        status: status as TaskStatus | undefined,
        priority: priority as TaskPriority | undefined,
        page,
        pageSize
    });

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset to page 1 on filter change
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleReset = () => {
        router.replace(pathname);
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <div className="rounded-full bg-destructive/10 p-4">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold cursor-default">Error loading tasks</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        {(error as Error)?.message || "Something went wrong. Please try again later."}
                    </p>
                </div>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Tasks
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage your action items.
                    </p>
                </div>
                <div className="hidden sm:block">
                    <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                        <CheckSquare className="h-5 w-5 text-primary" />
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <TasksToolbar
                    status={status}
                    priority={priority}
                    onStatusChange={(val) => updateFilters('status', val)}
                    onPriorityChange={(val) => updateFilters('priority', val)}
                    onReset={handleReset}
                />

                <TaskList tasks={data?.items || []} isLoading={isLoading} />

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Page {data.page} of {data.totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= data.totalPages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TasksPage;
