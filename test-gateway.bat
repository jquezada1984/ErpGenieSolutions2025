@echo off
title Gateway API Test
color 0A

echo ========================================
echo    GATEWAY API TEST
echo ========================================
echo.

echo 🔍 Verificando Gateway API...
echo.

:: Verificar si el puerto 3002 está en uso
netstat -an | findstr :3002 >nul
if %errorlevel% equ 0 (
    echo ✅ Puerto 3002 está en uso
) else (
    echo ❌ Puerto 3002 no está en uso
    echo 💡 Ejecuta: cd gateway-api && npm run dev
    goto :end
)

:: Probar endpoint de salud
echo 📋 Probando endpoint de salud...
curl -s http://localhost:3002/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Endpoint de salud funciona
) else (
    echo ❌ Endpoint de salud no funciona
)

:: Probar endpoint GraphQL
echo 📋 Probando endpoint GraphQL...
curl -s http://localhost:3002/graphql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Endpoint GraphQL funciona
) else (
    echo ❌ Endpoint GraphQL no funciona
)

echo.
echo ========================================
echo    CONFIGURACIÓN ACTUAL
echo ========================================
echo.
echo 🌐 Gateway API: http://localhost:3002
echo 🟣 GraphQL: http://localhost:3002/graphql
echo 📊 Health: http://localhost:3002/api/health
echo.
echo 💡 Para probar el login:
echo   1. Abre http://localhost:3000 en el navegador
echo   2. Intenta hacer login
echo   3. Verifica que use http://localhost:3002/graphql
echo.

:end
echo.
echo Presiona cualquier tecla para continuar...
pause >nul 