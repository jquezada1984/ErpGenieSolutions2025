@echo off
echo ========================================
echo   Iniciando Servicios ERP Manualmente
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado. Por favor instala Node.js primero.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
echo.

REM Verificar servicios existentes
echo Verificando servicios existentes...
netstat -ano | findstr ":3001" >nul
if %errorlevel% equ 0 (
    echo [OK] InicioNestJs puerto 3001 - Ya esta corriendo
) else (
    echo [ADVERTENCIA] InicioNestJs puerto 3001 - NO esta corriendo
)

netstat -ano | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo [OK] InicioPython puerto 5000 - Ya esta corriendo
) else (
    echo [ADVERTENCIA] InicioPython puerto 5000 - NO esta corriendo
)

echo.
echo ========================================
echo   Iniciando MenuNestJs (Puerto 3003)
echo ========================================
echo.

cd MenuNestJs
if not exist node_modules (
    echo Instalando dependencias de MenuNestJs...
    call npm install --legacy-peer-deps
)

echo Iniciando MenuNestJs...
start "MenuNestJs - Puerto 3003" cmd /k "cd /d %CD% && npm run start:dev"
cd ..

timeout /t 8 /nobreak >nul

echo.
echo ========================================
echo   Iniciando Gateway API (Puerto 3002)
echo ========================================
echo.

cd gateway-api
if not exist node_modules (
    echo Instalando dependencias de Gateway...
    call npm install
)

echo Configurando variables de entorno...
set PYTHON_SERVICE_URL=http://localhost:5000
set NESTJS_SERVICE_URL=http://localhost:3001
set MENU_SERVICE_URL=http://localhost:3003
set GATEWAY_PORT=3002
set CORS_ORIGIN=http://localhost:3000,http://localhost:5173
set LOG_LEVEL=info
set NODE_ENV=development

echo Iniciando Gateway API...
start "Gateway API - Puerto 3002" cmd /k "cd /d %CD% && set PYTHON_SERVICE_URL=http://localhost:5000 && set NESTJS_SERVICE_URL=http://localhost:3001 && set MENU_SERVICE_URL=http://localhost:3003 && set GATEWAY_PORT=3002 && set CORS_ORIGIN=http://localhost:3000,http://localhost:5173 && set LOG_LEVEL=info && set NODE_ENV=development && npm run dev"
cd ..

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Verificando Servicios
echo ========================================
echo.

netstat -ano | findstr ":3001" >nul
if %errorlevel% equ 0 (
    echo [OK] InicioNestJs - http://localhost:3001
) else (
    echo [ERROR] InicioNestJs - NO esta corriendo
)

netstat -ano | findstr ":3002" >nul
if %errorlevel% equ 0 (
    echo [OK] Gateway API - http://localhost:3002
) else (
    echo [ERROR] Gateway API - NO esta corriendo
)

netstat -ano | findstr ":3003" >nul
if %errorlevel% equ 0 (
    echo [OK] MenuNestJs - http://localhost:3003
) else (
    echo [ERROR] MenuNestJs - NO esta corriendo
)

netstat -ano | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo [OK] InicioPython - http://localhost:5000
) else (
    echo [ERROR] InicioPython - NO esta corriendo
)

echo.
echo ========================================
echo   Servicios Iniciados
echo ========================================
echo.
echo Revisa las ventanas de terminal abiertas para ver los logs.
echo Si hay errores, revisalos en las ventanas correspondientes.
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
