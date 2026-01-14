import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { logger } from './config/logger';
import rateLimit from 'express-rate-limit'; // Import rateLimit
import { requestId } from './shared/utils/requestId'; // Import requestId
import { errorHandler } from './middlewares/error.middleware'; // Import errorHandler
import { routes } from './routes';
import { ensureGuestSession } from './middlewares/ensureGuestSession.middleware';

const app: Express = express();

// Middlewares
app.use(requestId); // Request ID first
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(ensureGuestSession); // Apply globally for MVP

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(limiter);

// Request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Routes
app.use(routes);

// Error Handler
app.use(errorHandler);

export { app };
