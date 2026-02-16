# ==========
# Build stage
# ==========
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ==========
# Runtime stage
# ==========
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Solo deps de producción
COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev

# Copiamos el build
COPY --from=build /app/dist ./dist

# Si usas GraphQL code-first con schema generado a disco, copia también:
# COPY --from=build /app/src/schema.gql ./src/schema.gql

# Puerto interno del contenedor
EXPOSE 3001

# Asegúrate que en main.ts uses app.listen(process.env.PORT || 3001)
ENV PORT=3001

CMD ["node", "dist/main.js"]
