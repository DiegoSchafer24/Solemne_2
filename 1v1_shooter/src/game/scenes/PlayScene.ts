import Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {

    private floor!: Phaser.GameObjects.Rectangle;
    private player1!: Phaser.GameObjects.Rectangle;
    private player2!: Phaser.GameObjects.Rectangle;

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

        //Jugadores
        this.player1 = this.add.rectangle(200, 200, 50, 50, 0x0000ff);
        this.physics.add.existing(this.player1);

        this.player2 = this.add.rectangle(1080, 200, 50, 50, 0xff0000);
        this.physics.add.existing(this.player2);

        (this.player1.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        (this.player2.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

        this.physics.add.collider(this.player1, this.floor);
        this.physics.add.collider(this.player2, this.floor);

    }

    update() {

    }
}