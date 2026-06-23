import { Router } from 'express';
import { getMySettings, updateMySettings } from '../controllers/settings.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', requireAuth, getMySettings);
router.put('/me', requireAuth, updateMySettings);

export default router;
