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
    port: 3000,
    open: true,
    hmr: {
      overlay: false // Deshabilitar overlay de errores para evitar problemas con múltiples raíces
    }
  },
  // Configuración para evitar problemas de múltiples raíces
  define: {
    __DEV__: true
  }
})