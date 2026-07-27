/**
 * Proxy escritura Gastos → GastoPython (Flask).
 * Headers vía requestContext (mismo patrón ItemPython / InventarioPython).
 *
 * Deuda documentada: X-User-Id sigue originándose en el header entrante
 * (el front lo toma del JWT). No se hace refactor global JWT en esta fase.
 * X-Company-Id EMPRESA se fuerza desde usuario.scope vía getUsuarioScope.
 */
const axios = require('axios');
const { ctxHeaders } = require('../utils/requestContext');

const BASE_URL = process.env.GASTO_PY_BASE_URL || 'http://gasto-python-service:3018';
const TIMEOUT = parseInt(process.env.GASTO_PY_TIMEOUT || '15000', 10);

const http = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

async function crearCategoriaGasto(body, req) {
  const headers = await ctxHeaders(req, body || {});
  const res = await http.post('/api/categoria-gasto', body || {}, { headers });
  return res.data;
}

async function actualizarCategoriaGasto(id, body, req) {
  const headers = await ctxHeaders(req, body || {});
  const res = await http.put(
    `/api/categoria-gasto/${encodeURIComponent(id)}`,
    body || {},
    { headers },
  );
  return res.data;
}

async function cambiarEstadoCategoriaGasto(id, req) {
  const headers = await ctxHeaders(req, {});
  const res = await http.patch(
    `/api/categoria-gasto/${encodeURIComponent(id)}/estado`,
    {},
    { headers },
  );
  return res.data;
}

async function crearGasto(body, req) {
  const headers = await ctxHeaders(req, body || {});
  const res = await http.post('/api/gasto', body || {}, { headers });
  return res.data;
}

async function actualizarGasto(id, body, req) {
  const headers = await ctxHeaders(req, body || {});
  const res = await http.put(
    `/api/gasto/${encodeURIComponent(id)}`,
    body || {},
    { headers },
  );
  return res.data;
}

module.exports = {
  crearCategoriaGasto,
  actualizarCategoriaGasto,
  cambiarEstadoCategoriaGasto,
  crearGasto,
  actualizarGasto,
};
