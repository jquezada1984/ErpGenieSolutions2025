@echo off
title InicioNestJs - Puerto 3001
cd /d "%~dp0InicioNestJs"

if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install --legacy-peer-deps
)

echo.
echo Iniciando InicioNestJs (GraphQL en http://localhost:3001/graphql)...
echo.
npm run start:dev

pause
