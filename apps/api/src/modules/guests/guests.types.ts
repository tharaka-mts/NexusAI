import { GuestSession } from '@prisma/client';

export type CreateGuestSessionInput = {
    guestKey: string;
};

export type IGuestsRepository = {
    findByGuestKey(guestKey: string): Promise<GuestSession | null>;
    create(input: CreateGuestSessionInput): Promise<GuestSession>;
    markFreeRunUsed(guestSessionId: string, aiRunId: string): Promise<void>;
};
