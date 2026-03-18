# Auditoría técnica – MediaServiceNestJs

**Alcance:** Solo análisis. No se modifica código ni se generan archivos.

---

## 1. Arquitectura actual

| Aspecto | Estado |
|---------|--------|
| **Módulos** | `MediaModule` (media), `HealthController` suelto en `AppModule` (no hay `HealthModule`). |
| **Organización** | Estándar Nest: cada módulo tiene controller + service + module. |
| **Separación por dominio** | Simple: un solo dominio (media). No hay capa de dominio explícita (solo controller → service). |

**Estructura:**
- `app.module.ts`: importa `MediaModule`, declara `HealthController`.
- `modules/media/`: `media.module.ts`, `media.controller.ts`, `media.service.ts`.
- `modules/health/`: solo `health.controller.ts` (sin `health.module.ts` ni service).

**Conclusión:** Arquitectura mínima y coherente. Health está a nivel app; si creces en módulos, convendría un `HealthModule` opcional.

---

## 2. Manejo actual de archivos

| Aspecto | Detalle |
|---------|---------|
| **Upload** | `@nestjs/platform-express` + `FileInterceptor('file')`. Multer con **memoryStorage()** (archivo en RAM, no disco hasta que el service escribe). |
| **Dónde se guardan** | `MediaService.getUploadDir()` → `path.resolve(process.env.UPLOAD_DIR || './uploads', 'terceros')`. Por defecto `./uploads/terceros/`. El directorio se crea con `fs.mkdirSync(dir, { recursive: true })` si no existe. |
| **Nombre del archivo** | `Date.now()-{random}.{ext}`. Extensión por mimetype o por `originalname`. |
| **Qué retorna** | `{ url, filename, mimetype, size }`. `url` = `PUBLIC_BASE_URL` (o `http://localhost:PORT`) + `/uploads/terceros/{filename}`. |
| **Servir archivos** | `main.ts`: `app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))`. Las URLs devueltas apuntan a `/uploads/terceros/...`, que se resuelven con ese middleware. |

**Flujo:** Cliente envía `file` → Multer (memoria) → Controller valida que sea imagen → Service escribe en disco en `uploads/terceros/` y devuelve objeto con URL.

**Conclusión:** Upload y filesystem están bien acotados en `MediaService`; no hay conflicto con una futura capa de BD.

---

## 3. Estado de base de datos

| Verificación | Resultado |
|--------------|-----------|
| **¿Usa base de datos?** | **No.** |
| **package.json** | Sin TypeORM, Prisma, pg, mysql2, etc. Solo Nest core, platform-express, multer, reflect-metadata, rxjs. |
| **app.module.ts** | Sin `TypeOrmModule`, ni ningún `import` de BD. |

**Conclusión:** Servicio 100% sin persistencia; solo REST + filesystem.

---

## 4. Preparación para integrar PostgreSQL con TypeORM

| Punto | Estado / Qué falta |
|-------|---------------------|
| **Dependencias** | Falta instalar: `@nestjs/typeorm`, `typeorm`, `pg`. |
| **Configuración en app** | Falta registrar `TypeOrmModule.forRoot(...)` en `AppModule` (con env para URL/host/port/database/user/password). |
| **Conflictos** | Ninguno. El media actual no toca BD; TypeORM sería un nuevo `import` y opcionalmente un módulo (ej. `MediaDbModule` o entidades dentro de `MediaModule`). |
| **Estructura** | Permite agregar un módulo con entidades (ej. `media.entity.ts`, `directorio_documento.entity.ts`) y un servicio que use `Repository<Media>` sin tocar la lógica actual de `saveUpload` (que puede seguir escribiendo en disco y, si se quiere, persistir metadata en paralelo). |

**Riesgos técnicos:** Ninguno si TypeORM se añade solo para nuevos módulos/entidades. El único acoplamiento sería si más adelante se decide que “guardar upload” también escriba en la tabla `media` en la misma transacción; eso es una extensión del `MediaService`, no un reemplazo.

---

## 5. Recomendación técnica

**Evolución propuesta:** Este servicio como:
- **Manejo de archivos (filesystem):** ya lo hace; mantenerlo.
- **+ Metadata en PostgreSQL:** tablas tipo `media`, `directorio_documento` (o equivalente) para URLs, rutas, módulo, id de entidad, etc.

**¿Es buena idea?** Sí. Separar “archivo en disco” y “registro de metadata” es estándar; el servicio ya tiene un solo punto de upload y una respuesta con `url`/`filename`, idóneo para extender con un `MediaRepository` que persista esa misma información.

**Riesgos reales:**
- **Operacional:** Definir backups de `uploads/` y de la BD; si la BD se restaura sin los archivos (o al revés), hay que tener criterio de consistencia.
- **Transaccional:** Si en el futuro se persiste en BD en el mismo flujo que `writeFileSync`, un fallo después de escribir en disco pero antes de commit obliga a limpieza de archivos huérfanos (o a un job que los reconcilie). Mitigable con “guardar archivo primero, luego insert en BD” y manejo de errores.
- **Despliegue:** Variables de entorno para PostgreSQL y, si aplica, para `UPLOAD_DIR`/volumen persistente en contenedor.

Nada de esto bloquea la integración; son puntos de diseño a tener en cuenta.

---

## 6. Conclusión

**¿Este proyecto está listo para integrar TypeORM sin romper lo que ya funciona?**

**Sí.**  
- No hay BD ni librerías de persistencia hoy.  
- El upload y el filesystem están encapsulados en `MediaModule`/`MediaService` y no dependen de ninguna capa de datos.  
- Añadir TypeORM en `AppModule` y nuevos módulos/entidades/repositorios no requiere cambiar la lógica actual de subida ni la respuesta actual del endpoint.  
- Se puede integrar TypeORM de forma incremental (por ejemplo: primero conexión y módulo vacío, luego entidades y un servicio que persista metadata a partir del mismo `saveUpload`).

---

*Auditoría solo lectura. Sin cambios de código.*
