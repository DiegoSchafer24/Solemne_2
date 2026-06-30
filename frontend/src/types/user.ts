import type { PlayerControls } from '../game/scenes/controlState';

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  onlineControls?: PlayerControls;
  countryCode?: string;
}