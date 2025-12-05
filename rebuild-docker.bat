@echo off
echo ========================================
echo    RECONSTRUYENDO Y REINICIANDO DOCKER COMPLETO
echo ========================================
echo.

echo Deteniendo todos los servicios...
docker-compose down

echo.
echo Eliminando imágenes anteriores...
docker-compose down --rmi all

echo.
echo Reconstruyendo todas las imágenes (esto puede tomar varios minutos)...
docker-compose build --no-cache

echo.
echo Iniciando servicios con nuevas imágenes...
docker-compose up -d

echo.
echo Esperando 5 segundos para que los servicios inicien...
timeout /t 5 /nobreak >nul

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
echo - NestJS GraphQL: http://localhost:3001
echo - Menu Service: http://localhost:3003
echo - Financiero NestJS: http://localhost:3004
echo - Python Service: http://localhost:5000
echo - Financiero Python: http://localhost:5001
echo.
echo Para ver logs: docker-compose logs -f
echo Para ver logs de un servicio específico: docker-compose logs -f [nombre-servicio]
echo.
pause
















