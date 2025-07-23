# 🏗️ Arquitectura ERP con API Gateway Independiente

## 📋 Descripción General

El sistema ERP ahora utiliza una arquitectura de microservicios con un **API Gateway independiente** que actúa como punto de entrada único para todas las comunicaciones.

## 🏗️ Nueva Arquitectura

```
┌─────────────────┐
│   Frontend      │
│   (React:3000)  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   API Gateway   │ ← PROYECTO INDEPENDIENTE
│   (NestJS:3000) │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌─────────┐ ┌─────────┐
│ NestJS  │ │ Python  │
│GraphQL  │ │ REST    │
│(3001)   │ │(5000)   │
└─────────┘ └─────────┘
```

## 📁 Estructura de Proyectos

```
erp/
├── frontReact/           # Frontend React
├── back-nest-js/         # Servicio NestJS (GraphQL)
├── microservice-db/      # Servicio Python (REST)
└── gateway-api/          # 🆕 API Gateway Independiente
```

## 🚀 Configuración y Ejecución

### 1. Servicio Python (REST)
```bash
cd microservice-db
python start_server.py
# Puerto: 5000
```

### 2. Servicio NestJS (GraphQL)
```bash
cd back-nest-js
npm run start:dev
# Puerto: 3001 (interno)
```

### 3. API Gateway (Nuevo)
```bash
cd gateway-api
npm install
npm run start:dev
# Puerto: 3000 (punto de entrada)
```

### 4. Frontend React
```bash
cd frontReact
npm start
# Puerto: 3000 (diferente del Gateway)
```

## 🔄 Flujo de Datos

### Consultas (GET)
```
Frontend → Gateway → NestJS (GraphQL) → Base de Datos
```

### Mutaciones (POST/PUT/DELETE)
```
Frontend → Gateway → Python (REST) → Base de Datos
```

## 📡 Endpoints del Gateway

| Método | Endpoint | Descripción | Servicio Destino |
|--------|----------|-------------|------------------|
| GET | `/gateway/empresas` | Obtener empresas | NestJS (GraphQL) |
| GET | `/gateway/empresas/:id` | Obtener empresa | NestJS (GraphQL) |
| POST | `/gateway/empresas` | Crear empresa | Python (REST) |
| PUT | `/gateway/empresas/:id` | Actualizar empresa | Python (REST) |
| DELETE | `/gateway/empresas/:id` | Eliminar empresa | Python (REST) |
| GET | `/gateway/health` | Health check | Ambos servicios |
| GET | `/gateway/status` | Estado del Gateway | - |

## 🔧 Configuración del Gateway

### Variables de Entorno
```bash
# gateway-api/.env
PYTHON_SERVICE_URL=http://localhost:5000
NESTJS_SERVICE_URL=http://localhost:3001
GATEWAY_PORT=3000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Configuración del Frontend
```javascript
// frontReact/src/_apis_/gateway.js
const GATEWAY_URL = 'http://localhost:3000/gateway';
```

## ✨ Ventajas de la Nueva Arquitectura

### 🎯 **Gateway Independiente**
- ✅ **Proyecto separado**: Fácil de mover, mantener y escalar
- ✅ **Configuración independiente**: Variables de entorno propias
- ✅ **Despliegue independiente**: Puede desplegarse por separado
- ✅ **Versionado independiente**: Control de versiones propio

### 🔄 **Enrutamiento Inteligente**
- ✅ **Consultas automáticas**: GET → NestJS (GraphQL)
- ✅ **Mutaciones automáticas**: POST/PUT/DELETE → Python (REST)
- ✅ **Validación centralizada**: Una sola capa de validación
- ✅ **Logging unificado**: Todos los logs en un lugar

### 🛡️ **Seguridad y Monitoreo**
- ✅ **Punto de entrada único**: Una sola capa de seguridad
- ✅ **Health checks**: Monitoreo de microservicios
- ✅ **Manejo de errores**: Respuestas estandarizadas
- ✅ **Timeouts configurables**: Por servicio

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

## 🚀 Comandos de Inicio Rápido

### Script de Inicio Completo
```bash
# Terminal 1: Python Service
cd microservice-db && python start_server.py

# Terminal 2: NestJS Service
cd back-nest-js && npm run start:dev

# Terminal 3: Gateway
cd gateway-api && npm run start:dev

# Terminal 4: Frontend
cd frontReact && npm start
```

### Script de Inicio del Gateway (Windows)
```bash
cd gateway-api
start.bat
```

## 🧪 Testing del Gateway

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

## 📊 Monitoreo y Logs

### Logs del Gateway
```bash
# Ver logs en tiempo real
cd gateway-api
npm run start:dev
```

### Health Check de Servicios
```bash
# Verificar estado de todos los servicios
curl http://localhost:3000/gateway/health
```

## 🔮 Próximos Pasos

- [ ] Implementar autenticación JWT en el Gateway
- [ ] Agregar rate limiting
- [ ] Implementar cache para consultas frecuentes
- [ ] Agregar métricas con Prometheus
- [ ] Implementar circuit breaker para fallback
- [ ] Agregar documentación con Swagger
- [ ] Implementar load balancing
- [ ] Agregar tests unitarios y de integración

## 📞 Soporte

Para soporte técnico o preguntas sobre la nueva arquitectura, contacta al equipo de desarrollo. 