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

    // AI Config
    AI_PROVIDER: z.enum(['GEMINI', 'OLLAMA', 'MOCK']).default('MOCK'),
    AI_MODEL: z.string().default('gemini-2.0-flash'),
    GEMINI_API_KEY: z.string().optional(),
    OLLAMA_BASE_URL: z.string().optional(),
    AI_TIMEOUT_MS: z.coerce.number().default(30000),
    AI_PROMPT_VERSION: z.string().default('v1'),

    // Google OAuth
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CALLBACK_URL: z.string().default('http://localhost:4000/auth/google/callback'),
    FRONTEND_URL: z.string().default('http://localhost:3000'),
});

// Refine validation for providers
const refinedEnv = envSchema.superRefine((data, ctx) => {
    if (data.AI_PROVIDER === 'GEMINI' && !data.GEMINI_API_KEY) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'GEMINI_API_KEY is required when AI_PROVIDER is GEMINI',
            path: ['GEMINI_API_KEY'],
        });
    }
    if (data.AI_PROVIDER === 'OLLAMA' && !data.OLLAMA_BASE_URL) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'OLLAMA_BASE_URL is required when AI_PROVIDER is OLLAMA',
            path: ['OLLAMA_BASE_URL'],
        });
    }
});

export const env = refinedEnv.parse(process.env);
