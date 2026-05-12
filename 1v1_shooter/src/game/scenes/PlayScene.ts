import Phaser from 'phaser';
import { calculateDrag, validateJump } from '../utils/physicsLogic';

export default class PlayScene extends Phaser.Scene {

    //Escenario
    private floor!: Phaser.GameObjects.Rectangle;
    private platforms!: Phaser.Physics.Arcade.StaticGroup;

    //Jugadores
    private player1!: Phaser.GameObjects.Rectangle;
    private player2!: Phaser.GameObjects.Rectangle;

    //Movimiento
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: any;
    private p1CanDoubleJump: boolean = true;
    private p2CanDoubleJump: boolean = true;


    constructor() {
        super({ key: 'PlayScene' });
    }

    preload() {

    }

    create() {

        //Escenario
        this.cameras.main.setBackgroundColor('#2d2d2d');
        this.floor = this.add.rectangle(640, 700, 1280, 200, 0xffffff);
        this.physics.add.existing(this.floor, true);
        this.platforms = this.physics.add.staticGroup();
        const platLeft1 = this.add.rectangle(300, 500, 350, 25, 0xffffff);
        this.physics.add.existing(platLeft1, true);
        this.platforms.add(platLeft1);
        const platLeft2 = this.add.rectangle(400, 400, 350, 25, 0xffffff);
        this.physics.add.existing(platLeft2, true);
        this.platforms.add(platLeft2);
        const platRight1 = this.add.rectangle(980, 500, 350, 25, 0xffffff);
        this.physics.add.existing(platRight1, true);
        this.platforms.add(platRight1);
        const platRight2 = this.add.rectangle(880, 400, 350, 25, 0xffffff);
        this.physics.add.existing(platRight2, true);
        this.platforms.add(platRight2);
        const platTop = this.add.rectangle(640, 300, 500, 25, 0xffffff);
        this.physics.add.existing(platTop, true);
        this.platforms.add(platTop);

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

        this.physics.add.collider(this.player1, this.floor);
        this.physics.add.collider(this.player2, this.floor);
        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player2, this.platforms);


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