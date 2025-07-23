@echo off
title RUC Validation Test
color 0C

echo ========================================
echo    RUC VALIDATION TEST
echo ========================================
echo.

echo 🔍 Probando validación de RUC...
echo.

:: Probar RUC válido (11 dígitos)
echo 📋 Probando RUC válido (11 dígitos)...
curl -X PUT http://localhost:3002/api/empresas/test-id -H "Content-Type: application/json" -d "{\"ruc\":\"12345678901\"}" 2>nul
if %errorlevel% equ 0 (
    echo ✅ RUC válido aceptado
) else (
    echo ❌ RUC válido rechazado
)
echo.

:: Probar RUC inválido (menos de 11 dígitos)
echo 📋 Probando RUC inválido (menos de 11 dígitos)...
curl -X PUT http://localhost:3002/api/empresas/test-id -H "Content-Type: application/json" -d "{\"ruc\":\"1234567890\"}" 2>nul
if %errorlevel% equ 0 (
    echo ✅ RUC corto aceptado (flexible)
) else (
    echo ❌ RUC corto rechazado
)
echo.

:: Probar RUC con letras
echo 📋 Probando RUC con letras...
curl -X PUT http://localhost:3002/api/empresas/test-id -H "Content-Type: application/json" -d "{\"ruc\":\"ABC12345678\"}" 2>nul
if %errorlevel% equ 0 (
    echo ✅ RUC con letras aceptado (flexible)
) else (
    echo ❌ RUC con letras rechazado
)
echo.

echo ========================================
echo    CONFIGURACIÓN ACTUAL
echo ========================================
echo.
echo 📋 Schema de actualización:
echo   • RUC: string, minLength: 1, maxLength: 20
echo   • Formato: Flexible (sin patrón estricto)
echo.
echo 💡 Para probar en el frontend:
echo   1. Abre http://localhost:3000
echo   2. Ve a Empresas → Editar
echo   3. Modifica el RUC
echo   4. Guarda cambios
echo.

echo Presiona cualquier tecla para continuar...
pause >nul 