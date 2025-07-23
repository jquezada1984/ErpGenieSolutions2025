@echo off
title ERP System - All Services Launcher (Improved)
color 0A

echo ========================================
echo    ERP SYSTEM - ALL SERVICES LAUNCHER
echo ========================================
echo.
echo Este script iniciara todos los servicios:
echo  1. Python Service (REST) - Puerto 5000
echo  2. NestJS Service (GraphQL) - Puerto 3001  
echo  3. API Gateway - Puerto 3000
echo  4. Frontend React - Puerto 3000 (diferente)
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo ========================================
echo    INICIANDO TODOS LOS SERVICIOS...
echo ========================================
echo.

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado o no está en el PATH
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

:: Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python no está instalado o no está en el PATH
    echo Por favor instala Python desde: https://python.org/
    pause
    exit /b 1
)

echo ✅ Node.js y Python detectados correctamente
echo.

:: Verificar puertos disponibles (versión simplificada)
echo Verificando puertos disponibles...

:: Puerto 5000
netstat -an | find ":5000 " | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 5000 ya está en uso
) else (
    echo ✅ Puerto 5000 disponible
)

:: Puerto 3001
netstat -an | find ":3001 " | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 3001 ya está en uso
) else (
    echo ✅ Puerto 3001 disponible
)

:: Puerto 3000
netstat -an | find ":3000 " | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto 3000 ya está en uso
) else (
    echo ✅ Puerto 3000 disponible
)
echo.

:: Crear directorio temporal para logs
if not exist "logs" mkdir logs

echo ========================================
echo    INICIANDO SERVICIOS EN PARALELO
echo ========================================
echo.

:: Iniciar Python Service
echo 🐍 Iniciando Python Service (REST)...
start "Python Service" cmd /k "cd microservice-db && echo Iniciando Python Service en puerto 5000... && python start_server.py"

:: Esperar un poco para que Python inicie
echo Esperando 3 segundos para que Python inicie...
timeout /t 3 /nobreak >nul

:: Iniciar NestJS Service
echo 🟢 Iniciando NestJS Service (GraphQL)...
start "NestJS Service" cmd /k "cd back-nest-js && echo Iniciando NestJS Service en puerto 3001... && npm run start:dev"

:: Esperar un poco para que NestJS inicie
echo Esperando 5 segundos para que NestJS inicie...
timeout /t 5 /nobreak >nul

:: Iniciar API Gateway
echo 🌐 Iniciando API Gateway...
start "API Gateway" cmd /k "cd gateway-api && echo Iniciando API Gateway en puerto 3000... && npm run start:dev"

:: Esperar un poco para que Gateway inicie
echo Esperando 5 segundos para que Gateway inicie...
timeout /t 5 /nobreak >nul

:: Iniciar Frontend React
echo ⚛️  Iniciando Frontend React...
start "Frontend React" cmd /k "cd frontReact && echo Iniciando Frontend React... && npm start"

echo.
echo ========================================
echo    ✅ TODOS LOS SERVICIOS INICIADOS
echo ========================================
echo.
echo 📊 Servicios ejecutándose:
echo   🐍 Python Service: http://localhost:5000
echo   🟢 NestJS Service: http://localhost:3001
echo   🌐 API Gateway: http://localhost:3000/gateway
echo   ⚛️  Frontend React: http://localhost:3000
echo.
echo 🔍 Para verificar el estado:
echo   curl http://localhost:3000/gateway/health
echo.
echo 📝 Logs disponibles en las ventanas de cada servicio
echo.
echo ⏰ Esperando 10 segundos para que todos los servicios se inicialicen...
timeout /t 10 /nobreak >nul

echo.
echo 🎯 Verificando estado de servicios...
echo.

:: Verificar Python Service
echo 🔍 Verificando Python Service...
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python Service está respondiendo
) else (
    echo ⚠️  Python Service aún no responde (puede tardar más)
)

:: Verificar NestJS Service
echo 🔍 Verificando NestJS Service...
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ NestJS Service está respondiendo
) else (
    echo ⚠️  NestJS Service aún no responde (puede tardar más)
)

:: Verificar API Gateway
echo 🔍 Verificando API Gateway...
curl -s http://localhost:3000/gateway/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API Gateway está respondiendo
) else (
    echo ⚠️  API Gateway aún no responde (puede tardar más)
)

echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul

:: Abrir navegador
start http://localhost:3000

echo.
echo 🎉 ¡Sistema ERP iniciado correctamente!
echo.
echo 📋 Comandos útiles:
echo   - Para detener todos: stop-all-services.bat
echo   - Para verificar health: curl http://localhost:3000/gateway/health
echo   - Para ver logs: Revisa las ventanas de comandos abiertas
echo.
echo Para detener todos los servicios, cierra las ventanas de comandos
echo o ejecuta: stop-all-services.bat
echo.
pause 