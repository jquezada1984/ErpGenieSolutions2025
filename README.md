# ErpGenieSolutions2025

Este repositorio contiene un sistema ERP compuesto por tres partes principales:

- **microservice-db/**: Microservicio en Python (Flask) para la gestión de la base de datos.
- **back-nest-js/**: Backend en NestJS (Node.js/TypeScript) con API GraphQL.
- **frontReact/**: Frontend en React (Vite).

---

## Requisitos generales

- Python 3.8 o superior (para microservice-db)
- Node.js 18.x o superior y npm 9.x o superior (para back-nest-js y frontReact)
- PostgreSQL en ejecución

---

## Instalación y ejecución rápida

### 1. Microservicio de base de datos (Python)

```bash
cd microservice-db
pip install -r requirements.txt
# Configura el archivo .env con los datos de tu base de datos
python app.py
```

### 2. Backend NestJS (Node.js)

```bash
cd back-nest-js
npm install
npm run start:dev
```

Accede a la API GraphQL en: [http://localhost:3000/graphql](http://localhost:3000/graphql)

### 3. Frontend React (Vite)

```bash
cd frontReact
npm install
npm run dev
```

Accede a la aplicación en: [http://localhost:5173](http://localhost:5173)

---

## Más información

Cada subproyecto contiene su propio archivo `README.md` con instrucciones detalladas, requisitos y comandos adicionales.

---

¿Dudas o problemas? Revisa los README de cada carpeta o contacta al equipo de desarrollo. 

---


### 4. Ejecutar lo de pruebas

```bash

cd React/xtreme-react-v7/package/main
npm install
npm run dev
```