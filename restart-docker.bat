@echo off
echo ========================================
echo    REINICIANDO SERVICIOS DOCKER
echo ========================================
echo.

echo Deteniendo servicios...
docker-compose -f docker-compose.dev.yml down

echo.
echo Iniciando servicios...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo ========================================
echo    SERVICIOS REINICIADOS
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
echo.
pause




