import axios from 'axios';

const base = (import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002').replace(/\/$/, '');

const client = axios.create({ baseURL: `${base}/api/catalogos` });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const scope = String(payload.scope_acceso || 'EMPRESA').toUpperCase();
      const fromSession = sessionStorage.getItem('configuracion.id_empresa') || '';
      const companyId =
        scope === 'GLOBAL' ? fromSession || payload.id_empresa || '' : payload.id_empresa || '';
      if (companyId) config.headers['X-Company-Id'] = companyId;
      if (payload.sub || payload.id || payload.userId) {
        config.headers['X-User-Id'] = payload.sub || payload.id || payload.userId;
      }
      config.headers['X-Scope-Acceso'] = scope;
    } catch {
      /* ignore */
    }
  }
  return config;
});

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
  impuestos: 'impuesto',
};
