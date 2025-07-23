# Sistema de Banderas de Países

## Descripción

Este sistema implementa un componente de banderas de países que utiliza imágenes locales almacenadas en el proyecto, con fallback a emojis de banderas para mayor compatibilidad.

## Estructura de Archivos

```
frontReact/
├── public/
│   └── flags/           # Imágenes de banderas (32 países)
│       ├── pe.png       # Perú
│       ├── ar.png       # Argentina
│       ├── br.png       # Brasil
│       └── ...          # Otros países
├── src/
│   └── components/
│       ├── CountryFlag.tsx      # Componente de bandera
│       ├── CountryFlag.css      # Estilos del componente
│       ├── CountrySelect.tsx    # Selector de países
│       └── CountrySelect.css    # Estilos del selector
```

## Componentes

### CountryFlag

Componente reutilizable para mostrar banderas de países.

**Props:**
- `countryCode`: Código ISO del país (ej: 'PE', 'AR')
- `size`: Tamaño de la bandera ('small', 'medium', 'large')
- `className`: Clases CSS adicionales

**Características:**
- Usa imágenes locales desde `/flags/`
- Fallback automático a emojis si la imagen falla
- Estados de carga y error
- Efectos hover
- Responsive design

**Ejemplo de uso:**
```tsx
<CountryFlag countryCode="PE" size="medium" />
```

### CountrySelect

Selector dropdown de países con búsqueda y banderas.

**Props:**
- `id`: ID del campo
- `name`: Nombre del campo
- `value`: Valor seleccionado
- `onChange`: Función de cambio
- `disabled`: Estado deshabilitado
- `loading`: Estado de carga
- `countries`: Array de países
- `label`: Etiqueta del campo

## Países Soportados

El sistema incluye 32 países, principalmente de Latinoamérica y otros importantes:

### Latinoamérica
- Perú (PE), Argentina (AR), Brasil (BR), Chile (CL)
- Colombia (CO), México (MX), Ecuador (EC), Bolivia (BO)
- Paraguay (PY), Uruguay (UY), Venezuela (VE), Guatemala (GT)
- Honduras (HN), El Salvador (SV), Nicaragua (NI), Costa Rica (CR)
- Panamá (PA), Cuba (CU), República Dominicana (DO), Puerto Rico (PR)

### Otros Países
- Estados Unidos (US), Canadá (CA), España (ES), Francia (FR)
- Alemania (DE), Italia (IT), Reino Unido (GB), Japón (JP)
- China (CN), India (IN), Australia (AU), Nueva Zelanda (NZ)

## Ventajas del Sistema Local

1. **Rendimiento**: No depende de CDNs externos
2. **Confiabilidad**: Funciona sin conexión a internet
3. **Control**: Imágenes optimizadas y controladas
4. **Velocidad**: Carga más rápida desde servidor local
5. **Fallback**: Emojis como respaldo si las imágenes fallan

## Mantenimiento

### Agregar Nuevos Países

1. Descargar la imagen de bandera desde [flagcdn.com](https://flagcdn.com)
2. Guardar como `[codigo].png` en `public/flags/`
3. Agregar el emoji correspondiente en `CountryFlag.tsx`
4. Actualizar la lista de países en el backend si es necesario

### Actualizar Banderas

1. Reemplazar la imagen en `public/flags/`
2. Mantener el mismo nombre de archivo
3. El componente automáticamente usará la nueva imagen

## Estilos CSS

Los estilos incluyen:
- Tamaños responsivos (small, medium, large)
- Efectos hover con escala
- Sombras y bordes redondeados
- Adaptación móvil
- Transiciones suaves

## Compatibilidad

- ✅ Navegadores modernos
- ✅ Dispositivos móviles
- ✅ Modo offline
- ✅ Fallback a emojis
- ✅ Accesibilidad (alt text, title) 