import axios from 'axios';

const base = (import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002').replace(/\/$/, '');
const client = axios.create({ baseURL: `${base}/api/config` });

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

export const obtenerEmpresaConfig = async () => unwrap(await client.get('/empresa'));

export const guardarPanelesConfig = async (paneles) =>
  unwrap(await client.put('/empresa/paneles', { paneles }));

export const guardarAlertasConfig = async (alertas) =>
  unwrap(await client.put('/empresa/alertas', { alertas }));

export const guardarEmailsConfig = async (emails) =>
  unwrap(await client.put('/empresa/emails', { emails }));

export const obtenerSeguridadInstancia = async () =>
  unwrap(await client.get('/instancia/seguridad'));

export const guardarSeguridadInstancia = async (seguridad) =>
  unwrap(await client.put('/instancia/seguridad', { seguridad }));
