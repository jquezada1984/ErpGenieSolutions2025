import apiClient from './media';

export const getDirectorios = async (module, empresaId) => {
  const params = { module };

  if (empresaId) {
    params.empresa_id = empresaId;
  }

  const headers = {};

  if (empresaId) {
    headers['X-Company-Id'] = empresaId;
  }

  const res = await apiClient.get('/api/directorio', {
    params,
    ...(Object.keys(headers).length ? { headers } : {}),
  });

  const body = res?.data;
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
};

export const createDirectorio = async (data, empresaId) => {
  const headers = {};

  if (empresaId) {
    headers['X-Company-Id'] = empresaId;
  }

  const res = await apiClient.post('/api/directorio', data, {
    headers,
  });

  return res?.data;
};
