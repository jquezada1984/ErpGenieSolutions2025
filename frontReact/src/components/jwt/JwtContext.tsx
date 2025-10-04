import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { isValidToken, setSession } from './Jwt';
import { usePermissions } from '../authGurad/usePermissions';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        email
        firstName
        lastName
        id_perfil
      }
    }
  }
`;

const GET_ME_QUERY = gql`
  query GetMe {
    me {
      user {
        id
        email
        firstName
        lastName
        id_perfil
      }
    }
  }
`;

// Consulta adicional para obtener perfil completo
const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      id
      email
      firstName
      lastName
      id_perfil
    }
  }
`;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  id_perfil?: string; // Opcional por si no viene en el login
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

const handlers: Record<string, (state: AuthState, action: any) => AuthState> = {
  INITIALIZE: (state: AuthState, action: any) => ({
    ...state,
    isAuthenticated: action.payload.isAuthenticated,
    isInitialized: true,
    user: action.payload.user,
  }),
  LOGIN: (state: AuthState, action: any) => ({
    ...state,
    isAuthenticated: true,
    user: action.payload.user,
  }),
  LOGOUT: (state: AuthState) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state: AuthState, action: any) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<{
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateToken: (newToken: string) => void;
}>({
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  signInWithEmailAndPassword: async () => {},
  logout: async () => {},
  updateToken: () => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [getMe] = useLazyQuery(GET_ME_QUERY);
  const { cargarOpcionesMenuSuperior } = usePermissions();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Limpiar token expirado al inicializar
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken && !isValidToken(storedToken)) {
          localStorage.removeItem('accessToken');
        }
        
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          
          const { data } = await getMe();
          
          if (data && data.me && data.me.user) {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: data.me.user,
              },
            });
          } else {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
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
      const result = await loginMutation({
        variables: { email, password },
      });
      
      // Verificar si hay errores de GraphQL en la respuesta
      if (result.errors && result.errors.length > 0) {
        const graphQLError = result.errors[0];
        throw new Error(graphQLError.message || 'Error de GraphQL');
      }
      
      const { data } = result;
      
      if (!data || !data.login) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      const { accessToken, user } = data.login;

      if (!accessToken) {
        throw new Error('No se recibió token de acceso del servidor');
      }

      // Validar el token antes de guardar y autenticar
      if (!isValidToken(accessToken)) {
        setSession('');
        throw new Error('Token inválido o expirado. Por favor, intente nuevamente.');
      }

      setSession(accessToken);
      
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });

      // Cargar opciones del menú superior después del login exitoso
      if (user?.id_perfil) {
        console.log('🔍 DEBUG - Login exitoso, cargando opciones del menú para perfil:', user.id_perfil);
        try {
          await cargarOpcionesMenuSuperior(user.id_perfil);
          console.log('✅ Opciones del menú cargadas exitosamente');
        } catch (error) {
          console.error('❌ Error al cargar opciones del menú:', error);
        }
      } else {
        console.log('⚠️ DEBUG - Usuario no tiene id_perfil, intentando obtenerlo...');
        
        // Intentar obtener el perfil del usuario
        try {
          const { data: profileData } = await getMe();
          if (profileData?.me?.user?.id_perfil) {
            console.log('🔍 DEBUG - Perfil obtenido:', profileData.me.user.id_perfil);
            await cargarOpcionesMenuSuperior(profileData.me.user.id_perfil);
            console.log('✅ Opciones del menú cargadas exitosamente desde perfil');
          } else {
            console.error('❌ No se pudo obtener id_perfil del usuario');
          }
        } catch (error) {
          console.error('❌ Error al obtener perfil del usuario:', error);
        }
      }
    } catch (error: any) {
      // Extraer mensaje de error específico
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        errorMessage = graphQLError.message || 'Error de GraphQL';
      } else if (error.networkError) {
        errorMessage = 'Error de conexión. Verifique su conexión a internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Asegurar que el error se propague correctamente
      const authError = new Error(errorMessage);
      authError.name = 'AuthError';
      throw authError;
    }
  };

  const logout = async () => {
    setSession('');
    dispatch({
      type: 'LOGOUT',
    });
  };

  const updateToken = (newToken: string) => {
    setSession(newToken);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithEmailAndPassword,
        logout,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
