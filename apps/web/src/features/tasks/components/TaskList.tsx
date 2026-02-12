import { useState } from "react";
import { Task, UpdateTaskInput } from "../types/tasks.types";
import { TaskRow } from "./TaskRow";
import { TasksEmptyState } from "./TasksEmptyState";
import { Loader2 } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "../hooks/useTaskMutations";
import { TaskEditForm } from "./TaskEditForm";

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
}

export const TaskList = ({ tasks, isLoading }: TaskListProps) => {
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

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

    const handleEditSave = (id: string, data: UpdateTaskInput) => {
        updateTaskMutation.mutate(
            { id, data },
            {
                onSuccess: () => {
                    setEditingTaskId(null);
                },
            }
        );
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
                <div key={task.id}>
                    <TaskRow
                        task={task}
                        onToggleStatus={handleToggleStatus}
                        onEdit={() => setEditingTaskId(task.id)}
                        onDelete={handleDelete}
                        isUpdating={updateTaskMutation.isPending}
                        isDeleting={deleteTaskMutation.isPending}
                    />
                    {editingTaskId === task.id && (
                        <TaskEditForm
                            task={task}
                            isSaving={updateTaskMutation.isPending}
                            onCancel={() => setEditingTaskId(null)}
                            onSave={(data) => handleEditSave(task.id, data)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
