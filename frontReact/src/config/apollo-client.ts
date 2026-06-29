import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// URL del gateway: todo GraphQL (auth, menú, terceros…) pasa por aquí; el gateway enruta a cada NestJS.
const GATEWAY_GRAPHQL_URL = (import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3002').replace(/\/$/, '') + '/graphql';

// Solo si necesitas depurar MenuNestJs directo (no recomendado): VITE_MENU_GRAPHQL_URL completo, ej. http://localhost:3003/graphql
const menuGraphqlUri = import.meta.env.VITE_MENU_GRAPHQL_URL
  ? String(import.meta.env.VITE_MENU_GRAPHQL_URL).replace(/\/$/, '')
  : GATEWAY_GRAPHQL_URL;

// Configuración para Gateway (autenticación, usuarios, etc.)
const mainHttpLink = createHttpLink({
  uri: GATEWAY_GRAPHQL_URL,
});

// Mismo endpoint que main: permisos/menú los resuelve el gateway → MenuNestJs (ver gateway routes/graphql.js)
const menuHttpLink = createHttpLink({
  uri: menuGraphqlUri.includes('/graphql') ? menuGraphqlUri : `${menuGraphqlUri}/graphql`,
});

// Middleware para agregar token de autenticación
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');

  let companyId = '';

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      companyId = payload.id_empresa || '';
    } catch {}
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      // 🔥 SOLO poner si NO viene ya definido
      'X-Company-Id': headers?.['X-Company-Id'] || companyId,
    },
  };
});

// Middleware para manejo de errores
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Errores gestionados por estado en hooks/componentes; no hacer ruido en consola.
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
