import Phaser from 'phaser';

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
    }

    create() {

        this.p1Ready = false;
        this.p2Ready = false;
        this.p1Index = 0;
        this.p2Index = 1;
        this.input.keyboard!.removeAllListeners();
        
        const width = this.cameras.main.width;

        this.add.text(width / 2, 100, 'SELECCIÓN DE COLOR', {
            fontSize: '30px', fontFamily: '"Press Start 2P", monospace', color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(width / 4, 200, 'JUGADOR 1\n(A / D cambiar)\n(W confirmar)', {
            fontSize: '15px', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);

        this.p1Sprite = this.add.sprite(width / 4, 350, 'player_idle').setScale(4);
        this.p1Text = this.add.text(width / 4, 450, '', { fontSize: '20px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5);

        this.add.text((width / 4) * 3, 200, 'JUGADOR 2\n(← / → cambiar)\n(↑ confirmar)', {
            fontSize: '15px', fontFamily: '"Press Start 2P", monospace', align: 'center'
        }).setOrigin(0.5);

        this.p2Sprite = this.add.sprite((width / 4) * 3, 350, 'player_idle').setScale(4);
        this.p2Sprite.setFlipX(true);
        this.p2Text = this.add.text((width / 4) * 3, 450, '', { fontSize: '20px', fontFamily: '"Press Start 2P", monospace' }).setOrigin(0.5);

        this.updateSelections();

        this.input.keyboard!.on('keydown-A', () => { if (!this.p1Ready) { this.p1Index = (this.p1Index - 1 + COLORS.length) % COLORS.length; this.updateSelections(); }});
        this.input.keyboard!.on('keydown-D', () => { if (!this.p1Ready) { this.p1Index = (this.p1Index + 1) % COLORS.length; this.updateSelections(); }});
        this.input.keyboard!.on('keydown-W', () => { this.p1Ready = true; this.p1Text.setColor('#00ff00'); this.checkStart(); });

        this.input.keyboard!.on('keydown-LEFT', () => { if (!this.p2Ready) { this.p2Index = (this.p2Index - 1 + COLORS.length) % COLORS.length; this.updateSelections(); }});
        this.input.keyboard!.on('keydown-RIGHT', () => { if (!this.p2Ready) { this.p2Index = (this.p2Index + 1) % COLORS.length; this.updateSelections(); }});
        this.input.keyboard!.on('keydown-UP', () => { this.p2Ready = true; this.p2Text.setColor('#00ff00'); this.checkStart(); });
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