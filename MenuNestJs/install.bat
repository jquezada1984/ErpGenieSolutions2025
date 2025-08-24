@echo off
echo ========================================
echo    Instalando MenuNestJs
echo ========================================
echo.

echo 1. Instalando dependencias...
npm install

echo.
echo 2. Configurando variables de entorno...
if not exist .env (
    copy env.example .env
    echo Archivo .env creado. Por favor edítalo con tus credenciales.
) else (
    echo Archivo .env ya existe.
)

echo.
echo 3. Verificando configuración...
echo - Puerto: 3003
echo - Base de datos: PostgreSQL
echo - GraphQL: Habilitado

echo.
echo ========================================
echo    Instalación completada!
echo ========================================
echo.
echo Para ejecutar el servicio:
echo   npm run start:dev
echo.
echo GraphQL Playground disponible en:
echo   http://localhost:3003/graphql
echo.
pause
