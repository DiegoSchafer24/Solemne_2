import { Types } from 'mongoose';
import { PlayerSettings, defaultControls } from '../models/PlayerSettings.js';
import type { UpdateSettingsInput } from '../schemas/settings.schema.js';

function toSettingsResponse(settings: {
  _id: unknown;
  userId: unknown;
  controls: typeof defaultControls;
  createdAt: Date;
  updatedAt: Date;
}) {
  const controls = {
    moveUp: settings.controls.moveUp,
    moveDown: settings.controls.moveDown,
    moveLeft: settings.controls.moveLeft,
    moveRight: settings.controls.moveRight,
    pickUpWeapon: settings.controls.pickUpWeapon,
    dropWeapon: settings.controls.dropWeapon,
    shoot: settings.controls.shoot
  };

  return {
    id: String(settings._id),
    userId: String(settings.userId),
    controls,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt
  };
}

export async function getOrCreateSettings(userId: string) {
  const settings = await PlayerSettings.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    {
      $setOnInsert: {
        userId: new Types.ObjectId(userId),
        controls: defaultControls
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return toSettingsResponse(settings);
}

export async function updateSettings(userId: string, input: UpdateSettingsInput) {
  const currentSettings = await getOrCreateSettings(userId);
  const controls = {
    ...currentSettings.controls,
    ...input.controls
  };

  const settings = await PlayerSettings.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: { controls } },
    {
      new: true,
      runValidators: true
    }
  );

  if (!settings) {
    throw new Error('Player settings could not be updated');
  }

  return toSettingsResponse(settings);
}
