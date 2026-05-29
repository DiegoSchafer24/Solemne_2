import { describe, it, expect, beforeEach, vi } from 'vitest';
import Weapon from '../game/entities/Weapon';

const mockBody = {
    setDragX: vi.fn()
};

const mockScene = {
    add: { existing: vi.fn() },
    physics: { add: { existing: vi.fn() } }
};

vi.mock('phaser', () => ({
    default: {
        Physics: {
            Arcade: {
                Sprite: class {
                    scene: any;
                    x: any;
                    y: any;
                    textureKey: any;
                    body: any;
                    constructor(scene: any, x: any, y: any, textureKey: any) {
                        this.scene = scene;
                        this.x = x;
                        this.y = y;
                        this.textureKey = textureKey;
                        this.body = mockBody;
                    }
                    setDepth() {}
                    setScale() {}
                }
            }
        }
    }
}));

describe('Entidad Weapon (Actualizada a Sprite)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Debería inicializarse correctamente con la textura y color de bala asignados', () => {

        const weapon = new Weapon(
            mockScene as any, 
            100, 200, 
            'shotgun', 
            'weapon_shotgun', 
            0xffaa00, 
            5, 1000, 2500, 300
        );

        expect(weapon.name).toBe('shotgun');
        expect(weapon.bulletColor).toBe(0xffaa00);
        expect(weapon.maxAmmo).toBe(5);
        expect(weapon.currentAmmo).toBe(5);
        expect(weapon.fireRate).toBe(1000);
        expect(weapon.bulletSpeed).toBe(2500);
        expect(weapon.range).toBe(300);
        expect(mockScene.add.existing).toHaveBeenCalledWith(weapon);
        expect(mockScene.physics.add.existing).toHaveBeenCalledWith(weapon);
        expect(mockBody.setDragX).toHaveBeenCalledWith(100);
    });
});