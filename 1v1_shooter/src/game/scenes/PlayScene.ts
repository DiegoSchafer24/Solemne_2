import Phaser from 'phaser';
import { calculateDrag, validateJump } from '../utils/physicsLogic';
import { canTakeDamage } from '../utils/playerLogic';
import Weapon from '../entities/Weapon';
import { canShoot } from '../utils/weaponLogic';
import { uiState } from '../../state/uiState';
import { checkWinner } from '../utils/gameLogic';


export default class PlayScene extends Phaser.Scene {

    //Escenario
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private cameraTarget!: Phaser.GameObjects.Zone;

    //Jugadores
    private player1!: Phaser.GameObjects.Rectangle;
    private player2!: Phaser.GameObjects.Rectangle;
    private p1FacingRight: boolean = true;
    private p2FacingRight: boolean = false;
    private p1Status = { isDead: false, isInvul: false, spawnX: 50, spawnY: 500 };
    private p2Status = { isDead: false, isInvul: false, spawnX: 1230, spawnY: 500 };
    private isGameOver: boolean = false;
    private pendingGameOver: boolean = false;

    //Movimiento
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: any;
    private p1CanDoubleJump: boolean = true;
    private p2CanDoubleJump: boolean = true;

    //Armas
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

    preload() {

    }

    create() {

        //Escenario
        this.cameras.main.setBackgroundColor('#2d2d2d');
        this.platforms = this.physics.add.staticGroup();
        this.cameraTarget = this.add.zone(640, 360, 1, 1);
        this.cameras.main.startFollow(this.cameraTarget, false, 0.1, 0.1);

        const levelData = [
            { x: 640, y: 700, width: 1280, height: 200 }, //Suelo base
            { x: 350, y: 480, width: 250, height: 20 },   //Izquierda
            { x: 930, y: 480, width: 250, height: 20 },   //Derecha
            { x: 640, y: 280, width: 350, height: 20 }    //Arriba centro
        ];

        levelData.forEach(data => {
            const plat = this.add.rectangle(data.x, data.y, data.width, data.height, 0xffffff);
            this.physics.add.existing(plat, true);

            this.platforms.add(plat);
        });

        //Armas
        this.weapons = this.physics.add.group({
            allowGravity: true,
            immovable: false
        });
        
        this.spawners = [
            { 
                x: 640, y: 400,
                config: { name: 'Pistola', color: 0xffff00, ammo: 15, fireRate: 400, speed: 800, range: 1000 },
                nextSpawnTime: 0,
                isOccupied: false,
                activeWeapon: null 
            },
            { 
                x: 640, y: 200, 
                config: { name: 'Escopeta', color: 0xffaa00, ammo: 5, fireRate: 1000, speed: 2500, range: 300 },
                nextSpawnTime: 0,
                isOccupied: false,
                activeWeapon: null 
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

        //Jugadores
        this.player1 = this.add.rectangle(50, 500, 35, 35, 0xff0000);
        this.player1.setOrigin(0.5, 1);
        this.player1.setDepth(10);
        this.physics.add.existing(this.player1);
        const body1 = this.player1.body as Phaser.Physics.Arcade.Body;
        body1.setMaxVelocity(400, 800);

        this.player2 = this.add.rectangle(1230, 500, 35, 35, 0x0000ff);
        this.player2.setOrigin(0.5, 1);
        this.player2.setDepth(10);
        this.physics.add.existing(this.player2);
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

        this.physics.add.overlap(this.bullets, this.player1, (_player, bullet) => {
            bullet.destroy();
            this.killPlayer(1);
        });

        this.physics.add.overlap(this.bullets, this.player2, (_player, bullet) => {
            bullet.destroy();
            this.killPlayer(2);
        });

    }

    update() {

        if (this.isGameOver) return;

        const accel = 2500;
        const normalDrag = 1500;
        const slideDrag = 300;
        const jumpForce = -550;

        const body1 = this.player1.body as Phaser.Physics.Arcade.Body;
        const body2 = this.player2.body as Phaser.Physics.Arcade.Body;

        //Jugador 1
        if (!this.p1Status.isDead) {
        body1.setAccelerationX(0);

        const isP1Crouching = this.wasd.S.isDown;
        body1.setDragX(calculateDrag(isP1Crouching, body1.velocity.x, normalDrag, slideDrag));

        if (isP1Crouching) {
            this.player1.setScale(1, 0.5);
        }
        else {
            this.player1.setScale(1, 1);
            if (this.wasd.A.isDown) {
                body1.setAccelerationX(-accel);
                this.p1FacingRight = false; // NUEVO
            }
            else if (this.wasd.D.isDown) {
                body1.setAccelerationX(accel);
                this.p1FacingRight = true;  // NUEVO
            }
        }

        if (body1.touching.down) {
            this.p1CanDoubleJump = true;
        }

        if (Phaser.Input.Keyboard.JustDown(this.wasd.W)) {
            const jumpStatus = validateJump(body1.touching.down, this.p1CanDoubleJump);

            if (jumpStatus.canJump) {
                body1.setVelocityY(jumpForce);
                if (jumpStatus.useDoubleJump) {
                    this.p1CanDoubleJump = false;
                }
            }
        }
        }

        //Jugador 2
        if (!this.p2Status.isDead) {
        body2.setAccelerationX(0);

        const isP2Crouching = this.cursors.down.isDown;
        body2.setDragX(calculateDrag(isP2Crouching, body2.velocity.x, normalDrag, slideDrag));

        if (isP2Crouching) {
            this.player2.setScale(1, 0.5);
        }
        else {
            this.player2.setScale(1, 1);
            if (this.cursors.left.isDown) {
                body2.setAccelerationX(-accel);
                this.p2FacingRight = false;
        }   
            else if (this.cursors.right.isDown) {
                body2.setAccelerationX(accel);
                this.p2FacingRight = true;
        }
        }

        if (body2.touching.down) {
            this.p2CanDoubleJump = true;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            const jumpStatus = validateJump(body2.touching.down, this.p2CanDoubleJump);

            if (jumpStatus.canJump) {
                body2.setVelocityY(jumpForce);
                if (jumpStatus.useDoubleJump) {
                    this.p2CanDoubleJump = false;
                }
            }
        }
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
            this.p1Weapon.setPosition(this.player1.x, this.player1.y - 15);
        }

        if (this.p2Weapon) {
            this.p2Weapon.setPosition(this.player2.x, this.player2.y - 15);
        }

        const time = this.time.now;

        if (this.p1Shoot.isDown && this.p1Weapon) {
            this.tryShoot(this.p1Weapon, this.player1, this.p1FacingRight, time);
        }

        if (this.p2Shoot.isDown && this.p2Weapon) {
            this.tryShoot(this.p2Weapon, this.player2, this.p2FacingRight, time);
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

                const newWeapon = new Weapon(this, spawner.x, spawner.y, w.name, w.color, w.ammo, w.fireRate, w.speed, w.range);
            
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

    //Fin update

    private tryPickUpWeapon(player: Phaser.GameObjects.Rectangle, playerNum: number) {

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

            if (playerNum === 1) this.p1Weapon = weapon;
            if (playerNum === 2) this.p2Weapon = weapon;
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

    private tryShoot(weapon: Weapon, player: Phaser.GameObjects.Rectangle, facingRight: boolean, time: number) {
        
        if (canShoot(time, weapon.lastFired, weapon.fireRate, weapon.currentAmmo, weapon.isEquipped)) {
            
            weapon.lastFired = time;
            weapon.currentAmmo--;

            const offsetX = facingRight ? 25 : -25;
            const bullet = this.add.rectangle(player.x + offsetX, player.y - 15, 15, 5, weapon.fillColor);
            
            this.physics.add.existing(bullet);
            this.bullets.add(bullet);
            
            const body = bullet.body as Phaser.Physics.Arcade.Body;
            body.setVelocityX(facingRight ? weapon.bulletSpeed : -weapon.bulletSpeed); 
            
            bullet.setData('originX', bullet.x);
            bullet.setData('range', weapon.range);
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
        const textColor = winnerNum === 0 ? '#ffffff' : (winnerNum === 1 ? '#ff0000' : '#0000ff');
        
        const winText = this.add.text(640, 360, textStr, {
            fontSize: '45px', 
            color: textColor, 
            fontStyle: 'bold',
            backgroundColor: '#000000aa',
            padding: { x: 30, y: 15 },
            align: 'center'
        });
        
        winText.setOrigin(0.5);
        winText.setScrollFactor(0);
        winText.setDepth(100);
    }

}