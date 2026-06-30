import Phaser from 'phaser';
import { canTakeDamage } from '../utils/playerLogic';
import Weapon from '../entities/Weapon';
import { canShoot } from '../utils/weaponLogic';
import { uiState } from '../../state/uiState';
import { checkWinner } from '../utils/gameLogic';
import Player, { type RuntimePlayerControls } from '../entities/Player';
import { controlState } from './controlState';

type SpawnPoint = {
    x: number;
    y: number;
};

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
    private p1Controls!: RuntimePlayerControls;
    private p2Controls!: RuntimePlayerControls;
    private weapons!: Phaser.Physics.Arcade.Group;
    private p1Weapon: Weapon | null = null;
    private p2Weapon: Weapon | null = null;
    private bullets!: Phaser.Physics.Arcade.Group;
    private p1AmmoText!: Phaser.GameObjects.Text;
    private p2AmmoText!: Phaser.GameObjects.Text;
    private spawners: any[] = [];
    private respawnPoints: SpawnPoint[] = [];
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

        this.load.audio('sfx_pistol', '/assets/sounds/pistol.wav');
        this.load.audio('sfx_shotgun', '/assets/sounds/shotgun.wav');
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

        this.respawnPoints = this.createRespawnPoints(levelData);

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
        this.p1Controls = this.input.keyboard!.addKeys(controlState.player1) as RuntimePlayerControls;
        this.p2Controls = this.input.keyboard!.addKeys(controlState.player2) as RuntimePlayerControls;

        this.player1 = new Player(this, this.p1Status.spawnX, this.p1Status.spawnY, 'player_idle', this.p1Controls, true, this.p1Color);
        const body1 = this.player1.body as Phaser.Physics.Arcade.Body;
        body1.setMaxVelocity(400, 800);

        this.player2 = new Player(this, this.p2Status.spawnX, this.p2Status.spawnY, 'player_idle', this.p2Controls, false, this.p2Color);
        const body2 = this.player2.body as Phaser.Physics.Arcade.Body;
        body2.setMaxVelocity(400, 800);

        this.p1AmmoText = this.createAmmoText();
        this.p2AmmoText = this.createAmmoText();

        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);
        this.physics.add.collider(this.weapons, this.platforms, (weaponObject, _platformObject) => {
            const weapon = weaponObject as Weapon;
            const body = weapon.body as Phaser.Physics.Arcade.Body;

            if (weapon.getData('thrownBy')) {
                weapon.setData('thrownBy', null);
            }

            if (body.touching.down && !weapon.getData('isSettling')) {
                weapon.setData('isSettling', true);

                body.setAngularVelocity(0);

                const targetAngle = Math.abs(weapon.angle) < 90 ? 0 : 180;

                this.tweens.add({
                    targets: weapon,
                    angle: targetAngle,
                    duration: 150,
                    ease: 'Cubic.easeOut'
                });

                body.setDragX(800);
                
                body.setBounceY(0.1);
            }
        });

        const deathZone = this.add.rectangle(640, 1300, 4000, 100, 0xff0000, 0);
        this.physics.add.existing(deathZone, true);

        this.physics.add.overlap(this.player1, deathZone, () => {
            this.killPlayer(1, true);
        });

        this.physics.add.overlap(this.player2, deathZone, () => {
            this.killPlayer(2, true);
        });

        this.physics.add.overlap(deathZone, this.weapons, (_zone, weaponObject) => {
            (weaponObject as Weapon).destroy();
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

        this.physics.add.overlap(this.player1, this.weapons, (p, w) => {
            this.handleWeaponCollision(p as Player, 1, w as Weapon);
        });
        this.physics.add.overlap(this.player2, this.weapons, (p, w) => {
            this.handleWeaponCollision(p as Player, 2, w as Weapon);
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

        if (Phaser.Input.Keyboard.JustDown(this.p1Controls.interact)) {
            if (this.p1Weapon) {
                this.dropWeapon(this.player1, 1);
            } else {
                this.tryPickUpWeapon(this.player1, 1);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.p2Controls.interact)) {
            if (this.p2Weapon) {
                this.dropWeapon(this.player2, 2);
            } else {
                this.tryPickUpWeapon(this.player2, 2);
            }
        }

        if (this.p1Weapon) {
            const offsetX = this.player1.flipX ? -18 : 18;
            const isP1Crouching = this.player1.anims.currentAnim?.key === 'crouch';
            const offsetY = isP1Crouching ? -20 : -30;
            
            this.p1Weapon.setPosition(this.player1.x + offsetX, this.player1.y + offsetY);
            this.p1Weapon.setFlipX(this.player1.flipX);
            this.p1Weapon.setDepth(11);
        }

        if (this.p2Weapon) {
            const offsetX = this.player2.flipX ? -18 : 18;
            const isP2Crouching = this.player2.anims.currentAnim?.key === 'crouch';
            const offsetY = isP2Crouching ? -20 : -30;
            
            this.p2Weapon.setPosition(this.player2.x + offsetX, this.player2.y + offsetY);
            this.p2Weapon.setFlipX(this.player2.flipX);
            this.p2Weapon.setDepth(11);
        }

        const time = this.time.now;

        if (this.p1Controls.shoot.isDown && this.p1Weapon) {
            this.tryShoot(this.p1Weapon, this.player1, this.player1.facingRight, time, 1);
        }

        if (this.p2Controls.shoot.isDown && this.p2Weapon) {
            this.tryShoot(this.p2Weapon, this.player2, this.player2.facingRight, time, 2);
        }

        this.bullets.getChildren().forEach((b: any) => {
            const distance = Math.abs(b.x - b.getData('originX'));
            if (distance > b.getData('range')) {
                b.destroy();
            }
        });

        this.updateAmmoIndicator(this.player1, this.p1Weapon, this.p1AmmoText);
        this.updateAmmoIndicator(this.player2, this.p2Weapon, this.p2AmmoText);

        const midX = (this.player1.x + this.player2.x) / 2;
        const midY = (this.player1.y + this.player2.y) / 2;
        this.cameraTarget.setPosition(midX, midY);

        this.updateCameraZoom();
        this.updateWeaponSpawners();

        this.weapons.getChildren().forEach((w: any) => {
            const weapon = w as Weapon;
            const body = weapon.body as Phaser.Physics.Arcade.Body;

            if (body) {

                if (!body.touching.down && weapon.getData('isSettling')) {
                    weapon.setData('isSettling', false);
                    
                    body.setDragX(100); 
                }
            }

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

    private updateCameraZoom() {
        const dist = Phaser.Math.Distance.Between(this.player1.x, this.player1.y, this.player2.x, this.player2.y);
        let zoom = 1000 / (dist + 500);
        zoom = Phaser.Math.Clamp(zoom, 0.6, 1.3);
        this.cameras.main.setZoom(zoom);
    }

    private updateWeaponSpawners() {
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
    }

    private createRespawnPoints(levelData: Array<{ x: number, y: number, height: number }>): SpawnPoint[] {
        const platformSpawnOffset = 10;
        const platformSpawnPoints = levelData.map(data => ({
            x: data.x,
            y: data.y - (data.height / 2) - platformSpawnOffset
        }));

        return [
            { x: this.p1Status.spawnX, y: this.p1Status.spawnY },
            { x: this.p2Status.spawnX, y: this.p2Status.spawnY },
            ...platformSpawnPoints
        ];
    }

    private getRandomRespawnPoint(): SpawnPoint {
        return Phaser.Utils.Array.GetRandom(this.respawnPoints);
    }

    private createAmmoText(): Phaser.GameObjects.Text {
        return this.add.text(0, 0, '', {
            fontSize: '18px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#ffff00'
        })
            .setOrigin(0.5)
            .setDepth(30)
            .setVisible(false);
    }

    private updateAmmoIndicator(player: Player, weapon: Weapon | null, ammoText: Phaser.GameObjects.Text) {
        if (!weapon || !player.visible) {
            ammoText.setVisible(false);
            return;
        }

        ammoText.setText(weapon.currentAmmo.toString());
        ammoText.setColor(weapon.currentAmmo <= 0 ? '#ff0000' : '#ffff00');
        ammoText.setPosition(player.x, player.y - player.displayHeight - 12);
        ammoText.setVisible(true);
    }

    private tryPickUpWeapon(player: Player, playerNum: number) {
        if (playerNum === 1 && this.p1Weapon) return;
        if (playerNum === 2 && this.p2Weapon) return;

        this.physics.world.overlap(player, this.weapons, (_p, w) => {
            const weapon = w as Weapon;

            if (weapon.isEquipped) return;
            if (playerNum === 1 && this.p1Weapon) return;
            if (playerNum === 2 && this.p2Weapon) return;

            this.tweens.killTweensOf(weapon);

            weapon.isEquipped = true;
            weapon.setAngle(0);

            const body = weapon.body as Phaser.Physics.Arcade.Body;
            body.setEnable(false);
            body.setAngularVelocity(0);

            if (playerNum === 1) {
                this.p1Weapon = weapon;
            }
            if (playerNum === 2) {
                this.p2Weapon = weapon;
            }
        });
    }

    private dropWeapon(player: Player, playerNum: number) {
        let weaponToDrop: Weapon | null = null;
        let playerWeaponRef: 'p1Weapon' | 'p2Weapon' | null = null;
        let controls: RuntimePlayerControls | null = null;

        if (playerNum === 1 && this.p1Weapon) {
            weaponToDrop = this.p1Weapon;
            playerWeaponRef = 'p1Weapon';
            controls = this.p1Controls;
        } else if (playerNum === 2 && this.p2Weapon) {
            weaponToDrop = this.p2Weapon;
            playerWeaponRef = 'p2Weapon';
            controls = this.p2Controls;
        }

        if (weaponToDrop && playerWeaponRef && player.body && controls) {
            this[playerWeaponRef] = null;

            weaponToDrop.isEquipped = false;
            weaponToDrop.setData('thrownBy', playerNum);

            const body = weaponToDrop.body as Phaser.Physics.Arcade.Body;
            body.setEnable(true);

            const baseThrowSpeedX = 550;
            const baseThrowSpeedY = 350;
            const playerMomentumFactor = 0.5;

            let directionX = 0;
            let directionY = 0;

            const hasHorizontalInput = controls.left.isDown || controls.right.isDown;
            const hasVerticalInput = controls.up.isDown || controls.down.isDown;

            if (hasHorizontalInput || hasVerticalInput) {
                if (controls.up.isDown) directionY = -1;
                if (controls.down.isDown) directionY = 1;
                if (controls.left.isDown) directionX = -1;
                if (controls.right.isDown) directionX = 1;
            } else {
                directionX = player.facingRight ? 1 : -1;
                directionY = -0.75;
            }

            if (hasVerticalInput && !hasHorizontalInput) {
                directionX = 0;
            }

            if (hasHorizontalInput && !hasVerticalInput) {
                directionY = -0.5;
            }

            const finalVelocityX = (player.body.velocity.x * playerMomentumFactor) + (directionX * baseThrowSpeedX);
            let finalVelocityY = (player.body.velocity.y * playerMomentumFactor) + (directionY * baseThrowSpeedY);

            finalVelocityY = Phaser.Math.Clamp(finalVelocityY, -1000, 800);

            body.setVelocity(finalVelocityX, finalVelocityY);
            body.setAngularVelocity(directionX !== 0 ? (directionX > 0 ? 600 : -600) : (player.facingRight ? 300 : -300));
        }
    }

    private tryShoot(weapon: Weapon, player: Player, facingRight: boolean, time: number, ownerNum: number) {
        if (canShoot(time, weapon.lastFired, weapon.fireRate, weapon.currentAmmo, weapon.isEquipped)) {
            weapon.lastFired = time;
            weapon.currentAmmo--;

            if (weapon.name === 'pistol') {
                this.sound.play('sfx_pistol', { volume: 0.5 });
            } else if (weapon.name === 'shotgun') {
                this.sound.play('sfx_shotgun', { volume: 0.5 });
            }

            const offsetX = facingRight ? 38 : -38;
            const isCrouching = player.anims.currentAnim?.key === 'crouch';
            const spawnY = isCrouching ? player.y - 12 : player.y - 38;
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

            this.dropWeapon(player, playerNum);
            player.setVisible(false);
            (player.body as Phaser.Physics.Arcade.Body).setEnable(false);
            return;
        }
        
        this.dropWeapon(player, playerNum);
        player.setVisible(false);
        (player.body as Phaser.Physics.Arcade.Body).setEnable(false);

        this.time.delayedCall(3000, () => {
            const respawnPoint = this.getRandomRespawnPoint();
            status.spawnX = respawnPoint.x;
            status.spawnY = respawnPoint.y;

            player.setPosition(respawnPoint.x, respawnPoint.y);
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
        this.p1AmmoText.setVisible(false);
        this.p2AmmoText.setVisible(false);

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

        const textStr = winnerNum === 0 ? 'Tie!' : `JUGADOR ${winnerNum} GANA!`;
        
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

    private handleWeaponCollision(player: Player, playerNum: number, weapon: Weapon) {
        const weaponBody = weapon.body as Phaser.Physics.Arcade.Body;
        if (!weaponBody) return;

        const thrownBy = weapon.getData('thrownBy');
        const isDangerous = !weapon.isEquipped && weaponBody.velocity.length() > 150 && thrownBy && thrownBy !== playerNum;

        const status = playerNum === 1 ? this.p1Status : this.p2Status;
        if (!isDangerous || status.isDead || status.isInvul) {
            return;
        }

        weapon.setData('thrownBy', null);

        const playerBody = player.body as Phaser.Physics.Arcade.Body;
        if (playerBody) {
            const knockbackForce = 250;
            playerBody.setVelocity(knockbackForce * (weaponBody.velocity.x > 0 ? 1 : -1), -200);
        }

        if (playerNum === 1 ? this.p1Weapon : this.p2Weapon) {
            this.dropWeapon(player, playerNum);
        }
    }
}
