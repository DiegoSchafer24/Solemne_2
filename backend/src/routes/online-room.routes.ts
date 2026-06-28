import { Router } from 'express';
import { getOnlineRoomByCode } from '../controllers/online-room.controller.js';

const router = Router();

router.get('/:roomCode', getOnlineRoomByCode);

export default router;
