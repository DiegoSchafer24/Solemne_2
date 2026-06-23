export function calculateDrag(isCrouching: boolean, velocityX: number, normalDrag: number, slideDrag: number): number {

  if (isCrouching && Math.abs(velocityX) > 50) {
    return slideDrag;
  }
  return normalDrag;
}

export function validateJump(isTouchingDown: boolean, canDoubleJump: boolean): { canJump: boolean; useDoubleJump: boolean } {
  if (isTouchingDown) {

    return { canJump: true, useDoubleJump: false };
  } 
  
  if (canDoubleJump) {

    return { canJump: true, useDoubleJump: true };
  }

  return { canJump: false, useDoubleJump: false };
}