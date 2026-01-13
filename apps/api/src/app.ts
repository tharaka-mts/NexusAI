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

const app: Express = express();


// Middlewares
app.use(requestId); // Request ID first
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
import { ensureGuestSession } from './middlewares/ensureGuestSession.middleware';
import { guestLimitMiddleware } from './middlewares/guestLimit.middleware';
import { guestsService } from './modules/guests/guests.service';

// ... middlewares ...
app.use(cookieParser());
app.use(ensureGuestSession); // Apply globally for MVP
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ... (rate limit, morgan, health check) ...

// Guest Verification Route (TEMP)
app.post('/check-guest', guestLimitMiddleware, async (req, res, next) => {
  try {
    const guestId = (req as any).guestId;
    // Simulate usage if requested via body flag, or just check allow status
    // For testing "mark used", we can look for a query param or body
    if (req.query.simulate === 'true') {
      await guestsService.markFreeRunUsed(guestId, 'test-run-id-' + Date.now());
      return res.json({ ok: true, message: 'Marked as used', guestId });
    }

    res.json({ ok: true, allowed: true, guestId });
  } catch (err) {
    next(err);
  }
});

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

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date(), env: env.NODE_ENV, requestId: req.requestId });
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


// Error Handler
app.use(errorHandler);

export { app };
