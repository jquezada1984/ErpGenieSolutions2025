# 🚀 API Gateway - Fastify

## 📋 Descripción

API Gateway moderno y rápido para el sistema ERP. Actúa como punto de entrada único para todas las comunicaciones entre el frontend y los microservicios.

## 🏗️ Arquitectura

```
Frontend (React:3000)
    ↓
API Gateway (Fastify:3000) ← ESTE PROYECTO
    ↓
├── NestJS GraphQL (3001) - Consultas
└── Python REST (5000) - Mutaciones
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd gateway-api
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar variables según tu configuración
nano .env
```

### 3. Variables de Entorno Disponibles

```bash
# Servicios
PYTHON_SERVICE_URL=http://localhost:5000
PYTHON_SERVICE_TIMEOUT=5000
NESTJS_SERVICE_URL=http://localhost:3001
NESTJS_SERVICE_TIMEOUT=5000

# Gateway
GATEWAY_PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📡 Endpoints Disponibles

### Empresas

| Método | Endpoint | Descripción | Servicio Destino |
|--------|----------|-------------|------------------|
| GET | `/gateway/empresas` | Obtener todas las empresas | NestJS (GraphQL) |
| GET | `/gateway/empresas/:id` | Obtener empresa específica | NestJS (GraphQL) |
| POST | `/gateway/empresas` | Crear nueva empresa | Python (REST) |
| PUT | `/gateway/empresas/:id` | Actualizar empresa | Python (REST) |
| DELETE | `/gateway/empresas/:id` | Eliminar empresa | Python (REST) |

### Monitoreo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/gateway/health` | Health check de todos los servicios |
| GET | `/gateway/status` | Estado del Gateway |

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/gateway/health
```

### Obtener Empresas
```bash
curl http://localhost:3000/gateway/empresas
```

### Crear Empresa
```bash
curl -X POST http://localhost:3000/gateway/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Empresa Test",
    "ruc": "12345678901",
    "direccion": "Test 123",
    "telefono": "01-123-4567",
    "email": "test@empresa.com"
  }'
```

## 📁 Estructura del Proyecto

```
gateway-api/
├── src/
│   ├── app.js                     # Servidor principal Fastify
│   ├── routes/
│   │   ├── empresas.js            # Rutas de empresas
│   │   └── health.js              # Health checks
│   ├── services/
│   │   ├── index.js               # Exportación de servicios
│   │   ├── python.js              # Cliente Python REST
│   │   └── nestjs.js              # Cliente NestJS GraphQL
│   └── schemas/
│       └── empresa.js             # Esquemas de validación
├── package.json                   # Dependencias
├── env.example                    # Variables de entorno de ejemplo
└── README.md                      # Este archivo
```

## 🔧 Configuración Avanzada

### Cambiar Puerto del Gateway
```bash
# En .env
GATEWAY_PORT=8080
```

### Cambiar URLs de Microservicios
```bash
# En .env
PYTHON_SERVICE_URL=http://mi-servidor:5000
NESTJS_SERVICE_URL=http://mi-servidor:3001
```

### Configurar CORS
```bash
# En .env
CORS_ORIGIN=http://mi-frontend.com,http://localhost:3000
```

## 📊 Logging

El Gateway incluye logging detallado de todas las operaciones:

- **Requests**: Todas las peticiones entrantes
- **Responses**: Todas las respuestas salientes
- **Errors**: Errores detallados con stack trace
- **Service Calls**: Llamadas a microservicios

### Configurar Logging
```bash
# En .env
LOG_LEVEL=debug          # debug, info, warn, error
LOG_REQUESTS=true        # Habilitar logging de requests
LOG_RESPONSES=true       # Habilitar logging de responses
```

## 🚀 Despliegue

### Docker (Recomendado)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  gateway:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PYTHON_SERVICE_URL=http://python-service:5000
      - NESTJS_SERVICE_URL=http://nestjs-service:3001
    depends_on:
      - python-service
      - nestjs-service
```

## 🔄 Migración desde Arquitectura Anterior

### Antes (Sin Gateway)
```javascript
// Frontend se comunicaba directamente con microservicios
const { data } = await client.query({ query: GET_EMPRESAS });
await crearEmpresa(empresaData);
```

### Después (Con Gateway)
```javascript
// Frontend se comunica solo con el Gateway
import { getEmpresas, crearEmpresa } from '../_apis_/gateway';

const empresas = await getEmpresas();
await crearEmpresa(empresaData);
```

## ✨ Características

- ✅ **Punto de entrada único** para todos los microservicios
- ✅ **Enrutamiento automático** basado en el tipo de operación
- ✅ **Validación automática** con JSON Schema
- ✅ **Logging estructurado** con Pino
- ✅ **Manejo de errores consistente**
- ✅ **Health checks** de microservicios
- ✅ **Configuración flexible** via variables de entorno
- ✅ **CORS configurado** para frontend
- ✅ **Timeouts configurables** por servicio
- ✅ **Rendimiento superior** con Fastify
- ✅ **Validación de esquemas** automática

## 🔮 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Agregar rate limiting
- [ ] Implementar cache para consultas frecuentes
- [ ] Agregar métricas con Prometheus
- [ ] Implementar circuit breaker
- [ ] Agregar documentación con Swagger
- [ ] Implementar load balancing
- [ ] Agregar tests unitarios y de integración

## 📞 Soporte

Para soporte técnico o preguntas sobre el Gateway, contacta al equipo de desarrollo. 