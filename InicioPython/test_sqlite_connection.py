#!/usr/bin/env python3
"""
Script para verificar la conexión a SQLite
"""

import os
import sys
from dotenv import load_dotenv

def test_sqlite_connection():
    """Prueba la conexión a SQLite"""
    try:
        import sqlite3
        print("✅ sqlite3 importado correctamente")
        
        # Cargar variables de entorno
        load_dotenv()
        
        # Obtener URL de la base de datos
        database_url = os.getenv('DATABASE_URL', 'sqlite:///app/data/database.db')
        print(f"🔗 Intentando conectar a: {database_url}")
        
        # Extraer ruta del archivo SQLite
        if database_url.startswith('sqlite:///'):
            db_path = database_url.replace('sqlite:///', '')
        else:
            db_path = '/app/data/database.db'
        
        # Crear directorio si no existe
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        
        # Intentar conectar
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT sqlite_version();")
            version = cursor.fetchone()
            print(f"✅ Conexión exitosa a SQLite: {version[0]}")
            return True
                
    except ImportError as e:
        print(f"❌ Error importando sqlite3: {e}")
        return False
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Probando conexión con SQLite...")
    success = test_sqlite_connection()
    sys.exit(0 if success else 1)














