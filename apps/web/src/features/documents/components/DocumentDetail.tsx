import Link from "next/link";
import { ArrowLeft, Calendar, FileText, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDocument } from "../hooks/useDocument";
import { safeFormatDate } from "@/lib/date";

interface DocumentDetailProps {
    id: string;
}

export const DocumentDetail = ({ id }: DocumentDetailProps) => {
    const { data, isLoading, isError, error } = useDocument(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <div className="rounded-full bg-muted p-4">
                    <Info className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Document not found</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        {(error as Error)?.message || "We couldn't find the document you're looking for."}
                    </p>
                </div>
                <Link href="/documents">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Documents
                    </Button>
                </Link>
            </div>
        );
    }

    const { document: doc, latestSummary, tasks } = data;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-6">
                <div className="space-y-1">
                    <Link
                        href="/documents"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-2 w-fit"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back to list
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {doc.title || "Untitled Document"}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {safeFormatDate(doc.createdAt, "MMMM d, yyyy 'at' h:mm a")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content & Summary */}
                <div className="lg:col-span-2 space-y-8">
                    {/* AI Summary Section */}
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b bg-muted/30 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold text-sm">AI</span>
                            </div>
                            <h2 className="font-semibold">Executive Summary</h2>
                        </div>
                        <div className="p-6">
                            {latestSummary ? (
                                <div className="space-y-4">
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                        <p className="font-medium text-foreground">Summary</p>
                                        {latestSummary.shortSummary}
                                    </div>
                                    {latestSummary.detailedSummary && (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed border-t pt-4">
                                            <p className="font-medium text-foreground">Detailed Analysis</p>
                                            {latestSummary.detailedSummary}
                                        </div>
                                    )}
                                    {latestSummary.highlights && latestSummary.highlights.length > 0 && (
                                        <div className="space-y-2 border-t pt-4">
                                            <p className="text-sm font-medium text-foreground">Key Highlights</p>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                                {latestSummary.highlights.map((h, i) => (
                                                    <li key={i}>{h}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                    <p className="text-sm">No summary available.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Original Content Section */}
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="px-6 py-4 border-b bg-muted/30 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <h2 className="font-semibold">Original Content</h2>
                        </div>
                        <div className="p-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                {doc.content || 'No content.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Tasks/Actions */}
                <div className="space-y-6">
                    <div className="rounded-xl border bg-card shadow-sm h-fit sticky top-24">
                        <div className="px-6 py-4 border-b bg-muted/30">
                            <h2 className="font-semibold">Extracted Tasks</h2>
                        </div>
                        <div className="p-6">
                            {tasks && tasks.length > 0 ? (
                                <ul className="space-y-2">
                                    {tasks.map((task: any) => (
                                        <li key={task.id} className="flex gap-2 text-sm text-foreground">
                                            <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${task.status === 'DONE' ? 'text-green-500' : 'text-muted-foreground'}`} />
                                            <div className="flex flex-col">
                                                <span className={task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
                                                {task.description && <span className="text-xs text-muted-foreground/70">{task.description}</span>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground/60 text-sm">
                                    <Info className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p>No tasks found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
