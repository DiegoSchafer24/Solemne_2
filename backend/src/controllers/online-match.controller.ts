import type { NextFunction, Response } from 'express';
import { createOnlineMatchSchema } from '../schemas/online-match.schema.js';
import {
  createOnlineMatch,
  getOnlineStatsForUser,
  listOnlineMatchesForUser
} from '../services/online-match.service.js';
import type { AuthenticatedRequest } from '../types/auth.js';
import { HttpError } from '../utils/http-error.js';

function getAuthenticatedUserId(req: AuthenticatedRequest) {
  if (!req.user?.id) {
    throw new HttpError(401, 'Se requiere un usuario autentificado');
  }

  return req.user.id;
}

export async function createOnlineMatchController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const input = createOnlineMatchSchema.parse(req.body);
    const match = await createOnlineMatch(input);

    res.status(201).json({ match });
  } catch (error) {
    next(error);
  }
}

export async function getMyOnlineMatches(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const matches = await listOnlineMatchesForUser(getAuthenticatedUserId(req));
    res.status(200).json({ matches });
  } catch (error) {
    next(error);
  }
}

export async function getMyOnlineStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const stats = await getOnlineStatsForUser(getAuthenticatedUserId(req));
    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
}
