# Dockerfile para MenuNestJs
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

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3003

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3003

# Comando por defecto
CMD ["npm", "run", "start:prod"]
