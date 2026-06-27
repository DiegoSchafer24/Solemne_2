import Phaser from 'phaser';

export default class Weapon extends Phaser.Physics.Arcade.Sprite {
  public name: string;
  public maxAmmo: number;
  public currentAmmo: number;
  public fireRate: number;
  public bulletSpeed: number;
  public range: number;
  public isEquipped: boolean = false;
  public lastFired: number = 0;
  public bulletColor: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    textureKey: string,
    color: number,
    maxAmmo: number,
    fireRate: number,
    bulletSpeed: number,
    range: number
  ) {

    super(scene, x, y, textureKey);

    this.name = name;
    this.bulletColor = color; 
    this.maxAmmo = maxAmmo;
    this.currentAmmo = maxAmmo;
    this.fireRate = fireRate;
    this.bulletSpeed = bulletSpeed;
    this.range = range;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(20);
    this.setScale(1.5);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setDragX(100);
  }
}
