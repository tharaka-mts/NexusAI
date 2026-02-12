import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import type { Task, UpdateTaskInput } from '../types/tasks.types';

interface TaskEditFormProps {
  task: Task;
  isSaving?: boolean;
  onCancel: () => void;
  onSave: (input: UpdateTaskInput) => void;
}

const toInputDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const toIsoStartOfDay = (value: string) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return date.toISOString();
};

export const TaskEditForm = ({ task, isSaving, onCancel, onSave }: TaskEditFormProps) => {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<NonNullable<UpdateTaskInput['priority']>>(task.priority || 'MEDIUM');
  const [status, setStatus] = useState<NonNullable<UpdateTaskInput['status']>>(task.status || 'TODO');
  const [dueDate, setDueDate] = useState(toInputDate(task.dueDate));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    onSave({
      title: normalizedTitle,
      description: description.trim() || undefined,
      priority,
      status,
      dueDate: dueDate ? toIsoStartOfDay(dueDate) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-lg border bg-muted/30 p-4 space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        maxLength={140}
        required
      />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description (optional)"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as NonNullable<UpdateTaskInput['status']>)}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="BLOCKED">Blocked</option>
        </select>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value as NonNullable<UpdateTaskInput['priority']>)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
