#!/usr/bin/env python3
"""
Script para verificar la estructura de la base de datos
"""

import sys
import os

# Agregar el directorio del proyecto al path
sys.path.append(os.path.join(os.path.dirname(__file__), 'InicioPython'))

from InicioPython.app import app
from InicioPython.utils.db import db
from InicioPython.models.empresa import Empresa, EmpresaHorarioApertura, EmpresaIdentificacion, EmpresaRedSocial
from sqlalchemy import inspect

def check_database_structure():
    """Verificar la estructura de la base de datos"""
    
    print("🔍 Verificando estructura de la base de datos...")
    
    with app.app_context():
        try:
            # Verificar conexión
            print("1️⃣ Verificando conexión a la base de datos...")
            db.engine.execute("SELECT 1")
            print("✅ Conexión exitosa")
            
            # Verificar tablas
            print("\n2️⃣ Verificando tablas...")
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"✅ Tablas encontradas: {tables}")
            
            # Verificar estructura de empresa_horario_apertura
            print("\n3️⃣ Verificando estructura de empresa_horario_apertura...")
            if 'empresa_horario_apertura' in tables:
                columns = inspector.get_columns('empresa_horario_apertura')
                print("✅ Columnas de empresa_horario_apertura:")
                for column in columns:
                    print(f"  - {column['name']}: {column['type']}")
            else:
                print("❌ Tabla empresa_horario_apertura no encontrada")
            
            # Verificar datos existentes
            print("\n4️⃣ Verificando datos existentes...")
            try:
                empresas = Empresa.query.all()
                print(f"✅ Empresas encontradas: {len(empresas)}")
                
                for empresa in empresas:
                    print(f"  - Empresa: {empresa.nombre} (ID: {empresa.id_empresa})")
                    
                    # Verificar horarios
                    horarios = EmpresaHorarioApertura.query.filter_by(id_empresa=empresa.id_empresa).all()
                    print(f"    - Horarios: {len(horarios)}")
                    for horario in horarios:
                        print(f"      * Día {horario.dia}: {horario.valor}")
                    
                    # Verificar identificación
                    identificacion = EmpresaIdentificacion.query.filter_by(id_empresa=empresa.id_empresa).first()
                    if identificacion:
                        print(f"    - Identificación: {identificacion.administradores}")
                    else:
                        print(f"    - Identificación: No encontrada")
                    
                    # Verificar redes sociales
                    redes = EmpresaRedSocial.query.filter_by(id_empresa=empresa.id_empresa).all()
                    print(f"    - Redes sociales: {len(redes)}")
                    
            except Exception as e:
                print(f"❌ Error verificando datos: {e}")
            
            # Probar inserción simple
            print("\n5️⃣ Probando inserción simple...")
            try:
                # Crear un horario de prueba
                test_horario = EmpresaHorarioApertura(
                    id_empresa=empresas[0].id_empresa if empresas else "test-id",
                    dia=1,
                    valor="8:00-18:00"
                )
                db.session.add(test_horario)
                db.session.commit()
                print("✅ Inserción simple exitosa")
                
                # Limpiar
                db.session.delete(test_horario)
                db.session.commit()
                print("✅ Limpieza exitosa")
                
            except Exception as e:
                print(f"❌ Error en inserción simple: {e}")
                db.session.rollback()
            
        except Exception as e:
            print(f"❌ Error general: {e}")

if __name__ == "__main__":
    check_database_structure() 