import type { Request } from 'express';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
