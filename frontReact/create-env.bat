@echo off
echo Creando archivo .env para el frontend...

echo # ===== CONFIGURACIÓN DE APIS ===== > .env
echo # Gateway API URL (Vite usa prefijo VITE_) >> .env
echo VITE_GATEWAY_URL=http://localhost:3002 >> .env
echo. >> .env
echo # ===== CONFIGURACIÓN DEL SERVIDOR ===== >> .env
echo PORT=3000 >> .env

echo Archivo .env creado exitosamente!
echo.
echo Contenido del archivo:
type .env
echo.
pause 