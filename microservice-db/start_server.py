#!/usr/bin/env python3
"""
Script para iniciar el microservicio Python con la configuración de Supabase
"""

import os
import sys
from app import app

if __name__ == '__main__':
    print("🚀 Iniciando microservicio Python...")
    print("📊 Configuración de base de datos:")
    print("   Host: db.xfeycgctysoumclptgoh.supabase.co")
    print("   Puerto: 5432")
    print("   Base de datos: postgres")
    print("   Usuario: postgres")
    print("🌐 Servidor iniciado en: http://localhost:5000")
    print("📋 Endpoints disponibles:")
    print("   - GET  /health")
    print("   - GET  /api/empresa")
    print("   - POST /api/empresa")
    print("   - PUT  /api/empresa/<id>")
    print("   - DELETE /api/empresa/<id>")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True) 