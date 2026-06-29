import { Schema, model, type Document } from 'mongoose';

export interface PlayerControls {
    up: number;
    down: number;
    left: number;
    right: number;
    shoot: number;
    interact: number;
}

const controlSchema = new Schema<PlayerControls>({
    up: { type: Number },
    down: { type: Number },
    left: { type: Number },
    right: { type: Number },
    shoot: { type: Number },
    interact: { type: Number },
}, { _id: false });

export interface UserDocument extends Document {
  username: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  onlineControls?: PlayerControls;
}

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    onlineControls: { type: controlSchema, required: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const User = model<UserDocument>('User', userSchema);