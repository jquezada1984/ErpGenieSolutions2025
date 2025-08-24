# MenuNestJs - Microservicio de Permisos de Menú

## 🎯 Descripción

Microservicio especializado en la gestión de permisos de menú para el sistema ERP. Este servicio se encarga de:

- **Validar permisos** de acceso a rutas específicas
- **Filtrar menús** según el perfil del usuario
- **Gestionar autorizaciones** para menú superior e inferior
- **Optimizar consultas** con cache para consultas frecuentes

## 🏗️ Arquitectura

### **Tablas Utilizadas**
- `perfil` - Perfiles de usuario
- `menu_seccion` - Secciones del menú superior
- `menu_item` - Items del menú lateral
- `perfil_menu_permiso` - Permisos de perfil por item

### **Flujo de Autorización**
1. **Login** → Usuario se autentica en InicioNestJs
2. **Validación** → MenuNestJs valida permisos del perfil
3. **Filtrado** → Se filtran opciones según permisos
4. **Respuesta** → Se retornan solo opciones permitidas

## 🚀 Instalación

### **1. Clonar y configurar**
```bash
cd MenuNestJs
npm install
```

### **2. Configurar variables de entorno**
```bash
cp env.example .env
# Editar .env con tus credenciales de BD
```

### **3. Ejecutar**
```bash
npm run start:dev
```

## 📊 Endpoints GraphQL

### **Consultas de Permisos**
- `permisosPorPerfil(id_perfil)` - Todos los permisos de un perfil
- `menuLateralPorPerfil(id_perfil)` - Menú lateral filtrado
- `opcionesMenuSuperior(id_perfil)` - Opciones del menú superior
- `validarAccesoRuta(id_perfil, ruta)` - Validar acceso a ruta específica

### **Consultas de Perfil**
- `perfilConPermisos(id_perfil)` - Perfil completo con permisos
- `modulosDisponibles(id_perfil)` - Módulos donde tiene permisos
- `estadisticasPermisos(id_perfil)` - Estadísticas de cobertura

## 🔧 Configuración

### **Variables de Entorno**
```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=erp

# Servidor
PORT=3003
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000
```

### **Puertos**
- **MenuNestJs**: 3003
- **InicioNestJs**: 3001
- **Frontend**: 3000

## 📈 Optimizaciones

### **Cache Implementado**
- **Permisos por perfil**: 5 minutos
- **Secciones activas**: 10 minutos
- **Validación de rutas**: 5 minutos

### **Consultas Optimizadas**
- Uso de `QueryBuilder` con joins optimizados
- Filtrado por estado en base de datos
- Ordenamiento por prioridad

## 🔐 Seguridad

### **Validaciones**
- Verificación de estado de perfil
- Validación de estado de secciones e items
- Control de acceso por ruta específica

### **CORS Configurado**
- Origen configurable
- Credenciales habilitadas
- Headers de autorización

## 🧪 Testing

### **GraphQL Playground**
```
http://localhost:3003/graphql
```

### **Ejemplo de Consulta**
```graphql
query GetMenuLateralPorPerfil {
  menuLateralPorPerfil(id_perfil: "uuid-del-perfil") {
    id_seccion
    nombre
    items {
      id_item
      etiqueta
      ruta
      icono
    }
  }
}
```

## 📝 Logs

### **Niveles de Log**
- **Development**: Logs detallados
- **Production**: Solo errores críticos

### **Información Registrada**
- Inicio del servicio
- Consultas GraphQL
- Errores de base de datos
- Estadísticas de rendimiento

## 🔄 Integración con Frontend

### **Hook usePermissions**
```typescript
const { 
  menuLateral, 
  opcionesMenuSuperior, 
  tienePermiso 
} = usePermissions();
```

### **Configuración Apollo Client**
```typescript
const client = new ApolloClient({
  uri: 'http://localhost:3003/graphql',
  // ... otras configuraciones
});
```

## 🚨 Troubleshooting

### **Problemas Comunes**
1. **Error de conexión BD**: Verificar credenciales y host
2. **CORS error**: Verificar FRONTEND_URL en .env
3. **Entidades no encontradas**: Verificar sincronización de BD

### **Logs de Debug**
```bash
NODE_ENV=development npm run start:dev
```

## 📚 Dependencias

### **Core**
- `@nestjs/common` - Framework NestJS
- `@nestjs/graphql` - GraphQL para NestJS
- `@nestjs/typeorm` - ORM para TypeScript

### **Base de Datos**
- `typeorm` - ORM principal
- `pg` - Driver PostgreSQL

### **Utilidades**
- `bcrypt` - Encriptación de contraseñas
- `class-validator` - Validación de DTOs

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.
