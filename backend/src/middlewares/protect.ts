import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../services/auth.service.js';
import { HttpError } from '../utils/http-error.js';

export interface RequestWithUser extends Request {
  userId?: string;
}

export function protect(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError(401, 'No autorizado, no hay token'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { sub: string };
    req.userId = decoded.sub;
    next();
  } catch (error) {
    return next(new HttpError(401, 'No autorizado, token invalido'));
  }
}