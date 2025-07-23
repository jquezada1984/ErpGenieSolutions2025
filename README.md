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
- **Microservicio Python** (`microservice-db/`) - Gestión de base de datos (Flask)
- **Backend NestJS** (`back-nest-js/`) - API GraphQL (NestJS)

---

## 📋 Requisitos del Sistema

### **Software Requerido:**
- **Python 3.8+** (para microservicio Python)
- **Node.js 18.x+** (para Gateway API, NestJS y React)
- **npm 9.x+** o **yarn** (gestor de paquetes)
- **Git** (control de versiones)

### **Base de Datos:**
- **SQLite** (desarrollo) - Incluido con Python
- **PostgreSQL** (producción) - Opcional

---

## 🚀 Instalación y Configuración

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/jquezada1984/ErpGenieSolutions2025.git
cd ErpGenieSolutions2025
```

### **2. Configurar Variables de Entorno**

#### **Gateway API:**
```bash
cd gateway-api
cp env.example .env
```

Editar `.env`:
```env
PYTHON_SERVICE_URL=http://localhost:5000
NESTJS_SERVICE_URL=http://localhost:3001
GATEWAY_PORT=3002
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
NODE_ENV=development
```

#### **Microservicio Python:**
```bash
cd microservice-db
cp env.example .env
```

Editar `.env`:
```env
DATABASE_URL=sqlite:///database.db
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
JWT_SECRET_KEY=your-secret-key
```

#### **Frontend React:**
```bash
cd frontReact
cp env.example .env
```

Editar `.env`:
```env
VITE_GATEWAY_URL=http://localhost:3002
```

### **3. Instalar Dependencias**

#### **Gateway API:**
```bash
cd gateway-api
npm install
```

#### **Microservicio Python:**
```bash
cd microservice-db
pip install -r requirements.txt
```

#### **Backend NestJS:**
```bash
cd back-nest-js
npm install
```

#### **Frontend React:**
```bash
cd frontReact
npm install
```

---

## 🏃‍♂️ Ejecución del Sistema

### **Opción 1: Ejecución Manual (Recomendado para desarrollo)**

#### **1. Iniciar Microservicio Python:**
```bash
cd microservice-db
python app.py
```
**Puerto:** 5000  
**URL:** http://localhost:5000

#### **2. Iniciar Backend NestJS:**
```bash
cd back-nest-js
npm run start:dev
```
**Puerto:** 3001  
**GraphQL:** http://localhost:3001/graphql

#### **3. Iniciar Gateway API:**
```bash
cd gateway-api
npm run dev
```
**Puerto:** 3002  
**URL:** http://localhost:3002

#### **4. Iniciar Frontend React:**
```bash
cd frontReact
npm run dev
```
**Puerto:** 3000  
**URL:** http://localhost:3000

### **Opción 2: Ejecución con Scripts (Windows)**

```bash
# Iniciar todos los servicios
start-all-services.bat

# Detener todos los servicios
stop-all-services.bat
```

---

## 🔧 Configuración de Base de Datos

### **Aplicar Migración de Email Único:**
```bash
cd microservice-db
python apply_email_unique.py
```

### **Verificar Conexión:**
```bash
cd microservice-db
python test_connection.py
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
- `GET /api/empresa` - Listar empresas
- `POST /api/empresa` - Crear empresa
- `PUT /api/empresa/:id` - Actualizar empresa
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

### **Puerto en Uso:**
```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3002 | xargs kill -9
```

### **Problemas de CORS:**
Verificar configuración en:
- `gateway-api/.env` - CORS_ORIGIN
- `microservice-db/.env` - CORS_ORIGINS

### **Errores de Base de Datos:**
```bash
cd microservice-db
python test_connection.py
```

### **Problemas de React (Múltiples Raíces):**
```bash
cd frontReact
npm run clean
npm install
npm run dev
```

---

## 📚 Documentación Adicional

- **Arquitectura CORS:** `ARQUITECTURA_CORS.md`
- **Gateway API:** `gateway-api/README.md`
- **Microservicio Python:** `microservice-db/README.md`
- **Frontend React:** `frontReact/README.md`

---

## 🧪 Testing

### **Probar Sistema de Errores:**
1. Intentar crear empresa con RUC duplicado
2. Intentar crear empresa con email duplicado
3. Verificar mensajes en español

### **Probar API Gateway:**
```bash
curl http://localhost:3002/gateway/health
curl http://localhost:3002/gateway/empresas
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

**¡Disfruta desarrollando con ErpGenieSolutions2025! 🚀**