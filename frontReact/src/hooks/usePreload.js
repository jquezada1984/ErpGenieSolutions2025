import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Hook para preloading inteligente
export const usePreload = (components = []) => {
  const location = useLocation();

  // Preload componentes cuando cambia la ruta
  useEffect(() => {
    const preloadComponents = async () => {
      try {
        await Promise.all(
          components.map(component => {
            if (component && typeof component.preload === 'function') {
              return component.preload();
            }
            return Promise.resolve();
          })
        );
      } catch (error) {
        console.warn('Error preloading components:', error);
      }
    };

    preloadComponents();
  }, [location.pathname, components]);

  // Función para preload manual
  const preloadComponent = useCallback(async (component) => {
    if (component && typeof component.preload === 'function') {
      try {
        await component.preload();
      } catch (error) {
        console.warn('Error preloading component:', error);
      }
    }
  }, []);

  return { preloadComponent };
};

// Hook para preload en hover
export const usePreloadOnHover = (component) => {
  const handleMouseEnter = useCallback(() => {
    if (component && typeof component.preload === 'function') {
      component.preload();
    }
  }, [component]);

  return { handleMouseEnter };
};

// Hook para preload en focus (accesibilidad)
export const usePreloadOnFocus = (component) => {
  const handleFocus = useCallback(() => {
    if (component && typeof component.preload === 'function') {
      component.preload();
    }
  }, [component]);

  return { handleFocus };
}; 