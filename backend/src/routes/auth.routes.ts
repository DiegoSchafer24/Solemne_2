import { Router } from 'express';
import { loginUser, registerUser, updateOnlineControls, verifyUser } from '../services/auth.service.js';
import { loginSchema, registerSchema, verifySchema } from '../schemas/auth.schema.js';
import { validate } from '../middlewares/validate.js';
import { protect, type RequestWithUser } from '../middlewares/protect.js';
import { HttpError } from '../utils/http-error.js';

const router = Router();

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/verify', validate(verifySchema), async (req, res, next) => {
  try {
    const result = await verifyUser(req.body.email, req.body.verificationCode);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.put('/controls', protect, async (req: RequestWithUser, res, next) => {
  if (!req.userId) return next(new HttpError(401, 'No autorizado'));
  await updateOnlineControls(req.userId, req.body).then(r => res.json(r)).catch(next);
});

export default router;