# Implementación del Menú "Empresa" - Paso a Paso

## 🎯 Objetivo
Configurar el sistema para que al ingresar esté activo "Inicio" y solo aparezca "Empresa" en el menú lateral, basándose en la consulta SQL proporcionada.

## 📋 Pasos a Seguir

### 1. **Ejecutar Migraciones de Base de Datos**

```bash
# Conectarse a la base de datos PostgreSQL
psql -h localhost -U tu_usuario -d tu_base_de_datos

# Ejecutar las migraciones en orden:
\i migrations/add-fields-to-menu-item.sql
\i migrations/insert-empresa-menu-data.sql
```

### 2. **Reiniciar el Servicio MenuNestJs**

```bash
# Detener el servicio actual
docker-compose down

# Reconstruir y reiniciar
docker-compose up --build -d
```

### 3. **Verificar la Consulta SQL**

Ejecutar esta consulta para verificar que solo "Empresa" aparece:

```sql
SELECT id_item, id_seccion, parent_id, etiqueta, icono, ruta, es_clickable, orden, muestra_badge, badge_text, estado, created_by, created_at, updated_by, updated_at
FROM public.menu_item 
WHERE id_seccion='29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1' 
  AND parent_id IS NULL 
  AND estado=true 
ORDER BY orden ASC;
```

**Resultado esperado:** Solo debe devolver 1 registro con "Empresa".

### 4. **Probar el Frontend**

1. **Recargar la página** (Ctrl+F5)
2. **Verificar que "Inicio" esté activo** en el header
3. **Verificar que solo "Empresa" aparezca** en el sidebar
4. **Verificar que "Empresa" tenga submenús:**
   - Lista de Empresas
   - Nueva Empresa  
   - Configuración

### 5. **Logs de Debug**

En la consola del navegador deberías ver:

```
🔍 DEBUG - Header - Configurando menú inicial a "inicio"
🔍 DEBUG - Sidebar - Menú seleccionado: inicio
🔍 DEBUG - Sidebar - Cargando menú dinámico para inicio, id_seccion: 29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1
🔍 DEBUG - obtenerMenuPrincipalOrdenado - Items principales encontrados: 1
🔍 DEBUG - obtenerMenuPrincipalOrdenado - Items principales: [{etiqueta: "Empresa", orden: 1, es_clickable: false}]
```

## 🔧 Cambios Implementados

### **Frontend:**
- ✅ Configurado "inicio" como activo por defecto
- ✅ Modificado `SidebarData.tsx` para mostrar solo "Empresa" en "inicio"
- ✅ Implementado menú dinámico que usa la consulta SQL
- ✅ Agregado debug logs para rastrear el comportamiento

### **Backend:**
- ✅ Actualizada entidad `MenuItem` con campos faltantes
- ✅ Implementada consulta SQL exacta en `obtenerMenuPrincipalOrdenado`
- ✅ Creados scripts de migración para la base de datos
- ✅ Creados datos de ejemplo para "Empresa"

## 🚨 Solución de Problemas

### **Si no aparece "Empresa":**
1. Verificar que las migraciones se ejecutaron correctamente
2. Verificar que el servicio MenuNestJs se reinició
3. Revisar los logs del backend para errores

### **Si aparecen otros items además de "Empresa":**
1. Verificar que el script `insert-empresa-menu-data.sql` se ejecutó
2. Verificar que otros items tienen `estado = false`

### **Si el menú no se actualiza:**
1. Limpiar cache del navegador (Ctrl+Shift+R)
2. Verificar que el token JWT es válido
3. Revisar logs de la consola para errores de GraphQL

## 📊 Estructura de Datos Esperada

```json
{
  "menuLateralOrdenado": [{
    "id_seccion": "29dea275-b0f7-4fb3-83fa-7c0ea31c3cf1",
    "nombre": "Administración",
    "orden": 1,
    "icono": "bi bi-gear",
    "items": [{
      "id_item": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "etiqueta": "Empresa",
      "icono": "bi bi-building",
      "orden": 1,
      "children": [
        {"etiqueta": "Lista de Empresas", "ruta": "/empresas"},
        {"etiqueta": "Nueva Empresa", "ruta": "/empresas/nueva"},
        {"etiqueta": "Configuración", "ruta": "/empresas/config"}
      ]
    }]
  }]
}
```

## ✅ Criterios de Éxito

- [ ] Al ingresar, "Inicio" está activo en el header
- [ ] Solo "Empresa" aparece en el sidebar
- [ ] "Empresa" tiene 3 submenús
- [ ] Los submenús son clickeables y llevan a las rutas correctas
- [ ] No aparecen otros items principales (Sucursal, Menú, Perfil, Usuario)
- [ ] Los logs de debug muestran el flujo correcto
