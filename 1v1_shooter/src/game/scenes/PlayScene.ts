import Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
    }

    preload() {

    }

    create() {

        this.cameras.main.setBackgroundColor('#2d2d2d');


        //Texto de prueba
        this.add.text(20, 20, 'Hola Mundo', {
            fontSize: '24px',
            color: '#00ff00'
        });
    }

    update() {

    }
}