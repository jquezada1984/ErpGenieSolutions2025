@echo off
echo ========================================
echo    RECONSTRUYENDO Y REINICIANDO DOCKER COMPLETO
echo ========================================
echo.

echo [1/7] Deteniendo todos los servicios...
docker-compose -f docker-compose.dev.yml down
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Algunos servicios no se pudieron detener correctamente
)

echo.
echo [2/7] Limpiando redes Docker existentes...
echo Eliminando red erp-network si existe...
docker network rm erpgeniesolutions2025_erp-network 2>nul
docker network rm erp-network 2>nul
docker network prune -f
if %errorlevel% neq 0 (
    echo ADVERTENCIA: No se pudieron limpiar todas las redes
)

echo.
echo [3/7] Eliminando imágenes anteriores...
docker-compose -f docker-compose.dev.yml down --rmi all
if %errorlevel% neq 0 (
    echo ADVERTENCIA: No se pudieron eliminar todas las imágenes
)

echo.
echo [4/7] Reconstruyendo todas las imágenes (esto puede tomar varios minutos)...
echo Por favor, espere...
docker-compose -f docker-compose.dev.yml build --no-cache
if %errorlevel% neq 0 (
    echo ERROR: Fallo en la construcción de las imágenes
    pause
    exit /b 1
)

echo.
echo [5/7] Iniciando servicios con nuevas imágenes...
docker-compose -f docker-compose.dev.yml up -d
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudieron iniciar los servicios
    echo Intentando limpiar redes y reintentar...
    docker network prune -f
    timeout /t 2 /nobreak >nul
    docker-compose -f docker-compose.dev.yml up -d
    if %errorlevel% neq 0 (
        echo ERROR: Fallo al iniciar servicios después del reintento
        echo Verifique los logs con: docker-compose -f docker-compose.dev.yml logs
        pause
        exit /b 1
    )
)

echo.
echo [6/7] Esperando a que los servicios estén listos...
timeout /t 5 /nobreak >nul

echo.
echo [7/7] Verificando estado de los servicios...
docker-compose -f docker-compose.dev.yml ps

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
echo Para ver logs: docker-compose -f docker-compose.dev.yml logs -f
echo Para ver logs de un servicio específico: docker-compose -f docker-compose.dev.yml logs -f [nombre-servicio]
echo.
pause
















