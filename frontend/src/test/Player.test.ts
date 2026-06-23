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

const mockPlay = vi.fn().mockImplementation((key: string) => { 
    mockAnims.currentAnim.key = key; 
});

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
                    play = mockPlay;
                    stop() {}
                    setTexture() {}
                }
            }
        },
        Input: { Keyboard: { JustDown: vi.fn() } }
    }
}));

describe('Entidad Player (Animaciones Finales y Físicas)', () => {
    let player: Player;
    let PhaserMock: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        mockBody.velocity = { x: 0, y: 0 };
        mockBody.touching.down = true;
        mockControls.left.isDown = false;
        mockControls.right.isDown = false;
        mockControls.down.isDown = false;

        PhaserMock = (await import('phaser')).default;
        PhaserMock.Input.Keyboard.JustDown.mockReturnValue(false);

        player = new Player(mockScene as any, 100, 100, 'player_idle', mockControls, false, 0x0000ff);
    });

    it('Debería inicializarse correctamente en estado IDLE', () => {
        expect(player.isDead).toBe(false);
        expect(mockBody.setSize).toHaveBeenCalledWith(24, 40, false);
        expect(mockAnims.currentAnim.key).toBe('idle');
    });

    it('Debería cambiar a WALK al moverse a los lados', () => {
        mockControls.left.isDown = true;
        mockBody.velocity.x = -160; 

        player.updatePlayer(2500, 1500, 300, -550);

        expect(player.facingRight).toBe(false);
        expect(player.flipX).toBe(true);
        expect(mockAnims.currentAnim.key).toBe('walk');
    });

    it('Debería encoger su hitbox al agacharse (CROUCH) a baja velocidad', () => {
        mockControls.down.isDown = true;
        mockBody.velocity.x = 10; 

        player.updatePlayer(2500, 1500, 300, -550);

        expect(mockBody.setSize).toHaveBeenCalledWith(24, 20, false);
        expect(mockAnims.currentAnim.key).toBe('crouch');
    });

    it('Debería usar la animación CROUCH cuando entra en estado SLIDE por alta velocidad', () => {
        mockControls.down.isDown = true;
        mockBody.velocity.x = 200;

        player.updatePlayer(2500, 1500, 300, -550);

        expect(mockBody.setSize).toHaveBeenCalledWith(24, 20, false);
        expect(mockAnims.currentAnim.key).toBe('crouch');
    });

    it('Debería pasar a JUMP si se encuentra cayendo o en el aire', () => {
        mockBody.touching.down = false;
        mockBody.velocity.y = 100; 

        player.updatePlayer(2500, 1500, 300, -550);

        expect(mockAnims.currentAnim.key).toBe('jump');
    });

    it('Debería reiniciar la animación JUMP al ejecutar un doble salto', () => {
        mockBody.touching.down = false;
        PhaserMock.Input.Keyboard.JustDown.mockReturnValue(true);
        
        player.updatePlayer(2500, 1500, 300, -550);

        expect(mockBody.setVelocityY).toHaveBeenCalledWith(-550);
        expect(mockPlay).toHaveBeenCalledWith('jump');
    });
});