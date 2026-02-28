# MediaServiceNestJs

Microservicio NestJS REST para subida y servicio de archivos multimedia (imágenes). Sin base de datos ni GraphQL.

## Requisitos

- Node.js 20+
- npm

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3010` |
| `UPLOAD_DIR` | Carpeta base para guardar archivos | `./uploads` |
| `PUBLIC_BASE_URL` | URL pública del servicio (para construir URLs de archivos) | `http://localhost:${PORT}` |

Copiar `.env.example` a `.env` y ajustar si es necesario.

## Instalación

```bash
npm install --legacy-peer-deps
```

## Desarrollo

```bash
npm run start:dev
```

## Producción

```bash
npm run build
npm run start:prod
```

## Endpoints

### GET /health

Respuesta: `{ "status": "ok" }`

### POST /media/upload

- **Content-Type:** `multipart/form-data`
- **Campo obligatorio:** `file` (archivo imagen)
- **Acepta solo:** `image/*` (jpeg, png, gif, webp, svg, bmp). Si no es imagen → 400.

Los archivos se guardan en `{UPLOAD_DIR}/terceros/` con nombre seguro: `{timestamp}-{random}.{ext}`.

**Respuesta 200:**

```json
{
  "url": "<PUBLIC_BASE_URL>/uploads/terceros/<filename>",
  "filename": "...",
  "mimetype": "...",
  "size": 1234
}
```

### GET /uploads/*

Sirve archivos estáticos desde la carpeta `uploads`. Ejemplo: `GET /uploads/terceros/1234567890-abc123.jpg`

## Docker

```bash
docker build -t media-service-nestjs .
docker run -p 3010:3010 -e PORT=3010 -e UPLOAD_DIR=./uploads -e PUBLIC_BASE_URL=http://localhost:3010 media-service-nestjs
```

Para persistir archivos subidos, montar un volumen en la ruta de `UPLOAD_DIR`.
