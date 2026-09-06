const { resolveCtxHeaders, ctxHeaders } = require('../requestContext');

describe('resolveCtxHeaders', () => {
  const empresaJwt = 'emp-jwt-111';
  const empresaSel = 'emp-sel-222';

  test('EMPRESA fuerza X-Company-Id del usuario e ignora body/header', () => {
    const headers = resolveCtxHeaders(
      { id_empresa: empresaJwt, scope_acceso: 'EMPRESA' },
      'user-1',
      { id_empresa: empresaSel },
      { 'x-company-id': empresaSel },
    );
    expect(headers['X-Company-Id']).toBe(empresaJwt);
    expect(headers['X-User-Id']).toBe('user-1');
    expect(headers['X-Scope-Acceso']).toBe('EMPRESA');
  });

  test('GLOBAL acepta body.id_empresa', () => {
    const headers = resolveCtxHeaders(
      { id_empresa: empresaJwt, scope_acceso: 'GLOBAL' },
      'user-g',
      { id_empresa: empresaSel },
      {},
    );
    expect(headers['X-Company-Id']).toBe(empresaSel);
    expect(headers['X-Scope-Acceso']).toBe('GLOBAL');
  });

  test('GLOBAL usa header si no hay body', () => {
    const headers = resolveCtxHeaders(
      { id_empresa: empresaJwt, scope_acceso: 'GLOBAL' },
      'user-g',
      {},
      { 'X-Company-Id': empresaSel },
    );
    expect(headers['X-Company-Id']).toBe(empresaSel);
  });

  test('GLOBAL hace fallback a usuario.id_empresa', () => {
    const headers = resolveCtxHeaders(
      { id_empresa: empresaJwt, scope_acceso: 'GLOBAL' },
      'user-g',
      {},
      {},
    );
    expect(headers['X-Company-Id']).toBe(empresaJwt);
  });

  test('sin usuario usa header o body', () => {
    expect(
      resolveCtxHeaders(null, 'u1', {}, { 'x-company-id': empresaSel })['X-Company-Id'],
    ).toBe(empresaSel);
    expect(
      resolveCtxHeaders(null, 'u1', { id_empresa: empresaJwt }, {})['X-Company-Id'],
    ).toBe(empresaJwt);
    expect(resolveCtxHeaders(null, 'u1', {}, {})['X-Scope-Acceso']).toBe('EMPRESA');
  });
});

describe('ctxHeaders', () => {
  test('delega a getUsuarioScope y resolveCtxHeaders', async () => {
    const rc = require('../requestContext');
    const spy = jest.spyOn(rc, 'getUsuarioScope').mockResolvedValue({
      id_empresa: 'emp-a',
      scope_acceso: 'EMPRESA',
    });
    const req = { headers: { 'x-user-id': 'u-1', 'x-company-id': 'emp-hack' } };
    const out = await rc.ctxHeaders(req, { id_empresa: 'emp-hack' });
    expect(out['X-Company-Id']).toBe('emp-a');
    expect(out['X-User-Id']).toBe('u-1');
    spy.mockRestore();
  });
});
