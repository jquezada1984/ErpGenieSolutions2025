const axios = require('axios');

const BASE_URL = process.env.BANCO_CAJA_PY_BASE_URL || 'http://banco-caja-python-service:3015';
const NESTJS_SERVICE_URL = process.env.NESTJS_SERVICE_URL || 'http://nestjs-service:3001';

const http = axios.create({ baseURL: BASE_URL, timeout: 15000 });
const inicioNestHttp = axios.create({ baseURL: NESTJS_SERVICE_URL, timeout: 10000 });

const USUARIO_SCOPE_QUERY = `
  query ($id_usuario: ID!) {
    usuario(id_usuario: $id_usuario) {
      id_usuario
      id_empresa
      scope_acceso
    }
  }
`;

async function getUsuarioScope(req) {
  const idUsuario = req.headers['x-user-id'] || req.headers['X-User-Id'] || '';
  if (!idUsuario) return null;
  try {
    const res = await inicioNestHttp.post(
      '/graphql',
      { query: USUARIO_SCOPE_QUERY, variables: { id_usuario: idUsuario } },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(req.headers.authorization && { Authorization: req.headers.authorization }),
        },
      },
    );
    const data = res.data?.data?.usuario;
    if (!data) return null;
    return { id_empresa: data.id_empresa || '', scope_acceso: data.scope_acceso || 'EMPRESA' };
  } catch {
    return null;
  }
}

async function ctxHeaders(req, body = {}) {
  const idUsuario = req.headers['x-user-id'] || req.headers['X-User-Id'] || '';
  const usuario = await getUsuarioScope(req);
  let idEmpresaFinal;
  if (usuario) {
    if (usuario.scope_acceso === 'GLOBAL') {
      idEmpresaFinal =
        body.id_empresa ||
        req.headers['x-company-id'] ||
        req.headers['X-Company-Id'] ||
        usuario.id_empresa ||
        '';
    } else {
      idEmpresaFinal = usuario.id_empresa || '';
    }
  } else {
    idEmpresaFinal =
      req.headers['x-company-id'] || req.headers['X-Company-Id'] || body.id_empresa || '';
  }
  return {
    'X-Company-Id': idEmpresaFinal,
    'X-User-Id': idUsuario,
    'X-Scope-Acceso': usuario?.scope_acceso || 'EMPRESA',
    'Content-Type': 'application/json',
    ...(req.headers.authorization && { Authorization: req.headers.authorization }),
  };
}

async function crearBanco(body, req) {
  const res = await http.post('/api/banco', body, { headers: await ctxHeaders(req, body) });
  return res.data;
}

async function actualizarBanco(id, body, req) {
  const res = await http.put(`/api/banco/${id}`, body, { headers: await ctxHeaders(req, body) });
  return res.data;
}

async function eliminarBanco(id, req) {
  const res = await http.delete(`/api/banco/${id}`, { headers: await ctxHeaders(req, {}) });
  return res.data;
}

async function crearCuentaBancaria(body, req) {
  const res = await http.post('/api/cuenta-bancaria', body, { headers: await ctxHeaders(req, body) });
  return res.data;
}

async function actualizarCuentaBancaria(id, body, req) {
  const res = await http.put(`/api/cuenta-bancaria/${id}`, body, {
    headers: await ctxHeaders(req, body),
  });
  return res.data;
}

async function eliminarCuentaBancaria(id, req) {
  const res = await http.delete(`/api/cuenta-bancaria/${id}`, {
    headers: await ctxHeaders(req, {}),
  });
  return res.data;
}

async function crearMovimientoBancario(body, req) {
  const res = await http.post('/api/movimiento-bancario', body, {
    headers: await ctxHeaders(req, body),
  });
  return res.data;
}

async function actualizarMovimientoBancario(id, body, req) {
  const res = await http.put(`/api/movimiento-bancario/${id}`, body, {
    headers: await ctxHeaders(req, body),
  });
  return res.data;
}

async function eliminarMovimientoBancario(id, req) {
  const res = await http.delete(`/api/movimiento-bancario/${id}`, {
    headers: await ctxHeaders(req, {}),
  });
  return res.data;
}

async function crearTransferenciaBancaria(body, req) {
  const res = await http.post('/api/transferencia-bancaria', body, {
    headers: await ctxHeaders(req, body),
  });
  return res.data;
}

async function eliminarTransferenciaBancaria(id, req) {
  const res = await http.delete(`/api/transferencia-bancaria/${id}`, {
    headers: await ctxHeaders(req, {}),
  });
  return res.data;
}

module.exports = {
  crearBanco,
  actualizarBanco,
  eliminarBanco,
  crearCuentaBancaria,
  actualizarCuentaBancaria,
  eliminarCuentaBancaria,
  crearMovimientoBancario,
  actualizarMovimientoBancario,
  eliminarMovimientoBancario,
  crearTransferenciaBancaria,
  eliminarTransferenciaBancaria,
};
