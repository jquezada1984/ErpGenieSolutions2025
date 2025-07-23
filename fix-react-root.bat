@echo off
title React Root Fix
color 0C

echo ========================================
echo    REACT ROOT PROBLEM DIAGNOSIS
echo ========================================
echo.

echo 🔍 Diagnóstico del problema de múltiples raíces de React...
echo.

echo 📋 Problema identificado:
echo    Warning: You are calling ReactDOMClient.createRoot() on a container 
echo    that has already been passed to createRoot() before.
echo.

echo 🔧 Soluciones implementadas:
echo    ✅ Eliminada importación duplicada de createRoot
echo    ✅ Agregado debug para detectar raíces existentes
echo    ✅ Implementada limpieza automática de raíces
echo    ✅ Validación del elemento root antes de crear
echo.

echo 📁 Archivos modificados:
echo    ✅ frontReact/src/main.tsx
echo    ✅ frontReact/src/utils/reactRootDebug.ts
echo.

echo 💡 Para aplicar la solución:
echo    1. Detener el servidor de desarrollo (Ctrl+C)
echo    2. Limpiar caché: npm run clean
echo    3. Reinstalar dependencias: npm install
echo    4. Reiniciar servidor: npm run dev
echo.

echo 🧹 Limpiando caché de Vite...
if exist "frontReact\node_modules\.vite" (
    rmdir /s /q "frontReact\node_modules\.vite"
    echo ✅ Caché de Vite limpiado
) else (
    echo ℹ️ No se encontró caché de Vite
)

echo.
echo 🧹 Limpiando caché de npm...
if exist "frontReact\node_modules\.cache" (
    rmdir /s /q "frontReact\node_modules\.cache"
    echo ✅ Caché de npm limpiado
) else (
    echo ℹ️ No se encontró caché de npm
)

echo.
echo ========================================
echo    VERIFICACIÓN EN EL NAVEGADOR
echo ========================================
echo.
echo 🔍 Para verificar que el problema está resuelto:
echo    1. Abrir DevTools (F12)
echo    2. Ir a la pestaña Console
echo    3. Buscar mensajes de debug:
echo       • "✅ Nueva raíz de React creada de forma segura"
echo       • "🧹 Elemento root limpiado"
echo    4. NO debería aparecer el warning de múltiples raíces
echo.

echo Presiona cualquier tecla para continuar...
pause >nul 