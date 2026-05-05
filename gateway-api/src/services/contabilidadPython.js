const axios = require('axios');
const { ctxHeaders } = require('./terceroPython');

const BASE_URL = process.env.CONTABILIDAD_PY_BASE_URL || 'http://localhost:5002';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

async function actualizarConfiguracionContabilidad(body, req) {
  const headers = await ctxHeaders(req, body || {});
  const res = await http.put('/api/configuracion-contabilidad', body || {}, { headers });
  return res.data;
}

module.exports = {
  actualizarConfiguracionContabilidad,
};
