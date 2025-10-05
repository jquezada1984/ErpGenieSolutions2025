#!/usr/bin/env python3
"""
Script para iniciar el servidor Flask con SQLite
"""

import os
import sys
import time
from dotenv import load_dotenv

def check_database_connection():
    """Verifica la conexión a la base de datos SQLite"""
    try:
        import sqlite3
        load_dotenv()
        
        database_url = os.getenv('DATABASE_URL', 'sqlite:///app/data/database.db')
        print(f"🔍 Verificando conexión a la base de datos...")
        
        # Extraer ruta del archivo SQLite
        if database_url.startswith('sqlite:///'):
            db_path = database_url.replace('sqlite:///', '')
        else:
            db_path = '/app/data/database.db'
        
        # Crear directorio si no existe
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1;")
            result = cursor.fetchone()
            if result:
                print("✅ Conexión a la base de datos exitosa")
                return True
                    
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        return False

def wait_for_database(max_retries=5, delay=1):
    """Espera a que la base de datos esté disponible"""
    print("⏳ Verificando base de datos SQLite...")
    
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
        print("🚀 Iniciando servidor Flask...")
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        print(f"❌ Error iniciando la aplicación Flask: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🎯 Iniciando ERP Python Service con SQLite...")
    
    # Verificar conexión a la base de datos
    if not wait_for_database():
        print("💥 No se puede iniciar el servidor sin conexión a la base de datos")
        sys.exit(1)
    
    # Iniciar aplicación Flask
    start_flask_app()



