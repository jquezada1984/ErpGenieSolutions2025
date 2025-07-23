@echo off
title ERP System - CORS Configuration Checker
color 0B

echo ========================================
echo    ERP SYSTEM - CORS CONFIG CHECKER
echo ========================================
echo.

echo 🔍 Verificando configuraciones CORS...
echo.

:: Verificar Gateway API
echo 📋 Gateway API (.env):
if exist "gateway-api\.env" (
    echo ✅ Archivo .env encontrado
    findstr "CORS_ORIGIN" "gateway-api\.env" 2>nul || echo ⚠️  CORS_ORIGIN no encontrado
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
echo    CONFIGURACIÓN CORS RECOMENDADA
echo ========================================
echo.
echo 🌐 Gateway API debe permitir:
echo   • Frontend React: http://localhost:3000, http://localhost:5173
echo.
echo 🟢 NestJS debe permitir:
echo   • Solo Gateway API: http://localhost:3002
echo.
echo 🐍 Python debe permitir:
echo   • Solo Gateway API: http://localhost:3002
echo.
echo 💡 Arquitectura segura: Frontend → Gateway → Microservicios
echo.

echo Presiona cualquier tecla para continuar...
pause >nul 