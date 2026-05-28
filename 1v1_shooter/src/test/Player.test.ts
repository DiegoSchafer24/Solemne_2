import { describe, it, expect, beforeEach, vi } from 'vitest';
import Player from '../game/entities/Player'; 

const mockBody = {
    setSize: vi.fn(),
    setOffset: vi.fn(),
    setAccelerationX: vi.fn(),
    setDragX: vi.fn(),
    setVelocityY: vi.fn(),
    velocity: { x: 0, y: 0 },
    touching: { down: true }
};

const mockAnims = {
    currentAnim: { key: '' },
    exists: vi.fn().mockReturnValue(true)
};

const mockScene = {
    add: { existing: vi.fn() },
    physics: { add: { existing: vi.fn() } },
    anims: mockAnims,
    textures: { exists: vi.fn().mockReturnValue(true) }
};

const mockControls = {
    left: { isDown: false },
    right: { isDown: false },
    up: { isDown: false },
    down: { isDown: false }
};

vi.mock('phaser', () => ({
    default: {
        Physics: {
            Arcade: {
                Sprite: class {
                    scene: any;
                    body: any;
                    texture: any;
                    x: any;
                    y: any;
                    anims: any;
                    flipX: boolean = false;
                    constructor(scene: any, x: any, y: any, texture: any) {
                        this.scene = scene;
                        this.x = x;
                        this.y = y;
                        this.body = mockBody;
                        this.texture = texture;
                        this.anims = mockAnims;
                    }
                    setOrigin() {}
                    setCollideWorldBounds() {}
                    setDepth() {}
                    setScale() {}
                    setFrame() {}
                    setTint() {}
                    play(key: string) { mockAnims.currentAnim.key = key; }
                    stop() {}
                    setTexture() {}
                }
            }
        },
        Input: { Keyboard: { JustDown: vi.fn().mockReturnValue(false) } }
    }
}));

describe('Entidad Player (State Machine y Físicas)', () => {
    let player: Player;

    beforeEach(() => {
        vi.clearAllMocks();
        mockBody.velocity = { x: 0, y: 0 };
        mockBody.touching.down = true;
        mockControls.left.isDown = false;
        mockControls.right.isDown = false;
        mockControls.down.isDown = false;
        player = new Player(mockScene as any, 100, 100, 'player_idle_unarmed', mockControls, false, 0x0000ff);
    });

    it('Debería inicializarse correctamente con offset ajustado', () => {
        expect(player.isDead).toBe(false);
        expect(mockBody.setSize).toHaveBeenCalledWith(24, 40, false);
        expect(mockBody.setOffset).toHaveBeenCalledWith(4, 8);
        expect(mockAnims.currentAnim.key).toBe('idle-unarmed');
    });

    it('Debería voltearse (flipX) y cambiar a WALK al moverse a la izquierda', () => {
        mockControls.left.isDown = true;
        mockBody.velocity.x = -160; 

        player.updatePlayer(2500, 1500, 300, -550);

        expect(player.facingRight).toBe(false);
        expect(player.flipX).toBe(true);
        expect(mockAnims.currentAnim.key).toBe('walk-unarmed');
    });

    it('Debería encoger su hitbox al agacharse (CROUCH)', () => {
        mockControls.down.isDown = true;

        player.updatePlayer(2500, 1500, 300, -550);

        expect(mockBody.setSize).toHaveBeenCalledWith(24, 20, false);
        expect(mockBody.setOffset).toHaveBeenCalledWith(4, 28);
        expect(mockAnims.currentAnim.key).toBe('crouch-unarmed');
    });

    it('Debería pasar al estado FALL si cae sin tocar el suelo', () => {
        mockBody.touching.down = false;
        mockBody.velocity.y = 100; 

        player.updatePlayer(2500, 1500, 300, -550);

        expect(mockAnims.currentAnim.key).toBe('fall-unarmed');
    });

    it('Debería mantener el arma en la animación al caminar', () => {
        player.setWeaponState('Escopeta');
        expect(mockAnims.currentAnim.key).toBe('idle-shotgun');

        mockControls.right.isDown = true;
        mockBody.velocity.x = 160;
        player.updatePlayer(2500, 1500, 300, -550);

        expect(mockAnims.currentAnim.key).toBe('walk-shotgun');
    });
});