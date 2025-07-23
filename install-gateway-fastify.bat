@echo off
title Installing Gateway (Fastify)
color 0A

echo ========================================
echo    INSTALLING GATEWAY (FASTIFY)
echo ========================================
echo.
echo Este script instalará el Gateway con Fastify
echo (versión moderna y rápida)
echo.

cd gateway-api

echo 🧹 Limpiando instalación anterior...
if exist "node_modules" (
    rmdir /s /q node_modules
    echo ✅ node_modules eliminado
)

if exist "package-lock.json" (
    del package-lock.json
    echo ✅ package-lock.json eliminado
)

echo.
echo 📦 Instalando dependencias de Fastify...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: No se pudieron instalar las dependencias
    echo Verifica tu conexión a internet y Node.js
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias instaladas correctamente
echo.
echo 📋 Dependencias instaladas:
echo   - fastify: ^4.24.0
echo   - @fastify/cors: ^8.4.0
echo   - @fastify/helmet: ^11.1.0
echo   - axios: ^1.6.0
echo   - dotenv: ^16.3.0
echo.
echo 🎉 ¡Gateway Fastify listo para usar!
echo.
echo Para iniciar el Gateway:
echo   cd gateway-api && npm run dev
echo.
echo O usa el script completo:
echo   setup-and-start.bat
echo.
pause 