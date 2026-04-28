const axios = require('axios');
const { ctxHeaders } = require('./terceroPython');

const BASE_URL = process.env.INVENTARIO_PY_BASE_URL || 'http://inventario-python-service:3014';
const TIMEOUT = parseInt(process.env.INVENTARIO_PY_TIMEOUT || '15000', 10);

const http = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});

async function crearInventario(body, req) {
  const payload = body || {};
  const headers = await ctxHeaders(req, payload);
  const res = await http.post('/api/inventario', payload, { headers });
  return res.data;
}

module.exports = {
  crearInventario,
};
