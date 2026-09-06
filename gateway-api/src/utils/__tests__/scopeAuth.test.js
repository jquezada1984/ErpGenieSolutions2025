const {
  isCallerScopeGlobal,
  stripScopeIfNotGlobal,
  decodeJwtPayload,
} = require('../scopeAuth');

function bearerWithScope(scope) {
  const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({ scope_acceso: scope, id_empresa: 'e1' }),
  ).toString('base64url');
  return `Bearer ${header}.${payload}.sig`;
}

describe('scopeAuth', () => {
  test('isCallerScopeGlobal true solo si JWT es GLOBAL', () => {
    expect(isCallerScopeGlobal(bearerWithScope('GLOBAL'))).toBe(true);
    expect(isCallerScopeGlobal(bearerWithScope('EMPRESA'))).toBe(false);
    expect(isCallerScopeGlobal(null)).toBe(false);
  });

  test('stripScopeIfNotGlobal quita scope_acceso si caller no es GLOBAL', () => {
    const body = { username: 'a', scope_acceso: 'GLOBAL', id_empresa: 'e1' };
    const stripped = stripScopeIfNotGlobal(body, bearerWithScope('EMPRESA'));
    expect(stripped).toEqual({ username: 'a', id_empresa: 'e1' });
    expect(stripped).not.toHaveProperty('scope_acceso');
  });

  test('stripScopeIfNotGlobal conserva scope si caller es GLOBAL', () => {
    const body = { username: 'a', scope_acceso: 'GLOBAL' };
    expect(stripScopeIfNotGlobal(body, bearerWithScope('GLOBAL'))).toEqual(body);
  });

  test('decodeJwtPayload lee claim', () => {
    const p = decodeJwtPayload(bearerWithScope('GLOBAL'));
    expect(p.scope_acceso).toBe('GLOBAL');
  });
});
