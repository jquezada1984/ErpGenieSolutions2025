/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GATEWAY_URL: string
  // más variables de entorno aquí...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 