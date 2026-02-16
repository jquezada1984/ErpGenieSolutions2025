# Dockerfile para Backend Financiero NestJS
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

# Copiar archivos de dependencias
COPY package*.json ./

# Remover dependencia problemática msnodesqlv8 temporalmente
RUN npm pkg delete dependencies.msnodesqlv8 || true

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3007

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3007

# Comando por defecto
CMD ["npm", "run", "start:prod"]
