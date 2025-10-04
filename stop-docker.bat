@echo off
echo ========================================
echo    DETENIENDO SERVICIOS DOCKER
echo ========================================
echo.

echo Deteniendo todos los servicios...
docker-compose -f docker-compose.dev.yml down

echo.
echo ========================================
echo    SERVICIOS DETENIDOS
echo ========================================
echo.
echo Todos los servicios han sido detenidos.
echo Para iniciar nuevamente: start-docker.bat
echo.
pause