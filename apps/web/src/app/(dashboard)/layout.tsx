import NavBar from '@/components/ui/NavBar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="flex pt-16">
                <aside className="w-64 border-r border-border/50 bg-sidebar/50 backdrop-blur-sm p-4 min-h-[calc(100vh-4rem)] fixed">
                    <nav className="space-y-2 mt-4">
                        <div className="px-3 py-2 bg-sidebar-accent rounded-md text-sm font-medium text-sidebar-accent-foreground">
                            Dashboard
                        </div>
                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors cursor-pointer">
                            Documents
                        </div>
                        <div className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors cursor-pointer">
                            Tasks
                        </div>
                    </nav>
                </aside>
                <main className="flex-1 p-8 ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
