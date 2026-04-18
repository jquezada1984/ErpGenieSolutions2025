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

/** Actualización solo servicio (tipo SERVICE en catálogo) → ItemPython PUT /api/item/servicio/:id_item */
async function actualizarItemServicio(idItem, body, req) {
  const headers = await ctxHeaders(req, body || {});
  const id = encodeURIComponent(String(idItem || '').trim());
  console.log('Gateway -> ItemPython: PUT /api/item/servicio/' + id);
  const res = await http.put(`/api/item/servicio/${id}`, body || {}, { headers });
  return res.data;
}

/** Catálogo item_etiqueta_categoria (listado por empresa; opcional id_tipo_item vía tipo_item_catalogo). */
async function listarEtiquetasCategoria(req) {
  const headers = await ctxHeaders(req, {});
  const q = req.query || {};
  console.log('📤 Gateway -> ItemPython: GET /api/item/etiqueta-categoria');
  const params = { id_empresa: q.id_empresa || '' };
  if (q.id_tipo_item != null && String(q.id_tipo_item).trim() !== '') {
    params.id_tipo_item = String(q.id_tipo_item).trim();
  }
  if (q.incluir_sin_tipo_item != null && String(q.incluir_sin_tipo_item).trim() !== '') {
    params.incluir_sin_tipo_item = String(q.incluir_sin_tipo_item).trim();
  }
  const res = await http.get('/api/item/etiqueta-categoria', {
    headers,
    params,
  });
  return res.data;
}

/** Alta en item_etiqueta_categoria. */
async function crearEtiquetaCategoria(body, req) {
  const headers = await ctxHeaders(req, body || {});
  console.log('📤 Gateway -> ItemPython: POST /api/item/etiqueta-categoria');
  const res = await http.post('/api/item/etiqueta-categoria', body || {}, { headers });
  return res.data;
}

/** Actualización de fila en item_etiqueta_categoria por id_etiqueta_categoria (URL). */
async function actualizarEtiquetaCategoria(idEtiquetaCategoria, body, req) {
  const headers = await ctxHeaders(req, body || {});
  const id = encodeURIComponent(String(idEtiquetaCategoria || '').trim());
  console.log('📤 Gateway -> ItemPython: PUT /api/item/etiqueta-categoria/' + id);
  const res = await http.put(`/api/item/etiqueta-categoria/${id}`, body || {}, { headers });
  return res.data;
}

/** Solo columna estado (+ updated_at, updated_by) en item_etiqueta_categoria. */
async function cambiarEstadoEtiquetaCategoria(idEtiquetaCategoria, body, req) {
  const headers = await ctxHeaders(req, body || {});
  const id = encodeURIComponent(String(idEtiquetaCategoria || '').trim());
  console.log('📤 Gateway -> ItemPython: PATCH /api/item/etiqueta-categoria/' + id + '/estado');
  const res = await http.patch(`/api/item/etiqueta-categoria/${id}/estado`, body || {}, { headers });
  return res.data;
}

module.exports = {
  crearItem,
  actualizarItem,
  actualizarItemServicio,
  listarEtiquetasCategoria,
  crearEtiquetaCategoria,
  actualizarEtiquetaCategoria,
  cambiarEstadoEtiquetaCategoria,
};
