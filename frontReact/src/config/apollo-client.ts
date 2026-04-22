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

  let companyId = '';

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      companyId = payload.id_empresa || '';
    } catch (e) {
      console.warn('No se pudo extraer id_empresa del token');
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'X-Company-Id': companyId,
    },
  };
});

// Middleware para manejo de errores
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
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
          menuLateralOrdenado: {
            keyArgs: ['id_seccion'],
            merge(existing, incoming) {
              return incoming;
            },
          },
          menuPrincipalOrdenado: {
            keyArgs: ['id_seccion'],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          submenusOrdenados: {
            keyArgs: ['parent_id'],
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
      fetchPolicy: 'cache-first',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
  },
});

// Cliente principal (por defecto) - Usar el mismo que main.tsx
export const client = mainClient;
