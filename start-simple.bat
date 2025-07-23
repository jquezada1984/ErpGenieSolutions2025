@echo off
title ERP System - Simple Launcher
color 0A

echo ========================================
echo    ERP SYSTEM - SIMPLE LAUNCHER
echo ========================================
echo.
echo Verificando dependencias...
echo.

:: Verificar si las dependencias del Gateway están instaladas
if not exist "gateway-api\node_modules" (
    echo ⚠️  Dependencias del Gateway no encontradas
    echo 📦 Instalando dependencias del Gateway...
    cd gateway-api
    npm install
    cd ..
    echo ✅ Dependencias del Gateway instaladas
    echo.
)

echo Iniciando todos los servicios...
echo.

:: Iniciar Python Service
echo 🐍 Iniciando Python Service...
if not exist "microservice-db\.env" (
    echo Copiando configuración de ejemplo para Python...
    copy "microservice-db\env.example" "microservice-db\.env"
)
start "Python Service" cmd /k "cd microservice-db && python start_server.py"

:: Esperar 2 segundos
timeout /t 2 /nobreak >nul

:: Iniciar NestJS Service
echo 🟢 Iniciando NestJS Service...
if not exist "back-nest-js\.env" (
    echo Copiando configuración de ejemplo para NestJS...
    copy "back-nest-js\env.example" "back-nest-js\.env"
)
start "NestJS Service" cmd /k "cd back-nest-js && npm run start:dev"

:: Esperar 3 segundos
timeout /t 3 /nobreak >nul

:: Iniciar API Gateway
echo 🌐 Iniciando API Gateway...
if not exist "gateway-api\.env" (
    echo Copiando configuración de ejemplo para Gateway...
    copy "gateway-api\env.example" "gateway-api\.env"
)
start "API Gateway" cmd /k "cd gateway-api && npm run start:dev"

:: Esperar 3 segundos
timeout /t 3 /nobreak >nul

:: Iniciar Frontend React
echo ⚛️  Iniciando Frontend React...
start "Frontend React" cmd /k "cd frontReact && npm start"

echo.
echo ========================================
echo    ✅ SERVICIOS INICIADOS
echo ========================================
echo.
echo 📊 Servicios ejecutándose:
echo   🐍 Python Service: http://localhost:5000
echo   🟢 NestJS Service: http://localhost:3001
echo   🌐 API Gateway: http://localhost:3002
echo   ⚛️  Frontend React: http://localhost:3000
echo.
echo ⏰ Esperando 15 segundos para que se inicialicen...
timeout /t 15 /nobreak >nul

:: Abrir navegador
start http://localhost:3000

echo.
echo 🎉 ¡Listo! Navegador abierto.
echo.
echo Para detener todos los servicios:
echo   stop-all-services.bat
echo.
pause 