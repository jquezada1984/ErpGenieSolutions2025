@echo off
set PYTHON_SERVICE_URL=http://localhost:5000
set NESTJS_SERVICE_URL=http://localhost:3001
set MENU_SERVICE_URL=http://localhost:3003
set GATEWAY_PORT=3002
set CORS_ORIGIN=http://localhost:3000
set LOG_LEVEL=info
set NODE_ENV=development

echo Iniciando Gateway con variables de entorno:
echo PYTHON_SERVICE_URL=%PYTHON_SERVICE_URL%
echo NESTJS_SERVICE_URL=%NESTJS_SERVICE_URL%
echo MENU_SERVICE_URL=%MENU_SERVICE_URL%
echo GATEWAY_PORT=%GATEWAY_PORT%
echo.

npm run dev
