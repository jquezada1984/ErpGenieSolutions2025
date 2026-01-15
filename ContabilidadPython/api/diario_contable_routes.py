from flask import Blueprint, request, jsonify
from models.diario_contable import DiarioContable
from schemas.diario_contable_schema import DiarioContableSchema, DiarioContableCreateSchema, DiarioContableUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

diario_contable_bp = Blueprint('diario_contable_bp', __name__)
diario_contable_schema = DiarioContableSchema()
diario_contable_create_schema = DiarioContableCreateSchema()
diario_contable_update_schema = DiarioContableUpdateSchema()

@diario_contable_bp.route('/diario-contable', methods=['POST', 'OPTIONS'])
@diario_contable_bp.route('/diario-contable/', methods=['POST', 'OPTIONS'])
def crear_diario_contable():
    """Crear un nuevo diario contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        print(f"📝 Datos recibidos para crear diario contable: {data}")
        
        # Validar y deserializar
        errors = diario_contable_create_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Crear diario contable
        diario = DiarioContable(**data)
        db.session.add(diario)
        db.session.commit()
        
        result = diario_contable_schema.dump(diario)
        print(f"✅ Diario contable creado exitosamente: {result}")
        return jsonify(result), 201
    except IntegrityError as e:
        print(f"❌ Error de integridad al crear diario contable: {e}")
        db.session.rollback()
        if "codigo" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe un diario contable con este código para esta empresa',
                'field': 'codigo',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al crear diario contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@diario_contable_bp.route('/diario-contable/<int:id>', methods=['PUT', 'OPTIONS'])
@diario_contable_bp.route('/diario-contable/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_diario_contable(id):
    """Actualizar un diario contable existente"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        diario = DiarioContable.query.get(id)
        if not diario:
            return jsonify({'error': 'Diario contable no encontrado'}), 404
        
        data = request.get_json()
        print(f"📝 Datos recibidos para actualizar diario contable {id}: {data}")
        
        # Validar y deserializar
        errors = diario_contable_update_schema.validate(data)
        if errors:
            print(f"❌ Errores de validación: {errors}")
            return jsonify(errors), 400
        
        # Actualizar campos
        for key, value in data.items():
            if hasattr(diario, key):
                setattr(diario, key, value)
        
        db.session.commit()
        
        result = diario_contable_schema.dump(diario)
        print(f"✅ Diario contable actualizado exitosamente: {result}")
        return jsonify(result), 200
    except IntegrityError as e:
        print(f"❌ Error de integridad al actualizar diario contable: {e}")
        db.session.rollback()
        if "codigo" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe un diario contable con este código para esta empresa',
                'field': 'codigo',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad en los datos'}), 409
    except Exception as e:
        print(f"❌ Error al actualizar diario contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@diario_contable_bp.route('/diario-contable/<int:id>', methods=['DELETE', 'OPTIONS'])
@diario_contable_bp.route('/diario-contable/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_diario_contable(id):
    """Desactivar un diario contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        diario = DiarioContable.query.get(id)
        if not diario:
            return jsonify({'error': 'Diario contable no encontrado'}), 404
        
        diario.estado = False
        db.session.commit()
        return jsonify({'message': 'Diario contable desactivado exitosamente'}), 200
    except Exception as e:
        print(f"❌ Error al eliminar diario contable: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
