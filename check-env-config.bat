@echo off
title ERP System - Environment Configuration Checker
color 0E

echo ========================================
echo    ERP SYSTEM - ENV CONFIG CHECKER
echo ========================================
echo.

echo 🔍 Verificando configuraciones de entorno...
echo.

:: Verificar Frontend React
echo 📋 Frontend React (.env):
if exist "frontReact\.env" (
    echo ✅ Archivo .env encontrado
    findstr "VITE_GATEWAY_URL" "frontReact\.env" 2>nul || echo ⚠️  VITE_GATEWAY_URL no encontrado
) else (
    echo ❌ Archivo .env no encontrado
    echo 💡 Ejecuta: copy frontReact\env.example frontReact\.env
)
echo.

:: Verificar Gateway API
echo 📋 Gateway API (.env):
if exist "gateway-api\.env" (
    echo ✅ Archivo .env encontrado
    findstr "PYTHON_SERVICE_URL" "gateway-api\.env" 2>nul || echo ⚠️  PYTHON_SERVICE_URL no encontrado
    findstr "NESTJS_SERVICE_URL" "gateway-api\.env" 2>nul || echo ⚠️  NESTJS_SERVICE_URL no encontrado
    findstr "GATEWAY_PORT" "gateway-api\.env" 2>nul || echo ⚠️  GATEWAY_PORT no encontrado
) else (
    echo ❌ Archivo .env no encontrado
    echo 💡 Ejecuta: copy gateway-api\env.example gateway-api\.env
)
echo.

:: Verificar NestJS
echo 📋 NestJS Backend (.env):
if exist "back-nest-js\.env" (
    echo ✅ Archivo .env encontrado
    findstr "CORS_ORIGINS" "back-nest-js\.env" 2>nul || echo ⚠️  CORS_ORIGINS no encontrado
) else (
    echo ❌ Archivo .env no encontrado
    echo 💡 Ejecuta: copy back-nest-js\env.example back-nest-js\.env
)
echo.

:: Verificar Python Microservice
echo 📋 Python Microservice (.env):
if exist "microservice-db\.env" (
    echo ✅ Archivo .env encontrado
    findstr "CORS_ORIGINS" "microservice-db\.env" 2>nul || echo ⚠️  CORS_ORIGINS no encontrado
) else (
    echo ❌ Archivo .env no encontrado
    echo 💡 Ejecuta: copy microservice-db\env.example microservice-db\.env
)
echo.

echo ========================================
echo    CONFIGURACIÓN RECOMENDADA
echo ========================================
echo.
echo 🌐 Frontend React:
echo   • VITE_GATEWAY_URL=http://localhost:3002
echo   • GraphQL endpoint: http://localhost:3002/graphql
echo.
echo 🌐 Gateway API:
echo   • PYTHON_SERVICE_URL=http://localhost:5000
echo   • NESTJS_SERVICE_URL=http://localhost:3001
echo   • GATEWAY_PORT=3002
echo   • CORS_ORIGIN=http://localhost:3000,http://localhost:5173
echo.
echo 🟢 NestJS Backend:
echo   • CORS_ORIGINS=http://localhost:3002
echo.
echo 🐍 Python Microservice:
echo   • CORS_ORIGINS=http://localhost:3002
echo.

echo Presiona cualquier tecla para continuar...
pause >nul 