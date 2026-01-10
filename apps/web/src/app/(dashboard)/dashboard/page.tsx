import TranscriptInput from '@/components/common/TranscriptInput';
import { FileText, CheckSquare, Activity } from 'lucide-react';

const DashboardPage = () => {
    return (
        <div className="space-y-10 max-w-6xl mx-auto">

            {/* Welcome & Quick Action */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground mt-2">
                        Welcome back. ready to summarize your next conversation?
                    </p>
                </div>

                {/* Quick Summarize Widget */}
                <div className="pt-2">
                    <h3 className="text-lg font-semibold mb-4 text-foreground/90">Quick Summarize</h3>
                    <TranscriptInput />
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards */}
                <div className="glass-card p-6 rounded-xl border border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Documents</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl border border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                            <CheckSquare className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Open Tasks</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl border border-border/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Usage</p>
                            <p className="text-2xl font-bold">0/1</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardPage;