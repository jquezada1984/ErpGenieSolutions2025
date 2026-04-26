# 🐳 Desarrollo con Docker - ERP System

Este documento explica cómo configurar y usar Docker para desarrollo con hot reload automático.

## 🚀 Inicio Rápido

### Windows (scripts en la raíz del repo)

- **`docker-dev-up.bat`** — construye imágenes si hace falta e inicia todo el stack (`up -d --build`).
- **`docker-dev-down.bat`** — detiene y elimina los contenedores del compose de desarrollo.
- **`docker-dev-restart.bat`** — `down` + `up -d` sin rebuild (útil tras un fallo o para refrescar).

### Linux / macOS / WSL (mismos comandos que usan los scripts)

```bash
docker compose -f docker-compose.dev.yml up -d --build   # equivalente a docker-dev-up.bat
docker compose -f docker-compose.dev.yml down            # equivalente a docker-dev-down.bat
docker compose -f docker-compose.dev.yml down && docker compose -f docker-compose.dev.yml up -d
```

### Primer plano (logs en la terminal)

```bash
docker compose -f docker-compose.dev.yml up --build
```

## 📋 Servicios Disponibles

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| Frontend React | 3000 | http://localhost:3000 | Interfaz de usuario |
| Gateway API | 3002 | http://localhost:3002 | Punto de entrada único |
| Backend NestJS | 3001 | http://localhost:3001 | API GraphQL principal |
| Backend Python | 5000 | http://localhost:5000 | API REST para datos |
| Menu Service | 3003 | http://localhost:3003 | Servicio de menús y permisos |

## 🔄 Hot Reload

### ✅ Configurado para Hot Reload Automático

Todos los servicios están configurados para reflejar cambios automáticamente:

- **Frontend React**: Vite con hot reload
- **Backend NestJS**: `npm run start:dev` con watch mode
- **Gateway API**: Nodemon con watch mode
- **Menu Service**: `npm run start:dev` con watch mode
- **Backend Python**: Flask con debug mode

### 📁 Volúmenes Montados

```yaml
volumes:
  - ./frontReact:/app          # Frontend
  - ./gateway-api:/app         # Gateway
  - ./InicioNestJs:/app        # Backend NestJS
  - ./MenuNestJs:/app          # Menu Service
  - ./InicioPython:/app        # Backend Python
  - /app/node_modules          # Excluir node_modules del host
```

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Iniciar todos los servicios
docker compose -f docker-compose.dev.yml up

# Iniciar en segundo plano
docker compose -f docker-compose.dev.yml up -d

# Reconstruir solo un servicio
docker compose -f docker-compose.dev.yml up --build nestjs-service

# Ver logs de un servicio específico
docker compose -f docker-compose.dev.yml logs -f frontend
```

### Limpieza
```bash
# Detener todos los servicios
docker compose -f docker-compose.dev.yml down

# Detener y eliminar volúmenes
docker compose -f docker-compose.dev.yml down -v

# Limpiar imágenes no utilizadas
docker system prune -f
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

El archivo `docker-compose.dev.yml` incluye:

- **NODE_ENV=development**: Modo desarrollo
- **TZ=America/Guayaquil**: Zona horaria de Ecuador
- **CORS_ORIGIN**: Configurado para desarrollo local
- **Hot Reload**: Habilitado en todos los servicios

### Dockerfiles de Desarrollo

Cada servicio tiene su propio `Dockerfile.dev` optimizado para desarrollo:

- **Dependencias de desarrollo**: Incluidas
- **Watch mode**: Habilitado
- **Debug**: Configurado
- **Hot reload**: Automático

## 🐛 Debugging

### Ver Logs en Tiempo Real
```bash
# Todos los servicios
docker compose -f docker-compose.dev.yml logs -f

# Servicio específico
docker compose -f docker-compose.dev.yml logs -f nestjs-service
```

### Acceder a Contenedor
```bash
# Acceder al contenedor del frontend
docker exec -it erp-frontend-dev sh

# Acceder al contenedor del backend
docker exec -it erp-nestjs-service-dev sh
```

## 📝 Notas Importantes

1. **Primera vez**: Los contenedores se construirán automáticamente
2. **Cambios de código**: Se reflejan automáticamente sin reconstruir
3. **Dependencias**: Se instalan automáticamente en el contenedor
4. **Puertos**: Asegúrate de que los puertos estén libres
5. **Volúmenes**: Los cambios se sincronizan automáticamente

## 🚨 Solución de Problemas

### Puerto en Uso
```bash
# Verificar puertos en uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
netstat -tulpn | grep :3002
```

### Reconstruir Contenedor
```bash
# Reconstruir servicio específico
docker compose -f docker-compose.dev.yml up --build --force-recreate nestjs-service
```

### Limpiar Docker
```bash
# Limpiar todo
docker system prune -a -f
docker volume prune -f
```

## 🎯 Flujo de Desarrollo

1. **Iniciar servicios**: `docker compose -f docker-compose.dev.yml up`
2. **Hacer cambios**: Editar código en tu editor
3. **Ver cambios**: Se reflejan automáticamente en el navegador
4. **Debug**: Usar logs y herramientas de desarrollo
5. **Commit**: Cuando esté listo, hacer commit de los cambios
