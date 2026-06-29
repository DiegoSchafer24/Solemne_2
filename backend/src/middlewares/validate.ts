import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { HttpError } from '../utils/http-error.js';

export function validate(schema: z.ZodType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new HttpError(400, error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')));
      }
      return next(new HttpError(500, 'Error interno del servidor'));
    }
  };
}