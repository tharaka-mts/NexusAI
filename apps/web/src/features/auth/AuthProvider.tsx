"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { apiFetch } from '@/lib/apiClient';

interface User {
    id: string;
    email: string;
    username?: string;
    googleId?: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { setUser, isInitialized, isAuthenticated } = useAuthStore();

    // Define protected routes that require auth checking
    const isProtected =
        pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/tasks') ||
        pathname?.startsWith('/documents');

    const { data, isError } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: () => apiFetch<{ data: User }>('/auth/me'),
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        // Only fetch if accessing protected route AND we aren't already known to be authenticated
        enabled: isProtected && !isAuthenticated,
    });

    useEffect(() => {
        // Case 1: Public Route
        if (!isProtected) {
            // If we land on a public route and haven't initialized, 
            // set user to null to stop the "Loading..." state.
            // We preserve existing user state if they navigated here from a protected route.
            if (!isInitialized) {
                setUser(null);
            }
            return;
        }

        // Case 2: Protected Route Query Success
        if (data?.data) {
            setUser(data.data);
        }

        // Case 3: Protected Route Query Error (401/Network)
        else if (isError) {
            // Query failed, so we are not authenticated.
            setUser(null);
        }
    }, [isProtected, isInitialized, data, isError, setUser]);

    return <>{children}</>;
};
