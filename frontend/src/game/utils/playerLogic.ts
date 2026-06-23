export function canTakeDamage(isDead: boolean, isInvulnerable: boolean, ignoreInvulnerability: boolean): boolean {
    if (isDead) return false;
    if (isInvulnerable && !ignoreInvulnerability) return false;
    return true;
}