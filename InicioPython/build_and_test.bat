@echo off
echo 🔧 Script de construcción y prueba para ERP Python Service
echo ==================================================

if "%1"=="psycopg3" goto build_psycopg3
if "%1"=="psycopg2" goto build_psycopg2
if "%1"=="test" goto test_only
if "%1"=="help" goto show_help
if "%1"=="-h" goto show_help
if "%1"=="--help" goto show_help
if "%1"=="" goto build_psycopg3

echo ❌ Opción no válida: %1
goto show_help

:build_psycopg3
echo 🚀 Construyendo con psycopg3...
echo ✅ requirements.txt ya configurado para psycopg3
echo 🐳 Construyendo imagen Docker...
docker build -t erp-python-service:psycopg3 .
echo 🧪 Probando conexión...
docker run --rm erp-python-service:psycopg3 python test_psycopg_connection.py
goto end

:build_psycopg2
echo 🚀 Construyendo con psycopg2-binary...
echo ⚠️  psycopg2-binary puede tener problemas con Python 3.13
echo 🔄 Usando Python 3.12 en el Dockerfile...
echo 🐳 Construyendo imagen Docker...
docker build -t erp-python-service:psycopg2 .
echo 🧪 Probando conexión...
docker run --rm erp-python-service:psycopg2 python test_psycopg_connection.py
goto end

:test_only
echo 🧪 Solo probando conexión...
docker run --rm erp-python-service:latest python test_psycopg_connection.py
goto end

:show_help
echo Uso: %0 [opción]
echo.
echo Opciones:
echo   psycopg3    - Construir con psycopg3 (recomendado)
echo   psycopg2     - Construir con psycopg2-binary (fallback)
echo   test         - Solo probar conexión
echo   help         - Mostrar esta ayuda
goto end

:end
echo ✅ Proceso completado




