// src/services/terceroPython.js
const axios = require('axios');

const BASE_URL = process.env.TERCERO_PY_BASE_URL || 'http://localhost:3004';
const NESTJS_SERVICE_URL = process.env.NESTJS_SERVICE_URL || 'http://localhost:3000';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

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
 * Construye headers X-Company-Id y X-User-Id según scope_acceso del usuario.
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

async function crearTercero(body, req) {
  const headers = await ctxHeaders(req, body);
  
  // Remover id_empresa del body si está presente (se pasa por header)
  const bodyToSend = { ...body };
  if (bodyToSend.id_empresa) {
    // Mantenerlo en el body también por si acaso el backend lo necesita
  }
  
  console.log('📤 Gateway -> TerceroPython: Crear tercero', { headers, body: bodyToSend });
  const res = await http.post('/api/tercero', bodyToSend, { headers });
  console.log('✅ Gateway <- TerceroPython: Tercero creado', res.data);
  return res.data;
}

async function actualizarTercero(idTercero, body, req) {
  const res = await http.put(`/api/tercero/${idTercero}`, body, { headers: await ctxHeaders(req, body) });
  return res.data;
}

async function eliminarTercero(idTercero, req) {
  const res = await http.delete(`/api/tercero/${idTercero}`, { headers: await ctxHeaders(req, {}) });
  return res.data;
}

// ----- Contactos (TerceroPython mismo servicio) -----
async function crearContacto(body, req) {
  const headers = await ctxHeaders(req, body);
  console.log('📤 Gateway -> TerceroPython: POST /contactos', { id_tercero: body?.id_tercero });
  const res = await http.post('/api/contactos', body, { headers });
  console.log('✅ Gateway <- TerceroPython: Contacto creado', res.data?.id_contacto);
  return res.data;
}

async function listarContactosByTercero(idTercero, req) {
  const res = await http.get(`/api/contactos/tercero/${idTercero}`, { headers: await ctxHeaders(req, {}) });
  return res.data;
}

async function obtenerContacto(idContacto, req) {
  const res = await http.get(`/api/contactos/${idContacto}`, { headers: await ctxHeaders(req, {}) });
  return res.data;
}

async function actualizarContacto(idContacto, body, req) {
  const res = await http.put(`/api/contactos/${idContacto}`, body, { headers: await ctxHeaders(req, body) });
  return res.data;
}

async function toggleContactoEstado(idContacto, req) {
  const res = await http.patch(`/api/contactos/${idContacto}/estado`, {}, { headers: await ctxHeaders(req, {}) });
  return res.data;
}

module.exports = {
  crearTercero,
  actualizarTercero,
  eliminarTercero,
  crearContacto,
  listarContactosByTercero,
  obtenerContacto,
  actualizarContacto,
  toggleContactoEstado,
  ctxHeaders,
};
