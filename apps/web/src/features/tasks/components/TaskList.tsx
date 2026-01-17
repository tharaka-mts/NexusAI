import { Task } from "../types/tasks.types";
import { TaskRow } from "./TaskRow";
import { TasksEmptyState } from "./TasksEmptyState";
import { Loader2 } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "../hooks/useTaskMutations";

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
}

export const TaskList = ({ tasks, isLoading }: TaskListProps) => {
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();

    const handleToggleStatus = (task: Task) => {
        const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
        const completedAt = newStatus === 'DONE' ? new Date().toISOString() : null;

        updateTaskMutation.mutate({
            id: task.id,
            data: { status: newStatus, completedAt }
        });
    };

    const handleDelete = (id: string) => {
        deleteTaskMutation.mutate(id);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return <TasksEmptyState />;
    }

    return (
        <div className="space-y-3">
            {/* Pending mutations indicator could go here */}
            {tasks.map((task) => (
                <TaskRow
                    key={task.id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                    isUpdating={updateTaskMutation.isPending} // Naive, disables all rows during any update. Can refine by tracking ID if needed.
                    isDeleting={deleteTaskMutation.isPending}
                />
            ))}
        </div>
    );
};
