@echo off
title ERP System - Stop All Services
color 0C

echo ========================================
echo    ERP SYSTEM - STOP ALL SERVICES
echo ========================================
echo.
echo Este script detendra todos los servicios:
echo  1. Python Service (REST) - Puerto 5000
echo  2. NestJS Service (GraphQL) - Puerto 3001  
echo  3. API Gateway - Puerto 3000
echo  4. Frontend React - Puerto 3000
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo ========================================
echo    DETENIENDO TODOS LOS SERVICIOS...
echo ========================================
echo.

:: Detener procesos en puertos específicos
echo 🔴 Deteniendo servicios por puerto...

:: Puerto 5000 (Python)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do (
    echo Deteniendo proceso en puerto 5000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

:: Puerto 3001 (NestJS)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo Deteniendo proceso en puerto 3001 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

:: Puerto 3000 (Gateway/Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Deteniendo proceso en puerto 3000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

:: Detener procesos de Node.js
echo 🔴 Deteniendo procesos de Node.js...
taskkill /IM node.exe /F >nul 2>&1

:: Detener procesos de Python
echo 🔴 Deteniendo procesos de Python...
taskkill /IM python.exe /F >nul 2>&1
taskkill /IM python3.exe /F >nul 2>&1

:: Cerrar ventanas de comandos con títulos específicos
echo 🔴 Cerrando ventanas de servicios...
taskkill /FI "WINDOWTITLE eq Python Service*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq NestJS Service*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq API Gateway*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend React*" /F >nul 2>&1

echo.
echo ========================================
echo    ✅ TODOS LOS SERVICIOS DETENIDOS
echo ========================================
echo.
echo 📊 Servicios detenidos:
echo   🐍 Python Service (Puerto 5000)
echo   🟢 NestJS Service (Puerto 3001)
echo   🌐 API Gateway (Puerto 3000)
echo   ⚛️  Frontend React (Puerto 3000)
echo.
echo 🧹 Limpiando archivos temporales...

:: Limpiar directorio de logs si existe
if exist "logs" (
    rmdir /s /q logs
    echo ✅ Directorio de logs eliminado
)

:: Limpiar archivos temporales de Node.js
if exist "node_modules\.cache" (
    rmdir /s /q node_modules\.cache
    echo ✅ Cache de Node.js eliminado
)

echo.
echo 🎉 ¡Todos los servicios han sido detenidos correctamente!
echo.
echo Para reiniciar todos los servicios, ejecuta:
echo   start-all-services.bat
echo.
pause 