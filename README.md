# ErpGenieSolutions2025

Sistema ERP moderno con arquitectura de microservicios, API Gateway y frontend React.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Gateway API   │    │   Microservicios│
│   React (Vite)  │◄──►│   Fastify       │◄──►│   Python + NestJS│
│   Puerto: 3000  │    │   Puerto: 3002  │    │   Puerto: 5000/3001│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Componentes:**

- **Frontend React** (`frontReact/`) - Interfaz de usuario moderna
- **Gateway API** (`gateway-api/`) - API Gateway centralizado (Fastify)
- **Microservicio Python** (`InicioPython/`) - Gestión de base de datos (Flask) - Puerto: 5000
- **Backend NestJS** (`InicioNestJs/`) - API GraphQL (NestJS) - Puerto: 3001
- **MenuNestJs** (`MenuNestJs/`) - Servicio de menús (NestJS) - Puerto: 3003
- **Microservicio Python Financiero** (`FinancieroPython/`) - Módulo financiero (Flask) - Puerto: 5001
- **Backend NestJS Financiero** (`FinancieroNestJs/`) - API GraphQL Financiero (NestJS) - Puerto: 3004

---

## 🔌 **Puertos de los Servicios**

Esta es la configuración completa de puertos utilizada por cada servicio del sistema:

| Servicio | Puerto | Descripción | URL Local |
|----------|--------|-------------|-----------|
| **Frontend React** | 3000 | Interfaz de usuario (Nginx) | http://localhost:3000 |
| **Gateway API** | 3002 | API Gateway centralizado (Fastify) | http://localhost:3002 |
| **Python Service (Inicio)** | 5000 | Microservicio Flask - Gestión base de datos | http://localhost:5000 |
| **NestJS Service (Inicio)** | 3001 | API GraphQL - Módulo de inicio | http://localhost:3001 |
| **Menu Service** | 3003 | API GraphQL - Servicio de menús | http://localhost:3003 |
| **Python Service Financiero** | 5001 | Microservicio Flask - Módulo financiero | http://localhost:5001 |
| **NestJS Service Financiero** | 3004 | API GraphQL - Módulo financiero | http://localhost:3004 |

### **Endpoints Especiales:**

- **GraphQL Playground (Inicio):** http://localhost:3001/graphql
- **GraphQL Playground (Financiero):** http://localhost:3004/graphql
- **GraphQL Playground (Menú):** http://localhost:3003/graphql
- **Health Check (Python Inicio):** http://localhost:5000/health
- **Health Check (Python Financiero):** http://localhost:5001/health
- **Gateway Health Check:** http://localhost:3002/gateway/health

### **Notas Importantes:**

- Todos los servicios se comunican internamente a través de la red Docker `erp-network`
- Los puertos expuestos son para acceso desde el host local
- El Gateway API actúa como punto de entrada único para el frontend
- Los servicios GraphQL tienen sus propios playgrounds para desarrollo y pruebas

---

## 📋 Requisitos del Sistema

### **Software Requerido:**
- **Docker** 20.10+ (contenedorización)
- **Docker Compose** 2.0+ (orquestación)
- **Git** (control de versiones)

### **Base de Datos:**
- **PostgreSQL** - Servicio externo (configurar DATABASE_URL)
- **SQLite** - Para desarrollo local (opcional)

---

## 🚀 Instalación y Configuración

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/jquezada1984/ErpGenieSolutions2025.git
cd ErpGenieSolutions2025
```

---

## 🐳 **Ejecución con Docker**

### **Requisitos:**
- **Docker** 20.10+
- **Docker Compose** 2.0+

### **Inicio Rápido:**

#### **Opción 1: Scripts Automáticos (Windows)**

##### **Para Desarrollo (con Hot-Reload):**
```bash
# Iniciar servicios de desarrollo
start-docker-dev.bat

# Detener servicios de desarrollo
stop-docker-dev.bat
```

##### **Para Producción:**
```bash
# Iniciar servicios de producción
start-docker.bat

# Detener servicios de producción
stop-docker.bat
```

#### **Opción 2: Comandos Docker**

##### **Para Desarrollo (con Hot-Reload):**
```bash
# Construir e iniciar servicios de desarrollo
docker-compose -f docker-compose.dev.yml up --build -d

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios de desarrollo
docker-compose -f docker-compose.dev.yml down
```

##### **Para Producción:**
```bash
# Construir e iniciar servicios de producción
docker-compose up --build -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener servicios de producción
docker-compose down
```

---

## 🐳 **Creación de Contenedores Docker**

### **Paso a Paso - Primera Vez:**

#### **1. Configurar Variables de Entorno:**
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar con tu configuración de base de datos
# DATABASE_URL=postgresql://usuario:password@servidor:5432/erp_database
```

#### **2. Construir Contenedores:**

##### **Para Desarrollo (con Hot-Reload):**
```bash
# Construir imágenes de desarrollo
docker-compose -f docker-compose.dev.yml build

# O construir e iniciar en un solo comando
docker-compose -f docker-compose.dev.yml up --build -d
```

##### **Para Producción:**
```bash
# Construir imágenes de producción
docker-compose build

# O construir e iniciar en un solo comando
docker-compose up --build -d
```

#### **3. Verificar Contenedores:**
```bash
# Ver estado de todos los contenedores
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs -f python-service

# Ver logs de todos los servicios
docker-compose logs -f
```

### **Comandos de Gestión de Contenedores:**

#### **Construir Contenedores:**

##### **Desarrollo (con Hot-Reload):**
```bash
# Construir todos los servicios de desarrollo
docker-compose -f docker-compose.dev.yml build

# Construir un servicio específico
docker-compose -f docker-compose.dev.yml build python-service

# Forzar reconstrucción (sin cache)
docker-compose -f docker-compose.dev.yml build --no-cache
```

##### **Producción:**
```bash
# Construir todos los servicios de producción
docker-compose build

# Construir un servicio específico
docker-compose build python-service

# Forzar reconstrucción (sin cache)
docker-compose build --no-cache
```

#### **Iniciar/Detener Contenedores:**

##### **Desarrollo (con Hot-Reload):**
```bash
# Iniciar todos los servicios de desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Iniciar un servicio específico
docker-compose -f docker-compose.dev.yml up -d python-service

# Detener todos los servicios
docker-compose -f docker-compose.dev.yml down

# Detener y eliminar volúmenes
docker-compose -f docker-compose.dev.yml down -v
```

##### **Producción:**
```bash
# Iniciar todos los servicios de producción
docker-compose up -d

# Iniciar un servicio específico
docker-compose up -d python-service

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

#### **Gestión de Contenedores:**
```bash
# Ver contenedores en ejecución
docker-compose ps

# Reiniciar un servicio
docker-compose restart python-service

# Reiniciar todos los servicios
docker-compose restart

# Ver uso de recursos
docker stats
```

### **Servicios Disponibles:**
- **Frontend React:** http://localhost:3000
- **Gateway API:** http://localhost:3002
- **Python Service (Inicio):** http://localhost:5000
- **NestJS Service (Inicio):** http://localhost:3001
- **Menu Service:** http://localhost:3003
- **Python Service Financiero:** http://localhost:5001
- **NestJS Service Financiero:** http://localhost:3004 (GraphQL Playground: http://localhost:3004/graphql)

---

## 🔥 **Hot-Reload para Desarrollo**

### **¿Qué es Hot-Reload?**
El Hot-Reload permite que los cambios en tu código se reflejen automáticamente en los contenedores sin necesidad de reconstruirlos.

### **Configuración de Hot-Reload:**

#### **Archivos que se actualizan automáticamente:**
- ✅ **Python Service (Inicio)** - Cambios en `InicioPython/`
- ✅ **NestJS Service (Inicio)** - Cambios en `InicioNestJs/`
- ✅ **Menu Service** - Cambios en `MenuNestJs/`
- ✅ **Python Service Financiero** - Cambios en `FinancieroPython/`
- ✅ **NestJS Service Financiero** - Cambios en `FinancieroNestJs/`
- ✅ **Gateway API** - Cambios en `gateway-api/`
- ✅ **Frontend React** - Cambios en `frontReact/`

#### **Comandos para Desarrollo con Hot-Reload:**
```bash
# Iniciar en modo desarrollo (con hot-reload)
docker-compose -f docker-compose.dev.yml up -d

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Reiniciar un servicio específico
docker-compose -f docker-compose.dev.yml restart python-service
```

### **Flujo de Desarrollo:**
1. **Iniciar servicios en modo desarrollo**
2. **Editar código** en tu editor
3. **Los cambios se reflejan automáticamente** en el contenedor
4. **Ver resultados** en el navegador/servicio

---

## 🔧 Configuración de Base de Datos

### **Base de Datos Externa:**
El sistema se conecta a una base de datos PostgreSQL externa. Configura la variable `DATABASE_URL` antes de iniciar los servicios.

### **Estructura Completa de Empresa:**

La entidad empresa incluye todos los campos del esquema PostgreSQL:

#### **Campos Básicos:**
- `nombre`, `ruc`, `direccion`, `telefono`, `email`, `estado`
- `codigo_postal`, `poblacion`, `movil`, `fax`, `web`
- `logo`, `logotipo_cuadrado`, `nota`
- `sujeto_iva`, `fiscal_year_start_month`, `fiscal_year_start_day`

#### **Relaciones:**
- `id_moneda` → Tabla `moneda`
- `id_pais` → Tabla `pais`
- `id_provincia` → Tabla `provincia`

#### **Entidades Relacionadas:**
- **empresa_identificacion**: Información fiscal y legal
- **empresa_red_social**: Redes sociales de la empresa
- **empresa_horario_apertura**: Horarios de apertura

### **Configuración de Variables de Entorno:**

#### **Crear archivo .env:**
```bash
cp env.example .env
```

#### **Editar .env con tu configuración:**
```env
# Para PostgreSQL externo:
DATABASE_URL=postgresql://usuario:password@servidor-externo:5432/erp_database

# Para SQLite local (desarrollo):
# DATABASE_URL=sqlite:///app/data/database.db

JWT_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
```

### **Comandos de Base de Datos con Docker:**

#### **Insertar Datos Maestros:**
```bash
docker-compose exec python-service python insert_master_data.py
```

#### **Probar Empresa Completa:**
```bash
docker-compose exec python-service python test_empresa_completa.py
```

#### **Aplicar Migración de Email Único:**
```bash
docker-compose exec python-service python apply_email_unique.py
```

#### **Verificar Conexión:**
```bash
docker-compose exec python-service python test_connection.py
```

---

## 📡 Endpoints Disponibles

### **Gateway API (Puerto 3002):**
- `GET /gateway/empresas` - Listar empresas
- `GET /gateway/empresas/:id` - Obtener empresa
- `POST /gateway/empresas` - Crear empresa
- `PUT /gateway/empresas/:id` - Actualizar empresa
- `DELETE /gateway/empresas/:id` - Eliminar empresa
- `GET /gateway/health` - Health check
- `POST /graphql` - Proxy GraphQL

### **Microservicio Python (Puerto 5000):**

#### **Empresas:**
- `GET /api/empresa` - Listar empresas
- `GET /api/empresa/:id` - Obtener empresa
- `POST /api/empresa` - Crear empresa
- `PUT /api/empresa/:id` - Actualizar empresa
- `DELETE /api/empresa/:id` - Eliminar empresa

#### **Entidades Maestras:**
- `GET /api/pais` - Listar países
- `GET /api/pais/:id` - Obtener país
- `POST /api/pais` - Crear país
- `GET /api/moneda` - Listar monedas
- `GET /api/moneda/:id` - Obtener moneda
- `POST /api/moneda` - Crear moneda
- `GET /api/provincia` - Listar provincias
- `GET /api/provincia/:id` - Obtener provincia
- `POST /api/provincia` - Crear provincia
- `GET /api/tipo-entidad` - Listar tipos de entidad comercial
- `GET /api/tipo-entidad/:id` - Obtener tipo de entidad
- `POST /api/tipo-entidad` - Crear tipo de entidad
- `GET /api/red-social` - Listar redes sociales
- `GET /api/red-social/:id` - Obtener red social
- `POST /api/red-social` - Crear red social

- `GET /health` - Health check

### **NestJS GraphQL (Puerto 3001):**
- `POST /graphql` - API GraphQL

---

## 🎨 Características del Frontend

### **Sistema de Errores en Español:**
- ✅ Traducción automática de errores
- ✅ Componente ErrorAlert reutilizable
- ✅ Iconos y colores apropiados por tipo de error
- ✅ Mensajes específicos para duplicados (RUC, email)

### **Validaciones:**
- ✅ RUC único (11 dígitos)
- ✅ Email único y válido
- ✅ Campos obligatorios
- ✅ Validación en tiempo real

### **Componentes:**
- ✅ Gestión de empresas (CRUD)
- ✅ Sistema de autenticación
- ✅ Interfaz responsive
- ✅ Tema claro/oscuro

---

## 🐛 Solución de Problemas

### **Ver Estado de Contenedores:**
```bash
# Ver todos los contenedores
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs -f python-service

# Ver logs de todos los servicios
docker-compose logs -f
```

### **Reiniciar Servicios:**
```bash
# Reiniciar un servicio específico
docker-compose restart python-service

# Reiniciar todos los servicios
docker-compose restart

# Reconstruir y reiniciar
docker-compose up --build -d
```

### **Problemas de Base de Datos:**
```bash
# Verificar conexión
docker-compose exec python-service python test_connection.py

# Verificar variables de entorno
docker-compose exec python-service env | grep DATABASE_URL
```

### **Limpiar Sistema Docker:**
```bash
# Detener y eliminar contenedores
docker-compose down

# Eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Limpiar imágenes no utilizadas
docker system prune -a

# Ver uso de recursos
docker stats
```

### **Problemas de Puerto en Uso:**
```bash
# Ver qué está usando un puerto
netstat -ano | findstr :3002

# Detener contenedores que usan el puerto
docker-compose down
```

### **Problemas de Dependencias (npm):**
```bash
# Si hay conflictos de dependencias en el frontend
# Los Dockerfiles ya incluyen --legacy-peer-deps

# Para reconstruir solo el frontend
docker-compose build --no-cache frontend

# Para desarrollo, reconstruir frontend
docker-compose -f docker-compose.dev.yml build --no-cache frontend
```

### **Problemas de Versiones de Node.js:**
```bash
# Si hay errores de versión de Node.js (requiere Node 20+)
# Los Dockerfiles ya están actualizados a Node.js 20

# Para limpiar cache y reconstruir
docker-compose build --no-cache

# Para desarrollo
docker-compose -f docker-compose.dev.yml build --no-cache
```

### **Problemas de Dependencias Faltantes (TypeScript):**
```bash
# Si hay errores de módulos no encontrados (@nestjs/axios, @nestjs/jwt, etc.)
# Los Dockerfiles instalan TODAS las dependencias (incluyendo devDependencies)

# Para reconstruir con todas las dependencias
docker-compose -f docker-compose.dev.yml build --no-cache nestjs-service
docker-compose -f docker-compose.dev.yml build --no-cache menu-service
```

### **Problemas de Compilación Nativa:**
```bash
# Si hay errores de compilación nativa (msnodesqlv8, etc.)
# Los Dockerfiles ya incluyen python3, make, g++
# La dependencia msnodesqlv8 se elimina automáticamente durante la construcción

# Para reconstruir con dependencias del sistema
docker-compose build --no-cache nestjs-service
docker-compose build --no-cache menu-service
```

### **Problemas con msnodesqlv8 (SQL Server):**
```bash
# Si hay errores con msnodesqlv8 (requiere SQL Server ODBC)
# El Dockerfile elimina automáticamente esta dependencia
# Solo se usa PostgreSQL en este proyecto

# Para verificar que se eliminó correctamente
docker-compose exec nestjs-service npm list msnodesqlv8
```

### **Problemas de Hot-Reload:**
```bash
# Si los cambios no se reflejan automáticamente
# Verificar que estés usando el modo desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Reiniciar un servicio específico
docker-compose -f docker-compose.dev.yml restart frontend
```

---

## 📚 Documentación Adicional

- **Arquitectura CORS:** `ARQUITECTURA_CORS.md`
- **Gateway API:** `gateway-api/README.md`
- **Microservicio Python (Inicio):** `InicioPython/README.md`
- **Microservicio Python Financiero:** `FinancieroPython/README.md`
- **Backend NestJS (Inicio):** `InicioNestJs/README.md`
- **Backend NestJS Financiero:** `FinancieroNestJs/README.md`
- **Frontend React:** `frontReact/README.md`

---

## 🧪 Testing

### **Probar Sistema de Errores:**
1. Intentar crear empresa con RUC duplicado
2. Intentar crear empresa con email duplicado
3. Verificar mensajes en español

### **Probar API Gateway:**
```bash
# Verificar salud del gateway
curl http://localhost:3002/gateway/health

# Listar empresas
curl http://localhost:3002/gateway/empresas

# Verificar todos los servicios
docker-compose ps
```

### **Ejecutar Tests con Docker:**
```bash
# Ejecutar tests de Python
docker-compose exec python-service python test_empresa_completa.py

# Verificar conexión a base de datos
docker-compose exec python-service python test_connection.py

# Insertar datos de prueba
docker-compose exec python-service python insert_master_data.py
```

---

## 🤝 Contribución

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 📞 Soporte

- **Issues:** [GitHub Issues](https://github.com/jquezada1984/ErpGenieSolutions2025/issues)
- **Documentación:** Revisar README de cada componente
- **Equipo:** Contactar al equipo de desarrollo

---

## 🐳 **Configuración Docker Detallada**

### **Estructura de Dockerfiles:**

#### **Microservicio Python (Flask) - Inicio:**
- **Imagen base:** `python:3.12-slim`
- **Puerto:** 5000
- **Dependencias:** Flask, SQLAlchemy, CORS, JWT

#### **Microservicio Python (Flask) - Financiero:**
- **Imagen base:** `python:3.12-slim`
- **Puerto:** 5001
- **Dependencias:** Flask, SQLAlchemy, CORS, JWT

#### **Gateway API (Fastify):**
- **Imagen base:** `node:20-alpine`
- **Puerto:** 3002
- **Dependencias:** Fastify, CORS, Axios

#### **Backend NestJS (GraphQL) - Inicio:**
- **Imagen base:** `node:20-slim`
- **Puerto:** 3001
- **Dependencias:** NestJS, GraphQL, TypeORM

#### **Backend NestJS (GraphQL) - Financiero:**
- **Imagen base:** `node:20-slim`
- **Puerto:** 3004
- **Dependencias:** NestJS, GraphQL, TypeORM

#### **Frontend React (Vite):**
- **Imagen base:** `node:20-alpine` (build) + `nginx:alpine` (production)
- **Puerto:** 3000
- **Servidor:** Nginx

#### **MenuNestJs:**
- **Imagen base:** `node:20-slim`
- **Puerto:** 3003
- **Dependencias:** NestJS, GraphQL

### **Proceso de Construcción de Imágenes:**

#### **Construir Todas las Imágenes:**
```bash
# Construir todas las imágenes Docker
docker-compose build

# Construir con verbose (ver detalles)
docker-compose build --progress=plain

# Construir sin usar cache
docker-compose build --no-cache
```

#### **Construir Imagen Específica:**
```bash
# Construir solo Python service (Inicio)
docker-compose build python-service

# Construir solo Python service Financiero
docker-compose build financiero-python-service

# Construir solo NestJS service (Inicio)
docker-compose build nestjs-service

# Construir solo NestJS service Financiero
docker-compose build financiero-nestjs-service

# Construir solo Menu service
docker-compose build menu-service

# Construir solo Frontend
docker-compose build frontend

# Construir solo Gateway
docker-compose build gateway-api
```

#### **Ver Imágenes Construidas:**
```bash
# Ver todas las imágenes Docker
docker images

# Ver imágenes del proyecto
docker images | grep erp

# Ver tamaño de imágenes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### **Comandos Docker Útiles:**

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs -f python-service

# Reconstruir un servicio específico
docker-compose up --build python-service

# Ejecutar comandos en un contenedor
docker-compose exec python-service python insert_master_data.py

# Limpiar sistema Docker
docker system prune -a

# Ver uso de recursos
docker stats
```

### **Variables de Entorno Docker:**

```env
# Base de datos (servicio externo)
DATABASE_URL=postgresql://usuario:password@servidor-externo:5432/erp_database

# Servicios (configurados automáticamente)
PYTHON_SERVICE_URL=http://python-service:5000
NESTJS_SERVICE_URL=http://nestjs-service:3001
MENU_SERVICE_URL=http://menu-service:3003
GATEWAY_PORT=3002

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
CORS_ORIGINS=http://localhost:3000,http://localhost:3002,http://localhost:5173

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
```

### **Volúmenes Docker:**
- `python_data`: Datos de SQLite (si se usa)

### **Red Docker:**
- `erp-network`: Red interna para comunicación entre servicios

---

**¡Disfruta desarrollando con ErpGenieSolutions2025! 🚀**