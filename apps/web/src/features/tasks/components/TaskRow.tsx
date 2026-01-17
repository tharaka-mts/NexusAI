import { Trash2, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { safeFormatDate } from "@/lib/date";
import type { Task } from "../types/tasks.types";
import { cn } from "@/lib/utils"; // Assuming utils exists

interface TaskRowProps {
    task: Task;
    onToggleStatus: (task: Task) => void;
    onDelete: (id: string) => void;
    isUpdating?: boolean;
    isDeleting?: boolean;
}

export const TaskRow = ({ task, onToggleStatus, onDelete, isUpdating, isDeleting }: TaskRowProps) => {
    const isCompleted = task.status === 'DONE';

    return (
        <div className={cn(
            "group flex items-center justify-between p-4 rounded-lg border bg-card transition-all hover:shadow-sm",
            isCompleted && "bg-muted/30"
        )}>
            <div className="flex items-start gap-3 overflow-hidden">
                <button
                    onClick={() => onToggleStatus(task)}
                    disabled={isUpdating}
                    className="mt-1 shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                    {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <Circle className="h-5 w-5" />
                    )}
                </button>

                <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className={cn(
                            "text-sm font-medium leading-none truncate",
                            isCompleted && "text-muted-foreground line-through"
                        )}>
                            {task.title || "Untitled Task"}
                        </h4>
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-full text-[10px] uppercase font-bold border",
                            task.priority === 'HIGH' ? "border-red-200 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                task.priority === 'MEDIUM' ? "border-yellow-200 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                    "border-blue-200 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        )}>
                            {task.priority || 'MEDIUM'}
                        </span>
                    </div>

                    {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                        {task.dueDate && (
                            <span className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Due {safeFormatDate(task.dueDate)}
                            </span>
                        )}
                        {task.createdAt && (
                            <span>Created {safeFormatDate(task.createdAt)}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this task?')) {
                            onDelete(task.id);
                        }
                    }}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </div>
        </div>
    );
};
