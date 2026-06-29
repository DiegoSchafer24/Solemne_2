import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, verifyUser } from '../services/auth.service.js';
import type { RegisterInput, LoginInput, VerifyInput } from '../schemas/auth.schema.js';

export async function registerUserHandler(
  req: Request<object, object, RegisterInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function loginUserHandler(
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyUserHandler(
  req: Request<object, object, VerifyInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await verifyUser(req.body.email, req.body.verificationCode);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}