"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import NavBar from '@/components/ui/NavBar';
import Link from 'next/link';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isInitialized } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    const isDocumentPage = pathname.startsWith('/documents');
    const isTaskPage = pathname.startsWith('/tasks');
    const selectedStyle: string = "px-3 py-2 bg-sidebar-accent rounded-md text-sm font-medium text-sidebar-accent-foreground"
    const unselectedStyle: string = "px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors cursor-pointer"
    const selectedPage = isDocumentPage ? 'Documents' : isTaskPage ? 'Tasks' : 'Dashboard';

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.push('/signin');
        }
    }, [isInitialized, isAuthenticated, router]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen">
            <NavBar />
            <div className="flex pt-16">
                <aside className="w-64 border-r border-border/50 bg-sidebar/50 backdrop-blur-sm p-4 min-h-[calc(100vh-4rem)] fixed">
                    <nav className="space-y-2 mt-4">
                        <div className={selectedPage === 'Dashboard' ? selectedStyle : unselectedStyle}>
                            <Link href="/dashboard">Dashboard</Link>
                        </div>
                        <div className={selectedPage === 'Documents' ? selectedStyle : unselectedStyle}>
                            <Link href="/documents">Documents</Link>
                        </div>
                        <div className={selectedPage === 'Tasks' ? selectedStyle : unselectedStyle}>
                            <Link href="/tasks">Tasks</Link>
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
