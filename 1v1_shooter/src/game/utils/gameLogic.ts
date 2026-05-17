export function checkWinner(p1Lives: number, p2Lives: number): number | null {
    if (p1Lives <= 0 && p2Lives <= 0) return 0; // NUEVO: Ambas vidas en 0 = Empate
    if (p1Lives <= 0) return 2; 
    if (p2Lives <= 0) return 1; 
    return null; 
}