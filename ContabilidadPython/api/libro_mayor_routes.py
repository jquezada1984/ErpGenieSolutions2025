from flask import Blueprint, request, jsonify
from models.libro_mayor import LibroMayor
from schemas.libro_mayor_schema import LibroMayorSchema, LibroMayorCreateSchema, LibroMayorUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

libro_mayor_bp = Blueprint('libro_mayor_bp', __name__)
libro_mayor_schema = LibroMayorSchema()
libro_mayor_create_schema = LibroMayorCreateSchema()
libro_mayor_update_schema = LibroMayorUpdateSchema()

@libro_mayor_bp.route('/libro-mayor', methods=['POST', 'OPTIONS'])
@libro_mayor_bp.route('/libro-mayor/', methods=['POST', 'OPTIONS'])
def crear_libro_mayor():
    """Crear un nuevo registro de libro mayor"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear libro mayor: {data}")
        
        # Validar y deserializar
        errors = libro_mayor_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Convertir valores a Decimal
        for key in ['saldo_inicial', 'total_debe', 'total_haber', 'saldo_final']:
            if key in data:
                data[key] = Decimal(str(data[key]))
        
        # Crear libro mayor
        libro = LibroMayor(**data)
        db.session.add(libro)
        db.session.commit()
        
        result = libro_mayor_schema.dump(libro)
        print(f"✅ Libro mayor creado exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear libro mayor: {e}")
        db.session.rollback()
        return jsonify({'error': 'Error de integridad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear libro mayor: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@libro_mayor_bp.route('/libro-mayor/<int:id>', methods=['PUT', 'OPTIONS'])
@libro_mayor_bp.route('/libro-mayor/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_libro_mayor(id):
    """Actualizar un registro de libro mayor existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        libro = LibroMayor.query.get(id)
        if not libro:
            return jsonify({'error': 'Libro mayor no encontrado'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar libro mayor {id}: {data}")
        
        # Validar y deserializar
        errors = libro_mayor_update_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Actualizar campos
        for key, value in data.items():
            if hasattr(libro, key):
                if key in ['saldo_inicial', 'total_debe', 'total_haber', 'saldo_final']:
                    setattr(libro, key, Decimal(str(value)))
                else:
                    setattr(libro, key, value)
        
        db.session.commit()
        
        result = libro_mayor_schema.dump(libro)
        print(f"✅ Libro mayor actualizado exitosamente: {result}")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error al actualizar libro mayor: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@libro_mayor_bp.route('/libro-mayor/<int:id>', methods=['DELETE', 'OPTIONS'])
@libro_mayor_bp.route('/libro-mayor/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_libro_mayor(id):
    """Eliminar un registro de libro mayor"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        libro = LibroMayor.query.get(id)
        if not libro:
            return jsonify({'error': 'Libro mayor no encontrado'}), 404
        
        db.session.delete(libro)
        db.session.commit()
        return jsonify({'message': 'Libro mayor eliminado exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al eliminar libro mayor: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
