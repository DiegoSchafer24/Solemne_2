import jwt from 'jsonwebtoken';
import { Client, Room } from 'colyseus';
import { createOnlineMatch } from '../../services/online-match.service.js';
import { getJwtSecret, getUserById } from '../../services/auth.service.js';
import type { AuthUser } from '../../types/auth.js';
import { createRoomCode } from '../room-code.js';
import {
  registerOnlineRoom,
  unregisterOnlineRoom,
  updateOnlineRoomStatus
} from '../room-registry.js';

type RoomStatus = 'waiting' | 'playing' | 'finished';

interface PlayerState {
  sessionId: string;
  userId: string;
  username: string;
  slot: 1 | 2;
  connected: boolean;
}

interface OnlineRoomState {
  roomCode: string;
  status: RoomStatus;
  players: Record<string, PlayerState>;
}

interface JoinOptions {
  token?: string;
}

interface PlayerInputMessage {
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
  shoot?: boolean;
  pickUp?: boolean;
  drop?: boolean;
}

interface EndMatchMessage {
  winnerUserId: string;
  winnerSlot: 1 | 2;
  durationSeconds: number;
}

export class OnlineRoom extends Room {
  maxClients = 2;
  private roomState!: OnlineRoomState;

  onCreate() {
    const roomCode = createRoomCode();

    this.setMetadata({ roomCode });
    this.roomState = {
      roomCode,
      status: 'waiting',
      players: {}
    };
    registerOnlineRoom({
      roomCode,
      roomId: this.roomId,
      status: 'waiting'
    });

    this.onMessage('player:input', (client, message: PlayerInputMessage) => {
      this.broadcast('player:input', {
        sessionId: client.sessionId,
        input: message
      }, { except: client });
    });

    this.onMessage('match:end', async (_client, message: EndMatchMessage) => {
      if (this.roomState.status === 'finished') return;

      this.roomState.status = 'finished';
      updateOnlineRoomStatus(this.roomState.roomCode, 'finished');
      this.broadcast('match:ended', message);

      const players = Object.values(this.roomState.players);
      if (players.length !== 2) return;

      await createOnlineMatch({
        roomCode: this.roomState.roomCode,
        players: players.map((player) => ({
          userId: player.userId,
          username: player.username,
          slot: player.slot
        })),
        winnerUserId: message.winnerUserId,
        winnerSlot: message.winnerSlot,
        durationSeconds: message.durationSeconds
      });
    });
  }

  async onAuth(_client: Client, options: JoinOptions): Promise<AuthUser> {
    if (!options.token) {
      throw new Error('Authorization token is required');
    }

    const payload = jwt.verify(options.token, getJwtSecret());
    const userId = typeof payload === 'object' && 'sub' in payload ? payload.sub : undefined;

    if (typeof userId !== 'string') {
      throw new Error('Invalid token');
    }

    return getUserById(userId);
  }

  onJoin(client: Client, _options: JoinOptions, auth: AuthUser) {
    const slot = Object.keys(this.roomState.players).length === 0 ? 1 : 2;

    this.roomState.players[client.sessionId] = {
      sessionId: client.sessionId,
      userId: auth.id,
      username: auth.username,
      slot,
      connected: true
    };

    if (Object.keys(this.roomState.players).length === 2) {
      this.roomState.status = 'playing';
      updateOnlineRoomStatus(this.roomState.roomCode, 'playing');
    }

    this.broadcast('room:state', this.roomState);
  }

  onLeave(client: Client) {
    const player = this.roomState.players[client.sessionId];
    if (!player) return;

    player.connected = false;
    this.broadcast('player:left', player);
  }

  onDispose() {
    unregisterOnlineRoom(this.roomState.roomCode);
  }
}
