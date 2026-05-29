import Phaser from 'phaser';
import { calculateDrag, validateJump } from '../utils/physicsLogic';
export const PLAYER_STATES = { IDLE: 0, WALK: 1, JUMP: 2, CROUCH: 3, SLIDE: 4 };

export default class Player extends Phaser.Physics.Arcade.Sprite {
    public isDead: boolean = false;
    public facingRight: boolean = true;
    
    private currentState: number = PLAYER_STATES.IDLE;
    private controls: any;
    private canDoubleJump: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string, controls: any, facingRight: boolean, playerColor: number) {
        super(scene, x, y, textureKey);
        this.controls = controls;
        this.facingRight = facingRight;
        this.setOrigin(0.5, 1);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false); 
        this.body!.setSize(24, 40, false);
        this.body!.setOffset(4, 8);
        this.setDepth(10);
        this.setTint(playerColor);
        
        this.play('idle');
    }

    updatePlayer(accel: number, normalDrag: number, slideDrag: number, jumpForce: number) {

        if (this.isDead) return;

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setAccelerationX(0);

        const isCrouching = this.controls.S ? this.controls.S.isDown : this.controls.down.isDown;
        const leftDown = this.controls.A ? this.controls.A.isDown : this.controls.left.isDown;
        const rightDown = this.controls.D ? this.controls.D.isDown : this.controls.right.isDown;
        const upJustDown = this.controls.W ? Phaser.Input.Keyboard.JustDown(this.controls.W) : Phaser.Input.Keyboard.JustDown(this.controls.up);

        body.setDragX(calculateDrag(isCrouching, body.velocity.x, normalDrag, slideDrag));

        if (isCrouching) {
            this.setScale(1, 0.5);
            this.currentState = PLAYER_STATES.CROUCH;
        } else {
            this.setScale(1, 1);
            if (leftDown) {
                body.setAccelerationX(-accel);
                this.facingRight = false;
                this.flipX = true;
            } else if (rightDown) {
                body.setAccelerationX(accel);
                this.facingRight = true;
                this.flipX = false;
            }
        }

        if (body.touching.down) {
            this.canDoubleJump = true;
        }

        if (upJustDown) {
            const jumpStatus = validateJump(body.touching.down, this.canDoubleJump);
            if (jumpStatus.canJump) {
                body.setVelocityY(jumpForce);
                if (jumpStatus.useDoubleJump) {
                    this.canDoubleJump = false;
                    this.play('jump'); 
                }
            }
        }

        const isActuallyMoving = Math.abs(body.velocity.x) > 5; 

        if (!body.touching.down) {
            this.currentState = PLAYER_STATES.JUMP; 
        } else if (isCrouching) {
            this.currentState = Math.abs(body.velocity.x) > 50 ? PLAYER_STATES.SLIDE : PLAYER_STATES.CROUCH;
            this.setScale(1, 0.5); 
            body.setSize(24, 20, false); 
            body.setOffset(4, 28); 
        } else {
            this.setScale(1, 1); 
            body.setSize(24, 40, false); 
            body.setOffset(4, 8);

            this.currentState = isActuallyMoving ? PLAYER_STATES.WALK : PLAYER_STATES.IDLE;
        }

        this.updateAnimation();
    }

    private updateAnimation() {

        const stateKeys = ['idle', 'walk', 'jump', 'crouch', 'crouch'];
        const animToPlay = stateKeys[this.currentState];
        
        if (this.scene.anims.exists(animToPlay)) {
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== animToPlay) {
                this.play(animToPlay, true);
            }
        } else {
            this.stop(); 
            const walkTextureKey = `player_${animToPlay}`;
            
            if (this.scene.textures.exists(walkTextureKey)) {
                this.setTexture(walkTextureKey);
                this.setFrame(0);
            }
        }
    }
}