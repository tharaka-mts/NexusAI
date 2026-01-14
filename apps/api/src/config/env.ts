import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or local
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('4000'),
    DATABASE_URL: z.string(),
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
    REDIS_URL: z.string().default('redis://localhost:6379'),
    COOKIE_SECURE: z.string().transform((v) => v === 'true').default('false'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    AUTH_COOKIE_NAME: z.string().default('nexus_auth'),
});

export const env = envSchema.parse(process.env);
