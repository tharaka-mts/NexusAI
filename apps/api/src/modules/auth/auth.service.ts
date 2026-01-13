import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { authRepository } from './auth.repository';
import { CreateUserInput, SafeUser } from './auth.types';
import { AppError } from '../../shared/errors/AppError';
import { z } from 'zod';
import { loginSchema, registerSchema } from './auth.validators';

const signToken = (user: SafeUser): string => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET as jwt.Secret, {
        expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
};

const filterUser = (user: any): SafeUser => {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
};

export const authService = {
    async register(input: z.infer<typeof registerSchema>['body']) {
        const existingEmail = await authRepository.findByEmail(input.email);
        if (existingEmail) {
            throw new AppError('Email already exists', 409);
        }

        const existingUsername = await authRepository.findByUsername(input.username);
        if (existingUsername) {
            throw new AppError('Username already exists', 409);
        }

        const passwordHash = await argon2.hash(input.password);

        const newUser = await authRepository.createUser({
            email: input.email,
            username: input.username,
            passwordHash,
        });

        const safeUser = filterUser(newUser);
        const token = signToken(safeUser);

        return { user: safeUser, token };
    },

    async login(input: z.infer<typeof loginSchema>['body']) {
        const user = await authRepository.findByEmail(input.email);
        if (!user || !user.passwordHash) {
            throw new AppError('Invalid email or password', 401);
        }

        const validPassword = await argon2.verify(user.passwordHash, input.password);
        if (!validPassword) {
            throw new AppError('Invalid email or password', 401);
        }

        const safeUser = filterUser(user);
        const token = signToken(safeUser);

        return { user: safeUser, token };
    },
};
