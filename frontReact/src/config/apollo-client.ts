import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Configuración para MenuNestJs (permisos de menú)
const menuHttpLink = createHttpLink({
  uri: process.env.REACT_APP_MENU_GRAPHQL_URL || 'http://localhost:3003/graphql',
});

// Configuración para InicioNestJs (autenticación y otros servicios)
const mainHttpLink = createHttpLink({
  uri: process.env.REACT_APP_MAIN_GRAPHQL_URL || 'http://localhost:3001/graphql',
});

// Middleware para agregar token de autenticación
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Middleware para manejo de errores
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
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

// Cliente para InicioNestJs (principal)
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
  },
});

// Cliente principal (por defecto)
export const client = mainClient;
