import Phaser from 'phaser';
import { uiState } from '../../state/uiState';
import { controlState, getControlName, type ControlActions, type PlayerControls } from './controlState';

type MenuView = 'main' | 'online' | 'local' | 'controls-online' | 'controls-local';

export default class MainMenuScene extends Phaser.Scene {
    private bg!: Phaser.GameObjects.TileSprite;
    private menuItems: Phaser.GameObjects.GameObject[] = [];
    private logo?: Phaser.GameObjects.Image;
    private initialMenu: MenuView = 'main';

    private rebindingText?: Phaser.GameObjects.Text;
    private isRebinding = false;

    private readonly buttonScale = 0.26;
    private readonly buttonHitWidth = 340;
    private readonly buttonHitHeight = 80;
    private readonly backButtonScale = 2.3;
    private readonly backButtonHitSize = 72;

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    init(data: { initialMenu?: MenuView }) {
        this.initialMenu = data.initialMenu ?? 'main';
    }

    preload() {
        this.load.image('menu_background', 'assets/menu_bg.png');
        this.load.image('game_logo', 'assets/logo.png');
        this.load.image('button_bg', 'assets/button.png'); 
        this.load.image('back_button', 'assets/back.png');
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
            this.bg.tilePositionX = this.registry.get('menuBgTilePositionX') ?? 0;
        }

        this.logo = this.add.image(width / 2, height / 4.5, 'game_logo')
            .setOrigin(0.5)
            .setScale(0.6);

        if (this.initialMenu === 'online') {
            this.showOnlineMenu();
        } else if (this.initialMenu === 'local') {
            this.showLocalMenu();
        } else if (this.initialMenu === 'controls-online') {
            this.showControlsMenu('online');
        } else if (this.initialMenu === 'controls-local') {
            this.showControlsMenu('local');
        } else {
            this.showMainMenu();
        }
    }

    private showMainMenu() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.logo?.setVisible(true);
        this.clearMenuItems();
        this.createMenuButton(width / 2, height / 2 + 60, 'ONLINE', () => {
            this.showOnlineMenu();
        });
        this.createMenuButton(width / 2, height / 2 + 150, 'LOCAL', () => {
            this.showLocalMenu();
        });
    }

    private showOnlineMenu() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.logo?.setVisible(true);
        this.clearMenuItems();
        this.createBackButton(() => {
            this.showMainMenu();
        });
        this.createMenuTitle(width / 2, height / 2 - 35, 'ONLINE');
        this.createMenuButton(width / 2, height / 2 + 60, 'JUGAR', () => {});
        this.createMenuButton(width / 2, height / 2 + 150, 'CONTROLES', () => {
            this.showControlsMenu('online');
        });
    }

    private showLocalMenu() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.logo?.setVisible(true);
        this.clearMenuItems();
        this.createBackButton(() => {
            this.showMainMenu();
        });
        this.createMenuTitle(width / 2, height / 2 - 35, 'LOCAL');
        this.createMenuButton(width / 2, height / 2 + 60, 'JUGAR', () => {
            this.scene.start('CharacterSelectScene');
        });
        this.createMenuButton(width / 2, height / 2 + 150, 'CONTROLES', () => {
            this.showControlsMenu('local');
        });
    }

    private showControlsMenu(mode: 'local' | 'online') {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.logo?.setVisible(false);
        this.clearMenuItems();
        this.createBackButton(() => {
            if (mode === 'local') {
                this.showLocalMenu();
            } else {
                this.showOnlineMenu();
            }
        });

        if (mode === 'local') {
            const bg1 = this.add.rectangle(width / 4, height / 2 + 20, 350, 320, 0x000000, 0.5);
            this.createMenuTitle(width / 4, height / 2 - 150, 'JUGADOR 1');
            this.createControlsList(controlState.player1, width / 4, height / 2 - 100, 'player1');
            this.menuItems.push(bg1);

            const bg2 = this.add.rectangle(width * 3 / 4, height / 2 + 20, 350, 320, 0x000000, 0.5);
            this.createMenuTitle(width * 3 / 4, height / 2 - 150, 'JUGADOR 2');
            this.createControlsList(controlState.player2, width * 3 / 4, height / 2 - 100, 'player2');
            this.menuItems.push(bg2);

        } else {
            const bg = this.add.rectangle(width / 2, height / 2 + 20, 350, 320, 0x000000, 0.5);
            this.createMenuTitle(width / 2, height / 2 - 150, 'CONTROLES ONLINE');
            this.createControlsList(controlState.online, width / 2, height / 2 - 100, 'online');
            this.menuItems.push(bg);
        }
    }

    private createControlsList(playerControls: PlayerControls, x: number, y: number, playerKey: 'player1' | 'player2' | 'online') {
        const controlLabels: { [key in ControlActions]: string } = {
            up: 'ARRIBA',
            down: 'ABAJO',
            left: 'IZQUIERDA',
            right: 'DERECHA',
            shoot: 'DISPARAR',
            take: 'TOMAR ARMA',
            drop: 'SOLTAR ARMA'
        };

        let yOffset = y;
        const actions = Object.keys(playerControls) as ControlActions[];

        actions.forEach(action => {
            const labelText = `${controlLabels[action]}:`;
            const keyText = getControlName(playerControls[action]);

            const label = this.add.text(x - 10, yOffset, labelText, {
                fontSize: '16px',
                fontFamily: '"Press Start 2P", monospace',
                color: '#ffffff',
            }).setOrigin(1, 0.5);

            const keyButtonText = this.add.text(x + 10, yOffset, keyText, {
                fontSize: '16px',
                fontFamily: '"Press Start 2P", monospace',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 4,
            }).setOrigin(0, 0.5).setInteractive({ cursor: 'pointer' });

            keyButtonText.on('pointerdown', () => {
                if (this.isRebinding) return;
                this.startRebinding(playerKey, action, keyButtonText);
            });

            this.menuItems.push(label, keyButtonText);
            yOffset += 40;
        });
    }

    private startRebinding(playerKey: 'player1' | 'player2' | 'online', action: ControlActions, keyButtonText: Phaser.GameObjects.Text) {
        this.isRebinding = true;
        keyButtonText.setText('...').setColor('#ff0000');

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.rebindingText = this.add.text(width / 2, height / 2, 'PRESIONE LA TECLA A ASIGNAR', {
            fontSize: '24px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(100);

        this.input.keyboard!.once('keydown', (event: KeyboardEvent) => {
            this.finishRebinding(playerKey, action, event.keyCode, keyButtonText);
        });
    }

    private finishRebinding(playerKey: 'player1' | 'player2' | 'online', action: ControlActions, newKeyCode: number, keyButtonText: Phaser.GameObjects.Text) {
        if (!this.isRebinding) return;

        if (this.rebindingText) {
            this.rebindingText.destroy();
            this.rebindingText = undefined;
        }

        if (this.isKeyInUse(newKeyCode, playerKey, action)) {
            const originalKeyCode = controlState[playerKey][action];
            keyButtonText.setText(getControlName(originalKeyCode)).setColor('#ffff00');

            const errorText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'TECLA YA EN USO', {
                fontSize: '24px', fontFamily: '"Press Start 2P", monospace', color: '#ff0000',
                backgroundColor: 'rgba(0,0,0,0.7)', padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setDepth(100);

            this.time.delayedCall(1000, () => errorText.destroy());

        } else {
            controlState[playerKey][action] = newKeyCode;
            keyButtonText.setText(getControlName(newKeyCode)).setColor('#ffff00');
        }

        this.isRebinding = false;
        
        this.input.keyboard!.removeAllListeners('keydown');
    }

    private isKeyInUse(newKeyCode: number, currentPlayerKey: 'player1' | 'player2' | 'online', currentAction: ControlActions): boolean {
        const playersToCheck: Array<'player1' | 'player2' | 'online'> = 
            (currentPlayerKey === 'online') ? ['online'] : ['player1', 'player2'];

        for (const playerKey of playersToCheck) {
            const controls = controlState[playerKey];
            for (const action in controls) {
                if (playerKey === currentPlayerKey && action === currentAction) continue;
                if (controls[action as ControlActions] === newKeyCode) return true;
            }
        }
        return false;
    }

    private createMenuTitle(x: number, y: number, label: string) {
        const title = this.add.text(x, y, label, {
            fontSize: '28px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 0, fill: true }
        }).setOrigin(0.5);

        this.menuItems.push(title);
    }

    private createMenuButton(x: number, y: number, label: string, onClick: () => void) {
        if (this.isRebinding) return;

        const pressedScale = 0.9;

        const buttonBg = this.add.image(x, y, 'button_bg')
            .setOrigin(0.5)
            .setScale(this.buttonScale);

        this.setCenteredHitArea(buttonBg, this.buttonHitWidth, this.buttonHitHeight);

        const buttonText = this.add.text(x, y, label, {
            fontSize: '29px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 0, fill: true }
        }).setOrigin(0.5);

        buttonBg.on('pointerover', () => {
            buttonBg.setTint(0xdddddd);
        });

        buttonBg.on('pointerout', () => {
            buttonBg.clearTint();
        });

        buttonBg.on('pointerdown', () => {
            buttonBg.setScale(this.buttonScale * pressedScale);
            buttonText.setScale(pressedScale);
            
            this.time.delayedCall(100, () => {
                buttonBg.setScale(this.buttonScale);
                buttonText.setScale(1);
                onClick();
            }); 
        });

        this.menuItems.push(buttonBg, buttonText);
    }

    private createBackButton(onClick: () => void) {
        if (this.isRebinding) return;

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
            onClick();
        });

        this.menuItems.push(backButton);
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

    private clearMenuItems() {
        this.menuItems.forEach(item => item.destroy());
        this.menuItems = [];
    }

    update() {
        if (this.bg && !this.isRebinding) {
            this.bg.tilePositionX += 0.5;
            this.registry.set('menuBgTilePositionX', this.bg.tilePositionX);
        }
    }
}
