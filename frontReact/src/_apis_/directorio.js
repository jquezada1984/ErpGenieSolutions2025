import apiClient from './media';

export const getDirectorios = async (module) => {
  const res = await apiClient.get('/api/directorio', {
    params: { module },
  });

  return res?.data || [];
};

export const createDirectorio = async (data) => {
  const res = await apiClient.post('/api/directorio', data);
  return res?.data;
};
