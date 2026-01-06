# Dockerfile para Backend NestJS
FROM node:20-slim

# Instalar dependencias del sistema para compilación nativa
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# Configurar zona horaria de Guayaquil, Ecuador
ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Establecer directorio de trabajo
WORKDIR /app

# Copiar primero la librería compartida (necesaria para la dependencia local)
COPY shared-logging-nestjs ./shared-logging-nestjs

# Construir la librería compartida primero
WORKDIR /app/shared-logging-nestjs
RUN npm install --legacy-peer-deps && npm run build
WORKDIR /app

# Copiar archivos de dependencias del servicio
COPY FinancieroNestJs/package*.json ./

# Ajustar temporalmente la ruta de la dependencia local para que apunte a ./shared-logging-nestjs
# (en lugar de file:../shared-logging-nestjs que requiere el directorio padre)
RUN npm pkg set dependencies.@erp/shared-logging-nestjs="file:./shared-logging-nestjs"

# Remover dependencia problemática msnodesqlv8 temporalmente
RUN npm pkg delete dependencies.msnodesqlv8

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
# Esto creará el symlink a shared-logging-nestjs en node_modules
RUN npm install --legacy-peer-deps

# Verificar que el symlink se creó correctamente
RUN ls -la node_modules/@erp/ || echo "Verificando estructura de node_modules"

# Copiar código fuente del servicio (después de instalar dependencias para preservar node_modules)
COPY FinancieroNestJs/tsconfig*.json ./
COPY FinancieroNestJs/nest-cli.json ./
COPY FinancieroNestJs/src ./src

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3004

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3004

# Comando por defecto
CMD ["npm", "run", "start:prod"]

