@echo off
echo ========================================
echo   Iniciando todos los servicios ERP
echo ========================================
echo.

echo Verificando servicios necesarios...
echo.

REM Verificar si InicioNestJs está corriendo
netstat -ano | findstr ":3001" >nul
if %errorlevel% equ 0 (
    echo [OK] InicioNestJs (puerto 3001) - Corriendo
) else (
    echo [ERROR] InicioNestJs (puerto 3001) - NO está corriendo
    echo Por favor inicia InicioNestJs primero
)

REM Verificar si InicioPython está corriendo
netstat -ano | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo [OK] InicioPython (puerto 5000) - Corriendo
) else (
    echo [ERROR] InicioPython (puerto 5000) - NO está corriendo
    echo Por favor inicia InicioPython primero
)

REM Verificar si MenuNestJs está corriendo
netstat -ano | findstr ":3003" >nul
if %errorlevel% equ 0 (
    echo [OK] MenuNestJs (puerto 3003) - Corriendo
) else (
    echo [ADVERTENCIA] MenuNestJs (puerto 3003) - NO está corriendo
    echo Iniciando MenuNestJs...
    start "MenuNestJs" cmd /k "cd MenuNestJs && npm run start:dev"
    timeout /t 5 /nobreak >nul
)

REM Verificar si Gateway está corriendo
netstat -ano | findstr ":3002" >nul
if %errorlevel% equ 0 (
    echo [OK] Gateway (puerto 3002) - Ya está corriendo
) else (
    echo Iniciando Gateway API...
    start "Gateway API" cmd /k "cd gateway-api && start-gateway.bat"
    timeout /t 3 /nobreak >nul
)

echo.
echo ========================================
echo   Servicios iniciados
echo ========================================
echo.
echo Servicios disponibles:
echo   - Frontend: http://localhost:3000
echo   - Gateway API: http://localhost:3002
echo   - InicioNestJs: http://localhost:3001
echo   - InicioPython: http://localhost:5000
echo   - MenuNestJs: http://localhost:3003
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
