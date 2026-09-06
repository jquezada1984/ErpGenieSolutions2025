/**
 * POST/PUT /usuarios: strip scope_acceso si el caller no es GLOBAL.
 * Invoca el plugin Fastify con inject (sin Python real).
 */
const Fastify = require('fastify');

jest.mock('../../services', () => ({
  pythonService: {
    createUsuario: jest.fn(async (data) => ({ ok: true, echo: data })),
    updateUsuario: jest.fn(async (id, data) => ({ ok: true, id, echo: data })),
  },
}));

const { pythonService } = require('../../services');
const routes = require('../usuarios');

function bearer(scope) {
  const payload = Buffer.from(
    JSON.stringify({ scope_acceso: scope, id_empresa: 'e1' }),
  ).toString('base64');
  return `Bearer x.${payload}.y`;
}

describe('routes/usuarios scope strip', () => {
  let app;

  beforeEach(async () => {
    jest.clearAllMocks();
    app = Fastify({ logger: false });
    await app.register(routes, { prefix: '/api' });
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  test('POST EMPRESA quita scope_acceso GLOBAL del body', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/usuarios',
      headers: { authorization: bearer('EMPRESA') },
      payload: {
        id_empresa: 'e1',
        id_perfil: 'p1',
        username: 'u1',
        password: 'secret',
        scope_acceso: 'GLOBAL',
      },
    });
    expect(res.statusCode).toBe(201);
    expect(pythonService.createUsuario).toHaveBeenCalled();
    const sent = pythonService.createUsuario.mock.calls[0][0];
    expect(sent).not.toHaveProperty('scope_acceso');
    expect(sent.username).toBe('u1');
  });

  test('POST GLOBAL conserva scope_acceso', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/usuarios',
      headers: { authorization: bearer('GLOBAL') },
      payload: {
        id_empresa: 'e1',
        id_perfil: 'p1',
        username: 'u2',
        password: 'secret',
        scope_acceso: 'GLOBAL',
      },
    });
    expect(res.statusCode).toBe(201);
    const sent = pythonService.createUsuario.mock.calls[0][0];
    expect(sent.scope_acceso).toBe('GLOBAL');
  });

  test('PUT EMPRESA quita scope_acceso', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/usuarios/uid-1',
      headers: { authorization: bearer('EMPRESA') },
      payload: { nombre_completo: 'Ana', scope_acceso: 'GLOBAL' },
    });
    expect(res.statusCode).toBe(200);
    const sent = pythonService.updateUsuario.mock.calls[0][1];
    expect(sent).not.toHaveProperty('scope_acceso');
    expect(sent.nombre_completo).toBe('Ana');
  });
});
