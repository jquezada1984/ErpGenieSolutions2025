import apiClient from './media';

export const getEstadosArchivo = async (empresaId) => {
  if (!empresaId) return [];

  const response = await apiClient.get(`/api/estado-archivo?empresa=${empresaId}`);
  const body = response?.data;

  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
};
