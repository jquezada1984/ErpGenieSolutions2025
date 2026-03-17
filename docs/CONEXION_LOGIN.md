# Conexión para el Login

Para que el login funcione, el frontend debe poder hablar con el **Gateway** y el Gateway con **InicioNestJs**. Aquí tienes las URLs y cómo configurarlas.

## URLs de conexión

| Qué | URL | Uso |
|-----|-----|-----|
| **Gateway (GraphQL)** | `http://localhost:3002/graphql` | Login, usuarios, empresas, etc. |
| **Gateway (salud)** | `http://localhost:3002/graphql/health` | Comprobar si el gateway responde |
| **InicioNestJs** | `http://localhost:3001` | Donde el gateway envía login y consultas de inicio |
| **MenuNestJs** | `http://localhost:3003` | Menús y permisos |
| **Frontend** | `http://localhost:3000` | Donde corre la app React |

## Configuración del Gateway

El gateway **debe** tener estas variables (por `.env` o `start-gateway.bat`):

```env
NESTJS_SERVICE_URL=http://localhost:3001
MENU_SERVICE_URL=http://localhost:3003
PYTHON_SERVICE_URL=http://localhost:5000
GATEWAY_PORT=3002
CORS_ORIGIN=http://localhost:3000
```

Si no están, el gateway no arranca. Para desarrollo rápido puedes usar:

```bat
cd gateway-api
start-gateway.bat
```

## Configuración del Frontend

En `frontReact` crea o edita `.env`:

```env
VITE_GATEWAY_URL=http://localhost:3002
```

Si no existe `.env`, el front ya usa por defecto `http://localhost:3002` para GraphQL.

## Login y contraseña

- **Login** = el **correo electrónico** del usuario (o su **username**, según cómo esté en la base).
- **Contraseña** = la contraseña que tiene ese usuario en la base de datos (tabla `usuario`).

No hay usuario/contraseña de prueba hardcodeados. Los usuarios se crean en el sistema (pantalla Usuarios o por `crearUsuario` en GraphQL). El correo que ves en el formulario (por ejemplo `john_quezada@hotmail.com`) es el **login**; la contraseña es la que configuraste para ese usuario al crearlo o editarlo.

## Cómo iniciar InicioNestJs

**Opción A – Con Docker (recomendado si ya usas docker-compose):**
```bash
docker-compose -f docker-compose.dev.yml up -d nestjs-service
```
Ver logs: `docker-compose -f docker-compose.dev.yml logs -f nestjs-service`

**Opción B – Sin Docker (desde la raíz del repo):**
- Ejecutar el script: **`start-inicio-nestjs.bat`** (doble clic o desde terminal).
- O manualmente:
  ```bash
  cd InicioNestJs
  npm install --legacy-peer-deps
  npm run start:dev
  ```
- Debe existir `InicioNestJs/.env` con al menos la base de datos y JWT (puedes copiar de `InicioNestJs/env.example`).

Cuando arranque bien verás: `Backend NestJS ejecutándose en puerto 3001` y GraphQL en `http://localhost:3001/graphql`.

## Orden para que funcione

1. **Base de datos** accesible para InicioNestJs (variables en `InicioNestJs/.env`: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`).
2. **InicioNestJs** en marcha en el puerto **3001** (usa `start-inicio-nestjs.bat` o Docker).
3. **MenuNestJs** en marcha en el puerto **3003** (y opcionalmente Python en 5000 si usas ese servicio).
4. **Gateway** en marcha en el puerto **3002** con las variables anteriores.
5. **Frontend** en **3000** con `VITE_GATEWAY_URL=http://localhost:3002` (o sin .env para usar el default).

Si al hacer login sale *"Error de conexión. Verifique su conexión a internet"*, suele ser que el navegador no recibe respuesta de `http://localhost:3002/graphql`: revisa que el gateway esté levantado en 3002 y que InicioNestJs esté en 3001.
