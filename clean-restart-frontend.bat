@echo off
title Frontend Clean Restart
color 0A

echo ========================================
echo    FRONTEND CLEAN RESTART
echo ========================================
echo.

echo 🛑 Deteniendo servidor de desarrollo...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Servidor detenido
echo.

echo 🧹 Limpiando caché y archivos temporales...

cd frontReact

echo 📁 Limpiando node_modules/.vite...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo ✅ Caché de Vite limpiado
)

echo 📁 Limpiando dist...
if exist "dist" (
    rmdir /s /q "dist"
    echo ✅ Carpeta dist limpiada
)

echo 📁 Limpiando .vite...
if exist ".vite" (
    rmdir /s /q ".vite"
    echo ✅ Carpeta .vite limpiada
)

echo 📁 Limpiando package-lock.json...
if exist "package-lock.json" (
    del "package-lock.json"
    echo ✅ package-lock.json eliminado
)

echo.
echo 📦 Reinstalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

echo 🚀 Iniciando servidor de desarrollo...
echo.
echo 💡 Para verificar que el problema está resuelto:
echo    1. Abrir http://localhost:3000
echo    2. Abrir DevTools (F12)
echo    3. Verificar que NO aparezca el warning de múltiples raíces
echo    4. Buscar mensajes de debug en la consola
echo.

npm run dev

cd .. 