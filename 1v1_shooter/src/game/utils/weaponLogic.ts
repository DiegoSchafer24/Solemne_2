export function canShoot(
    currentTime: number, 
    lastFired: number, 
    fireRate: number, 
    currentAmmo: number, 
    isEquipped: boolean
): boolean {
    return (currentTime > lastFired + fireRate) && (currentAmmo > 0) && isEquipped;
}