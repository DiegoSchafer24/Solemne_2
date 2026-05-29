import Phaser from 'phaser';
import { canTakeDamage } from '../utils/playerLogic';
import Weapon from '../entities/Weapon';
import { canShoot } from '../utils/weaponLogic';
import { uiState } from '../../state/uiState';
import { checkWinner } from '../utils/gameLogic';
import Player from '../entities/Player';

export default class PlayScene extends Phaser.Scene {

    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private cameraTarget!: Phaser.GameObjects.Zone;
    private player1!: Player;
    private player2!: Player;
    private p1Status = { isDead: false, isInvul: false, spawnX: 100, spawnY: 600 };
    private p2Status = { isDead: false, isInvul: false, spawnX: 1180, spawnY: 600 };
    private isGameOver: boolean = false;
    private pendingGameOver: boolean = false;
    private p1Color: number = 0xff0000;
    private p2Color: number = 0x0000ff;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: any;
    private weapons!: Phaser.Physics.Arcade.Group;
    private p1Weapon: Weapon | null = null;
    private p2Weapon: Weapon | null = null;
    private p1Interact!: { E: Phaser.Input.Keyboard.Key, Q: Phaser.Input.Keyboard.Key };
    private p2Interact!: { PICK: Phaser.Input.Keyboard.Key, DROP: Phaser.Input.Keyboard.Key };
    private bullets!: Phaser.Physics.Arcade.Group;
    private p1Shoot!: Phaser.Input.Keyboard.Key;
    private p2Shoot!: Phaser.Input.Keyboard.Key;
    private spawners: any[] = [];
    private maxTotalWeapons: number = 10;

    constructor() {
        super({ key: 'PlayScene' });
    }

    init(data: any) {
        if (data.p1Color !== undefined) this.p1Color = data.p1Color;
        if (data.p2Color !== undefined) this.p2Color = data.p2Color;
        uiState.p1.color = '#' + this.p1Color.toString(16).padStart(6, '0');
        uiState.p2.color = '#' + this.p2Color.toString(16).padStart(6, '0');
    }

    preload() {
        this.load.image('bg', '/assets/background.jpg');
        this.load.image('floor_tex', '/assets/floor_tex.png');
        this.load.image('platform_tex', '/assets/platform_tex.png');
        this.load.image('weapon_pistol', '/assets/weapons/pistol.png');
        this.load.image('weapon_shotgun', '/assets/weapons/shotgun.png');
        
        const frameConf = { frameWidth: 32, frameHeight: 48 };
        this.load.spritesheet('player_idle', '/assets/characters/player_idle.png', frameConf);
        this.load.spritesheet('player_walk', '/assets/characters/player_walk.png', frameConf);
        this.load.spritesheet('player_jump', '/assets/characters/player_jump.png', frameConf);
        this.load.spritesheet('player_crouch', '/assets/characters/player_crouch.png', frameConf);
        this.load.spritesheet('player_slide', '/assets/characters/player_slide.png', frameConf);
    }

    create() {

        this.isGameOver = false;
        this.pendingGameOver = false;
        this.physics.world.resume();
        this.p1Status = { isDead: false, isInvul: false, spawnX: 100, spawnY: 500 };
        this.p2Status = { isDead: false, isInvul: false, spawnX: 1180, spawnY: 500 };
        this.p1Weapon = null;
        this.p2Weapon = null;

        const bg = this.add.image(640, 360, 'bg').setDepth(-100);
        bg.setScrollFactor(0);
        bg.setScale(1.7);
        bg.setTint(0x777777);
        uiState.isMenu = false;

        this.platforms = this.physics.add.staticGroup();
        this.cameraTarget = this.add.zone(640, 360, 1, 1);
        this.cameras.main.startFollow(this.cameraTarget, false, 0.1, 0.1);

        const levelData = [

            { x: 640, y: 700, width: 1280, height: 200, texture: 'floor_tex' },
            { x: 640, y: 520, width: 350, height: 20, texture: 'platform_tex' },  
            { x: 640, y: 320, width: 400, height: 20, texture: 'platform_tex' },  
            { x: 200, y: 250, width: 250, height: 20, texture: 'platform_tex' },
            { x: 1080, y: 250, width: 250, height: 20, texture: 'platform_tex' },
            { x: 50, y: 440, width: 250, height: 20, texture: 'platform_tex' },
            { x: 1240, y: 440, width: 250, height: 20, texture: 'platform_tex' },
            { x: 640, y: 150, width: 350, height: 20, texture: 'platform_tex' }
        ];

        levelData.forEach(data => {
            const platformElement = this.add.tileSprite(data.x, data.y, data.width, data.height, data.texture);
            const textureHeight = platformElement.frame.height;
            const perfectScale = data.height / textureHeight;
            platformElement.setTileScale(perfectScale, perfectScale);
            this.physics.add.existing(platformElement, true);
            this.platforms.add(platformElement);
        });

        const states = ['idle', 'walk', 'jump', 'crouch', 'slide'];
        
        states.forEach(s => {
            const spriteKey = `player_${s}`;
            if (this.textures.exists(spriteKey)) { 
                this.anims.create({
                    key: s,
                    frames: this.anims.generateFrameNumbers(spriteKey, { start: 0 }),
                    frameRate: 8,
                    repeat: (s === 'jump' || s === 'crouch' || s === 'slide') ? 0 : -1 
                });
            }
        });

        this.weapons = this.physics.add.group({
            allowGravity: true,
            immovable: false
        });
        
        this.spawners = [
            { 
                x: 200, y: 210, 
                config: { name: 'shotgun', texture: 'weapon_shotgun', color: 0xffaa00, ammo: 5, fireRate: 1000, speed: 2500, range: 300 },
                nextSpawnTime: 0, isOccupied: false, activeWeapon: null 
            },
            { 
                x: 1080, y: 210, 
                config: { name: 'shotgun', texture: 'weapon_shotgun', color: 0xffaa00, ammo: 5, fireRate: 1000, speed: 2500, range: 300 },
                nextSpawnTime: 0, isOccupied: false, activeWeapon: null 
            },
            { 
                x: 640, y: 280,
                config: { name: 'pistol', texture: 'weapon_pistol', color: 0xffff00, ammo: 15, fireRate: 400, speed: 800, range: 1000 },
                nextSpawnTime: 0, isOccupied: false, activeWeapon: null 
            },
            { 
                x: 640, y: 480, 
                config: { name: 'pistol', texture: 'weapon_pistol', color: 0xffff00, ammo: 15, fireRate: 400, speed: 800, range: 1000 },
                nextSpawnTime: 0, isOccupied: false, activeWeapon: null 
            }
        ];

        this.bullets = this.physics.add.group({
            allowGravity: false
        });
        this.physics.add.collider(this.bullets, this.platforms, (bullet) => {
            bullet.destroy();
        });
        this.p1Shoot = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.p2Shoot = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = this.input.keyboard!.addKeys('W,A,S,D');

        this.player1 = new Player(this, this.p1Status.spawnX, this.p1Status.spawnY, 'player_idle', this.wasd, true, this.p1Color);
        const body1 = this.player1.body as Phaser.Physics.Arcade.Body;
        body1.setMaxVelocity(400, 800);

        this.player2 = new Player(this, this.p2Status.spawnX, this.p2Status.spawnY, 'player_idle', this.cursors, false, this.p2Color);
        const body2 = this.player2.body as Phaser.Physics.Arcade.Body;
        body2.setMaxVelocity(400, 800);

        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);
        this.physics.add.collider(this.weapons, this.platforms);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = this.input.keyboard!.addKeys('W,A,S,D');

        this.p1Interact = this.input.keyboard!.addKeys('E,Q') as any;
        this.p2Interact = {
            PICK: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD),
            DROP: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA)
        };

        const deathZone = this.add.rectangle(640, 1300, 4000, 100, 0xff0000, 0);
        this.physics.add.existing(deathZone, true);

        this.physics.add.overlap(this.player1, deathZone, () => {
            this.killPlayer(1, true);
        });

        this.physics.add.overlap(this.player2, deathZone, () => {
            this.killPlayer(2, true);
        });

        this.physics.add.overlap(this.bullets, this.player1, (_player, b) => {
            const bullet = b as Phaser.GameObjects.Rectangle;
            if (bullet.getData('owner') !== 1) {
                bullet.destroy();
                this.killPlayer(1);
            }
        });

        this.physics.add.overlap(this.bullets, this.player2, (_player, b) => {
            const bullet = b as Phaser.GameObjects.Rectangle;
            if (bullet.getData('owner') !== 2) {
                bullet.destroy();
                this.killPlayer(2);
            }
        });
    }

    update() {
        if (this.isGameOver) return;

        const accel = 2500;
        const normalDrag = 1500;
        const slideDrag = 300;
        const jumpForce = -550;

        if (!this.p1Status.isDead) {
            this.player1.updatePlayer(accel, normalDrag, slideDrag, jumpForce);
        }

        if (!this.p2Status.isDead) {
            this.player2.updatePlayer(accel, normalDrag, slideDrag, jumpForce);
        }

        if (Phaser.Input.Keyboard.JustDown(this.p1Interact.E)) {
            this.tryPickUpWeapon(this.player1, 1);
        }
        if (Phaser.Input.Keyboard.JustDown(this.p1Interact.Q)) {
            this.dropWeapon(1);
        }

        if (Phaser.Input.Keyboard.JustDown(this.p2Interact.PICK)) {
            this.tryPickUpWeapon(this.player2, 2);
        }
        if (Phaser.Input.Keyboard.JustDown(this.p2Interact.DROP)) {
            this.dropWeapon(2);
        }

        if (this.p1Weapon) {
            const offsetX = this.player1.flipX ? -12 : 12; 
            const isP1Crouching = this.player1.anims.currentAnim?.key === 'crouch';
            const offsetY = isP1Crouching ? -5 : -20; 
            
            this.p1Weapon.setPosition(this.player1.x + offsetX, this.player1.y + offsetY);
            this.p1Weapon.setFlipX(this.player1.flipX);
            this.p1Weapon.setDepth(11);
        }

        if (this.p2Weapon) {
            const offsetX = this.player2.flipX ? -12 : 12;
            const isP2Crouching = this.player2.anims.currentAnim?.key === 'crouch';
            const offsetY = isP2Crouching ? -5 : -20;
            
            this.p2Weapon.setPosition(this.player2.x + offsetX, this.player2.y + offsetY);
            this.p2Weapon.setFlipX(this.player2.flipX);
            this.p2Weapon.setDepth(11);
        }

        const time = this.time.now;

        if (this.p1Shoot.isDown && this.p1Weapon) {
            this.tryShoot(this.p1Weapon, this.player1, this.player1.facingRight, time, 1);
        }

        if (this.p2Shoot.isDown && this.p2Weapon) {
            this.tryShoot(this.p2Weapon, this.player2, this.player2.facingRight, time, 2);
        }

        this.bullets.getChildren().forEach((b: any) => {
            const distance = Math.abs(b.x - b.getData('originX'));
            if (distance > b.getData('range')) {
                b.destroy();
            }
        });

        const midX = (this.player1.x + this.player2.x) / 2;
        const midY = (this.player1.y + this.player2.y) / 2;
        this.cameraTarget.setPosition(midX, midY);

        const dist = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, this.player2.x, this.player2.y);
        let zoom = 1000 / (dist + 500); 
        zoom = Phaser.Math.Clamp(zoom, 0.6, 1.3); 
        this.cameras.main.setZoom(zoom);

        const currentTime = this.time.now;

        this.spawners.forEach(spawner => {
            if (!spawner.isOccupied && currentTime > spawner.nextSpawnTime && this.weapons.getLength() < this.maxTotalWeapons) {
                const w = spawner.config;
                const newWeapon = new Weapon(this, spawner.x, spawner.y, w.name, w.texture, w.color, w.ammo, w.fireRate, w.speed, w.range);
                this.weapons.add(newWeapon);
                spawner.activeWeapon = newWeapon;
                spawner.isOccupied = true;
            }

            if (spawner.isOccupied && spawner.activeWeapon && spawner.activeWeapon.isEquipped) {
                spawner.isOccupied = false;
                spawner.activeWeapon = null;
                spawner.nextSpawnTime = currentTime + 5000; 
            }
        });

        this.weapons.getChildren().forEach((w: any) => {
            const weapon = w as Weapon;
            if (!weapon.isEquipped && weapon.currentAmmo <= 0 && !weapon.getData('destroying')) {
                weapon.setData('destroying', true);
                this.time.delayedCall(5000, () => {
                    if (!weapon.isEquipped) {
                        weapon.destroy();
                    } else {
                        weapon.setData('destroying', false);
                    }
                });
            }
        });
    }

    private tryPickUpWeapon(player: Player, playerNum: number) {
        if (playerNum === 1 && this.p1Weapon) return;
        if (playerNum === 2 && this.p2Weapon) return;

        this.physics.world.overlap(player, this.weapons, (_p, w) => {
            const weapon = w as Weapon;

            if (weapon.isEquipped) return;
            if (playerNum === 1 && this.p1Weapon) return;
            if (playerNum === 2 && this.p2Weapon) return;

            weapon.isEquipped = true;
            const body = weapon.body as Phaser.Physics.Arcade.Body;
            body.setEnable(false);

            if (playerNum === 1) {
                this.p1Weapon = weapon;
            }
            if (playerNum === 2) {
                this.p2Weapon = weapon;
            }
        });
    }

    private dropWeapon(playerNum: number) {
        let weaponToDrop: Weapon | null = null;

        if (playerNum === 1 && this.p1Weapon) {
            weaponToDrop = this.p1Weapon;
            this.p1Weapon = null;
        } else if (playerNum === 2 && this.p2Weapon) {
            weaponToDrop = this.p2Weapon;
            this.p2Weapon = null;
        }

        if (weaponToDrop) {
            weaponToDrop.isEquipped = false;
            const body = weaponToDrop.body as Phaser.Physics.Arcade.Body;
            body.setEnable(true);
            body.setVelocityY(-200);
        }
    }

    private tryShoot(weapon: Weapon, player: Player, facingRight: boolean, time: number, ownerNum: number) {
        if (canShoot(time, weapon.lastFired, weapon.fireRate, weapon.currentAmmo, weapon.isEquipped)) {
            weapon.lastFired = time;
            weapon.currentAmmo--;

            const offsetX = facingRight ? 25 : -25;
            const isCrouching = player.anims.currentAnim?.key === 'crouch';
            const spawnY = isCrouching ? player.y - 8 : player.y - 25;
            const bullet = this.add.rectangle(player.x + offsetX, spawnY, 15, 5, weapon.bulletColor);

            this.physics.add.existing(bullet);
            this.bullets.add(bullet);

            const body = bullet.body as Phaser.Physics.Arcade.Body;
            body.setVelocityX(facingRight ? weapon.bulletSpeed : -weapon.bulletSpeed);
            body.setSize(60, 15);
            bullet.setData('originX', bullet.x);
            bullet.setData('range', weapon.range);
            bullet.setData('owner', ownerNum);
        }
    }

    private killPlayer(playerNum: number, ignoreInvul: boolean = false) {
        const status = playerNum === 1 ? this.p1Status : this.p2Status;
        const player = playerNum === 1 ? this.player1 : this.player2;
        const ui = playerNum === 1 ? uiState.p1 : uiState.p2;

        if (!canTakeDamage(status.isDead, status.isInvul, ignoreInvul)) return;

        status.isDead = true;
        ui.lives--;

        if (uiState.p1.lives <= 0 || uiState.p2.lives <= 0) {
            if (!this.pendingGameOver) {
                this.pendingGameOver = true; 

                this.time.delayedCall(100, () => {
                    const winner = checkWinner(uiState.p1.lives, uiState.p2.lives);
                    if (winner !== null) {
                        this.endGame(winner);
                    }
                });
            }

            this.dropWeapon(playerNum); 
            player.setVisible(false); 
            (player.body as Phaser.Physics.Arcade.Body).setEnable(false); 
            return; 
        }
        
        this.dropWeapon(playerNum); 
        player.setVisible(false); 
        (player.body as Phaser.Physics.Arcade.Body).setEnable(false); 

        this.time.delayedCall(3000, () => {
            player.setPosition(status.spawnX, status.spawnY);
            player.setVisible(true);
            
            const body = player.body as Phaser.Physics.Arcade.Body;
            body.setEnable(true);
            body.setVelocity(0, 0);

            status.isDead = false;
            status.isInvul = true;

            const blink = this.tweens.add({
                targets: player,
                alpha: 0.2,
                yoyo: true,
                repeat: -1,
                duration: 150
            });

            this.time.delayedCall(2000, () => {
                status.isInvul = false;
                blink.stop();
                player.setAlpha(1); 
            });
        });
    }

    private endGame(winnerNum: number) {
        this.isGameOver = true;
        this.physics.pause();

        let targetX = 640;
        let targetY = 360;

        if (winnerNum !== 0) { 
            const winnerPlayer = winnerNum === 1 ? this.player1 : this.player2;
            const loserPlayer = winnerNum === 1 ? this.player2 : this.player1;
            loserPlayer.setVisible(false);
            
            targetX = winnerPlayer.x;
            targetY = winnerPlayer.y;
        } else {
            this.player1.setVisible(false);
            this.player2.setVisible(false);
        }

        this.cameras.main.stopFollow(); 
        this.cameras.main.pan(targetX, targetY, 1000, 'Power2');
        this.cameras.main.zoomTo(1.8, 1000, 'Power2');

        const textStr = winnerNum === 0 ? 'Tie!' : `Player ${winnerNum} wins!`;
        
        let textColor = '#ffffff'; 
        if (winnerNum === 1) {
            textColor = '#' + this.p1Color.toString(16).padStart(6, '0');
        } else if (winnerNum === 2) {
            textColor = '#' + this.p2Color.toString(16).padStart(6, '0');
        }
        
        const winText = this.add.text(640, 360, textStr, {
            fontSize: '30px', 
            fontFamily: '"Press Start 2P", monospace',
            color: textColor, 
            backgroundColor: '#000000aa',
            padding: { x: 30, y: 20 },
            align: 'center'
        });
        
        winText.setOrigin(0.5);
        winText.setScrollFactor(0);
        winText.setDepth(100);

        this.time.delayedCall(1000, () => {
            const btnStyle = {
                fontSize: '20px',
                fontFamily: '"Press Start 2P", monospace',
                color: '#ffffff',
                backgroundColor: '#333333aa',
                padding: { x: 20, y: 15 }
            };

            const rematchBtn = this.add.text(640, 440, 'REVANCHA', btnStyle)
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(100)
                .setInteractive({ useHandCursor: true });

            rematchBtn.on('pointerover', () => rematchBtn.setColor('#00ff00'));
            rematchBtn.on('pointerout', () => rematchBtn.setColor('#ffffff'));
            rematchBtn.on('pointerdown', () => {

                uiState.p1.lives = 3;
                uiState.p2.lives = 3;
                this.scene.restart({ p1Color: this.p1Color, p2Color: this.p2Color });
            });

            const menuBtn = this.add.text(640, 500, 'MENÚ', btnStyle)
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(100)
                .setInteractive({ useHandCursor: true });

            menuBtn.on('pointerover', () => menuBtn.setColor('#ff0000'));
            menuBtn.on('pointerout', () => menuBtn.setColor('#ffffff'));
            menuBtn.on('pointerdown', () => {

                uiState.p1.lives = 3;
                uiState.p2.lives = 3;
                this.scene.start('MainMenuScene');
            });
        });
    }
}