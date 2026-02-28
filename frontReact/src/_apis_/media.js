import axios from 'axios';

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002';

const apiClient = axios.create({
  baseURL: GATEWAY_URL,
});

export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/api/media/upload', formData);

  return response.data;
};
