"use client";

import Link from 'next/link';
import { LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserMenu = () => {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20">
                    <span className="sr-only">Open user menu</span>
                    <div className="flex h-full w-full items-center justify-center text-primary font-bold text-lg">
                        {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.username || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || 'No email'}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
