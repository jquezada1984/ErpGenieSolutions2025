const axios = require('axios');
const { ctxHeaders } = require('../utils/requestContext');

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
  const payload = { id_inventario, estado };
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.patch('/api/inventario/estado', payload, { headers });
  return res.data;
}

async function actualizarInventario(id_inventario, body, req) {
  const payload = body || {};
  const id = encodeURIComponent(String(id_inventario || '').trim());
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.put(`/api/inventario/${id}`, payload, { headers });
  return res.data;
}

async function cerrarInventario(id_inventario, body, req) {
  const payload = body || {};
  const id = encodeURIComponent(String(id_inventario || '').trim());
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post(`/api/inventario/${id}/cerrar`, payload, { headers });
  return res.data;
}

async function crearAlmacen(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/almacen', payload, { headers });
  return res.data;
}

async function actualizarAlmacen(id_almacen, body, req) {
  const payload = body || {};
  const id = encodeURIComponent(String(id_almacen || '').trim());
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.put(`/api/almacen/${id}`, payload, { headers });
  return res.data;
}

async function upsertSaldo(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/stock/saldo', payload, { headers });
  return res.data;
}

async function crearMovimiento(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/stock/movimiento', payload, { headers });
  return res.data;
}

async function crearTransferencia(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/stock/transferencia', payload, { headers });
  return res.data;
}

async function completarTransferencia(id, body, req) {
  const payload = body || {};
  const enc = encodeURIComponent(String(id || '').trim());
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post(`/api/stock/transferencia/${enc}/completar`, payload, { headers });
  return res.data;
}

async function crearCambioMasivo(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/stock/cambio-masivo', payload, { headers });
  return res.data;
}

async function completarCambioMasivo(id, body, req) {
  const payload = body || {};
  const enc = encodeURIComponent(String(id || '').trim());
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post(`/api/stock/cambio-masivo/${enc}/completar`, payload, { headers });
  return res.data;
}

async function upsertLote(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/stock/lote', payload, { headers });
  return res.data;
}

async function stockAFecha(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/stock/a-fecha', payload, { headers });
  return res.data;
}

async function stockReposicion(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/stock/reposicion', payload, { headers });
  return res.data;
}

async function stockValoracionPmp(body, req) {
  const payload = body || {};
  const headers = await inventarioFwdHeaders(req, payload);
  const res = await http.post('/api/stock/valoracion-pmp', payload, { headers });
  return res.data;
}

module.exports = {
  crearInventario,
  actualizarEstadoInventario,
  actualizarInventario,
  cerrarInventario,
  crearAlmacen,
  actualizarAlmacen,
  upsertSaldo,
  crearMovimiento,
  crearTransferencia,
  completarTransferencia,
  crearCambioMasivo,
  completarCambioMasivo,
  upsertLote,
  stockAFecha,
  stockReposicion,
  stockValoracionPmp,
};
