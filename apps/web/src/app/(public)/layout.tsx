import { NavBar } from '@/features/layout/components';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen">
            <NavBar />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}

export default PublicLayout;
