#!/bin/bash

echo "🚀 Iniciando ERP en modo desarrollo con Docker..."
echo

echo "📦 Construyendo y ejecutando contenedores de desarrollo..."
docker-compose -f docker-compose.dev.yml up --build

echo
echo "✅ Servicios de desarrollo iniciados:"
echo "   - Frontend React: http://localhost:3000"
echo "   - Gateway API: http://localhost:3002"
echo "   - Backend NestJS: http://localhost:3001"
echo "   - Backend Python: http://localhost:5000"
echo "   - Menu Service: http://localhost:3003"
echo
echo "🔄 Los cambios en el código se reflejarán automáticamente sin reconstruir"
echo
