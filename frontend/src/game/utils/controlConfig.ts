import Phaser from 'phaser';

export type ControlAction = 'left' | 'right' | 'up' | 'down' | 'pickUp' | 'drop' | 'shoot';
export type ControlOwner = 'player1' | 'player2' | 'online';

export type ControlBinding = {
    type: 'keyboard' | 'mouse';
    label: string;
    code?: string;
    keyCode?: number;
    button?: number;
};

export type ControlScheme = Record<ControlAction, ControlBinding>;

export type RuntimeBinding = {
    binding: ControlBinding;
    key?: Phaser.Input.Keyboard.Key;
    wasDown: boolean;
};

export type RuntimeControlScheme = Record<ControlAction, RuntimeBinding>;

export const CONTROL_ACTIONS: Array<{ key: ControlAction, label: string }> = [
    { key: 'left', label: 'IZQUIERDA' },
    { key: 'right', label: 'DERECHA' },
    { key: 'up', label: 'ARRIBA' },
    { key: 'down', label: 'ABAJO' },
    { key: 'pickUp', label: 'TOMAR ARMA' },
    { key: 'drop', label: 'SOLTAR ARMA' },
    { key: 'shoot', label: 'DISPARAR' }
];

const defaultLocalP1: ControlScheme = {
    left: { type: 'keyboard', code: 'KeyA', keyCode: Phaser.Input.Keyboard.KeyCodes.A, label: 'A' },
    right: { type: 'keyboard', code: 'KeyD', keyCode: Phaser.Input.Keyboard.KeyCodes.D, label: 'D' },
    up: { type: 'keyboard', code: 'KeyW', keyCode: Phaser.Input.Keyboard.KeyCodes.W, label: 'W' },
    down: { type: 'keyboard', code: 'KeyS', keyCode: Phaser.Input.Keyboard.KeyCodes.S, label: 'S' },
    pickUp: { type: 'keyboard', code: 'KeyE', keyCode: Phaser.Input.Keyboard.KeyCodes.E, label: 'E' },
    drop: { type: 'keyboard', code: 'KeyQ', keyCode: Phaser.Input.Keyboard.KeyCodes.Q, label: 'Q' },
    shoot: { type: 'keyboard', code: 'Space', keyCode: Phaser.Input.Keyboard.KeyCodes.SPACE, label: 'SPACE' }
};

const defaultLocalP2: ControlScheme = {
    left: { type: 'keyboard', code: 'ArrowLeft', keyCode: Phaser.Input.Keyboard.KeyCodes.LEFT, label: 'LEFT' },
    right: { type: 'keyboard', code: 'ArrowRight', keyCode: Phaser.Input.Keyboard.KeyCodes.RIGHT, label: 'RIGHT' },
    up: { type: 'keyboard', code: 'ArrowUp', keyCode: Phaser.Input.Keyboard.KeyCodes.UP, label: 'UP' },
    down: { type: 'keyboard', code: 'ArrowDown', keyCode: Phaser.Input.Keyboard.KeyCodes.DOWN, label: 'DOWN' },
    pickUp: { type: 'keyboard', code: 'Period', keyCode: Phaser.Input.Keyboard.KeyCodes.PERIOD, label: '.' },
    drop: { type: 'keyboard', code: 'Comma', keyCode: Phaser.Input.Keyboard.KeyCodes.COMMA, label: ',' },
    shoot: { type: 'keyboard', code: 'Minus', keyCode: Phaser.Input.Keyboard.KeyCodes.MINUS, label: '-' }
};

const defaultOnline: ControlScheme = cloneScheme(defaultLocalP1);

export const localControls: Record<'player1' | 'player2', ControlScheme> = {
    player1: cloneScheme(defaultLocalP1),
    player2: cloneScheme(defaultLocalP2)
};

export const onlineControls: ControlScheme = cloneScheme(defaultOnline);

export function cloneScheme(scheme: ControlScheme): ControlScheme {
    return {
        left: { ...scheme.left },
        right: { ...scheme.right },
        up: { ...scheme.up },
        down: { ...scheme.down },
        pickUp: { ...scheme.pickUp },
        drop: { ...scheme.drop },
        shoot: { ...scheme.shoot }
    };
}

export function createKeyboardBinding(event: KeyboardEvent): ControlBinding {
    return {
        type: 'keyboard',
        code: event.code,
        keyCode: event.keyCode,
        label: getKeyboardLabel(event)
    };
}

export function createMouseBinding(button: number): ControlBinding {
    const labels = ['MOUSE 1', 'MOUSE 3', 'MOUSE 2'];

    return {
        type: 'mouse',
        button,
        label: labels[button] ?? `MOUSE ${button + 1}`
    };
}

export function createRuntimeControls(scene: Phaser.Scene, scheme: ControlScheme): RuntimeControlScheme {
    return CONTROL_ACTIONS.reduce((runtimeControls, action) => {
        const binding = scheme[action.key];
        runtimeControls[action.key] = {
            binding,
            key: binding.type === 'keyboard' && binding.keyCode !== undefined
                ? scene.input.keyboard!.addKey(binding.keyCode)
                : undefined,
            wasDown: false
        };
        return runtimeControls;
    }, {} as RuntimeControlScheme);
}

export function isControlDown(scene: Phaser.Scene, runtimeBinding: RuntimeBinding): boolean {
    if (runtimeBinding.binding.type === 'keyboard') {
        return runtimeBinding.key?.isDown ?? false;
    }

    return isMouseButtonDown(scene, runtimeBinding.binding.button ?? 0);
}

export function isControlJustDown(scene: Phaser.Scene, runtimeBinding: RuntimeBinding): boolean {
    const isDown = isControlDown(scene, runtimeBinding);
    const justDown = isDown && !runtimeBinding.wasDown;
    runtimeBinding.wasDown = isDown;
    return justDown;
}

function isMouseButtonDown(scene: Phaser.Scene, button: number): boolean {
    const pointer = scene.input.activePointer;

    if (button === 0) return pointer.primaryDown;
    if (button === 1) return pointer.middleButtonDown();
    if (button === 2) return pointer.rightButtonDown();

    return false;
}

function getKeyboardLabel(event: KeyboardEvent): string {
    if (event.code === 'Space') return 'SPACE';
    if (event.code.startsWith('Arrow')) return event.code.replace('Arrow', '').toUpperCase();
    if (event.key.length === 1) return event.key.toUpperCase();
    return event.key.toUpperCase();
}
