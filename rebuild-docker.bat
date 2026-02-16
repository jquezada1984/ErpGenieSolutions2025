@echo off
echo ========================================
echo    RECONSTRUYENDO DOCKER COMPLETO
echo ========================================
echo.

echo Deteniendo todos los servicios...
docker compose -f docker-compose.dev.yml down

echo.
echo Eliminando imagenes anteriores...
docker compose -f docker-compose.dev.yml down --rmi all

echo.
echo Reconstruyendo todas las imagenes (esto puede tomar varios minutos)...
docker compose -f docker-compose.dev.yml build --no-cache

echo.
echo Iniciando servicios con nuevas imagenes...
docker compose -f docker-compose.dev.yml up -d

echo.
echo ========================================
echo    RECONSTRUCCION COMPLETADA
echo ========================================
echo.
echo Todas las imagenes han sido reconstruidas y los servicios estan ejecutandose.
echo.
echo Servicios disponibles:
echo - Frontend React: http://localhost:3000
echo - Gateway API: http://localhost:3002
echo - NestJS GraphQL: http://localhost:3001
echo - Menu Service: http://localhost:3003
echo - Python Service: http://localhost:5000
echo - Tercero Python: http://localhost:3004
echo - Tercero NestJS: http://localhost:3006
echo - Contabilidad Python: http://localhost:5002
echo - Contabilidad NestJS: http://localhost:3005
echo - Financiero Python: http://localhost:5001
echo - Financiero NestJS: http://localhost:3007
echo.
echo Para ver logs: docker compose -f docker-compose.dev.yml logs -f
echo.
pause















