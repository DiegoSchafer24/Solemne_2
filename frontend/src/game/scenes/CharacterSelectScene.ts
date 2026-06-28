import Phaser from 'phaser';
import { controlState, getControlName } from './controlState';
import type { RuntimePlayerControls } from '../entities/Player';

const COLORS = [
    { name: 'Rojo', hex: 0xff0000 },
    { name: 'Azul', hex: 0x0000ff },
    { name: 'Amarillo', hex: 0xffff00 },
    { name: 'Verde', hex: 0x00ff00 },
    { name: 'Rosado', hex: 0xff66b2 },
    { name: 'Morado', hex: 0x800080 },
    { name: 'Naranjo', hex: 0xff8c00 },
    { name: 'Blanco', hex: 0xffffff }
];

export default class CharacterSelectScene extends Phaser.Scene {
    private p1Index: number = 0;
    private p2Index: number = 1;
    private readonly backButtonScale = 2;
    private readonly backButtonHitSize = 72;

    private p1Sprite!: Phaser.GameObjects.Sprite;
    private p2Sprite!: Phaser.GameObjects.Sprite;
    private p1Text!: Phaser.GameObjects.Text;
    private p2Text!: Phaser.GameObjects.Text;

    private p1Ready: boolean = false;
    private p2Ready: boolean = false;

    constructor() {
        super({ key: 'CharacterSelectScene' });
    }

    preload() {
        const frameConf = { frameWidth: 32, frameHeight: 48 };
        this.load.spritesheet('player_idle', '/assets/characters/player_idle.png', frameConf);
        this.load.image('back_button', '/assets/back.png');
    }

    create() {

        this.p1Ready = false;
        this.p2Ready = false;
        this.p1Index = 0;
        this.p2Index = 1;
        this.input.keyboard!.removeAllListeners();
        
        const width = this.cameras.main.width;
        this.createBackButton();

        this.add.text(width / 2, 100, 'SELECCIÓN DE COLOR', {
            fontSize: '30px', fontFamily: '"Press Start 2P", monospace', color: '#ffffff'
        }).setOrigin(0.5);

        const p1LeftKey = getControlName(controlState.player1.left);
        const p1RightKey = getControlName(controlState.player1.right);
        const p1ConfirmKey = getControlName(controlState.player1.up);
        this.add.text(width / 4, 200, `JUGADOR 1\n(${p1LeftKey} / ${p1RightKey} cambiar)\n(${p1ConfirmKey} confirmar)`, {
            fontSize: '15px', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);

        this.p1Sprite = this.add.sprite(width / 4, 350, 'player_idle').setScale(4);
        this.p1Text = this.add.text(width / 4, 450, '', { fontSize: '20px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5);

        const p2LeftKey = getControlName(controlState.player2.left);
        const p2RightKey = getControlName(controlState.player2.right);
        const p2ConfirmKey = getControlName(controlState.player2.up);
        this.add.text((width / 4) * 3, 200, `JUGADOR 2\n(${p2LeftKey} / ${p2RightKey} cambiar)\n(${p2ConfirmKey} confirmar)`, {
            fontSize: '15px', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);

        this.p2Sprite = this.add.sprite((width / 4) * 3, 350, 'player_idle').setScale(4);
        this.p2Sprite.setFlipX(true);
        this.p2Text = this.add.text((width / 4) * 3, 450, '', { fontSize: '20px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5);

        this.updateSelections();

        const p1Controls = this.input.keyboard!.addKeys(controlState.player1) as RuntimePlayerControls;
        const p2Controls = this.input.keyboard!.addKeys(controlState.player2) as RuntimePlayerControls;

        p1Controls.left.on('down', () => { if (!this.p1Ready) { this.p1Index = (this.p1Index - 1 + COLORS.length) % COLORS.length; this.updateSelections(); }});
        p1Controls.right.on('down', () => { if (!this.p1Ready) { this.p1Index = (this.p1Index + 1) % COLORS.length; this.updateSelections(); }});
        p1Controls.up.on('down', () => { this.p1Ready = true; this.p1Text.setColor('#00ff00'); this.checkStart(); });

        p2Controls.left.on('down', () => { if (!this.p2Ready) { this.p2Index = (this.p2Index - 1 + COLORS.length) % COLORS.length; this.updateSelections(); }});
        p2Controls.right.on('down', () => { if (!this.p2Ready) { this.p2Index = (this.p2Index + 1) % COLORS.length; this.updateSelections(); }});
        p2Controls.up.on('down', () => { this.p2Ready = true; this.p2Text.setColor('#00ff00'); this.checkStart(); });

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.keyboard!.off('keydown');
            for (const key in p1Controls) { p1Controls[key as keyof RuntimePlayerControls].removeAllListeners(); }
            for (const key in p2Controls) { p2Controls[key as keyof RuntimePlayerControls].removeAllListeners(); }
        });
    }

    private createBackButton() {
        const backButton = this.add.image(42, 42, 'back_button')
            .setOrigin(0.5)
            .setScale(this.backButtonScale);

        this.setCenteredHitArea(backButton, this.backButtonHitSize, this.backButtonHitSize);

        backButton.on('pointerover', () => {
            backButton.setTint(0xdddddd);
        });

        backButton.on('pointerout', () => {
            backButton.clearTint();
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene', { initialMenu: 'local' });
        });
    }

    private setCenteredHitArea(image: Phaser.GameObjects.Image, width: number, height: number) {
        image.setInteractive(
            new Phaser.Geom.Rectangle(
                image.width / 2 - width / (2 * image.scaleX),
                image.height / 2 - height / (2 * image.scaleY),
                width / image.scaleX,
                height / image.scaleY
            ),
            Phaser.Geom.Rectangle.Contains
        );
        image.input!.cursor = 'pointer';
    }

    private updateSelections() {
        if (!this.p1Ready) {
            this.p1Sprite.setTint(COLORS[this.p1Index].hex);
            this.p1Text.setText(COLORS[this.p1Index].hex === 0xffffff ? 'Blanco' : COLORS[this.p1Index].name).setColor('#ffffff');
        }
        if (!this.p2Ready) {
            this.p2Sprite.setTint(COLORS[this.p2Index].hex);
            this.p2Text.setText(COLORS[this.p2Index].hex === 0xffffff ? 'Blanco' : COLORS[this.p2Index].name).setColor('#ffffff');
        }
    }

    private checkStart() {
        if (this.p1Ready && this.p2Ready) {
            const finalP1Color = COLORS[this.p1Index].hex;
            let finalP2Color = COLORS[this.p2Index].hex;

            if (finalP1Color === finalP2Color) {
                finalP2Color = this.darkenColor(finalP2Color);
            }

            this.time.delayedCall(500, () => {
                this.scene.start('PlayScene', { p1Color: finalP1Color, p2Color: finalP2Color });
            });
        }
    }

    private darkenColor(hex: number): number {
        const r = Math.floor(((hex >> 16) & 0xff) * 0.5);
        const g = Math.floor(((hex >> 8) & 0xff) * 0.5);
        const b = Math.floor((hex & 0xff) * 0.5);
        return (r << 16) | (g << 8) | b;
    }
}
