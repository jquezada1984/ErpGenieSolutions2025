#!/usr/bin/env python3
"""
Script para aplicar la restricción única al campo email de la tabla empresa
"""

import sqlite3
import os
from pathlib import Path

def apply_email_unique_constraint():
    """Aplicar restricción única al campo email"""
    
    # Ruta a la base de datos
    db_path = Path(__file__).parent / "database.db"
    
    if not db_path.exists():
        print("❌ Base de datos no encontrada. Asegúrate de que el microservicio se haya ejecutado al menos una vez.")
        return False
    
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("🔍 Verificando restricciones existentes...")
        
        # Verificar si ya existe la restricción
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='sqlite_sequence'
        """)
        
        # Verificar restricciones únicas existentes
        cursor.execute("PRAGMA table_info(empresa)")
        columns = cursor.fetchall()
        
        email_column = None
        for col in columns:
            if col[1] == 'email':
                email_column = col
                break
        
        if email_column and email_column[5] == 1:  # 5 es el índice de la columna "notnull"
            print("✅ La restricción única ya existe en el campo email")
            return True
        
        print("📝 Aplicando restricción única al campo email...")
        
        # Crear tabla temporal con la nueva restricción
        cursor.execute("""
            CREATE TABLE empresa_temp (
                id_empresa TEXT PRIMARY KEY,
                nombre TEXT NOT NULL,
                ruc TEXT NOT NULL UNIQUE,
                direccion TEXT NOT NULL,
                telefono TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                estado BOOLEAN NOT NULL DEFAULT 1,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Copiar datos existentes
        cursor.execute("""
            INSERT INTO empresa_temp 
            SELECT * FROM empresa
        """)
        
        # Eliminar tabla original
        cursor.execute("DROP TABLE empresa")
        
        # Renombrar tabla temporal
        cursor.execute("ALTER TABLE empresa_temp RENAME TO empresa")
        
        # Confirmar cambios
        conn.commit()
        
        print("✅ Restricción única aplicada exitosamente al campo email")
        
        # Verificar que se aplicó correctamente
        cursor.execute("PRAGMA table_info(empresa)")
        columns = cursor.fetchall()
        
        for col in columns:
            if col[1] == 'email':
                if col[5] == 1:  # Verificar que tiene restricción única
                    print("✅ Verificación exitosa: campo email tiene restricción única")
                else:
                    print("⚠️ Advertencia: campo email no tiene restricción única")
                break
        
        return True
        
    except sqlite3.IntegrityError as e:
        print(f"❌ Error de integridad: {e}")
        print("💡 Esto puede ocurrir si ya existen emails duplicados en la base de datos")
        print("💡 Primero debes resolver los emails duplicados antes de aplicar la restricción")
        return False
        
    except Exception as e:
        print(f"❌ Error aplicando restricción: {e}")
        return False
        
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("🚀 Aplicando restricción única al campo email...")
    success = apply_email_unique_constraint()
    
    if success:
        print("🎉 Migración completada exitosamente")
    else:
        print("💥 Migración falló")
        exit(1) 