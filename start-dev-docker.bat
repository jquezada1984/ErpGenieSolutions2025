@echo off
echo ========================================
echo 🚀 INICIANDO ERP EN MODO DESARROLLO
echo ========================================
echo.

echo 📚 Paso 1: Preparando librería compartida de logging...
echo.

REM Verificar si existe la librería
if not exist "shared-logging-nestjs" (
    echo ❌ Error: No se encontró shared-logging-nestjs
    pause
    exit /b 1
)

REM Compilar la librería compartida
echo 📦 Compilando shared-logging-nestjs...
cd shared-logging-nestjs
if not exist "node_modules" (
    echo 📥 Instalando dependencias de shared-logging-nestjs...
    call npm install
)
echo 🔨 Compilando TypeScript...
call npm run build
if errorlevel 1 (
    echo ❌ Error al compilar shared-logging-nestjs
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Librería compartida lista
echo.

echo 📚 Paso 2: Instalando librería en servicios NestJS...
echo.

REM Servicios NestJS que usan la librería
set SERVICES=InicioNestJs MenuNestJs FinancieroNestJs ContabilidadNestJs

for %%S in (%SERVICES%) do (
    if exist "%%S" (
        echo 📦 Procesando %%S...
        cd %%S
        if exist "package.json" (
            REM Verificar si ya tiene la dependencia configurada
            findstr /C:"@erp/shared-logging-nestjs" package.json >nul 2>&1
            if errorlevel 1 (
                echo    ⚠️  No tiene la dependencia configurada en package.json
                echo    💡 Agregue en dependencies: "@erp/shared-logging-nestjs": "file:../shared-logging-nestjs"
            ) else (
                echo    ✅ Dependencia encontrada en package.json
            )
            REM Instalar todas las dependencias (incluyendo la librería compartida si está configurada)
            echo    📥 Instalando dependencias...
            call npm install
            if errorlevel 1 (
                echo    ❌ Error al instalar dependencias en %%S
            ) else (
                echo    ✅ Dependencias instaladas correctamente
            )
        ) else (
            echo    ⚠️  No se encontró package.json en %%S
        )
        cd ..
        echo    ✅ %%S procesado
    ) else (
        echo    ⚠️  %%S no encontrado, omitiendo...
    )
    echo.
)

echo 📚 Paso 3: Iniciando contenedores Docker...
echo.

echo 📦 Construyendo y ejecutando contenedores de desarrollo...
docker-compose -f docker-compose.dev.yml up --build

echo.
echo ========================================
echo ✅ SERVICIOS DE DESARROLLO INICIADOS
echo ========================================
echo.
echo Servicios disponibles:
echo    - Frontend React: http://localhost:3000
echo    - Gateway API: http://localhost:3002
echo    - Backend NestJS: http://localhost:3001
echo    - Backend Python: http://localhost:5000
echo    - Menu Service: http://localhost:3003
echo    - Financiero NestJS: http://localhost:3004
echo    - Financiero Python: http://localhost:5001
echo.
echo 🔄 Los cambios en el código se reflejarán automáticamente sin reconstruir
echo.
pause
