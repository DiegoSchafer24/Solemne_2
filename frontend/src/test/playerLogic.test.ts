import { describe, it, expect } from 'vitest';
import { canTakeDamage } from '../game/utils/playerLogic';

describe('Lógica de Daño e Invulnerabilidad', () => {
  it('Debe recibir daño en estado normal', () => {
    expect(canTakeDamage(false, false, false)).toBe(true);
  });

  it('NO debe recibir daño si ya está muerto', () => {
    expect(canTakeDamage(true, false, false)).toBe(false);
    expect(canTakeDamage(true, false, true)).toBe(false);
  });

  it('NO debe recibir daño de una bala normal si tiene inmunidad', () => {
    expect(canTakeDamage(false, true, false)).toBe(false);
  });

  it('Debe recibir daño de la Zona de Muerte aunque tenga inmunidad', () => {
    expect(canTakeDamage(false, true, true)).toBe(true);
  });
});