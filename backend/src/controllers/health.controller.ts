import type { Request, Response } from 'express';
import { getDatabaseStatus } from '../config/db.js';

export function getHealth(_req: Request, res: Response) {
  res.status(200).json({
    status: 'ok',
    service: 'shooter-backend'
  });
}

export function getDatabaseHealth(_req: Request, res: Response) {
  const databaseStatus = getDatabaseStatus();
  const isConnected = databaseStatus === 'connected';

  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'ok' : 'unavailable',
    database: databaseStatus
  });
}
