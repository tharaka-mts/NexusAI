import { create } from 'zustand';
import { logout as logoutRequest } from '../api/auth.api';
import { AuthUser } from '../types/auth.types';

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    isLoading: boolean;

    setUser: (user: AuthUser | null) => void;
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
            await logoutRequest();
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
