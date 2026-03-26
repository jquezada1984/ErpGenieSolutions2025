import apiClient from './media';

export const getDirectorios = async (module) => {
  const res = await apiClient.get('/api/directorio', {
    params: { module },
  });

  return res?.data || [];
};
