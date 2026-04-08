# AUDITORÍA ULTRASEGURA - MÓDULO TERCEROS

Fecha: 2026-03-31  
Alcance: Frontend, Gateway, TerceroNestJs, TerceroPython, Auth/Perfiles/Empresa  
Tipo: Solo lectura y diagnóstico (sin cambios de código)

## 1) Resumen ejecutivo corto

La visibilidad de `Terceros` no está totalmente blindada en backend para lectura.  
Existe segmentación por `id_empresa` en el flujo normal del frontend (basada en `scope_acceso` del JWT), pero el enforcement principal depende del cliente y no de una política uniforme en servidor.

## 2) Flujo real de visibilidad de terceros

1. `frontReact` decodifica JWT (`scope_acceso`, `id_empresa`) y arma queries de terceros con `id_empresa` cuando aplica.
2. El frontend consume `Gateway` por `/graphql` y REST con `Authorization`.
3. `gateway-api` enruta/reenvía; no impone filtros de visibilidad para lectura de terceros.
4. `TerceroNestJs` filtra por empresa solo si recibe `id_empresa` en la query.
5. `TerceroPython` aplica contexto de empresa/scope principalmente en escritura (crear/editar/eliminar), no como control fuerte de lectura de terceros.

## 3) Archivos exactos analizados por capa

### Frontend
- `frontReact/src/views/terceros/Terceros.tsx`
- `frontReact/src/views/terceros/Clientes.tsx`
- `frontReact/src/views/terceros/Proveedores.tsx`
- `frontReact/src/views/terceros/contactos/Contactos.tsx`
- `frontReact/src/_apis_/tercero.js`
- `frontReact/src/_apis_/contacto.js`
- `frontReact/src/hooks/useJwtPayload.ts`
- `frontReact/src/config/apollo-client.ts`
- `frontReact/src/components/jwt/JwtContext.tsx`
- `frontReact/src/routes/Router.tsx`
- `frontReact/src/components/authGurad/AuthGuard.tsx`

### Gateway
- `gateway-api/src/routes/tercero.js`
- `gateway-api/src/routes/contacto.js`
- `gateway-api/src/routes/graphql.js`
- `gateway-api/src/services/terceroNestJs.js`
- `gateway-api/src/services/terceroPython.js`
- `gateway-api/src/app.js`

### TerceroNestJs
- `TerceroNestJs/src/modules/tercero/tercero.resolver.ts`
- `TerceroNestJs/src/modules/tercero/tercero.service.ts`
- `TerceroNestJs/src/modules/tercero/contacto/contacto.resolver.ts`
- `TerceroNestJs/src/modules/tercero/contacto/contacto.service.ts`
- `TerceroNestJs/src/modules/tercero/tercero.controller.ts`
- `TerceroNestJs/src/app.module.ts`
- `TerceroNestJs/src/main.ts`

### TerceroPython
- `TerceroPython/api/tercero_routes.py`
- `TerceroPython/api/contacto_routes.py`
- `TerceroPython/services/tercero_service.py`
- `TerceroPython/services/contacto_service.py`
- `TerceroPython/repositories/tercero_repository.py`
- `TerceroPython/repositories/contacto_repository.py`
- `TerceroPython/app.py`

### Auth / Perfiles / Empresa
- `InicioNestJs/src/auth/auth.service.ts`
- `InicioNestJs/src/auth/jwt.strategy.ts`
- `InicioNestJs/src/auth/auth.resolver.ts`
- `InicioNestJs/src/resolvers/usuario.resolver.ts`
- `InicioNestJs/src/entities/usuario.entity.ts`

## 4) Hallazgos exactos

- El JWT incluye `sub`, `id_perfil`, `id_empresa`, `scope_acceso`.
- En frontend de terceros:
  - usuario `EMPRESA`: consulta con `id_empresa` del token.
  - usuario `GLOBAL`: selección manual de empresa en UI.
- `gateway-api` `/graphql` reenvía `Authorization` y enruta por tipo de query; no impone control por empresa/sucursal/rol para lectura.
- En `gateway-api/src/services/terceroNestJs.js`, las lecturas REST (`listarTerceros`, `listarClientes`) consultan GraphQL sin pasar `id_empresa`.
- En `TerceroNestJs`, filtros de lista dependen de que `id_empresa` llegue como argumento.
- No se observan guards activos de autorización para terceros/contactos en TerceroNestJs.
- `tercero(id_tercero)` y `contactosByTercero(id_tercero)` no validan pertenencia por empresa en esta capa.
- En `TerceroPython`, hay uso de `X-Company-Id`/`X-Scope-Acceso` en escritura, especialmente update/delete.
- En `TerceroPython` de contactos (lectura), no hay control por empresa/usuario.

## 5) Dónde está la lógica de restricción (si existe)

- Principalmente en frontend (construcción de consultas por `scope_acceso` e `id_empresa`).
- Parcial en backend:
  - `TerceroNestJs`: filtro por empresa solo si recibe `id_empresa`.
  - `TerceroPython`: restricciones sobre todo en update/delete.
- No se encontró control robusto por `sucursal`, `rol` o `perfil` para lectura de terceros.

## 6) Qué puede ver hoy cada tipo de usuario (según evidencia)

- Usuario `EMPRESA` (flujo UI normal): terceros de su empresa.
- Usuario `GLOBAL` (flujo UI normal): terceros de la empresa seleccionada.
- Con invocaciones no estándar o rutas sin filtro estricto: existe riesgo de ver más datos de los esperados.

## 7) Riesgos encontrados

- Dependencia del cliente para restringir lectura.
- Endpoints/queries de detalle y contactos sin validación fuerte de pertenencia por empresa.
- Falta de enforcement centralizado en gateway para este módulo.
- Inconsistencia entre rutas/queries con filtro opcional y rutas sin filtro explícito.

## 8) Respuestas obligatorias

1. **¿Todos los usuarios ven los mismos terceros actualmente?**  
   No en el flujo normal UI; sí hay riesgo de sobreexposición en rutas/queries sin enforcement.

2. **Si no, ¿qué criterio define la visibilidad?**  
   Principalmente `empresa` (`id_empresa`) y `scope_acceso` en frontend.

3. **¿En qué capa está aplicada esa lógica?**  
   Mayormente frontend; parcialmente TerceroNestJs/TerceroPython; gateway no impone restricción de lectura.

4. **¿Cómo se transporta el contexto del usuario?**  
   JWT en `Authorization`; headers `X-Company-Id`, `X-User-Id`, `X-Scope-Acceso`; variables GraphQL (`id_empresa`) cuando frontend las envía.

5. **¿La restricción es real de backend o solo visual?**  
   Mixta, pero predominantemente dependiente de cliente para lectura.

6. **¿Qué endpoints o queries están afectados por esa lógica?**  
   `terceros`, `clientes`, `tercero(id)`, `contactosByTercero`; `/graphql`; `/api/tercero`, `/api/clientes`, `/api/contactos/tercero/:id_tercero`, `/api/contactos/:id_contacto`.

7. **¿Qué archivos exactos contienen la lógica de visibilidad?**  
   Los listados en la sección de archivos analizados.

8. **¿Hay riesgos de que un usuario vea información que no debería?**  
   Sí.

9. **¿Hay ausencia total de control de visibilidad?**  
   No total, pero sí ausencia de control robusto y uniforme de backend en lectura.

10. **¿Qué comportamiento real tiene hoy el sistema, sin asumir nada?**  
    La visibilidad depende en gran medida de cómo el frontend arma la consulta; backend no fuerza de manera consistente la segmentación en todas las rutas de lectura.

## 9) Confirmación de integridad

Se confirma que esta auditoría fue de solo lectura.  
No se modificó backend, frontend, gateway, base de datos, configuración ni infraestructura durante la fase de diagnóstico.
