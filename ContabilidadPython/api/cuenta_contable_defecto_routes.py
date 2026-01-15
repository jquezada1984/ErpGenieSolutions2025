from flask import Blueprint, request, jsonify
from models.cuenta_contable_defecto import CuentaContableDefecto
from schemas.cuenta_contable_defecto_schema import CuentaContableDefectoSchema, CuentaContableDefectoCreateSchema, CuentaContableDefectoUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError

cuenta_defecto_bp = Blueprint('cuenta_contable_defecto_bp', __name__)
cuenta_defecto_schema = CuentaContableDefectoSchema()
cuenta_defecto_create_schema = CuentaContableDefectoCreateSchema()
cuenta_defecto_update_schema = CuentaContableDefectoUpdateSchema()

@cuenta_defecto_bp.route('/cuenta-contable-defecto', methods=['POST', 'OPTIONS'])
@cuenta_defecto_bp.route('/cuenta-contable-defecto/', methods=['POST', 'OPTIONS'])
def crear_cuenta_defecto():
    """Crear una nueva cuenta contable por defecto"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = cuenta_defecto_create_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        cuenta_defecto = CuentaContableDefecto(**data)
        db.session.add(cuenta_defecto)
        db.session.commit()
        
        result = cuenta_defecto_schema.dump(cuenta_defecto)
        return jsonify(result), 201
    except IntegrityError as e:
        db.session.rollback()
        if "tipo_operacion" in str(e).lower() and "unique" in str(e).lower():
            return jsonify({
                'error': 'Ya existe una cuenta por defecto para este tipo de operación en esta empresa',
                'field': 'tipo_operacion',
                'type': 'duplicate'
            }), 409
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_defecto_bp.route('/cuenta-contable-defecto/<int:id>', methods=['PUT', 'OPTIONS'])
@cuenta_defecto_bp.route('/cuenta-contable-defecto/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_cuenta_defecto(id):
    """Actualizar cuenta contable por defecto"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta_defecto = CuentaContableDefecto.query.get(id)
        if not cuenta_defecto:
            return jsonify({'error': 'Cuenta por defecto no encontrada'}), 404
        
        data = request.get_json()
        errors = cuenta_defecto_update_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        for key, value in data.items():
            if hasattr(cuenta_defecto, key):
                setattr(cuenta_defecto, key, value)
        
        db.session.commit()
        result = cuenta_defecto_schema.dump(cuenta_defecto)
        return jsonify(result), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_defecto_bp.route('/cuenta-contable-defecto/<int:id>', methods=['DELETE', 'OPTIONS'])
@cuenta_defecto_bp.route('/cuenta-contable-defecto/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_cuenta_defecto(id):
    """Desactivar cuenta contable por defecto"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta_defecto = CuentaContableDefecto.query.get(id)
        if not cuenta_defecto:
            return jsonify({'error': 'Cuenta por defecto no encontrada'}), 404
        
        cuenta_defecto.estado = False
        db.session.commit()
        return jsonify({'message': 'Cuenta por defecto desactivada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
