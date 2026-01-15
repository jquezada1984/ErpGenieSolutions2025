from flask import Blueprint, request, jsonify
from models.modelo_plan_contable import ModeloPlanContable
from schemas.modelo_plan_contable_schema import ModeloPlanContableSchema, ModeloPlanContableCreateSchema, ModeloPlanContableUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

modelo_bp = Blueprint('modelo_plan_contable_bp', __name__)
modelo_schema = ModeloPlanContableSchema()
modelo_create_schema = ModeloPlanContableCreateSchema()
modelo_update_schema = ModeloPlanContableUpdateSchema()

@modelo_bp.route('/modelo-plan-contable', methods=['POST', 'OPTIONS'])
@modelo_bp.route('/modelo-plan-contable/', methods=['POST', 'OPTIONS'])
def crear_modelo():
    """Crear un nuevo modelo de plan contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = modelo_create_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        modelo = ModeloPlanContable(**data)
        db.session.add(modelo)
        db.session.commit()
        
        result = modelo_schema.dump(modelo)
        return jsonify(result), 201
    except IntegrityError as e:
        db.session.rollback()
        if "codigo" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe un modelo con este código',
                'field': 'codigo',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@modelo_bp.route('/modelo-plan-contable/<int:id>', methods=['PUT', 'OPTIONS'])
@modelo_bp.route('/modelo-plan-contable/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_modelo(id):
    """Actualizar modelo de plan contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        modelo = ModeloPlanContable.query.get(id)
        if not modelo:
            return jsonify({'error': 'Modelo no encontrado'}), 404
        
        data = request.get_json()
        errors = modelo_update_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        for key, value in data.items():
            if hasattr(modelo, key):
                setattr(modelo, key, value)
        
        db.session.commit()
        result = modelo_schema.dump(modelo)
        return jsonify(result), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@modelo_bp.route('/modelo-plan-contable/<int:id>', methods=['DELETE', 'OPTIONS'])
@modelo_bp.route('/modelo-plan-contable/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_modelo(id):
    """Desactivar modelo de plan contable"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        modelo = ModeloPlanContable.query.get(id)
        if not modelo:
            return jsonify({'error': 'Modelo no encontrado'}), 404
        
        modelo.estado = False
        db.session.commit()
        return jsonify({'message': 'Modelo desactivado exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
