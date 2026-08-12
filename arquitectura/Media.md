# Media

Servicio único: **`MediaServiceNestJs`** (REST Nest, sin Python de dominio). Puerto típico **3010**.

Usado para adjuntos/archivos de terceros, ítems, documentos, etc.

```
Upload / listado media / directorios / estado archivo
  → REST _apis_/media|directorio|estadoArchivo.js
  → gateway → MediaServiceNestJs
```

## MediaServiceNestJs — endpoints

| Controlador | Método | Path | Acción |
|-------------|--------|------|--------|
| media | POST | `/media/upload` | Subir archivo (imagen/PDF ≤10MB) |
| | POST | `/media/metadata` | Metadata |
| | GET | `/media?module&module_id` | Listar por módulo |
| | GET | `/media/principal/:module/:module_id` | Principal |
| | DELETE/PATCH | `/media/:id_media` | Borrar / actualizar |
| directorio | GET | `/directorio?module` | Listar |
| | POST | `/directorio` | Crear |
| estado-archivo | GET | `/estado-archivo?empresa=` | Estados |
| health | GET | `/` | Health |

Headers: `X-Company-Id`, `X-User-Id`.

## Gateway

| Ruta gateway | Destino |
|--------------|---------|
| `/api/media/*` | `services/mediaService.js` |
| `/api/directorio` GET/POST | MediaNest |
| `/api/estado-archivo` GET | MediaNest |

## Front

| API | Uso |
|-----|-----|
| `_apis_/media.js` | Upload, listado, borrar adjuntos |
| `_apis_/directorio.js` | Carpetas por módulo |
| `_apis_/estadoArchivo.js` | Catálogo estados de archivo |

Pantalla agregadora: `views/documentos/Documentos.tsx` (`/documentos`). También embebido en formularios de terceros/ítems al adjuntar archivos.
