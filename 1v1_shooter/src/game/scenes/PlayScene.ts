import Phaser from 'phaser';
import { calculateDrag, validateJump } from '../utils/physicsLogic';
import Weapon from '../entities/Weapon';

export default class PlayScene extends Phaser.Scene {

    //Escenario
    private platforms!: Phaser.Physics.Arcade.StaticGroup;

    //Jugadores
    private player1!: Phaser.GameObjects.Rectangle;
    private player2!: Phaser.GameObjects.Rectangle;

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

    constructor() {
        super({ key: 'PlayScene' });
    }

    preload() {

    }

    create() {

        //Escenario
        this.cameras.main.setBackgroundColor('#2d2d2d');
        this.platforms = this.physics.add.staticGroup();

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
        const pistol = new Weapon(this, 640, 400, 'Pistola', 0xffff00, 15, 400);
        this.weapons.add(pistol);
        const shotgun = new Weapon(this, 640, 200, 'Escopeta', 0xffaa00, 5, 1000);
        this.weapons.add(shotgun);

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

        (this.player1.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        (this.player2.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);

        this.physics.add.collider(this.weapons, this.platforms);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = this.input.keyboard!.addKeys('W,A,S,D');

        this.p1Interact = this.input.keyboard!.addKeys('E,Q') as any;
        this.p2Interact = {
            PICK: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD), // .
            DROP: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA)   // ,
        };

    }

    update() {
        const accel = 2500; 
        const normalDrag = 1500; 
        const slideDrag = 300; 
        const jumpForce = -550;

        const body1 = this.player1.body as Phaser.Physics.Arcade.Body;
        const body2 = this.player2.body as Phaser.Physics.Arcade.Body;

        //Jugador 1
        body1.setAccelerationX(0);

        const isP1Crouching = this.wasd.S.isDown;
        body1.setDragX(calculateDrag(isP1Crouching, body1.velocity.x, normalDrag, slideDrag));

        if (isP1Crouching) {
            this.player1.setScale(1, 0.5);
    } 
            else {
            this.player1.setScale(1, 1);
            if (this.wasd.A.isDown) body1.setAccelerationX(-accel);
            else if (this.wasd.D.isDown) body1.setAccelerationX(accel);
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

        //Jugador 2
        body2.setAccelerationX(0);

        const isP2Crouching = this.cursors.down.isDown;
        body2.setDragX(calculateDrag(isP2Crouching, body2.velocity.x, normalDrag, slideDrag));

        if (isP2Crouching) {
            this.player2.setScale(1, 0.5);
    } 
            else {
            this.player2.setScale(1, 1);
            if (this.cursors.left.isDown) body2.setAccelerationX(-accel);
            else if (this.cursors.right.isDown) body2.setAccelerationX(accel);
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

  }

  private tryPickUpWeapon(player: Phaser.GameObjects.Rectangle, playerNum: number) {

    if (playerNum === 1 && this.p1Weapon) return;
    if (playerNum === 2 && this.p2Weapon) return;

    this.physics.world.overlap(player, this.weapons, (p, w) => {
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

}