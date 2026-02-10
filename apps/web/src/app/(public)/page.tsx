"use client";

import { Button } from '@/components/ui/Button';
import { RunAiSection } from '@/features/ai/components/RunAiSection';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const LandingPage = () => {
    const { isAuthenticated } = useAuthStore();
    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 px-8 flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                    Turn Chaos into <br />
                    <span className="gradient-text">Clarity</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    The AI-powered summarizer that extracts actionable tasks from your messy transcripts and notes.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
                        <Button size="lg" className="h-12 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20">
                            Get Started Free
                        </Button>
                    </Link>
                    <Link href="#demo">
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-2 hover:bg-muted/50">
                            See How It Works
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Input Section (Demo) */}
            <section id="demo" className="w-full px-4 md:px-8 pb-24">
                <div className="max-w-4xl mx-auto">
                    <RunAiSection mode="guest" />
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-muted/30 py-24 px-8 border-t border-border/50">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">AI Summaries</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Instantly condense hour-long meetings into concise, readable summaries.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Task Extraction</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Automatically detect action items, assignees, and deadlines from text.
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-2xl space-y-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Secure & Private</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Your data is processed securely and never trained on without permission.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
