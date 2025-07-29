#!/bin/bash

echo "🚀 Iniciando validación completa del proyecto ERP..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar resultados
show_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

echo -e "\n${YELLOW}📦 Validando Frontend (React)...${NC}"
cd frontReact
npm install
show_result $? "Dependencias del frontend instaladas"

npm run lint
show_result $? "Linting del frontend completado"

npm run build
show_result $? "Build del frontend completado"

cd ..

echo -e "\n${YELLOW}🌐 Validando Gateway API...${NC}"
cd gateway-api
npm install
show_result $? "Dependencias del Gateway instaladas"

# Verificar que el servidor puede iniciar (timeout de 10 segundos)
timeout 10s npm start &
GATEWAY_PID=$!
sleep 2
if kill -0 $GATEWAY_PID 2>/dev/null; then
    kill $GATEWAY_PID
    show_result 0 "Gateway API puede iniciar correctamente"
else
    show_result 1 "Gateway API no puede iniciar"
fi

cd ..

echo -e "\n${YELLOW}🐍 Validando Microservicio Python...${NC}"
cd InicioPython

# Verificar sintaxis Python
python -m py_compile app.py
show_result $? "Sintaxis de app.py válida"

python -m py_compile models/*.py
show_result $? "Sintaxis de modelos válida"

python -m py_compile api/*.py
show_result $? "Sintaxis de APIs válida"

python -m py_compile schemas/*.py
show_result $? "Sintaxis de esquemas válida"

# Verificar que la aplicación puede iniciar (timeout de 10 segundos)
timeout 10s python app.py &
PYTHON_PID=$!
sleep 2
if kill -0 $PYTHON_PID 2>/dev/null; then
    kill $PYTHON_PID
    show_result 0 "Microservicio Python puede iniciar correctamente"
else
    show_result 1 "Microservicio Python no puede iniciar"
fi

cd ..

echo -e "\n${YELLOW}⚡ Validando Microservicio NestJS...${NC}"
cd InicioNestJs
npm install
show_result $? "Dependencias de NestJS instaladas"

npm run lint
show_result $? "Linting de NestJS completado"

npm run build
show_result $? "Build de NestJS completado"

cd ..

echo -e "\n${YELLOW}🔧 Validando archivos de configuración...${NC}"

# Verificar variables de entorno
if [ -f "frontReact/.env" ]; then
    echo -e "${GREEN}✅ Frontend .env encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env no encontrado (usar .env.example)${NC}"
fi

if [ -f "gateway-api/.env" ]; then
    echo -e "${GREEN}✅ Gateway .env encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Gateway .env no encontrado (usar .env.example)${NC}"
fi

if [ -f "InicioPython/.env" ]; then
    echo -e "${GREEN}✅ Python .env encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Python .env no encontrado (usar .env.example)${NC}"
fi

if [ -f "InicioNestJs/.env" ]; then
    echo -e "${GREEN}✅ NestJS .env encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  NestJS .env no encontrado (usar .env.example)${NC}"
fi

echo -e "\n${GREEN}🎉 Validación completa finalizada exitosamente!${NC}"
echo -e "${YELLOW}📋 Checklist para producción:${NC}"
echo "  1. ✅ Todas las dependencias instaladas"
echo "  2. ✅ Sintaxis validada"
echo "  3. ✅ Builds completados"
echo "  4. ✅ Servidores pueden iniciar"
echo "  5. ⚠️  Verificar variables de entorno"
echo "  6. ⚠️  Verificar conexión a base de datos"
echo "  7. ⚠️  Configurar CORS para producción"
echo "  8. ⚠️  Configurar SSL/HTTPS"
echo "  9. ⚠️  Configurar logs y monitoreo"
echo "  10. ⚠️ Configurar backup de base de datos" 