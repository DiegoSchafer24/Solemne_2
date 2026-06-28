import { reactive } from 'vue';
import { cloneScheme, localControls, type ControlScheme } from '../game/utils/controlConfig';

export type LocalPlayerSlot = 'player1' | 'player2';

export interface LocalPlayerProfile {
  username: string;
  controls: ControlScheme;
}

function createDefaultLocalPlayers(): Record<LocalPlayerSlot, LocalPlayerProfile> {
  return {
    player1: {
      username: 'Invitado1',
      controls: cloneScheme(localControls.player1)
    },
    player2: {
      username: 'Invitado2',
      controls: cloneScheme(localControls.player2)
    }
  };
}

export const localPlayers = reactive(createDefaultLocalPlayers());

export function updateLocalPlayerName(slot: LocalPlayerSlot, username: string) {
  localPlayers[slot].username = username.trim() || (slot === 'player1' ? 'Invitado1' : 'Invitado2');
}

export function updateLocalPlayerControls(slot: LocalPlayerSlot, controls: ControlScheme) {
  localPlayers[slot].controls = cloneScheme(controls);
}

export function resetLocalPlayers() {
  const defaults = createDefaultLocalPlayers();

  localPlayers.player1.username = defaults.player1.username;
  localPlayers.player1.controls = defaults.player1.controls;
  localPlayers.player2.username = defaults.player2.username;
  localPlayers.player2.controls = defaults.player2.controls;
}
