# FinancieroNestJs

Microservicio NestJS para el módulo financiero del ERP.

## Descripción

Este servicio proporciona una API GraphQL para gestionar las funcionalidades financieras del sistema ERP.

## Configuración

### Variables de Entorno

Copia el archivo `env.example` a `.env` y configura las siguientes variables:

- `DB_HOST`: Host de la base de datos PostgreSQL
- `DB_PORT`: Puerto de la base de datos (por defecto: 5432)
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_DATABASE`: Nombre de la base de datos
- `JWT_SECRET`: Secreto para JWT
- `CORS_ORIGINS`: Orígenes permitidos para CORS (separados por comas)
- `PORT`: Puerto del servidor (por defecto: 3004)

## Instalación

```bash
npm install
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

## Docker

### Desarrollo
```bash
docker build -f Dockerfile.dev -t financiero-nestjs-dev .
docker run -p 3004:3004 financiero-nestjs-dev
```

### Producción
```bash
docker build -f Dockerfile -t financiero-nestjs .
docker run -p 3004:3004 financiero-nestjs
```

## GraphQL Playground

Una vez iniciado el servidor, puedes acceder al GraphQL Playground en:
- Desarrollo: http://localhost:3004/graphql
- Producción: http://localhost:3004/graphql

