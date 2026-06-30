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
    up: { type: Number, required: true },
    down: { type: Number, required: true },
    left: { type: Number, required: true },
    right: { type: Number, required: true },
    shoot: { type: Number, required: true },
    interact: { type: Number, required: true },
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
  countryCode?: string;
}

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    onlineControls: { type: controlSchema, required: false },
    countryCode: { type: String, required: false }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const User = model<UserDocument>('User', userSchema);