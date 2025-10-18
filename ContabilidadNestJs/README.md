# ContabilidadNestJs

Backend de Contabilidad desarrollado con NestJS y GraphQL.

## Características

- **NestJS**: Framework de Node.js para aplicaciones escalables
- **GraphQL**: API moderna y eficiente
- **TypeORM**: ORM para TypeScript y JavaScript
- **PostgreSQL**: Base de datos relacional
- **Docker**: Contenedorización para desarrollo y producción

## Entidades Principales

- **CuentaContable**: Plan de cuentas contables
- **AsientoContable**: Asientos contables
- **MovimientoContable**: Movimientos de cada asiento
- **BalanceGeneral**: Balances generales

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env

# Ejecutar en desarrollo
npm run start:dev
```

## Docker

```bash
# Desarrollo
docker build -f Dockerfile.dev -t contabilidad-nestjs-dev .

# Producción
docker build -f Dockerfile -t contabilidad-nestjs .
```

## Endpoints

- **GraphQL Playground**: http://localhost:3004/graphql
- **Health Check**: http://localhost:3004/health

## Puerto

El servicio se ejecuta en el puerto **3004**.
