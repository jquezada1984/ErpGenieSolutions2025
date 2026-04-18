/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GATEWAY_URL: string
  /** URL completa del endpoint GraphQL (opcional; si no existe se usa VITE_GATEWAY_URL + /graphql) */
  readonly VITE_GRAPHQL_URL: string
  readonly VITE_MENU_GRAPHQL_URL: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 