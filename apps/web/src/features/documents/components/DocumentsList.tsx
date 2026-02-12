import { useState } from "react";
import { Plus, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DocumentCard } from "./DocumentCard";
import { useDocuments } from "../hooks/useDocuments";
import { RunAiSection } from "@/features/ai/components/RunAiSection";

export const DocumentsList = () => {
    const [showComposer, setShowComposer] = useState(false);
    const { data: documents, isLoading, isError, error } = useDocuments();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
                <div className="rounded-full bg-destructive/10 p-4">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold cursor-default">Error loading documents</h3>
                    <p className="text-muted-foreground max-w-sm mt-2">
                        {(error as Error)?.message || "Something went wrong. Please try again later."}
                    </p>
                </div>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Documents
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and view your saved documents.
                    </p>
                </div>
                <Button
                    className="shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
                    onClick={() => setShowComposer((prev) => !prev)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {showComposer ? "Close Composer" : "New Document"}
                </Button>
            </div>

            {showComposer && (
                <section className="rounded-xl border border-border/50 bg-card p-6">
                    <h2 className="text-lg font-semibold mb-2">Create and Analyze Document</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Paste text below to generate summary and tasks. Your document will be saved automatically.
                    </p>
                    <RunAiSection mode="auth" />
                </section>
            )}

            {!documents || documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/50 p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No documents yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Get started by creating your first document to summarize.
                    </p>
                    <Button
                        className="mt-8"
                        variant="outline"
                        onClick={() => setShowComposer(true)}
                    >
                        Create Document
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                    ))}
                </div>
            )}
        </div>
    );
};
