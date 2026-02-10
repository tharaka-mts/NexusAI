"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore';
import { getCurrentUser } from './api/auth.api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { setUser, isInitialized, isAuthenticated } = useAuthStore();

    const isAuthPage = pathname === '/signin' || pathname === '/signup';
    const isProtected =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/tasks') ||
        pathname?.startsWith('/documents');

    const { data, isSuccess, isError } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: getCurrentUser,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        enabled: !isInitialized,
    });

    useEffect(() => {
        if (isInitialized) {
            return;
        }

        if (isSuccess) {
            setUser(data?.data ?? null);
        } else if (isError) {
            setUser(null);
        }
    }, [isInitialized, isSuccess, isError, data, setUser]);

    useEffect(() => {
        if (!isInitialized) {
            return;
        }

        if (isProtected && !isAuthenticated) {
            router.replace('/signin');
            return;
        }

        if (isAuthPage && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isInitialized, isProtected, isAuthPage, isAuthenticated, router]);

    return <>{children}</>;
};
