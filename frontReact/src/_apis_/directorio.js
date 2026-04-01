import apiClient from './media';

export const getDirectorios = async (module, empresaId) => {
  const res = await apiClient.get('/api/directorio', {
    params: {
      module,
      ...(empresaId && { empresa_id: empresaId }),
    },
    ...(empresaId ? { headers: { 'X-Company-Id': empresaId } } : {}),
  });

  const body = res?.data;
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
};

export const createDirectorio = async (data) => {
  const res = await apiClient.post('/api/directorio', data);
  return res?.data;
};
