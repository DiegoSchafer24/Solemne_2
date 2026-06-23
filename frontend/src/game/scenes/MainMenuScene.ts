import Phaser from 'phaser';
import { uiState } from '../../state/uiState';

export default class MainMenuScene extends Phaser.Scene {
    private bg!: Phaser.GameObjects.TileSprite;

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('menu_background', 'assets/menu_bg.png');
        this.load.image('game_logo', 'assets/logo.png');
        this.load.image('button_bg', 'assets/button.png'); 
    }

    create() {
        uiState.isMenu = true;
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        if (this.textures.exists('menu_background')) {
            const imgHeight = this.textures.get('menu_background').get().height;
            const scale = height / imgHeight;

            this.bg = this.add.tileSprite(0, 0, width / scale, height / scale, 'menu_background')
                .setOrigin(0, 0)
                .setScale(scale);
        }

        this.add.image(width / 2, height / 4.5, 'game_logo')
            .setOrigin(0.5)
            .setScale(0.6);

        const playBtnBg = this.add.image(width / 2, height / 2 + 100, 'button_bg')
            .setOrigin(0.5)
            .setScale(0.26)
            .setInteractive({ useHandCursor: true });

        const playBtnText = this.add.text(width / 2, height / 2 + 100, 'JUGAR', {
            fontSize: '29px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 0, fill: true }
        }).setOrigin(0.5);

        playBtnBg.on('pointerover', () => {
            playBtnBg.setTint(0xdddddd); 
        });

        playBtnBg.on('pointerout', () => {
            playBtnBg.clearTint(); 
        });

        playBtnBg.on('pointerdown', () => {
            playBtnBg.setScale(playBtnBg.scaleX * 0.9); 
            playBtnText.setScale(playBtnText.scaleX * 0.9);
            
            setTimeout(() => {
                this.scene.start('CharacterSelectScene');
            }, 100); 
        });
    }

    update() {
        if (this.bg) {
            this.bg.tilePositionX += 0.5;
        }
    }
}