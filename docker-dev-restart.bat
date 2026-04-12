@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo   ERP Docker (desarrollo): reiniciar
echo ========================================
echo.
echo Deteniendo contenedores (sin borrar imagenes)...

docker compose -f docker-compose.dev.yml down
if errorlevel 1 (
  echo ERROR en docker compose down.
  pause
  exit /b 1
)

echo.
echo Iniciando de nuevo con las imagenes existentes...
docker compose -f docker-compose.dev.yml up -d
if errorlevel 1 (
  echo ERROR en docker compose up. Prueba docker-dev-up.bat para reconstruir.
  pause
  exit /b 1
)

echo.
echo ========================================
echo   Reinicio completado
echo ========================================
echo.
echo Si cambiaron Dockerfiles o package.json, usa docker-dev-up.bat ^(build^).
echo.
pause
endlocal
