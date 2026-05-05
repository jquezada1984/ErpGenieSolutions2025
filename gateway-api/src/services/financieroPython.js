const axios = require('axios');
const { ctxHeaders } = require('./terceroPython');

const BASE_URL = process.env.FINANCIERO_PY_BASE_URL || 'http://localhost:5001';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

async function crearFacturaClienteBorrador(body, req) {
  const headers = await ctxHeaders(req, body || {});
  const res = await http.post('/api/facturas-clientes', body || {}, { headers });
  return res.data;
}

module.exports = {
  crearFacturaClienteBorrador,
};
