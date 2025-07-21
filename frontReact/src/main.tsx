import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
//import './_apis_/account';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/Store';
import App from './App';
import './assets/scss/style.scss';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { AuthProvider } from './components/jwt/JwtContext';

export const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Backend NestJS en puerto 3001
  cache: new InMemoryCache(),
  headers: {
    'Content-Type': 'application/json',
  },
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// Función para actualizar el token en el cliente Apollo
export const updateApolloToken = (token: string) => {
  client.setLink(
    new (require('@apollo/client').createHttpLink)({
      uri: 'http://localhost:3001/graphql',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
  );
};

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </ApolloProvider>
)
