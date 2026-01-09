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
    // Add more as needed
});

export const env = envSchema.parse(process.env);
