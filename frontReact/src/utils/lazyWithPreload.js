import { lazy } from 'react';

// Función para crear componentes lazy con preloading
export const lazyWithPreload = (importFunc) => {
  const Component = lazy(importFunc);
  
  // Función para preload el componente
  Component.preload = importFunc;
  
  return Component;
};

// Función para preload múltiples componentes
export const preloadComponents = (components) => {
  return Promise.all(components.map(component => component.preload()));
};

// Función para preload basado en hover (para mejor UX)
export const preloadOnHover = (component) => {
  return () => {
    component.preload();
  };
}; 