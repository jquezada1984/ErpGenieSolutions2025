@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo   ERP Docker (desarrollo): construir e iniciar
echo ========================================
echo.

if not exist "InicioNestJs\.env" (
  if exist "InicioNestJs\env.example" (
    echo Creando InicioNestJs\.env desde env.example ...
    copy /Y "InicioNestJs\env.example" "InicioNestJs\.env" >nul
    echo Revisa DB_* y JWT_SECRET en InicioNestJs\.env antes de produccion.
    echo.
  )
)

echo Construyendo imagenes si hace falta e iniciando contenedores en segundo plano...
docker compose -f docker-compose.dev.yml up -d --build
if errorlevel 1 (
  echo.
  echo ERROR: docker compose fallo. Revisa el mensaje anterior.
  echo Reconstruccion forzada sin cache: docker compose -f docker-compose.dev.yml build --no-cache
  pause
  exit /b 1
)

echo.
echo ========================================
echo   Stack en ejecucion
echo ========================================
echo.
echo - Frontend:        http://localhost:3000
echo - Gateway API:     http://localhost:3002
echo - NestJS GraphQL:  http://localhost:3001
echo - Menu Service:    http://localhost:3003
echo - Python Service:  http://localhost:5000
echo - Tercero Py/Nest: http://localhost:3004 / 3006
echo - Contab. Py/Nest: http://localhost:5002 / 3005
echo - Financ. Py/Nest: http://localhost:5001 / 3007
echo.
echo Logs: docker compose -f docker-compose.dev.yml logs -f
echo Detener: docker-dev-down.bat  ^|  Reiniciar: docker-dev-restart.bat
echo.
pause
endlocal
