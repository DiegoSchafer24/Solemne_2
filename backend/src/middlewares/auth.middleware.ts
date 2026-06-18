import jwt from 'jsonwebtoken';
import type { NextFunction, Response } from 'express';
import { getJwtSecret, getUserById } from '../services/auth.service.js';
import type { AuthenticatedRequest } from '../types/auth.js';
import { HttpError } from '../utils/http-error.js';

interface JwtPayload {
  sub?: string;
}

export async function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new HttpError(401, 'Authorization token is required');
    }

    const token = authHeader.slice('Bearer '.length);
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

    if (!payload.sub) {
      throw new HttpError(401, 'Invalid token');
    }

    req.user = await getUserById(payload.sub);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      next(new HttpError(401, 'Invalid or expired token'));
      return;
    }

    next(error);
  }
}
