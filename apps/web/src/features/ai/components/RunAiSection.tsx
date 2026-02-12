"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import TranscriptInput from './TranscriptInput';
import { useAiRun } from '../hooks/useAiRun';
import { RunAiResponse } from '../schemas/ai.schemas';
import { ApiError } from '@/lib/apiClient';

interface RunAiSectionProps {
    mode: 'guest' | 'auth';
}

export const RunAiSection = ({ mode }: RunAiSectionProps) => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<RunAiResponse['data'] | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useAiRun();

    const handleGenerate = () => {
        if (text.trim().length < 10) {
            toast.error('Please enter at least 10 characters.');
            return;
        }

        mutate({ text }, {
            onSuccess: (data) => {
                if (mode === 'auth') {
                    // Auth flow: Redirect
                    toast.success('Document created. Opening details...');
                    queryClient.invalidateQueries({ queryKey: ['documents'] });
                    queryClient.invalidateQueries({ queryKey: ['documents', 'stats'] });
                    queryClient.invalidateQueries({ queryKey: ['tasks'] });
                    queryClient.invalidateQueries({ queryKey: ['tasks', 'stats'] });
                    router.push(`/documents/${data.data.run.documentId}`);
                } else {
                    // Guest flow: Show preview
                    setResult(data.data);
                    toast.success('Summary generated successfully!');
                }
            },
            onError: (error: unknown) => {
                const apiError = error instanceof ApiError ? error : null;
                // Check if it's a limit reached error
                if (
                    apiError?.code === 'LIMIT_REACHED' ||
                    apiError?.status === 403 ||
                    apiError?.status === 401
                ) {
                    toast.error("You reached the free limit. Please sign in to continue.", {
                        action: {
                            label: 'Sign Up',
                            onClick: () => router.push('/signup')
                        }
                    });
                } else {
                    toast.error(apiError?.message || 'Something went wrong. Please try again.');
                }
            }
        });
    };

    if (result && mode === 'guest') {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="glass-card p-8 rounded-2xl border border-primary/20 bg-primary/5">
                    <h3 className="text-2xl font-bold mb-4">Summary Preview</h3>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-lg leading-relaxed">{result.summary.shortSummary}</p>
                        {result.summary.detailedSummary && (
                            <div className="mt-4 pt-4 border-t border-border/50">
                                <p className="text-muted-foreground whitespace-pre-wrap">{result.summary.detailedSummary}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center p-8 glass-card rounded-xl border-dashed border-2 border-primary/30">
                    <h4 className="text-xl font-semibold mb-2">Want to see extracted tasks?</h4>
                    <p className="text-muted-foreground mb-6">Create a free account to unlock tasks, save your documents, and more.</p>
                    <button
                        onClick={() => router.push('/signup')}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        Create Free Account
                    </button>
                    <button
                        onClick={() => setResult(null)}
                        className="block mx-auto mt-4 text-sm text-muted-foreground hover:underline"
                    >
                        Generate another (if limit permits)
                    </button>
                </div>
            </div>
        );
    }

    return (
        <TranscriptInput
            value={text}
            onChange={setText}
            onGenerate={handleGenerate}
            isLoading={isPending}
            helperText={
                mode === 'guest'
                    ? 'Guest Access: 1 Free Run • No credit card required'
                    : undefined
            }
        />
    );
};
