import { User } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreateUserInput } from './auth.types';

export const authRepository = {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    },

    async findByUsername(username: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { username },
        });
    },

    async findByGoogleId(googleId: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { googleId },
        });
    },

    async createUser(input: CreateUserInput & { googleId?: string; name?: string }): Promise<User> {
        return prisma.user.create({
            data: {
                username: input.username,
                email: input.email,
                passwordHash: input.passwordHash,
                googleId: input.googleId,
                name: input.name,
            },
        });
    },

    async updateGoogleId(id: string, googleId: string): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: { googleId },
        });
    },
};
