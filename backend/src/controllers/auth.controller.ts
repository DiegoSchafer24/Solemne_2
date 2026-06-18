import type { NextFunction, Request, Response } from 'express';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';
import { loginUser, registerUser } from '../services/auth.service.js';
import type { AuthenticatedRequest } from '../types/auth.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const result = await registerUser(input);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  res.status(200).json({
    user: req.user
  });
}
