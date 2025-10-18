# Dockerfile para Gateway API (Fastify)
FROM node:20-alpine

# Instalar tzdata para zona horaria
RUN apk add --no-cache tzdata

# Configurar zona horaria de Guayaquil, Ecuador
ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm install --legacy-peer-deps

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3002

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV GATEWAY_PORT=3002

# Comando por defecto
CMD ["npm", "start"]
