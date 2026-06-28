import { Types } from 'mongoose';
import { OnlineMatch } from '../models/OnlineMatch.js';
import type { CreateOnlineMatchInput } from '../schemas/online-match.schema.js';

export function toOnlineMatchResponse(match: {
  _id: unknown;
  roomCode: string;
  players: Array<{ userId: unknown; username: string; slot: 1 | 2 }>;
  winnerUserId: unknown;
  winnerSlot: 1 | 2;
  durationSeconds: number;
  playedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(match._id),
    roomCode: match.roomCode,
    players: match.players.map((player) => ({
      userId: String(player.userId),
      username: player.username,
      slot: player.slot
    })),
    winnerUserId: String(match.winnerUserId),
    winnerSlot: match.winnerSlot,
    durationSeconds: match.durationSeconds,
    playedAt: match.playedAt,
    createdAt: match.createdAt,
    updatedAt: match.updatedAt
  };
}

export async function createOnlineMatch(input: CreateOnlineMatchInput) {
  const match = await OnlineMatch.create({
    roomCode: input.roomCode,
    players: input.players.map((player) => ({
      userId: new Types.ObjectId(player.userId),
      username: player.username,
      slot: player.slot
    })),
    winnerUserId: new Types.ObjectId(input.winnerUserId),
    winnerSlot: input.winnerSlot,
    durationSeconds: input.durationSeconds
  });

  return toOnlineMatchResponse(match);
}

export async function listOnlineMatchesForUser(userId: string) {
  const matches = await OnlineMatch.find({
    'players.userId': new Types.ObjectId(userId)
  }).sort({ playedAt: -1 });

  return matches.map(toOnlineMatchResponse);
}

export async function getOnlineStatsForUser(userId: string) {
  const objectUserId = new Types.ObjectId(userId);
  const matchesPlayed = await OnlineMatch.countDocuments({ 'players.userId': objectUserId });
  const wins = await OnlineMatch.countDocuments({ winnerUserId: objectUserId });
  const losses = Math.max(matchesPlayed - wins, 0);
  const winRate = matchesPlayed > 0 ? Number(((wins / matchesPlayed) * 100).toFixed(1)) : 0;

  return {
    matchesPlayed,
    wins,
    losses,
    winRate
  };
}
