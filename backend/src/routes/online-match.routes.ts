import { Router } from 'express';
import {
  createOnlineMatchController,
  getMyOnlineMatches,
  getMyOnlineStats
} from '../controllers/online-match.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, createOnlineMatchController);
router.get('/me', requireAuth, getMyOnlineMatches);
router.get('/stats/me', requireAuth, getMyOnlineStats);

export default router;
