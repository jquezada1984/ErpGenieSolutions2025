import React from 'react';
import { createRoot } from 'react-dom/client';
//import './_apis_/account';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/Store';
import App from './App';
import './assets/scss/style.scss';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { AuthProvider } from './components/jwt/JwtContext';
import { debugReactRoot, cleanupReactRoots } from './utils/reactRootDebug';

// Configuración para conectar directamente a InicioNestJS
const NESTJS_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3000';

// Configura el link HTTP para InicioNestJS
const httpLink = createHttpLink({
  uri: `${NESTJS_URL}/graphql`,
});

// Configura el link de autenticación
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
  },
});

// Debug: Verificar si ya existe una raíz de React
debugReactRoot();

// Registrar el service worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker registrado con éxito:', registration);
    }).catch(error => {
      console.log('Error al registrar el Service Worker:', error);
    });
  });
}

// Limpiar raíces existentes antes de crear una nueva
cleanupReactRoots();

// Crear la raíz de React
const rootElement = document.getElementById('root') as HTMLElement;
if (!rootElement) {
  throw new Error('Elemento #root no encontrado en el DOM');
}

const root = createRoot(rootElement);

root.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </ApolloProvider>
);
