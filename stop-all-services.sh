#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "    ERP SYSTEM - STOP ALL SERVICES"
echo -e "========================================${NC}"
echo
echo "Este script detendrá todos los servicios:"
echo "  1. Python Service (REST) - Puerto 5000"
echo "  2. NestJS Service (GraphQL) - Puerto 3001"
echo "  3. API Gateway - Puerto 3000"
echo "  4. Frontend React - Puerto 3000"
echo
read -p "Presiona Enter para continuar..."

echo
echo -e "${BLUE}========================================"
echo -e "    DETENIENDO TODOS LOS SERVICIOS..."
echo -e "========================================${NC}"
echo

# Función para detener procesos por puerto
stop_port() {
    local port=$1
    local pids=$(lsof -ti:$port)
    
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}🔴 Deteniendo procesos en puerto $port (PIDs: $pids)${NC}"
        kill -9 $pids 2>/dev/null
        echo -e "${GREEN}✅ Procesos en puerto $port detenidos${NC}"
    else
        echo -e "${GREEN}✅ No hay procesos en puerto $port${NC}"
    fi
}

# Detener servicios por puerto
echo -e "${YELLOW}🔴 Deteniendo servicios por puerto...${NC}"
stop_port 5000
stop_port 3001
stop_port 3000

# Detener procesos de Node.js
echo -e "${YELLOW}🔴 Deteniendo procesos de Node.js...${NC}"
pkill -f "node" 2>/dev/null
echo -e "${GREEN}✅ Procesos de Node.js detenidos${NC}"

# Detener procesos de Python
echo -e "${YELLOW}🔴 Deteniendo procesos de Python...${NC}"
pkill -f "python" 2>/dev/null
pkill -f "python3" 2>/dev/null
echo -e "${GREEN}✅ Procesos de Python detenidos${NC}"

# Detener procesos específicos por nombre
echo -e "${YELLOW}🔴 Deteniendo procesos específicos...${NC}"

# Detener procesos de npm
pkill -f "npm" 2>/dev/null

# Detener procesos de desarrollo
pkill -f "start:dev" 2>/dev/null
pkill -f "start_server.py" 2>/dev/null

echo -e "${GREEN}✅ Procesos específicos detenidos${NC}"

# Limpiar archivos PID si existen
if [ -d "logs" ]; then
    echo -e "${YELLOW}🧹 Limpiando archivos PID...${NC}"
    for pid_file in logs/*.pid; do
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            echo -e "${YELLOW}Deteniendo PID $pid desde $pid_file${NC}"
            kill -9 $pid 2>/dev/null
            rm "$pid_file"
        fi
    done
    echo -e "${GREEN}✅ Archivos PID limpiados${NC}"
fi

echo
echo -e "${BLUE}========================================"
echo -e "    ✅ TODOS LOS SERVICIOS DETENIDOS"
echo -e "========================================${NC}"
echo
echo -e "${GREEN}📊 Servicios detenidos:${NC}"
echo "  🐍 Python Service (Puerto 5000)"
echo "  🟢 NestJS Service (Puerto 3001)"
echo "  🌐 API Gateway (Puerto 3000)"
echo "  ⚛️  Frontend React (Puerto 3000)"
echo

# Limpiar archivos temporales
echo -e "${YELLOW}🧹 Limpiando archivos temporales...${NC}"

# Eliminar directorio de logs
if [ -d "logs" ]; then
    rm -rf logs
    echo -e "${GREEN}✅ Directorio de logs eliminado${NC}"
fi

# Limpiar cache de Node.js
find . -name "node_modules/.cache" -type d -exec rm -rf {} + 2>/dev/null
echo -e "${GREEN}✅ Cache de Node.js eliminado${NC}"

# Limpiar archivos temporales de Python
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -delete 2>/dev/null
echo -e "${GREEN}✅ Archivos temporales de Python eliminados${NC}"

echo
echo -e "${GREEN}🎉 ¡Todos los servicios han sido detenidos correctamente!${NC}"
echo
echo -e "${YELLOW}Para reiniciar todos los servicios:${NC}"
echo "  ./start-all-services.sh"
echo
echo -e "${YELLOW}Para verificar que no hay procesos ejecutándose:${NC}"
echo "  lsof -i :5000,3001,3000"
echo 