import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Configuración para Gateway (todos los servicios)
const mainHttpLink = createHttpLink({
  uri: import.meta.env.VITE_GATEWAY_URL + '/graphql' || 'http://localhost:3002/graphql',
});

// Configuración para MenuNestJs (permisos de menú)
const menuHttpLink = createHttpLink({
  uri: import.meta.env.VITE_MENU_GRAPHQL_URL || 'http://localhost:3003/graphql',
});

// Middleware para agregar token de autenticación
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  console.log('🔍 DEBUG - Apollo Client - Token encontrado:', !!token);
  console.log('🔍 DEBUG - Apollo Client - Token completo:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('🔍 DEBUG - Apollo Client - Headers originales:', headers);
  
  const authHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  };
  
  console.log('🔍 DEBUG - Apollo Client - Headers con auth:', authHeaders);
  
  return {
    headers: authHeaders
  };
});

// Middleware para manejo de errores
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log('🔍 DEBUG - Apollo Client - Error detectado:', {
    graphQLErrors,
    networkError,
    operation: operation.operationName,
    variables: operation.variables
  });
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      console.error(`[GraphQL error]: Extensions:`, extensions);
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    console.error(`[Network error]: Type:`, networkError.constructor.name);
    console.error(`[Network error]: Message:`, networkError.message);
  }
});

// Cliente principal para InicioNestJs (autenticación y servicios principales)
export const mainClient = new ApolloClient({
  link: from([errorLink, authLink, mainHttpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Cliente para MenuNestJs (permisos)
export const menuClient = new ApolloClient({
  link: from([errorLink, authLink, menuHttpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          permisosPorPerfil: {
            keyArgs: ['id_perfil'],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          menuLateralPorPerfil: {
            keyArgs: ['id_perfil'],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Cliente principal (por defecto) - Usar el mismo que main.tsx
export const client = mainClient;
