# Guía de Pruebas - Backend de Terceros

## 🎯 Resumen de la Arquitectura

El sistema de terceros está dividido en dos servicios:

1. **TerceroNestJs** (Puerto 3005 externo / 3001 interno)
   - GraphQL endpoint: `http://localhost:3005/graphql`
   - **Responsabilidad**: Lectura y presentación de datos (GET)
   - Usa GraphQL para consultas

2. **TerceroPython** (Puerto 3004)
   - REST API: `http://localhost:3004`
   - **Responsabilidad**: Escritura de datos (POST, PUT, DELETE)
   - Usa REST para mutaciones

3. **Gateway API** (Puerto 3002)
   - Punto de entrada único: `http://localhost:3002`
   - Enruta las peticiones a los servicios correspondientes

## 📋 Pruebas del Backend

### 1. Verificar que los servicios estén corriendo

```bash
# Verificar contenedores Docker
docker ps | grep tercero

# Deberías ver:
# - erp-tercero-nestjs-service (puerto 3005)
# - erp-tercero-service (puerto 3004)
# - erp-gateway-api (puerto 3002)
```

### 2. Probar el Gateway (Punto de Entrada)

#### Health Check del Gateway
```bash
curl http://localhost:3002/health
```

#### Listar Terceros (GET - NestJS GraphQL)
```bash
curl http://localhost:3002/tercero
```

#### Obtener un Tercero por ID
```bash
curl http://localhost:3002/tercero/{id_tercero}
```

### 3. Probar Catálogos/Selects (GET - NestJS GraphQL)

#### Tipos de Tercero
```bash
curl http://localhost:3002/tercero/selects/tipo-tercero
```

#### Condiciones de Pago
```bash
curl http://localhost:3002/tercero/selects/condicion-pago
```

#### Formas de Pago
```bash
curl http://localhost:3002/tercero/selects/forma-pago
```

#### Incoterms
```bash
curl http://localhost:3002/tercero/selects/incoterms
```

#### Países
```bash
curl http://localhost:3002/tercero/selects/paises
```

### 4. Probar Creación de Tercero (POST - Python)

```bash
curl -X POST http://localhost:3002/tercero \
  -H "Content-Type: application/json" \
  -d '{
    "id_empresa": "uuid-de-empresa",
    "nombre": "Empresa de Prueba S.A.",
    "cliente": true,
    "proveedor": false,
    "cliente_potencial": false,
    "activo": true,
    "sujeto_iva": true,
    "direccion": "Calle Principal 123",
    "poblacion": "Guayaquil",
    "codigo_postal": "090101",
    "provincia": "Guayas",
    "telefono": "04-1234567",
    "correo": "contacto@empresa.com"
  }'
```

### 5. Probar GraphQL Directamente (TerceroNestJs)

#### Usando curl
```bash
curl -X POST http://localhost:3005/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { terceros { id_tercero nombre cliente proveedor activo } }"
  }'
```

#### Usando GraphQL Playground
1. Abre en el navegador: `http://localhost:3005/graphql`
2. Ejecuta esta query:
```graphql
query {
  terceros {
    id_tercero
    nombre
    apodo
    cliente
    proveedor
    cliente_potencial
    activo
    direccion
    poblacion
    correo
  }
}
```

#### Query para obtener un tercero específico
```graphql
query {
  tercero(id_tercero: "uuid-del-tercero") {
    id_tercero
    nombre
    direccion
    pais {
      nombre
    }
    tipo_tercero {
      nombre
    }
  }
}
```

### 6. Verificar Logs de los Servicios

```bash
# Logs del Gateway
docker logs erp-gateway-api -f

# Logs de TerceroNestJs
docker logs erp-tercero-nestjs-service -f

# Logs de TerceroPython
docker logs erp-tercero-service -f
```

## 🔗 Conexión Frontend-Backend

### Flujo de Datos

1. **Frontend (React)** → `http://localhost:3002` (Gateway)
2. **Gateway** → Enruta según el método:
   - **GET** → `http://tercero-nestjs-service:3001/graphql` (NestJS)
   - **POST/PUT/DELETE** → `http://tercero-python-service:3004` (Python)

### Archivos Clave

- **Frontend API**: `frontReact/src/_apis_/tercero.js`
- **Gateway Routes**: `gateway-api/src/routes/tercero.js`
- **Gateway Service NestJS**: `gateway-api/src/services/terceroNestJs.js`
- **Gateway Service Python**: `gateway-api/src/services/terceroPython.js`

## ✅ Checklist de Verificación

- [ ] Gateway responde en puerto 3002
- [ ] TerceroNestJs responde en puerto 3005
- [ ] TerceroPython responde en puerto 3004
- [ ] Los catálogos se cargan correctamente (tipos, países, etc.)
- [ ] Se puede crear un tercero desde el frontend
- [ ] Se puede listar terceros desde el frontend
- [ ] GraphQL Playground funciona en `http://localhost:3005/graphql`

## 🐛 Solución de Problemas

### Error: "Cannot connect to service"
- Verifica que todos los contenedores estén corriendo: `docker ps`
- Verifica las variables de entorno en `docker-compose.yml`
- Revisa los logs: `docker logs [nombre-contenedor]`

### Error: "GraphQL query failed"
- Verifica que TerceroNestJs esté corriendo
- Revisa que el schema GraphQL esté correcto
- Verifica los logs de TerceroNestJs

### Error: "Database connection failed"
- Verifica la conexión a la base de datos
- Revisa las variables de entorno `DATABASE_URL`
- Verifica que la base de datos tenga las tablas necesarias

### Los selects no cargan en el frontend
- Verifica que el Gateway esté accesible
- Revisa la consola del navegador para errores
- Verifica que las rutas del Gateway estén correctas
- Revisa que TerceroNestJs tenga los resolvers de GraphQL para los catálogos

## 📝 Notas Importantes

1. **id_empresa es obligatorio**: Asegúrate de tener un ID de empresa válido antes de crear terceros
2. **Los catálogos deben existir**: Asegúrate de tener datos en las tablas de catálogos (tipo_tercero_catalogo, condicion_pago_catalogo, etc.)
3. **GraphQL vs REST**: 
   - Usa GraphQL (NestJS) para leer datos
   - Usa REST (Python) para crear/actualizar/eliminar datos

