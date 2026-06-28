import { Server } from 'colyseus';
import { OnlineRoom } from './rooms/OnlineRoom.js';

export function createGameServer() {
  const gameServer = new Server();

  gameServer.define('online_room', OnlineRoom);

  return gameServer;
}
