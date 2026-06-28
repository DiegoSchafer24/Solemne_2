import { Schema, model, type Types } from 'mongoose';

export interface OnlineMatchPlayer {
  userId: Types.ObjectId;
  username: string;
  slot: 1 | 2;
}

export interface OnlineMatchDocument {
  roomCode: string;
  players: OnlineMatchPlayer[];
  winnerUserId: Types.ObjectId;
  winnerSlot: 1 | 2;
  durationSeconds: number;
  playedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const onlineMatchPlayerSchema = new Schema<OnlineMatchPlayer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    slot: {
      type: Number,
      required: true,
      enum: [1, 2]
    }
  },
  {
    _id: false
  }
);

const onlineMatchSchema = new Schema<OnlineMatchDocument>(
  {
    roomCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true
    },
    players: {
      type: [onlineMatchPlayerSchema],
      required: true,
      validate: {
        validator(players: OnlineMatchPlayer[]) {
          return players.length === 2;
        },
        message: 'Online match must have exactly two players'
      }
    },
    winnerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    winnerSlot: {
      type: Number,
      required: true,
      enum: [1, 2]
    },
    durationSeconds: {
      type: Number,
      required: true,
      min: 0
    },
    playedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const OnlineMatch = model<OnlineMatchDocument>('OnlineMatch', onlineMatchSchema);
