#!/usr/bin/env python3
"""
Script para verificar la conexión a PostgreSQL con psycopg3
"""

import os
import sys
from dotenv import load_dotenv

def test_psycopg_connection():
    """Prueba la conexión a PostgreSQL usando psycopg2"""
    try:
        import psycopg2
        print("✅ psycopg2 importado correctamente")
        
        # Cargar variables de entorno
        load_dotenv()
        
        # Obtener URL de la base de datos
        database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/postgres')
        print(f"🔗 Intentando conectar a: {database_url}")
        
        # Intentar conectar
        with psycopg2.connect(database_url) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT version();")
                version = cur.fetchone()
                print(f"✅ Conexión exitosa a PostgreSQL: {version[0]}")
                return True
                
    except ImportError as e:
        print(f"❌ Error importando psycopg2: {e}")
        return False
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Probando conexión con psycopg2...")
    success = test_psycopg_connection()
    sys.exit(0 if success else 1)


