import { z } from 'zod';

const keySchema = z.string().trim().min(1).max(24).toUpperCase();

export const updateSettingsSchema = z.object({
  controls: z.object({
    moveUp: keySchema.optional(),
    moveDown: keySchema.optional(),
    moveLeft: keySchema.optional(),
    moveRight: keySchema.optional(),
    pickUpWeapon: keySchema.optional(),
    dropWeapon: keySchema.optional(),
    shoot: keySchema.optional()
  }).optional()
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
