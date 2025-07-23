@echo off
title ERP System - Login Flow Test
color 0D

echo ========================================
echo    ERP SYSTEM - LOGIN FLOW TEST
echo ========================================
echo.

echo 🔍 Verificando flujo de login...
echo.

:: Verificar que el Gateway esté ejecutándose
echo 📋 Verificando Gateway API...
curl -s http://localhost:3002/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Gateway API está ejecutándose
) else (
    echo ❌ Gateway API no está ejecutándose
    echo 💡 Ejecuta: cd gateway-api && npm run dev
    goto :end
)

:: Verificar que NestJS esté ejecutándose
echo 📋 Verificando NestJS GraphQL...
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ NestJS está ejecutándose
) else (
    echo ❌ NestJS no está ejecutándose
    echo 💡 Ejecuta: cd back-nest-js && npm run start:dev
    goto :end
)

:: Verificar endpoint GraphQL del Gateway
echo 📋 Verificando endpoint GraphQL del Gateway...
curl -s -X POST http://localhost:3002/graphql -H "Content-Type: application/json" -d "{\"query\":\"query { __typename }\"}" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Endpoint GraphQL del Gateway funciona
) else (
    echo ❌ Endpoint GraphQL del Gateway no funciona
)

echo.
echo ========================================
echo    CONFIGURACIÓN DE LOGIN
echo ========================================
echo.
echo 🌐 Frontend React:
echo   • URL: http://localhost:3000
echo   • GraphQL endpoint: http://localhost:3002/graphql
echo.
echo 🌐 Gateway API:
echo   • URL: http://localhost:3002
echo   • GraphQL proxy: http://localhost:3002/graphql
echo.
echo 🟢 NestJS GraphQL:
echo   • URL: http://localhost:3001/graphql
echo.
echo 💡 Flujo de login:
echo   1. Frontend → Gateway (3002/graphql)
echo   2. Gateway → NestJS (3001/graphql)
echo   3. NestJS → Base de datos
echo.

:end
echo.
echo Presiona cualquier tecla para continuar...
pause >nul 