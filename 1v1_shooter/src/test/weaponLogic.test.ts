import { describe, it, expect } from 'vitest';
import { canShoot } from '../game/utils/weaponLogic';

describe('Lógica de Disparo de Armas', () => {
  it('Debe permitir disparar si se cumplen todas las condiciones', () => {

    expect(canShoot(1500, 1000, 400, 10, true)).toBe(true);
  });

  it('No debe permitir disparar si el arma no está equipada', () => {
    expect(canShoot(1500, 1000, 400, 10, false)).toBe(false);
  });

  it('No debe permitir disparar si no tiene munición', () => {
    expect(canShoot(1500, 1000, 400, 0, true)).toBe(false);
  });

  it('No debe permitir disparar si el arma está en cooldown (cadencia térmica)', () => {

    expect(canShoot(1200, 1000, 400, 10, true)).toBe(false); 
  });
});