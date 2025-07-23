#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "    ERP SYSTEM - ALL SERVICES LAUNCHER"
echo -e "========================================${NC}"
echo
echo "Este script iniciará todos los servicios:"
echo "  1. Python Service (REST) - Puerto 5000"
echo "  2. NestJS Service (GraphQL) - Puerto 3001"
echo "  3. API Gateway - Puerto 3000"
echo "  4. Frontend React - Puerto 3000 (diferente)"
echo
read -p "Presiona Enter para continuar..."

echo
echo -e "${BLUE}========================================"
echo -e "    INICIANDO TODOS LOS SERVICIOS..."
echo -e "========================================${NC}"
echo

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ ERROR: Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ ERROR: Python3 no está instalado${NC}"
    echo "Por favor instala Python desde: https://python.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js y Python detectados correctamente${NC}"
echo

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Puerto $port ya está en uso${NC}"
    else
        echo -e "${GREEN}✅ Puerto $port disponible${NC}"
    fi
}

# Verificar puertos
echo "Verificando puertos disponibles..."
check_port 5000
check_port 3001
check_port 3000
echo

# Crear directorio temporal para logs
mkdir -p logs

echo -e "${BLUE}========================================"
echo -e "    INICIANDO SERVICIOS EN PARALELO"
echo -e "========================================${NC}"
echo

# Función para iniciar servicio en background
start_service() {
    local name=$1
    local command=$2
    local log_file="logs/${name}.log"
    
    echo -e "${GREEN}🚀 Iniciando $name...${NC}"
    eval "$command" > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "logs/${name}.pid"
    echo -e "${GREEN}✅ $name iniciado (PID: $pid)${NC}"
    sleep 2
}

# Iniciar Python Service
start_service "Python Service" "cd microservice-db && python3 start_server.py"

# Iniciar NestJS Service
start_service "NestJS Service" "cd back-nest-js && npm run start:dev"

# Iniciar API Gateway
start_service "API Gateway" "cd gateway-api && npm run start:dev"

# Iniciar Frontend React
start_service "Frontend React" "cd frontReact && npm start"

echo
echo -e "${BLUE}========================================"
echo -e "    ✅ TODOS LOS SERVICIOS INICIADOS"
echo -e "========================================${NC}"
echo
echo -e "${GREEN}📊 Servicios ejecutándose:${NC}"
echo "  🐍 Python Service: http://localhost:5000"
echo "  🟢 NestJS Service: http://localhost:3001"
echo "  🌐 API Gateway: http://localhost:3000/gateway"
echo "  ⚛️  Frontend React: http://localhost:3000"
echo
echo -e "${YELLOW}🔍 Para verificar el estado:${NC}"
echo "  curl http://localhost:3000/gateway/health"
echo
echo -e "${YELLOW}📝 Logs disponibles en:${NC}"
echo "  logs/Python Service.log"
echo "  logs/NestJS Service.log"
echo "  logs/API Gateway.log"
echo "  logs/Frontend React.log"
echo

# Función para verificar si un servicio está respondiendo
check_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}🔍 Verificando $name...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name está respondiendo${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ $name no responde después de $max_attempts intentos${NC}"
    return 1
}

# Verificar servicios
echo -e "${BLUE}Verificando servicios...${NC}"
check_service "http://localhost:5000" "Python Service"
check_service "http://localhost:3001" "NestJS Service"
check_service "http://localhost:3000/gateway/health" "API Gateway"

echo
read -p "Presiona Enter para abrir el navegador..."

# Abrir navegador
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
else
    echo -e "${YELLOW}⚠️  No se pudo abrir el navegador automáticamente${NC}"
    echo "Abre manualmente: http://localhost:3000"
fi

echo
echo -e "${GREEN}🎉 ¡Sistema ERP iniciado correctamente!${NC}"
echo
echo -e "${YELLOW}Para detener todos los servicios:${NC}"
echo "  ./stop-all-services.sh"
echo
echo -e "${YELLOW}Para ver logs en tiempo real:${NC}"
echo "  tail -f logs/*.log"
echo
echo -e "${YELLOW}Para verificar PIDs:${NC}"
echo "  cat logs/*.pid"
echo 