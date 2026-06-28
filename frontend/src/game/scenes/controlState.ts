import { reactive } from 'vue';
import Phaser from 'phaser';

export type ControlActions = 'up' | 'down' | 'left' | 'right' | 'shoot' | 'take' | 'drop';

export interface PlayerControls {
    up: number;
    down: number;
    left: number;
    right: number;
    shoot: number;
    take: number;
    drop: number;
}

const defaultControls: { player1: PlayerControls, player2: PlayerControls, online: PlayerControls } = {
    player1: {
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
        take: Phaser.Input.Keyboard.KeyCodes.E,
        drop: Phaser.Input.Keyboard.KeyCodes.Q
    },
    player2: {
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        shoot: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO,
        take: Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE,
        drop: Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO
    },
    online: {
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
        take: Phaser.Input.Keyboard.KeyCodes.E,
        drop: Phaser.Input.Keyboard.KeyCodes.Q
    }
};

export const controlState = reactive(JSON.parse(JSON.stringify(defaultControls)));

export function getControlName(keyCode: number): string {
    const keyMap: { [key: number]: string } = {
        32: 'ESPACIO',
        37: 'IZQUIERDA',
        38: 'ARRIBA',
        39: 'DERECHA',
        40: 'ABAJO',
        110: 'NUM .',
        96: 'NUM 0',
        97: 'NUM 1',
        98: 'NUM 2',
    };

    if (keyMap[keyCode]) {
        return keyMap[keyCode];
    }

    if (keyCode >= 65 && keyCode <= 90) {
        return String.fromCharCode(keyCode);
    }

    return `Keycode ${keyCode}`;
}