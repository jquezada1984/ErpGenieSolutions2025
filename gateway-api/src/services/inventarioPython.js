const axios = require('axios');
const { ctxHeaders } = require('./terceroPython');

const BASE_URL = process.env.INVENTARIO_PY_BASE_URL || 'http://inventario-python-service:3014';
const TIMEOUT = parseInt(process.env.INVENTARIO_PY_TIMEOUT || '15000', 10);

const http = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

async function inventarioFwdHeaders(req, payload = {}) {
  const base = await ctxHeaders(req, payload);
  const auth = req.headers.authorization || req.headers.Authorization;
  return {
    ...base,
    ...(auth ? { Authorization: auth } : {}),
  };
}

async function crearInventario(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/inventario', payload, { headers });
  return res.data;
}

async function actualizarEstadoInventario(id_inventario, estado, req) {
  const payload = {
    id_inventario,
    estado,
  };
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.patch('/api/inventario/estado', payload, { headers });
  return res.data;
}

/**
 * Actualizar cabecera inventario → InventarioPython PUT /api/inventario/:id_inventario
 * (sin fallback a ItemPython ni NestJS).
 */
async function actualizarInventario(id_inventario, body, req) {
  const payload = body || {};
  const id = encodeURIComponent(String(id_inventario || '').trim());
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.put(`/api/inventario/${id}`, payload, { headers });
  return res.data;
}

module.exports = {
  crearInventario,
  actualizarEstadoInventario,
  actualizarInventario,
};
