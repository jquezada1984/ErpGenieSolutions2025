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

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Backend NestJS en puerto 3001
  cache: new InMemoryCache(),
});

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
