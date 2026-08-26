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

const ME_AUTH_QUERY = `
  query {
    me {
      user {
        id_usuario
        id_empresa
        scope_acceso
      }
    }
  }
`;

function authContextError(status, message) {
  const err = new Error(message);
  err.response = {
    status,
    data: {
      success: false,
      error: message,
    },
  };
  return err;
}

function extractBearerAuthorization(req) {
  const auth = req.headers.authorization || req.headers.Authorization || '';
  if (!auth || typeof auth !== 'string') return '';
  const trimmed = auth.trim();
  if (!trimmed.toLowerCase().startsWith('bearer ')) return '';
  const token = trimmed.slice(7).trim();
  if (!token) return '';
  return `Bearer ${token}`;
}

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

/**
 * Contexto FAIL CLOSED para escrituras sensibles (STOCK INICIAL).
 * Identidad confiable únicamente desde InicioNestJs `me` + Authorization.
 * Ignora X-User-Id entrante como autoridad.
 */
async function authenticatedWriteContext(req, body = {}) {
  const authorization = extractBearerAuthorization(req);
  if (!authorization) {
    throw authContextError(401, 'Sesión no válida o expirada.');
  }

  let res;
  try {
    res = await inicioNestHttp.post(
      '/graphql',
      { query: ME_AUTH_QUERY },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorization,
        },
      },
    );
  } catch (err) {
    const status = err.response?.status;
    if (status === 401) {
      throw authContextError(401, 'Sesión no válida o expirada.');
    }
    if (status === 403) {
      throw authContextError(403, 'Sesión no válida o expirada.');
    }
    console.warn('⚠️ authenticatedWriteContext me failed:', err.response?.data || err.message);
    throw authContextError(500, 'No se pudo completar la operación.');
  }

  const gqlErrors = res.data?.errors;
  if (Array.isArray(gqlErrors) && gqlErrors.length > 0) {
    const authStatus = explicitGraphqlAuthStatus(gqlErrors);
    if (authStatus === 401) {
      throw authContextError(401, 'Sesión no válida o expirada.');
    }
    if (authStatus === 403) {
      throw authContextError(403, 'Sesión no válida o expirada.');
    }
    console.warn('⚠️ authenticatedWriteContext GraphQL errors:', gqlErrors);
    throw authContextError(500, 'No se pudo completar la operación.');
  }

  const user = res.data?.data?.me?.user;
  if (!user) {
    throw authContextError(500, 'No se pudo completar la operación.');
  }

  const idUsuario = String(user.id_usuario || '').trim();
  const idEmpresaUsuario = String(user.id_empresa || '').trim();
  const scopeRaw = user.scope_acceso == null ? '' : String(user.scope_acceso).trim();
  if (!scopeRaw) {
    throw authContextError(500, 'No se pudo completar la operación.');
  }
  const scopeAcceso = scopeRaw.toUpperCase();

  if (!idUsuario) {
    throw authContextError(500, 'No se pudo completar la operación.');
  }

  let idEmpresaFinal;
  if (scopeAcceso === 'GLOBAL') {
    idEmpresaFinal = String(
      body.id_empresa ||
        req.headers['x-company-id'] ||
        req.headers['X-Company-Id'] ||
        idEmpresaUsuario ||
        '',
    ).trim();
  } else if (scopeAcceso === 'EMPRESA') {
    idEmpresaFinal = idEmpresaUsuario;
  } else {
    throw authContextError(500, 'No se pudo completar la operación.');
  }

  if (!idEmpresaFinal) {
    throw authContextError(500, 'No se pudo completar la operación.');
  }

  return {
    Authorization: authorization,
    'X-User-Id': idUsuario,
    'X-Company-Id': idEmpresaFinal,
    'X-Scope-Acceso': scopeAcceso,
  };
}

/**
 * Solo evidencia explícita de auth en GraphQL (código/statusCode).
 * Sin heurísticas de mensaje.
 * @returns {401|403|null}
 */
function explicitGraphqlAuthStatus(gqlErrors) {
  for (const err of gqlErrors) {
    const ext = err?.extensions || {};
    const code = String(ext.code || '').toUpperCase();
    const statusCode = Number(ext.statusCode || ext.originalError?.statusCode || 0);
    if (code === 'UNAUTHENTICATED' || code === 'UNAUTHORIZED' || statusCode === 401) {
      return 401;
    }
    if (code === 'FORBIDDEN' || statusCode === 403) {
      return 403;
    }
  }
  return null;
}

module.exports = {
  getUsuarioScope,
  ctxHeaders,
  authenticatedWriteContext,
};
