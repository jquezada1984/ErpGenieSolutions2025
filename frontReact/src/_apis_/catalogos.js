import axios from 'axios';

const base = (import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002').replace(/\/$/, '');

const client = axios.create({ baseURL: `${base}/api/catalogos` });

const unwrap = (res) => {
  const body = res.data;
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
};

export const listarCatalogo = async (recurso, params = {}) =>
  unwrap(await client.get(`/${recurso}`, { params }));

export const crearCatalogo = async (recurso, payload) =>
  unwrap(await client.post(`/${recurso}`, payload));

export const actualizarCatalogo = async (recurso, id, payload) =>
  unwrap(await client.put(`/${recurso}/${id}`, payload));

export const patchActivoCatalogo = async (recurso, id, activo) =>
  unwrap(await client.patch(`/${recurso}/${id}/activo`, { activo }));

export const RECURSOS = {
  condicionesPago: 'condicion-pago',
  modosPago: 'forma-pago',
  monedas: 'moneda',
  tipoEntidadLegal: 'tipo-entidad-legal',
  formatosPapel: 'formato-papel',
};
