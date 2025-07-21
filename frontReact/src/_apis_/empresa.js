import axios from 'axios';
import { gql } from '@apollo/client';
import { client } from '../main';

// Cambia la URL base según la configuración de tu microservicio Python
const API_URL = 'http://localhost:5000/api/empresa';

// Función para refrescar el token
const refreshToken = async () => {
  try {
    const { data } = await client.query({
      query: gql`
        query RefreshToken {
          refreshToken
        }
      `,
    });
    const newToken = data.refreshToken;
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
      // Actualizar el header de autorización en axios
      axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      console.log('✅ Token actualizado automáticamente');
    }
    return newToken;
  } catch (error) {
    console.error('❌ Error al refrescar token:', error);
    return null;
  }
};

export const crearEmpresa = async (empresa) => {
  const response = await axios.post(`${API_URL}/`, empresa);
  // Refrescar token después de crear
  await refreshToken();
  return response.data;
};

export const actualizarEmpresa = async (id, empresa) => {
  const response = await axios.put(`${API_URL}/${id}`, empresa);
  // Refrescar token después de actualizar
  await refreshToken();
  return response.data;
};

// "Eliminar" empresa: solo cambia el estado a false
export const eliminarEmpresa = async (id) => {
  const response = await axios.put(`${API_URL}/${id}`, { estado: false });
  // Refrescar token después de eliminar
  await refreshToken();
  return response.data;
}; 