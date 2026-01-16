import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'reactstrap',
      'bootstrap'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['reactstrap', 'bootstrap'],
          'redux-vendor': ['react-redux', '@reduxjs/toolkit'],
          'charts-vendor': ['apexcharts', 'react-apexcharts'],
          'utils-vendor': ['axios', 'formik', 'yup'],
        },
        // Optimizar nombres de chunks
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/(\.css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/(\.png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // Optimizaciones adicionales
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Deshabilitar en producción
    minify: 'esbuild', // Cambiar de terser a esbuild
  },
  // Optimizaciones de desarrollo
  server: {
    host: '0.0.0.0', // Permitir conexiones desde fuera del contenedor
    port: 3000,
    strictPort: false, // No fallar si el puerto está ocupado, usar otro
    open: false, // No abrir navegador automáticamente en Docker
    cors: true, // Habilitar CORS
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      clientPort: 3000
    },
    watch: {
      usePolling: true, // Usar polling para detectar cambios en Docker
      interval: 1000
    }
  },
  // Configuración para evitar problemas de múltiples raíces
  define: {
    __DEV__: true
  }
})