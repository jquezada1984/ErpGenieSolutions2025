# 🏗️ Arquitectura CORS - ERP System

## 📋 Flujo de Peticiones

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Gateway API   │    │  Microservicios │
│   React         │───▶│   (Fastify)     │───▶│  (NestJS/Python)│
│   (3000/5173)   │    │   (3002)        │    │  (3001/5000)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔒 Configuración CORS por Servicio

### 1. **Frontend React** (Puertos 3000, 5173)
- **Permite**: Todas las peticiones (desde navegador)
- **Configuración**: No aplica (cliente)

### 2. **Gateway API** (Puerto 3000)
- **Permite**: Solo Frontend React
- **URLs permitidas**: `http://localhost:3000`, `http://localhost:5173`
- **Archivo**: `gateway-api/.env`
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 3. **NestJS Backend** (Puerto 3001)
- **Permite**: Solo Gateway API
- **URLs permitidas**: `http://localhost:3002` (Gateway)
- **Archivo**: `InicioNestJs/.env`
```env
CORS_ORIGINS=http://localhost:3002
```

### 4. **Python Microservice** (Puerto 5000)
- **Permite**: Solo Gateway API
- **URLs permitidas**: `http://localhost:3002` (Gateway)
- **Archivo**: `InicioPython/.env`
```env
CORS_ORIGINS=http://localhost:3002
```

## 🛡️ Beneficios de Seguridad

### ✅ **Ventajas de esta arquitectura:**

1. **🔒 Seguridad mejorada**: Los microservicios no exponen APIs directamente al frontend
2. **🎯 Control centralizado**: Todas las peticiones pasan por el Gateway
3. **📊 Monitoreo**: Logging y métricas centralizadas en el Gateway
4. **🔧 Flexibilidad**: Fácil agregar autenticación, rate limiting, etc.
5. **🌐 Escalabilidad**: Los microservicios pueden estar en redes privadas

### ❌ **Lo que NO se permite:**

- ❌ Frontend → NestJS (directo)
- ❌ Frontend → Python (directo)
- ❌ Cualquier origen externo a los microservicios

## 🚀 Flujo de Datos

### **Login/Autenticación:**
```
Frontend → Gateway → NestJS (GraphQL) → Base de Datos
```

### **Consulta de Empresas:**
```
Frontend → Gateway → NestJS (GraphQL) → Base de Datos
```

### **Crear Empresa:**
```
Frontend → Gateway → Python (REST) → Base de Datos
```

### **Actualizar Empresa:**
```
Frontend → Gateway → Python (REST) → Base de Datos
```
**Nota:** Validación flexible de RUC (1-20 caracteres, sin patrón estricto)

## 📝 Comandos Útiles

```bash
# Verificar configuraciones CORS
check-cors-config.bat

# Iniciar todos los servicios
start-simple.bat

# Detener todos los servicios
stop-all-services.bat
```

## 🔧 Troubleshooting

### **Error CORS en Frontend:**
- Verificar que Gateway API esté ejecutándose en puerto 3000
- Verificar configuración CORS en `gateway-api/.env`

### **Error CORS en Gateway:**
- Verificar que microservicios estén ejecutándose
- Verificar configuración CORS en microservicios

### **Error de Conexión:**
- Verificar que todos los puertos estén disponibles
- Verificar variables de entorno en cada servicio 