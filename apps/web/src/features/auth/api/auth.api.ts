import { apiFetch } from '@/lib/apiClient';
import { AuthUser } from '../types/auth.types';

interface AuthPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends AuthPayload {
  username: string;
  confirmPassword?: string;
}

interface AuthResponse {
  data: AuthUser;
}

export const getCurrentUser = async (): Promise<AuthResponse> =>
  apiFetch<AuthResponse>('/auth/me');

export const login = async (payload: AuthPayload): Promise<AuthResponse> =>
  apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const register = async (payload: RegisterPayload): Promise<AuthResponse> =>
  apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const logout = async (): Promise<void> => {
  await apiFetch('/auth/logout', { method: 'POST' });
};
