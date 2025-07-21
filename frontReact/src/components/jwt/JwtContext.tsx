import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { setSession, isValidToken } from './Jwt';

// utils
import axios from './axios';

// GraphQL mutation para login
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      accessToken
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

// ----------------------------------------------------------------------

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state: AuthState, action: any) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: AuthState, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: AuthState) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state: AuthState, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state: AuthState, action: any) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  signInWithEmailAndPassword: (email: string, password: string) => Promise.resolve(),
  logout: () => Promise.resolve(),
  createUserWithEmailAndPassword: (email: string, password: string, firstName: string, lastName: string) => Promise.resolve(),
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [getMe] = useLazyQuery(ME_QUERY);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        console.log('🔍 Token encontrado en localStorage:', accessToken ? 'SÍ' : 'NO');

        if (accessToken && isValidToken(accessToken)) {
          console.log('✅ Token válido encontrado, configurando sesión...');
          setSession(accessToken);

          // Usar GraphQL en lugar de REST
          const { data } = await getMe();
          if (!data || !data.me) {
            console.error('⚠️ La respuesta de getMe es nula:', data);
            throw new Error('No se pudo obtener el usuario autenticado (me=null)');
          }
          const { user } = data.me;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          console.log('❌ No hay token válido, usuario no autenticado');
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error('❌ Error al inicializar auth:', err);
        if (err && typeof err === 'object') {
          if ('networkError' in err) {
            // @ts-ignore
            console.error('🌐 Detalle networkError:', err.networkError);
          }
          if ('graphQLErrors' in err) {
            // @ts-ignore
            console.error('🟣 Detalle graphQLErrors:', err.graphQLErrors);
          }
        }
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, [getMe]);

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando proceso de login...');
      const { data } = await loginMutation({
        variables: { email, password },
      });
      
      const { accessToken, user } = data.login;
      console.log('🎉 Login exitoso, token recibido:', accessToken ? 'SÍ' : 'NO');
      console.log('👤 Usuario:', user);

      // Validar el token antes de guardar y autenticar
      if (!isValidToken(accessToken)) {
        console.error('❌ Token inválido o expirado. No se puede autenticar.');
        setSession('');
        throw new Error('Token inválido o expirado. Por favor, intente nuevamente.');
      }

      setSession(accessToken);
      console.log('💾 Token guardado en localStorage');
      
      // Verificar que se guardó correctamente
      const storedToken = localStorage.getItem('accessToken');
      console.log('🔍 Verificación - Token en localStorage:', storedToken ? 'SÍ' : 'NO');
      
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
      console.log('✅ Estado de autenticación actualizado');
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  const createUserWithEmailAndPassword = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    console.log('🚪 Cerrando sesión...');
    setSession('');
    console.log('🗑️ Token eliminado de localStorage');
    dispatch({ type: 'LOGOUT' });
  };

  // Función para actualizar el token en el contexto
  const updateToken = (newToken: string) => {
    console.log('🔄 Actualizando token en contexto...');
    setSession(newToken);
    // Ya no es necesario actualizar Apollo Client manualmente
    console.log('✅ Token actualizado en contexto');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        signInWithEmailAndPassword,
        logout,
        createUserWithEmailAndPassword,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
AuthProvider.propTypes = {
  children: PropTypes.node,
};
export { AuthContext, AuthProvider };
