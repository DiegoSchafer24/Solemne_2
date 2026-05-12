import Phaser from 'phaser';

export default class Weapon extends Phaser.GameObjects.Rectangle {
  public name: string;
  public maxAmmo: number;
  public currentAmmo: number;
  public fireRate: number;
  public isEquipped: boolean = false;

  constructor(
    scene: Phaser.Scene, 
    x: number, 
    y: number, 
    name: string, 
    color: number, 
    maxAmmo: number, 
    fireRate: number
  ) {

    super(scene, x, y, 30, 15, color);
    
    this.name = name;
    this.maxAmmo = maxAmmo;
    this.currentAmmo = maxAmmo;
    this.fireRate = fireRate;

    scene.add.existing(this);
    
    scene.physics.add.existing(this);

  this.setDepth(20);    

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setDragX(100);
  }
}