import type { Response, NextFunction } from 'express';
import { updateSettingsSchema } from '../schemas/settings.schema.js';
import { getOrCreateSettings, updateSettings } from '../services/settings.service.js';
import type { AuthenticatedRequest } from '../types/auth.js';
import { HttpError } from '../utils/http-error.js';

function getAuthenticatedUserId(req: AuthenticatedRequest) {
  if (!req.user?.id) {
    throw new HttpError(401, 'Authenticated user is required');
  }

  return req.user.id;
}

export async function getMySettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const settings = await getOrCreateSettings(getAuthenticatedUserId(req));
    res.status(200).json({ settings });
  } catch (error) {
    next(error);
  }
}

export async function updateMySettings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = updateSettingsSchema.parse(req.body);
    const settings = await updateSettings(getAuthenticatedUserId(req), input);

    res.status(200).json({ settings });
  } catch (error) {
    next(error);
  }
}
