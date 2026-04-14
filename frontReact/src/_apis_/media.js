import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002';

const apiClient = axios.create({
  baseURL: GATEWAY_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const companyHeader =
          config.headers['X-Company-Id'] ?? config.headers['x-company-id'];
        if (!companyHeader && payload.id_empresa) {
          config.headers['X-Company-Id'] = payload.id_empresa;
        }
        if (payload.sub || payload.id) config.headers['X-User-Id'] = payload.sub || payload.id;
      } catch (e) {
        console.warn('No se pudo extraer headers del token:', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ Error en API Media:', error.response?.data || error.message);
    const rawMessage = error?.response?.data?.message;
    const messageFromArray = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : rawMessage;
    const mensaje =
      messageFromArray ||
      error?.response?.data?.error ||
      error?.message ||
      'Error inesperado';

    const err = new Error(mensaje);
    err.status = error?.response?.status;
    err.data = error?.response?.data;
    throw err;
  }
);

export const uploadMedia = async (file, empresaId) => {
  const formData = new FormData();
  formData.append('file', file);
  const headers = {};
  if (empresaId) {
    headers['X-Company-Id'] = empresaId;
  }
  const response = await apiClient.post('/api/media/upload', formData, {
    headers,
  });
  return response.data;
};

export const getMediaByModule = async (module, module_id, directorio_id, empresaId) => {
  const params = {
    module,
    module_id,
  };
  if (directorio_id) {
    params.directorio_id = directorio_id;
  }

  const headers = {};
  if (empresaId) {
    headers['X-Company-Id'] = empresaId;
  }

  const response = await apiClient.get('/api/media', {
    params,
    ...(Object.keys(headers).length ? { headers } : {}),
  });
  const body = response.data;
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
};

export const deleteMedia = async (id_media) => {
  const response = await apiClient.delete(`/api/media/${id_media}`);
  return response.data;
};

export const updateMedia = async (id_media, data) => {
  const res = await apiClient.patch(`/api/media/${id_media}`, data);
  return res?.data;
};

export default apiClient;
