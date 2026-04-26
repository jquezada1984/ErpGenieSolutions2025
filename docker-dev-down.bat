@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo   ERP Docker (desarrollo): detener
echo ========================================
echo.

docker compose -f docker-compose.dev.yml down
if errorlevel 1 (
  echo ERROR: docker compose down fallo.
  pause
  exit /b 1
)

echo.
echo Contenedores detenidos. Iniciar de nuevo: docker-dev-up.bat
echo.
pause
endlocal
