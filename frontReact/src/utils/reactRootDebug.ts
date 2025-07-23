// Utilidad para debuggear problemas de múltiples raíces de React
export const debugReactRoot = () => {
  // Verificar si ya existe una raíz de React
  const existingRoot = (window as any).__REACT_ROOT__;
  
  if (existingRoot) {
    console.warn('⚠️ Ya existe una raíz de React:', existingRoot);
    return existingRoot;
  }
  
  // Verificar elementos con id "root"
  const rootElements = document.querySelectorAll('#root');
  if (rootElements.length > 1) {
    console.error('❌ Múltiples elementos con id "root" encontrados:', rootElements);
  }
  
  // Verificar si hay múltiples scripts de main.tsx
  const scripts = document.querySelectorAll('script[src*="main.tsx"]');
  if (scripts.length > 1) {
    console.error('❌ Múltiples scripts de main.tsx encontrados:', scripts);
  }
  
  return null;
};

// Función para limpiar raíces existentes
export const cleanupReactRoots = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    // Limpiar el contenido del elemento root
    rootElement.innerHTML = '';
    console.log('🧹 Elemento root limpiado');
  }
  
  // Limpiar la referencia global
  delete (window as any).__REACT_ROOT__;
  console.log('🧹 Referencia global de React root limpiada');
};

// Función para crear una raíz de React de forma segura
export const createSafeReactRoot = (container: HTMLElement) => {
  // Limpiar raíces existentes
  cleanupReactRoots();
  
  // Crear nueva raíz
  const { createRoot } = require('react-dom/client');
  const root = createRoot(container);
  
  // Guardar referencia global
  (window as any).__REACT_ROOT__ = root;
  
  console.log('✅ Nueva raíz de React creada de forma segura');
  return root;
}; 