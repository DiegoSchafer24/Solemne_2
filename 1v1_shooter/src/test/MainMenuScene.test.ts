// @vitest-environment jsdom
import 'vitest-canvas-mock';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MainMenuScene from '../game/scenes/MainMenuScene';
import { uiState } from '../state/uiState';

const mockGameObject = {
    setOrigin: vi.fn().mockReturnThis(),
    setScale: vi.fn().mockReturnThis(),
    setInteractive: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    setTint: vi.fn().mockReturnThis(),
    clearTint: vi.fn().mockReturnThis(),
    scaleX: 1
};

describe('MainMenuScene', () => {
    let scene: any;

    beforeEach(() => {

        uiState.isMenu = false;

        scene = new MainMenuScene();

        scene.load = {
            image: vi.fn()
        };
        
        scene.cameras = {
            main: { width: 1280, height: 720 }
        };

        scene.textures = {
            exists: vi.fn().mockReturnValue(true),
            get: vi.fn().mockReturnValue({ get: () => ({ height: 1080 }) })
        };

        scene.add = {
            tileSprite: vi.fn().mockReturnValue(mockGameObject),
            image: vi.fn().mockReturnValue(mockGameObject),
            text: vi.fn().mockReturnValue(mockGameObject)
        };

        scene.scene = {
            start: vi.fn()
        };
    });

    it('debería registrarse con la clave correcta', () => {
        expect(scene.sys.config.key).toBe('MainMenuScene'); 
    });

    it('debería cargar todas las imágenes necesarias en preload', () => {
        scene.preload();

        expect(scene.load.image).toHaveBeenCalledWith('menu_background', 'assets/menu_bg.png');
        expect(scene.load.image).toHaveBeenCalledWith('game_logo', 'assets/logo.png');
        expect(scene.load.image).toHaveBeenCalledWith('button_bg', 'assets/button.png');
    });

    it('debería establecer uiState.isMenu en true al crearse', () => {

        scene.create();
        
        expect(uiState.isMenu).toBe(true);
    });

    it('debería mover el fondo en el ciclo update', () => {
        scene.create();

        scene.bg = { tilePositionX: 0 };

        scene.update();

        expect(scene.bg.tilePositionX).toBe(0.5);
    });
});