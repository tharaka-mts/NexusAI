import { create } from 'zustand';
import { apiFetch } from '@/lib/apiClient';

interface User {
    id: string;
    email: string;
    username?: string;
    googleId?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    isLoading: boolean;

    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    isLoading: true,

    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        isInitialized: true
    }),

    logout: async () => {
        set({ isLoading: true });
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true
            });
            window.location.href = '/';
        }
    },
}));
