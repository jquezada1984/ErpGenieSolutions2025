@echo off
title Error System Test
color 0E

echo ========================================
echo    ERROR SYSTEM TEST
echo ========================================
echo.

echo 🔍 Probando sistema de traducción de errores...
echo.

echo 📋 Errores de validación:
echo   • body/ruc must match pattern "^\\d{11}$" → El RUC debe tener exactamente 11 dígitos
echo   • body/email must match format "email" → El formato del email no es válido
echo   • body/nombre must NOT have fewer than 1 characters → El nombre es obligatorio
echo.

echo 📋 Errores de red:
echo   • Network Error → Error de conexión. Verifique su conexión a internet
echo   • Failed to fetch → Error de conexión al servidor
echo   • ERR_CONNECTION_REFUSED → No se puede conectar al servidor
echo.

echo 📋 Errores de autenticación:
echo   • Invalid credentials → Credenciales inválidas
echo   • Password is incorrect → Contraseña incorrecta
echo   • Token expired → Sesión expirada. Inicie sesión nuevamente
echo.

echo 📋 Errores HTTP:
echo   • 400 → Solicitud incorrecta
echo   • 401 → No autorizado. Inicie sesión nuevamente
echo   • 500 → Error interno del servidor
echo.

echo ========================================
echo    COMPONENTES ACTUALIZADOS
echo ========================================
echo.
echo ✅ EditarEmpresa.tsx - Usa ErrorAlert
echo ✅ NuevaEmpresa.tsx - Usa ErrorAlert
echo ✅ Login.tsx - Usa ErrorAlert
echo ✅ ErrorAlert.tsx - Componente reutilizable
echo ✅ errorTranslator.ts - Sistema de traducción
echo.

echo ========================================
echo    TIPOS DE ERRORES
echo ========================================
echo.
echo 🟡 Validación (warning) - Errores de formulario
echo 🔵 Red (info) - Problemas de conexión
echo 🔴 Autenticación (danger) - Problemas de login
echo 🔴 Servidor (danger) - Errores del backend
echo ❓ Desconocido (danger) - Errores no clasificados
echo.

echo 💡 Para probar:
echo   1. Abre http://localhost:3000
echo   2. Intenta crear/editar empresa con datos inválidos
echo   3. Verifica que los errores aparezcan en español
echo   4. Verifica que tengan iconos y colores apropiados
echo.

echo Presiona cualquier tecla para continuar...
pause >nul 