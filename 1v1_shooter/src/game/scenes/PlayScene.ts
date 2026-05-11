import Phaser from 'phaser';

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
        const platLeft = this.add.rectangle(350, 450, 350, 20, 0xffffff);
        this.physics.add.existing(platLeft, true);
        this.platforms.add(platLeft);
        const platRight = this.add.rectangle(930, 450, 350, 20, 0xffffff);
        this.physics.add.existing(platRight, true);
        this.platforms.add(platRight);
        const platTop = this.add.rectangle(640, 280, 350, 20, 0xffffff);
        this.physics.add.existing(platTop, true);
        this.platforms.add(platTop);

        //Jugadores
        this.player1 = this.add.rectangle(200, 200, 35, 35, 0xff0000);
        this.player1.setOrigin(0.5, 1);
        this.physics.add.existing(this.player1);

        this.player2 = this.add.rectangle(1080, 200, 35, 35, 0x0000ff);
        this.player2.setOrigin(0.5, 1);
        this.physics.add.existing(this.player2);

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
        const speed = 500;
        const jumpForce = -700;

        const body1 = this.player1.body as Phaser.Physics.Arcade.Body;
        const body2 = this.player2.body as Phaser.Physics.Arcade.Body;

        body1.setVelocityX(0);

        if (this.wasd.S.isDown) {
            this.player1.setScale(1, 0.5);
        } else {
            this.player1.setScale(1, 1);
        }

        if (this.wasd.A.isDown) {
            body1.setVelocityX(-speed);
        } else if (this.wasd.D.isDown) {
            body1.setVelocityX(speed);
        }

        if (this.wasd.W.isDown && body1.touching.down) {
            body1.setVelocityY(jumpForce);
        }

        body2.setVelocityX(0);

        if (this.cursors.down.isDown) {
            this.player2.setScale(1, 0.5);
        } else {
            this.player2.setScale(1, 1);
        }

        if (this.cursors.left.isDown) {
            body2.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            body2.setVelocityX(speed);
        }

        if (this.cursors.up.isDown && body2.touching.down) {
            body2.setVelocityY(jumpForce);
        }
    }
}