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
        this.physics.add.existing(this.player1);
        const body1 = this.player1.body as Phaser.Physics.Arcade.Body;
        body1.setMaxVelocity(400, 800);

        this.player2 = this.add.rectangle(1230, 500, 35, 35, 0x0000ff);
        this.player2.setOrigin(0.5, 1);
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
  }
}