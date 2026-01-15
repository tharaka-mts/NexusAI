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
    isLoading: boolean;

    setUser: (user: User | null) => void;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start loading to check auth on mount

    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const response = await apiFetch<{ data: User }>('/auth/me');
            set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            // 401 or network error -> not authenticated
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await apiFetch('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            // Always clear local state
            set({ user: null, isAuthenticated: false, isLoading: false });
            window.location.href = '/'; // Hard redirect to clear any in-memory states
        }
    },
}));
