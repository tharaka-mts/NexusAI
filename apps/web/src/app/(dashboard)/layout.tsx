export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 border-r bg-muted/20 p-4">
                <div className="font-bold text-lg mb-8">Nexus AI</div>
                <nav className="space-y-2">
                    <div className="px-3 py-2 bg-secondary rounded-md text-sm font-medium">Dashboard</div>
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Documents</div>
                    <div className="px-3 py-2 text-sm font-medium text-muted-foreground">Tasks</div>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
