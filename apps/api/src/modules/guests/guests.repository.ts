import { prisma } from '../../config/prisma';
import { CreateGuestSessionInput, IGuestsRepository } from './guests.types';

export const guestsRepository: IGuestsRepository = {
    async findByGuestKey(guestKey) {
        return prisma.guestSession.findUnique({
            where: { guestKey },
        });
    },

    async create(input) {
        return prisma.guestSession.create({
            data: {
                guestKey: input.guestKey,
            },
        });
    },

    async markFreeRunUsed(guestSessionId, aiRunId) {
        await prisma.guestSession.update({
            where: { id: guestSessionId },
            data: {
                freeRunUsedAt: new Date(),
                freeRunAiRunId: aiRunId,
            },
        });
    },
};
