@echo off
echo ========================================
echo    MICROSERVICIO PYTHON - ERP
echo ========================================
echo.
echo Configuracion de base de datos:
echo   Host: db.xfeycgctysoumclptgoh.supabase.co
echo   Puerto: 5432
echo   Base de datos: postgres
echo   Usuario: postgres
echo.
echo Iniciando servidor en http://localhost:5000
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

python start_server.py

pause 