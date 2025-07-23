@echo off
title ERP System - Complete Setup and Start
color 0E

echo ========================================
echo    ERP SYSTEM - COMPLETE SETUP
echo ========================================
echo.
echo Este script configurará e iniciará todo el sistema:
echo  1. Verificar dependencias
echo  2. Instalar dependencias faltantes
echo  3. Iniciar todos los servicios
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo ========================================
echo    VERIFICANDO DEPENDENCIAS
echo ========================================
echo.

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js detectado

:: Verificar Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python no está instalado
    echo Por favor instala Python desde: https://python.org/
    pause
    exit /b 1
)
echo ✅ Python detectado

echo.
echo ========================================
echo    INSTALANDO DEPENDENCIAS
echo ========================================
echo.

:: Instalar dependencias del Frontend
if not exist "frontReact\node_modules" (
    echo 📦 Instalando dependencias del Frontend...
    cd frontReact
    npm install
    cd ..
    echo ✅ Frontend listo
) else (
    echo ✅ Frontend ya tiene dependencias
)

:: Instalar dependencias del NestJS
if not exist "back-nest-js\node_modules" (
    echo 📦 Instalando dependencias del NestJS...
    cd back-nest-js
    npm install
    cd ..
    echo ✅ NestJS listo
) else (
    echo ✅ NestJS ya tiene dependencias
)

:: Instalar dependencias del Gateway
if not exist "gateway-api\node_modules" (
    echo 📦 Instalando dependencias del Gateway (Fastify)...
    cd gateway-api
    npm install
    cd ..
    echo ✅ Gateway Fastify listo
) else (
    echo ✅ Gateway ya tiene dependencias
)

:: Instalar dependencias de Python
if not exist "microservice-db\venv" (
    echo 📦 Instalando dependencias de Python...
    cd microservice-db
    python -m pip install -r requirements.txt
    cd ..
    echo ✅ Python listo
) else (
    echo ✅ Python ya tiene dependencias
)

echo.
echo ========================================
echo    INICIANDO SERVICIOS
echo ========================================
echo.

:: Iniciar Python Service
echo 🐍 Iniciando Python Service...
start "Python Service" cmd /k "cd microservice-db && echo Iniciando Python Service... && python start_server.py"

:: Esperar 3 segundos
timeout /t 3 /nobreak >nul

:: Iniciar NestJS Service
echo 🟢 Iniciando NestJS Service...
start "NestJS Service" cmd /k "cd back-nest-js && echo Iniciando NestJS Service... && npm run start:dev"

:: Esperar 5 segundos
timeout /t 5 /nobreak >nul

:: Iniciar API Gateway
echo 🌐 Iniciando API Gateway (Fastify)...
start "API Gateway" cmd /k "cd gateway-api && echo Iniciando API Gateway Fastify... && npm run dev"

:: Esperar 5 segundos
timeout /t 5 /nobreak >nul

:: Iniciar Frontend React
echo ⚛️  Iniciando Frontend React...
start "Frontend React" cmd /k "cd frontReact && echo Iniciando Frontend React... && npm start"

echo.
echo ========================================
echo    ✅ SISTEMA COMPLETAMENTE CONFIGURADO
echo ========================================
echo.
echo 📊 Servicios ejecutándose:
echo   🐍 Python Service: http://localhost:5000
echo   🟢 NestJS Service: http://localhost:3001
echo   🌐 API Gateway: http://localhost:3000/gateway
echo   ⚛️  Frontend React: http://localhost:3000
echo.
echo ⏰ Esperando 20 segundos para que todos los servicios se inicialicen...
timeout /t 20 /nobreak >nul

:: Abrir navegador
start http://localhost:3000

echo.
echo 🎉 ¡Sistema ERP completamente configurado y ejecutándose!
echo.
echo 📋 Comandos útiles:
echo   - Para detener todos: stop-all-services.bat
echo   - Para verificar health: curl http://localhost:3000/gateway/health
echo   - Para reiniciar: setup-and-start.bat
echo.
echo Para detener todos los servicios, cierra las ventanas de comandos
echo o ejecuta: stop-all-services.bat
echo.
pause 