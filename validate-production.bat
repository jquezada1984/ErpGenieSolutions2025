@echo off
echo 🚀 Iniciando validación completa del proyecto ERP...

echo.
echo 📦 Validando Frontend (React)...
cd frontReact
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del frontend
    exit /b 1
)
echo ✅ Dependencias del frontend instaladas

call npm run lint
if %errorlevel% neq 0 (
    echo ❌ Error en linting del frontend
    exit /b 1
)
echo ✅ Linting del frontend completado

call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error en build del frontend
    exit /b 1
)
echo ✅ Build del frontend completado

cd ..

echo.
echo 🌐 Validando Gateway API...
cd gateway-api
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias del Gateway
    exit /b 1
)
echo ✅ Dependencias del Gateway instaladas

cd ..

echo.
echo 🐍 Validando Microservicio Python...
cd InicioPython

python -m py_compile app.py
if %errorlevel% neq 0 (
    echo ❌ Error en sintaxis de app.py
    exit /b 1
)
echo ✅ Sintaxis de app.py válida

python -m py_compile models\*.py
if %errorlevel% neq 0 (
    echo ❌ Error en sintaxis de modelos
    exit /b 1
)
echo ✅ Sintaxis de modelos válida

python -m py_compile api\*.py
if %errorlevel% neq 0 (
    echo ❌ Error en sintaxis de APIs
    exit /b 1
)
echo ✅ Sintaxis de APIs válida

python -m py_compile schemas\*.py
if %errorlevel% neq 0 (
    echo ❌ Error en sintaxis de esquemas
    exit /b 1
)
echo ✅ Sintaxis de esquemas válida

cd ..

echo.
echo ⚡ Validando Microservicio NestJS...
cd InicioNestJs
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias de NestJS
    exit /b 1
)
echo ✅ Dependencias de NestJS instaladas

call npm run lint
if %errorlevel% neq 0 (
    echo ❌ Error en linting de NestJS
    exit /b 1
)
echo ✅ Linting de NestJS completado

call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error en build de NestJS
    exit /b 1
)
echo ✅ Build de NestJS completado

cd ..

echo.
echo 🔧 Validando archivos de configuración...

if exist "frontReact\.env" (
    echo ✅ Frontend .env encontrado
) else (
    echo ⚠️  Frontend .env no encontrado (usar .env.example)
)

if exist "gateway-api\.env" (
    echo ✅ Gateway .env encontrado
) else (
    echo ⚠️  Gateway .env no encontrado (usar .env.example)
)

if exist "InicioPython\.env" (
    echo ✅ Python .env encontrado
) else (
    echo ⚠️  Python .env no encontrado (usar .env.example)
)

if exist "InicioNestJs\.env" (
    echo ✅ NestJS .env encontrado
) else (
    echo ⚠️  NestJS .env no encontrado (usar .env.example)
)

echo.
echo 🎉 Validación completa finalizada exitosamente!
echo.
echo 📋 Checklist para producción:
echo   1. ✅ Todas las dependencias instaladas
echo   2. ✅ Sintaxis validada
echo   3. ✅ Builds completados
echo   4. ⚠️  Verificar variables de entorno
echo   5. ⚠️  Verificar conexión a base de datos
echo   6. ⚠️  Configurar CORS para producción
echo   7. ⚠️  Configurar SSL/HTTPS
echo   8. ⚠️  Configurar logs y monitoreo
echo   9. ⚠️  Configurar backup de base de datos

pause 