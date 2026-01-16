# Solución para Error de Pantalla en Blanco del Frontend

## Problema
El frontend muestra pantalla en blanco con errores `ERR_CONNECTION_RESET` en la consola del navegador.

## Diagnóstico

### Estado Actual
- ✅ El contenedor `erp-frontend-dev` está corriendo
- ✅ Vite está iniciado correctamente en el puerto 3000
- ✅ El servidor responde (aunque con 404 en algunos casos)
- ❌ El navegador no puede cargar los archivos estáticos

## Soluciones Aplicadas

### 1. Configuración de Vite para Docker
Se actualizó `vite.config.js` con:
- `host: '0.0.0.0'` - Permitir conexiones externas
- `strictPort: false` - No fallar si el puerto está ocupado
- `cors: true` - Habilitar CORS
- `usePolling: true` - Para detectar cambios en Docker
- Configuración mejorada de HMR (Hot Module Replacement)

### 2. Gateway GraphQL
Se corrigió el routing para que las mutations de permisos vayan a `InicioNestJs` en lugar de `MenuNestJs`.

### 3. Resolvers de Permisos
Se mejoró el manejo de permisos existentes para evitar errores al crear duplicados.

## Soluciones Adicionales a Probar

### Opción 1: Limpiar caché del navegador
1. Abre las herramientas de desarrollador (F12)
2. Haz clic derecho en el botón de recargar
3. Selecciona "Vaciar caché y volver a cargar de forma forzada"

### Opción 2: Verificar que no haya otro proceso en el puerto 3000
```powershell
# Ver qué proceso está usando el puerto 3000
netstat -ano | findstr :3000

# Si hay un proceso local (no Docker), detenerlo
# Buscar el PID en la última columna y usar:
taskkill /PID [número] /F
```

### Opción 3: Acceder directamente a la IP del contenedor
Si `localhost:3000` no funciona, intenta acceder a:
- `http://172.20.0.9:3000` (IP interna del contenedor)

### Opción 4: Reconstruir el contenedor del frontend
```powershell
docker-compose -f docker-compose.dev.yml stop frontend
docker-compose -f docker-compose.dev.yml rm -f frontend
docker-compose -f docker-compose.dev.yml build --no-cache frontend
docker-compose -f docker-compose.dev.yml up -d frontend
```

### Opción 5: Verificar logs en tiempo real
```powershell
docker-compose -f docker-compose.dev.yml logs -f frontend
```

## Verificación

### 1. Verificar que el frontend esté accesible
```powershell
# Desde el host
Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing

# Debería retornar código 200 o 404 (no ERR_CONNECTION_RESET)
```

### 2. Verificar que todos los servicios estén corriendo
```powershell
docker-compose -f docker-compose.dev.yml ps
```

Todos los servicios deberían mostrar estado "Up":
- erp-frontend-dev
- erp-gateway-api-dev
- erp-nestjs-service-dev
- erp-menu-service-dev
- erp-contabilidad-nestjs-service-dev
- erp-contabilidad-python-service-dev
- erp-financiero-nestjs-service-dev
- erp-financiero-python-service-dev
- erp-python-service-dev

### 3. Verificar logs del frontend
```powershell
docker-compose -f docker-compose.dev.yml logs frontend --tail=50
```

Buscar errores relacionados con:
- Compilación de módulos
- Errores de importación
- Problemas de red

## Si el Problema Persiste

### Verificar configuración de red Docker
```powershell
docker network inspect erp_erp-network
```

### Verificar que el puerto 3000 esté correctamente mapeado
```powershell
docker port erp-frontend-dev
```

Debería mostrar: `3000/tcp -> 0.0.0.0:3000`

### Reconstruir completamente
```powershell
# Detener todo
docker-compose -f docker-compose.dev.yml down

# Limpiar volúmenes y redes
docker-compose -f docker-compose.dev.yml down -v
docker network prune -f

# Reconstruir e iniciar
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

## Notas Importantes

1. **Variables de entorno**: El frontend necesita `VITE_GATEWAY_URL` configurado correctamente
2. **CORS**: Asegúrate de que el gateway tenga CORS habilitado para `http://localhost:3000`
3. **HMR**: El Hot Module Replacement puede tener problemas en Docker, por eso se configuró `usePolling: true`

## Contacto para Soporte

Si el problema persiste después de intentar estas soluciones, proporciona:
1. Logs completos del frontend: `docker-compose -f docker-compose.dev.yml logs frontend`
2. Captura de pantalla de la consola del navegador (F12)
3. Salida de `docker-compose -f docker-compose.dev.yml ps`
