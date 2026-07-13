FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3014
ENV PORT=3014
CMD ["node", "dist/main.js"]
