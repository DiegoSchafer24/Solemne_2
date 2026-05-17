import { describe, it, expect } from 'vitest';
import { checkWinner } from '../game/utils/gameLogic';

describe('Lógica de Fin de Juego y Victoria', () => {
  it('Debe devolver null si ambos jugadores tienen vidas (La partida continúa)', () => {
    expect(checkWinner(3, 3)).toBeNull();
    expect(checkWinner(1, 1)).toBeNull();
  });

  it('Debe declarar ganador al Jugador 1 (retorna 1) si el Jugador 2 se queda sin vidas', () => {
    expect(checkWinner(2, 0)).toBe(1);
    expect(checkWinner(3, -1)).toBe(1);
  });

  it('Debe declarar ganador al Jugador 2 (retorna 2) si el Jugador 1 se queda sin vidas', () => {
    expect(checkWinner(0, 2)).toBe(2);
    expect(checkWinner(-2, 1)).toBe(2);
  });

  it('Debe declarar empate (retorna 0) si ambos se quedan sin vidas en la ventana de intercambio', () => {
    expect(checkWinner(0, 0)).toBe(0);
    expect(checkWinner(-1, 0)).toBe(0);
    expect(checkWinner(-1, -2)).toBe(0);
  });
});