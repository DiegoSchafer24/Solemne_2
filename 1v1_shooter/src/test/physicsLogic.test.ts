import { describe, it, expect } from 'vitest';
import { calculateDrag, validateJump } from '../game/utils/physicsLogic';

describe('Lógica de Físicas y Movimiento', () => {
  
  describe('calculateDrag (Deslizamiento y Fricción)', () => {
    const normal = 1500;
    const slide = 300;

    it('Debería retornar fricción normal si el jugador NO está agachado', () => {
      expect(calculateDrag(false, 100, normal, slide)).toBe(normal);
    });

    it('Debería retornar fricción de deslizamiento si está agachado y va rápido', () => {
      expect(calculateDrag(true, 100, normal, slide)).toBe(slide);
    });

    it('Debería retornar fricción normal si está agachado pero va muy lento', () => {
      expect(calculateDrag(true, 10, normal, slide)).toBe(normal);
    });
  });

  describe('validateJump (Sistema de Doble Salto)', () => {
    it('Debería permitir el salto normal sin gastar el doble salto si toca el piso', () => {
      const result = validateJump(true, true);
      expect(result.canJump).toBe(true);
      expect(result.useDoubleJump).toBe(false);
    });

    it('Debería permitir el salto aéreo y gastarlo si no toca el piso pero lo tiene disponible', () => {
      const result = validateJump(false, true);
      expect(result.canJump).toBe(true);
      expect(result.useDoubleJump).toBe(true);
    });

    it('Debería denegar el salto si no toca el piso y ya gastó su doble salto', () => {
      const result = validateJump(false, false);
      expect(result.canJump).toBe(false);
      expect(result.useDoubleJump).toBe(false);
    });
  });
});