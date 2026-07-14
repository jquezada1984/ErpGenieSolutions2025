// Util compartido del gateway para proxies Python de ítems e inventario.
// Misma lógica de scope/headers que terceroPython (sin acoplar esos módulos al archivo de terceros).
const axios = require('axios');

const NESTJS_SERVICE_URL = process.env.NESTJS_SERVICE_URL || 'http://localhost:3000';

const inicioNestHttp = axios.create({
  baseURL: NESTJS_SERVICE_URL,
  timeout: 10000,
});

const USUARIO_SCOPE_QUERY = `
  query ($id_usuario: ID!) {
    usuario(id_usuario: $id_usuario) {
      id_usuario
      id_empresa
      scope_acceso
    }
  }
`;

/**
 * Obtiene id_empresa y scope_acceso del usuario desde InicioNestJs GraphQL.
 * @param {object} req - request del gateway (headers)
 * @returns {Promise<{ id_empresa: string, scope_acceso: string } | null>}
 */
async function getUsuarioScope(req) {
  const idUsuario = req.headers['x-user-id'] || req.headers['X-User-Id'] || '';
  if (!idUsuario) return null;

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(req.headers.authorization && { Authorization: req.headers.authorization }),
    };
    const res = await inicioNestHttp.post('/graphql', {
      query: USUARIO_SCOPE_QUERY,
      variables: { id_usuario: idUsuario },
    }, { headers });

    const data = res.data?.data?.usuario;
    if (!data) return null;
    return {
      id_empresa: data.id_empresa || '',
      scope_acceso: data.scope_acceso || 'EMPRESA',
    };
  } catch (err) {
    console.warn('⚠️ getUsuarioScope failed:', err.response?.data || err.message);
    return null;
  }
}

/**
 * Construye headers X-Company-Id, X-User-Id y X-Scope-Acceso según scope_acceso del usuario.
 * - GLOBAL: permite body.id_empresa o header, fallback a usuario.id_empresa
 * - EMPRESA (u otro): fuerza X-Company-Id = usuario.id_empresa
 */
async function ctxHeaders(req, body = {}) {
  const idUsuario = req.headers['x-user-id'] || req.headers['X-User-Id'] || '';
  const usuario = await getUsuarioScope(req);

  let idEmpresaFinal;
  if (usuario) {
    if (usuario.scope_acceso === 'GLOBAL') {
      idEmpresaFinal = body.id_empresa || req.headers['x-company-id'] || req.headers['X-Company-Id'] || usuario.id_empresa || '';
      console.log('[scope] usuario.scope_acceso=GLOBAL, idEmpresaFinal=', idEmpresaFinal);
    } else {
      idEmpresaFinal = usuario.id_empresa || '';
      console.log('[scope] usuario.scope_acceso=' + (usuario.scope_acceso || 'EMPRESA') + ', idEmpresaFinal=', idEmpresaFinal);
    }
  } else {
    idEmpresaFinal = req.headers['x-company-id'] || req.headers['X-Company-Id'] || body.id_empresa || '';
  }

  const scopeAcceso = usuario?.scope_acceso || 'EMPRESA';

  return {
    'X-Company-Id': idEmpresaFinal,
    'X-User-Id': idUsuario,
    'X-Scope-Acceso': scopeAcceso,
  };
}

module.exports = {
  getUsuarioScope,
  ctxHeaders,
};
