import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USUARIOS = gql`
  query {
    usuarios {
      id
      nombre_usuario
      email
      activo
    }
  }
`;

const UsuariosGraphQL = () => {
  const { loading, error, data } = useQuery(GET_USUARIOS);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>Usuarios (GraphQL)</h3>
      <ul>
        {data.usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.nombre_usuario} - {usuario.email} - {usuario.activo ? 'Activo' : 'Inactivo'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuariosGraphQL; 