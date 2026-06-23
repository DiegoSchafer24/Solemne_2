import { Schema, model, type Types } from 'mongoose';

export interface ControlSettings {
  moveUp: string;
  moveDown: string;
  moveLeft: string;
  moveRight: string;
  pickUpWeapon: string;
  dropWeapon: string;
  shoot: string;
}

export interface PlayerSettingsDocument {
  userId: Types.ObjectId;
  controls: ControlSettings;
  createdAt: Date;
  updatedAt: Date;
}

export const defaultControls: ControlSettings = {
  moveUp: 'W',
  moveDown: 'S',
  moveLeft: 'A',
  moveRight: 'D',
  pickUpWeapon: 'E',
  dropWeapon: 'Q',
  shoot: 'SPACE'
};

const controlsSchema = new Schema<ControlSettings>(
  {
    moveUp: { type: String, required: true, trim: true, default: defaultControls.moveUp },
    moveDown: { type: String, required: true, trim: true, default: defaultControls.moveDown },
    moveLeft: { type: String, required: true, trim: true, default: defaultControls.moveLeft },
    moveRight: { type: String, required: true, trim: true, default: defaultControls.moveRight },
    pickUpWeapon: { type: String, required: true, trim: true, default: defaultControls.pickUpWeapon },
    dropWeapon: { type: String, required: true, trim: true, default: defaultControls.dropWeapon },
    shoot: { type: String, required: true, trim: true, default: defaultControls.shoot }
  },
  {
    _id: false
  }
);

const playerSettingsSchema = new Schema<PlayerSettingsDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    controls: {
      type: controlsSchema,
      required: true,
      default: defaultControls
    }
  },
  {
    timestamps: true
  }
);

export const PlayerSettings = model<PlayerSettingsDocument>('PlayerSettings', playerSettingsSchema);
