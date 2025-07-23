#!/usr/bin/env python3
"""
Script para probar la conexión a la base de datos y el servidor
"""

import requests
import psycopg2
from config.config import Config

def test_database_connection():
    """Probar conexión a la base de datos"""
    try:
        print("🔍 Probando conexión a la base de datos...")
        
        # Extraer parámetros de la URL de conexión
        db_url = Config.SQLALCHEMY_DATABASE_URI
        print(f"📊 URL de conexión: {db_url}")
        
        # Conectar a la base de datos
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        # Probar consulta simple
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Conexión exitosa a PostgreSQL: {version[0]}")
        
        # Verificar tabla empresa
        cursor.execute("SELECT COUNT(*) FROM empresa;")
        count = cursor.fetchone()
        print(f"📋 Registros en tabla empresa: {count[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        return False

def test_server_connection():
    """Probar conexión al servidor"""
    try:
        print("\n🌐 Probando conexión al servidor...")
        
        # Probar endpoint de salud
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            print("✅ Servidor respondiendo correctamente")
            print(f"📄 Respuesta: {response.json()}")
            return True
        else:
            print(f"⚠️ Servidor respondió con código: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor en http://localhost:5000")
        print("💡 Asegúrate de que el microservicio esté ejecutándose")
        return False
    except Exception as e:
        print(f"❌ Error al conectar al servidor: {e}")
        return False

def main():
    print("=" * 50)
    print("    PRUEBA DE CONEXIONES - ERP")
    print("=" * 50)
    
    # Probar base de datos
    db_ok = test_database_connection()
    
    # Probar servidor
    server_ok = test_server_connection()
    
    print("\n" + "=" * 50)
    print("    RESUMEN")
    print("=" * 50)
    
    if db_ok:
        print("✅ Base de datos: CONECTADA")
    else:
        print("❌ Base de datos: ERROR")
    
    if server_ok:
        print("✅ Servidor: FUNCIONANDO")
    else:
        print("❌ Servidor: NO DISPONIBLE")
    
    if db_ok and server_ok:
        print("\n🎉 Todo está funcionando correctamente!")
    else:
        print("\n⚠️ Hay problemas que necesitan ser resueltos")
    
    print("=" * 50)

if __name__ == '__main__':
    main() 