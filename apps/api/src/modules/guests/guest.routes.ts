import { Router } from 'express';
import { guestsService } from './guests.service';
import { guestLimitMiddleware } from '../../middlewares/guestLimit.middleware';

const router = Router();

// Guest Verification Route (TEMP / DEV ONLY)
router.post('/check', guestLimitMiddleware, async (req, res, next) => {
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

export const guestRoutes = router;
