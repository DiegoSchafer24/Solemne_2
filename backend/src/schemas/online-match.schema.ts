import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid MongoDB ObjectId');

export const createOnlineMatchSchema = z.object({
  roomCode: z.string().trim().min(4).max(12).toUpperCase(),
  players: z.array(z.object({
    userId: objectIdSchema,
    username: z.string().trim().min(3).max(24),
    slot: z.union([z.literal(1), z.literal(2)])
  })).length(2),
  winnerUserId: objectIdSchema,
  winnerSlot: z.union([z.literal(1), z.literal(2)]),
  durationSeconds: z.number().int().min(0)
});

export type CreateOnlineMatchInput = z.infer<typeof createOnlineMatchSchema>;
