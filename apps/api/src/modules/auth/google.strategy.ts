import { VerifyCallback } from 'passport-google-oauth20';
import { authRepository } from './auth.repository';
import { v4 as uuidv4 } from 'uuid';

export const googleStrategyVerify = async (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
) => {
    try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
        }

        // 1. Find by googleId
        let user = await authRepository.findByGoogleId(googleId);

        if (user) {
            return done(null, user);
        }

        // 2. Find by email (to link account if it exists)
        user = await authRepository.findByEmail(email);

        if (user) {
            // Link googleId to existing user
            user = await authRepository.updateGoogleId(user.id, googleId);
            return done(null, user);
        }

        // 3. Create new user
        // Generate a safe username from email + random suffix
        const emailPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        const username = `${emailPrefix}_${uuidv4().substring(0, 4)}`;

        user = await authRepository.createUser({
            email,
            username,
            name,
            googleId,
            passwordHash: null,
        });

        return done(null, user);
    } catch (err) {
        return done(err as Error, undefined);
    }
};
