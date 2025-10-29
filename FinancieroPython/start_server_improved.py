#!/usr/bin/env python3
"""
Script mejorado para iniciar el servidor Flask con verificación de conexión
"""

import os
import sys
import time
from dotenv import load_dotenv

def check_database_connection():
    """Verifica la conexión a la base de datos antes de iniciar el servidor"""
    try:
        import psycopg2
        load_dotenv()
        
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/postgres')
        print(f"🔍 Verificando conexión a la base de datos...")
        
        with psycopg2.connect(database_url) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1;")
                result = cur.fetchone()
                if result:
                    print("✅ Conexión a la base de datos exitosa")
                    return True
                    
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        return False

def wait_for_database(max_retries=30, delay=2):
    """Espera a que la base de datos esté disponible"""
    print("⏳ Esperando a que la base de datos esté disponible...")
    
    for attempt in range(max_retries):
        if check_database_connection():
            return True
        
        print(f"🔄 Intento {attempt + 1}/{max_retries} - Reintentando en {delay} segundos...")
        time.sleep(delay)
    
    print("❌ No se pudo conectar a la base de datos después de todos los intentos")
    return False

def start_flask_app():
    """Inicia la aplicación Flask"""
    try:
        from app import app
        port = int(os.getenv('PORT', 5001))
        print(f"🚀 Iniciando servidor Flask Financiero en puerto {port}...")
        app.run(host='0.0.0.0', port=port, debug=True)
    except Exception as e:
        print(f"❌ Error iniciando la aplicación Flask: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🎯 Iniciando ERP Financiero Python Service...")
    
    # Verificar conexión a la base de datos
    if not wait_for_database():
        print("💥 No se puede iniciar el servidor sin conexión a la base de datos")
        sys.exit(1)
    
    # Iniciar aplicación Flask
    start_flask_app()

