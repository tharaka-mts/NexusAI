
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface TasksToolbarProps {
    status: string;
    priority: string;
    onStatusChange: (val: string) => void;
    onPriorityChange: (val: string) => void;
    onReset: () => void;
}

export const TasksToolbar = ({
    status,
    priority,
    onStatusChange,
    onPriorityChange,
    onReset
}: TasksToolbarProps) => {
    return (
        <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="w-[180px]">
                {/* Simplified Select for now, assuming Shadcn Select is available. 
                    If not, I might need to check components/ui.
                */}
                <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={status || ""}
                    onChange={(e) => onStatusChange(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                    <option value="BLOCKED">Blocked</option>
                </select>
            </div>

            <div className="w-[180px]">
                <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={priority || ""}
                    onChange={(e) => onPriorityChange(e.target.value)}
                >
                    <option value="">All Priorities</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                </select>
            </div>

            {(status || priority) && (
                <Button variant="ghost" size="sm" onClick={onReset} className="h-10 px-3">
                    <X className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            )}
        </div>
    );
};
