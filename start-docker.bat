@echo off
echo ========================================
echo    INICIANDO SERVICIOS DOCKER
echo ========================================
echo.

echo Iniciando todos los servicios...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo ========================================
echo    SERVICIOS INICIADOS
echo ========================================
echo.
echo Servicios disponibles:
echo - Frontend React: http://localhost:3000
echo - Gateway API: http://localhost:3002
echo - NestJS GraphQL: http://localhost:3001
echo - Menu Service: http://localhost:3003
echo - Python Service: http://localhost:5000
echo.
echo Para ver logs: docker-compose -f docker-compose.dev.yml logs -f
echo Para detener: stop-docker.bat
echo.
pause