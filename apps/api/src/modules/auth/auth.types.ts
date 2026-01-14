import { User } from '@prisma/client';

export type CreateUserInput = {
    username: string;
    email: string;
    passwordHash: string;
};

export type AuthResponse = {
    user: Omit<User, 'passwordHash'>;
    token: string;
};

export type SafeUser = Omit<User, 'passwordHash'>;
