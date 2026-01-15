@echo off
echo ========================================
echo    RECONSTRUYENDO Y REINICIANDO DOCKER COMPLETO
echo ========================================
echo.

REM Verificar si Docker está disponible
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no está instalado o no está en el PATH
    pause
    exit /b 1
)

REM Verificar si docker-compose está disponible
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: docker-compose no está instalado o no está en el PATH
    pause
    exit /b 1
)

REM Usar docker-compose.dev.yml para desarrollo (cambiar a docker-compose.yml para producción)
set COMPOSE_FILE=docker-compose.dev.yml

echo Deteniendo todos los servicios...
docker-compose -f %COMPOSE_FILE% down

if errorlevel 1 (
    echo ADVERTENCIA: Error al detener servicios, continuando...
)

echo.
echo Eliminando contenedores y volúmenes...
docker-compose -f %COMPOSE_FILE% down -v

echo.
echo Eliminando imágenes anteriores...
docker-compose -f %COMPOSE_FILE% down --rmi all

if errorlevel 1 (
    echo ADVERTENCIA: Algunas imágenes no pudieron ser eliminadas (puede ser normal si están en uso)
)

echo.
echo Reconstruyendo todas las imágenes (esto puede tomar varios minutos)...
docker-compose -f %COMPOSE_FILE% build --no-cache

if errorlevel 1 (
    echo ERROR: Fallo al reconstruir las imágenes
    pause
    exit /b 1
)

echo.
echo Iniciando servicios con nuevas imágenes...
docker-compose -f %COMPOSE_FILE% up -d

if errorlevel 1 (
    echo ERROR: Fallo al iniciar los servicios
    pause
    exit /b 1
)

echo.
echo Esperando 10 segundos para que los servicios inicien...
timeout /t 10 /nobreak >nul

echo.
echo Verificando estado de los servicios...
docker-compose -f %COMPOSE_FILE% ps

echo.
echo ========================================
echo    RECONSTRUCCIÓN Y REINICIO COMPLETADOS
echo ========================================
echo.
echo Todas las imágenes han sido reconstruidas y los servicios están ejecutándose.
echo.
echo Servicios disponibles:
echo - Frontend React: http://localhost:3000
echo - Gateway API: http://localhost:3002
echo - Inicio NestJS (GraphQL): http://localhost:3001
echo - Menu Service: http://localhost:3003
echo - Financiero NestJS: http://localhost:3004
echo - Contabilidad NestJS: http://localhost:3005
echo - Inicio Python Service: http://localhost:5000
echo - Financiero Python: http://localhost:5001
echo - Contabilidad Python: http://localhost:5002
echo.
echo Para ver logs: docker-compose -f %COMPOSE_FILE% logs -f
echo Para ver logs de un servicio específico: docker-compose -f %COMPOSE_FILE% logs -f [nombre-servicio]
echo Para detener servicios: stop-docker.bat
echo.
pause
