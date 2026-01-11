import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { logger } from './config/logger';

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date(), env: env.NODE_ENV });
});

// TODO: Routes
// DB connection check TEMP route
import { prisma } from './config/prisma';

app.get('/db-check', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});


// Error Handler Placeholder
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
});

export { app };
