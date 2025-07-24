@echo off
echo Iniciando servicios del ERP...

echo.
echo 1. Iniciando Gateway API (puerto 3002)...
start "Gateway API" cmd /k "cd gateway-api && npm start"

echo.
echo 2. Iniciando Python Microservice (puerto 5000)...
start "Python Microservice" cmd /k "cd InicioPython && python app.py"

echo.
echo 3. Iniciando NestJS Backend (puerto 3001)...
start "NestJS Backend" cmd /k "cd InicioNestJs && npm run start:dev"

echo.
echo 4. Iniciando Frontend React (puerto 3000)...
start "Frontend React" cmd /k "cd frontReact && npm run dev"

echo.
echo Todos los servicios están iniciándose...
echo.
echo Puertos:
echo - Frontend: http://localhost:3000
echo - Gateway API: http://localhost:3002
echo - Python Microservice: http://localhost:5000
echo - NestJS Backend: http://localhost:3001
echo.
pause 