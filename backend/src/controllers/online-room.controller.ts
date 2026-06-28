import type { Request, Response } from 'express';
import { findOnlineRoomByCode } from '../online/room-registry.js';

export function getOnlineRoomByCode(req: Request, res: Response) {
  const room = findOnlineRoomByCode(req.params.roomCode);

  if (!room) {
    res.status(404).json({
      error: 'Not Found',
      message: 'Online room does not exist or is no longer available'
    });
    return;
  }

  res.status(200).json({ room });
}
