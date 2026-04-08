// Proxy de escritura ítem → ItemPython (Flask). Mismo patrón de contexto que TerceroPython.
const axios = require('axios');
const { ctxHeaders } = require('./terceroPython');

const BASE_URL = process.env.ITEM_PY_BASE_URL || 'http://localhost:3012';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

async function crearItem(body, req) {
  const headers = await ctxHeaders(req, body);
  console.log('📤 Gateway -> ItemPython: POST /api/item');
  const res = await http.post('/api/item', body || {}, { headers });
  return res.data;
}

async function actualizarItem(idItem, body, req) {
  const headers = await ctxHeaders(req, body || {});
  console.log('📤 Gateway -> ItemPython: PUT /api/item/' + idItem);
  const res = await http.put(`/api/item/${encodeURIComponent(idItem)}`, body || {}, { headers });
  return res.data;
}

module.exports = {
  crearItem,
  actualizarItem,
};
