import Link from 'next/link';
import { Button } from './Button';

const NavBar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                            N
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            NexusAI
                        </span>
                    </Link>

                    {/* Right side - Auth buttons */}
                    <div className="flex items-center gap-4">
                        <Link href="/signin">
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-medium">
                                Sign in
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-md border-0">
                                Sign up
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;