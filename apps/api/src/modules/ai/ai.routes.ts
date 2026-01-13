import { Router } from 'express';
import { aiController } from './ai.controller';
import { validate } from '../../middlewares/validate.middleware';
import { aiRunSchema } from './ai.validators';
import { guestLimitMiddleware } from '../../middlewares/guestLimit.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Endpoint: POST /ai/runs
// 1. Validation
// 2. Auth check (if auth header present) -- handled by logic inside controller?
// Actually, we want to support BOTH auth and guest.
// We can use a "soft auth" middleware or just check req.user which might be set by global auth?
// We haven't set global auth middleware.
// Better: chain middlewares. 
//  - ensureGuestSession (Global in app.ts, so guestId is always there)
//  - attemptAuth (Try to decore user if token exists, but don't fail)
//  - guestLimitMiddleware (If no user, check guest limit)

// Since 'authMiddleware' throws error if invalid, we need a 'soft' version or logic in app.ts.
// BUT, the requirement is "Guest limit enforced".
// Let's rely on the client sending the cookie.
// If the user is logged in, they should send the auth cookie.
// 'authMiddleware' reads the cookie.
// We can make a wrapper to apply authMiddleware optionally.

// Simplified approach:
// The endpoint is public (guest allowed).
// We need to inspect the auth cookie manually or conditionally apply auth.
// Let's use a "maybeAuth" middleware.

// Actually, let's create a custom chain here or use a helper.
// Since we don't have a maybeAuth, checking `req.cookies` in controller is hacky.
// Let's make `auth.middleware` support `fail: false`? No, adhere to MVCS.
// Let's create 'attemptAuth' middleware inline or separate?
// Move attemptAuth to middlewares later if needed. For now, we reuse logic or just use `authMiddleware` inside a try/catch in a flexible middleware?
// Or: if `req.cookies[env.AUTH_COOKIE_NAME]` exists, run `authMiddleware`.
// If not, proceed as guest.

import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';

const attemptAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies[env.AUTH_COOKIE_NAME]) {
        return authMiddleware(req, res, next);
    }
    next();
};

router.post(
    '/runs',
    attemptAuth,       // 1. Try to set req.user
    guestLimitMiddleware, // 2. If no req.user, check guest limit
    validate(aiRunSchema), // 3. Validate body
    aiController.createRun // 4. Execute
);

export const aiRoutes = router;
