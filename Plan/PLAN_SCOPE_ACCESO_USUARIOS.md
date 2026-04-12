# Plan ejecutado: `scope_acceso` (GLOBAL / EMPRESA) en usuarios

## Reglas de negocio

- Columna `usuario.scope_acceso`: solo valores **`EMPRESA`** o **`GLOBAL`**.
- **GLOBAL** en JWT: puede listar usuarios de todas las empresas (Nest) y ver/editar el control de alcance en crear/editar usuario.
- **EMPRESA** en JWT: solo usuarios de su empresa; el control de alcance **no se muestra**; no puede asignar `GLOBAL` vía API.

## Flujos

| Acción | Canal | Archivos relevantes |
|--------|--------|---------------------|
| Crear usuario | REST Gateway → Python | `frontReact` → `gateway-api/routes/usuarios.js` → `InicioPython/api/usuario_routes.py` |
| Editar usuario | GraphQL Nest → Python | `EditarUsuario.tsx` → `usuario.resolver.ts` → Flask PUT |
| Crear vía GraphQL (si se usa) | Nest → Python | `usuario.resolver.ts` `crearUsuario` |

## Seguridad en servidor

1. **Nest**: solo si `context.req.user.scope_acceso` es GLOBAL se aplica `scope_acceso` en `crearUsuario` / `actualizarUsuario`; si no, creación fuerza EMPRESA y actualización no modifica `scope_acceso`.
2. **Gateway**: si el JWT no es GLOBAL, se elimina `scope_acceso` del body antes de enviar a Python (REST).
3. **Python**: POST fuerza EMPRESA si el JWT no es GLOBAL; PUT elimina `scope_acceso` del payload cargado si el caller no es GLOBAL (no sobrescribe un usuario GLOBAL existente).

## Frontend

- Util `isScopeGlobal` (`frontReact/src/utils/scopeAcceso.ts`).
- `useJwtPayload` depende de `pathname`/`key` de React Router para refrescar claims tras navegación.
- `NuevoUsuario.tsx` y `EditarUsuario.tsx`: select de alcance solo si `isScopeGlobal`.

## Pruebas manuales sugeridas

1. Login usuario **GLOBAL**: crear/editar con EMPRESA y GLOBAL; verificar BD.
2. Login **EMPRESA**: sin control; crear usuario sigue EMPRESA; REST manual con `scope_acceso: GLOBAL` debe ser ignorado/forzado.
3. Usuario EMPRESA editando otro usuario GLOBAL: no debe poder cambiar `scope_acceso` por PUT.
