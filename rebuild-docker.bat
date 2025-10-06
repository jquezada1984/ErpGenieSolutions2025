@echo off
echo ========================================
echo    RECONSTRUYENDO DOCKER COMPLETO
echo ========================================
echo.

echo Deteniendo todos los servicios...
docker-compose -f docker-compose.dev.yml down

echo.
echo Eliminando imágenes anteriores...
docker-compose -f docker-compose.dev.yml down --rmi all

echo.
echo Reconstruyendo todas las imágenes (esto puede tomar varios minutos)...
docker-compose -f docker-compose.dev.yml build --no-cache

echo.
echo Iniciando servicios con nuevas imágenes...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo ========================================
echo    RECONSTRUCCIÓN COMPLETADA
echo ========================================
echo.
echo Todas las imágenes han sido reconstruidas y los servicios están ejecutándose.
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


