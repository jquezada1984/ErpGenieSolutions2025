const axios = require('axios');
const { ctxHeaders, authenticatedWriteContext } = require('../utils/requestContext');

const BASE_URL = process.env.ALMACEN_PY_BASE_URL || 'http://almacen-python-service:3018';
const TIMEOUT = parseInt(process.env.ALMACEN_PY_TIMEOUT || '15000', 10);

const http = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

async function almacenFwdHeaders(req, payload = {}) {
  const base = await ctxHeaders(req, payload);
  const auth = req.headers.authorization || req.headers.Authorization;
  return {
    ...base,
    ...(auth ? { Authorization: auth } : {}),
  };
}

/**
 * Crear almacén → AlmacenPython POST /api/almacen.
 * Identidad FAIL CLOSED vía authenticatedWriteContext (`me`), igual que writers stock.
 */
async function crearAlmacen(body, req) {
  const payload = body || {};
  const headers = await authenticatedWriteContext(req, payload);
  const res = await http.post('/api/almacen', payload, { headers });
  return res.data;
}

/**
 * STOCK INICIAL → AlmacenPython POST /api/almacen/stock-inicial.
 * Identidad FAIL CLOSED vía authenticatedWriteContext (`me`).
 * Conserva status y body para distinguir creación de replay.
 */
async function crearStockInicial(body, req) {
  const payload = body || {};
  const headers = await authenticatedWriteContext(req, payload);
  const res = await http.post('/api/almacen/stock-inicial', payload, { headers });
  return {
    status: res.status,
    data: res.data,
  };
}

/**
 * ENTRADA STOCK → AlmacenPython POST /api/almacen/stock-entrada.
 * Misma identidad FAIL CLOSED que STOCK INICIAL (`me`).
 */
async function crearEntradaStock(body, req) {
  const payload = body || {};
  const headers = await authenticatedWriteContext(req, payload);
  const res = await http.post('/api/almacen/stock-entrada', payload, { headers });
  return {
    status: res.status,
    data: res.data,
  };
}

/**
 * SALIDA STOCK → AlmacenPython POST /api/almacen/stock-salida.
 * Misma identidad FAIL CLOSED que STOCK INICIAL / ENTRADA (`me`).
 */
async function crearSalidaStock(body, req) {
  const payload = body || {};
  const headers = await authenticatedWriteContext(req, payload);
  const res = await http.post('/api/almacen/stock-salida', payload, { headers });
  return {
    status: res.status,
    data: res.data,
  };
}

/**
 * AJUSTE STOCK → AlmacenPython POST /api/almacen/stock-ajuste.
 * Misma identidad FAIL CLOSED. No interpreta tipo_ajuste ni saldos.
 */
async function crearAjusteStock(body, req) {
  const payload = body || {};
  const headers = await authenticatedWriteContext(req, payload);
  const res = await http.post('/api/almacen/stock-ajuste', payload, { headers });
  return {
    status: res.status,
    data: res.data,
  };
}

/**
 * TRANSFERENCIA STOCK → AlmacenPython POST /api/almacen/stock-transferencia.
 * Misma identidad FAIL CLOSED. Atomicidad y patas TRF_* en Python.
 */
async function crearTransferenciaStock(body, req) {
  const payload = body || {};
  const headers = await authenticatedWriteContext(req, payload);
  const res = await http.post('/api/almacen/stock-transferencia', payload, { headers });
  return {
    status: res.status,
    data: res.data,
  };
}

/**
 * CAMBIO MASIVO STOCK → AlmacenPython POST /api/almacen/stock-cambio-masivo.
 * Misma identidad FAIL CLOSED. Body intacto; 1 POST; lote atómico en Python.
 */
async function crearCambioMasivoStock(body, req) {
  const payload = body || {};
  const headers = await authenticatedWriteContext(req, payload);
  const res = await http.post('/api/almacen/stock-cambio-masivo', payload, { headers });
  return {
    status: res.status,
    data: res.data,
  };
}

/**
 * Actualizar cabecera almacén → AlmacenPython PUT /api/almacen/:id_almacen.
 * Identidad FAIL CLOSED vía authenticatedWriteContext (`me`), igual que writers stock.
 */
async function actualizarAlmacen(id_almacen, body, req) {
  const payload = body || {};
  const id = encodeURIComponent(String(id_almacen || '').trim());
  const headers = await authenticatedWriteContext(req, payload);
  const res = await http.put(`/api/almacen/${id}`, payload, { headers });
  return res.data;
}

module.exports = {
  crearAlmacen,
  crearStockInicial,
  crearEntradaStock,
  crearSalidaStock,
  crearAjusteStock,
  crearTransferenciaStock,
  crearCambioMasivoStock,
  actualizarAlmacen,
};
