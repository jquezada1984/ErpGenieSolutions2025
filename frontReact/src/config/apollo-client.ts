import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

/**
 * GraphQL del cliente principal (login, catálogos vía gateway).
 * Por defecto: {VITE_GATEWAY_URL o http://localhost:3002}/graphql
 * Si trabajas sin gateway, en .env define por ejemplo:
 *   VITE_GRAPHQL_URL=http://localhost:3001/graphql
 * (no cambia los puertos de los servicios; solo indica a qué URL llama el front)
 */
const mainGraphqlUri =
  import.meta.env.VITE_GRAPHQL_URL ||
  `${import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002'}/graphql`;

const mainHttpLink = createHttpLink({
  uri: mainGraphqlUri,
});

// Configuración para MenuNestJs (permisos de menú)
const menuHttpLink = createHttpLink({
  uri: import.meta.env.VITE_MENU_GRAPHQL_URL || 'http://localhost:3003/graphql',
});

// Middleware para agregar token de autenticación
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  
  const authHeaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  };
  
  return {
    headers: authHeaders,
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
    console.error(`[GraphQL URI]: ${mainGraphqlUri}`);
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
