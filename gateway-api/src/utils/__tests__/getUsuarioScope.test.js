const mockPost = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn(() => ({ post: mockPost })),
}));

describe('getUsuarioScope', () => {
  let getUsuarioScope;

  beforeAll(() => {
    jest.resetModules();
    ({ getUsuarioScope } = require('../requestContext'));
  });

  beforeEach(() => {
    mockPost.mockReset();
  });

  test('sin x-user-id retorna null', async () => {
    await expect(getUsuarioScope({ headers: {} })).resolves.toBeNull();
    expect(mockPost).not.toHaveBeenCalled();
  });

  test('consulta GraphQL y mapea scope_acceso', async () => {
    mockPost.mockResolvedValue({
      data: {
        data: {
          usuario: {
            id_usuario: 'u1',
            id_empresa: 'emp-1',
            scope_acceso: 'GLOBAL',
          },
        },
      },
    });
    const out = await getUsuarioScope({
      headers: { 'x-user-id': 'u1', authorization: 'Bearer t' },
    });
    expect(out).toEqual({ id_empresa: 'emp-1', scope_acceso: 'GLOBAL' });
    expect(mockPost).toHaveBeenCalledWith(
      '/graphql',
      expect.objectContaining({
        variables: { id_usuario: 'u1' },
      }),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer t' }),
      }),
    );
  });

  test('sin usuario en respuesta retorna null', async () => {
    mockPost.mockResolvedValue({ data: { data: { usuario: null } } });
    await expect(
      getUsuarioScope({ headers: { 'x-user-id': 'u1' } }),
    ).resolves.toBeNull();
  });

  test('error HTTP retorna null', async () => {
    mockPost.mockRejectedValue({ message: 'network', response: { data: 'x' } });
    await expect(
      getUsuarioScope({ headers: { 'X-User-Id': 'u1' } }),
    ).resolves.toBeNull();
  });

  test('scope_acceso por defecto EMPRESA si viene vacío', async () => {
    mockPost.mockResolvedValue({
      data: {
        data: {
          usuario: { id_usuario: 'u1', id_empresa: 'e', scope_acceso: null },
        },
      },
    });
    const out = await getUsuarioScope({ headers: { 'x-user-id': 'u1' } });
    expect(out.scope_acceso).toBe('EMPRESA');
  });
});
