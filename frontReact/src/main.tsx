import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { store } from './store/Store';
import { AuthProvider } from './components/jwt/JwtContext';
import App from './App';
import './assets/scss/style.scss';

// Configuración para conectar directamente a InicioNestJS
const NESTJS_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3001';

// Configura el link HTTP para InicioNestJS
const httpLink = createHttpLink({
  uri: `${NESTJS_URL}/graphql`,
});

// Configura el contexto de autenticación
const authLink = setContext((_, { headers }) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('accessToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Link para manejar errores
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      // No mostrar errores de autenticación esperados en la consola
      const isAuthError = message.includes('Contraseña incorrecta') || 
                         message.includes('Usuario no encontrado') ||
                         message.includes('Credenciales inválidas') ||
                         message.includes('UNAUTHENTICATED');
      
      if (!isAuthError) {
        console.error('🟣 GraphQL Error:', {
          message,
          locations,
          path,
          operation: operation.operationName
        });
      }
    });
  }

  if (networkError) {
    console.error('🌐 Network Error:', {
      message: networkError.message,
      operation: operation.operationName
    });
  }
});

// Crea el cliente Apollo
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
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

// Exporta el cliente para uso en otros archivos
export { client };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
);
