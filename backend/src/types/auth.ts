import type { Request } from 'express';
import type { PlayerControls } from '../models/User.js';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  onlineControls?: PlayerControls;
  countryCode?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}