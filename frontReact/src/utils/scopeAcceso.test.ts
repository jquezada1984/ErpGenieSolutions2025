import { describe, expect, it } from 'vitest';
import { isScopeGlobal } from './scopeAcceso';

describe('isScopeGlobal', () => {
  it('true solo para GLOBAL (case-insensitive, trim)', () => {
    expect(isScopeGlobal({ scope_acceso: 'GLOBAL' })).toBe(true);
    expect(isScopeGlobal({ scope_acceso: ' global ' })).toBe(true);
    expect(isScopeGlobal({ scope_acceso: 'Global' })).toBe(true);
  });

  it('false para EMPRESA, vacío, null o undefined', () => {
    expect(isScopeGlobal({ scope_acceso: 'EMPRESA' })).toBe(false);
    expect(isScopeGlobal({ scope_acceso: '' })).toBe(false);
    expect(isScopeGlobal({})).toBe(false);
    expect(isScopeGlobal(null)).toBe(false);
    expect(isScopeGlobal(undefined)).toBe(false);
  });
});
