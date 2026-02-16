// src/services/terceroPython.js
const axios = require('axios');

const BASE_URL = process.env.TERCERO_PY_BASE_URL || 'http://localhost:3004';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

function ctxHeaders(req, body = {}) {
  // Priorizar id_empresa del body si no está en headers
  const idEmpresa = req.headers['x-company-id'] || req.headers['X-Company-Id'] || body.id_empresa || '';
  const idUsuario = req.headers['x-user-id'] || req.headers['X-User-Id'] || '';
  
  return {
    'X-Company-Id': idEmpresa,
    'X-User-Id': idUsuario,
  };
}

async function crearTercero(body, req) {
  // Asegurar que id_empresa esté en los headers
  const headers = ctxHeaders(req, body);
  
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
  const res = await http.put(`/api/tercero/${idTercero}`, body, { headers: ctxHeaders(req) });
  return res.data;
}

async function eliminarTercero(idTercero, req) {
  const res = await http.delete(`/api/tercero/${idTercero}`, { headers: ctxHeaders(req) });
  return res.data;
}

module.exports = {
  crearTercero,
  actualizarTercero,
  eliminarTercero,
};
