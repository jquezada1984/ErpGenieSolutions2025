from flask import Blueprint, request, jsonify
from models.cuenta_impuesto import CuentaImpuesto
from schemas.cuenta_impuesto_schema import CuentaImpuestoSchema, CuentaImpuestoCreateSchema, CuentaImpuestoUpdateSchema
from utils.db import db
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

cuenta_impuesto_bp = Blueprint('cuenta_impuesto_bp', __name__)
cuenta_impuesto_schema = CuentaImpuestoSchema()
cuenta_impuesto_create_schema = CuentaImpuestoCreateSchema()
cuenta_impuesto_update_schema = CuentaImpuestoUpdateSchema()

@cuenta_impuesto_bp.route('/cuenta-impuesto', methods=['POST', 'OPTIONS'])
@cuenta_impuesto_bp.route('/cuenta-impuesto/', methods=['POST', 'OPTIONS'])
def crear_cuenta_impuesto():
    """Crear una nueva cuenta de impuesto"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json()
        errors = cuenta_impuesto_create_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        if 'porcentaje' in data:
            data['porcentaje'] = Decimal(str(data['porcentaje']))
        
        cuenta_impuesto = CuentaImpuesto(**data)
        db.session.add(cuenta_impuesto)
        db.session.commit()
        
        result = cuenta_impuesto_schema.dump(cuenta_impuesto)
        return jsonify(result), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            'error': 'Ya existe una cuenta de impuesto con este tipo y porcentaje para esta empresa',
            'field': 'tipo_impuesto,porcentaje',
            'type': 'duplicate'
        }), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_impuesto_bp.route('/cuenta-impuesto/<int:id>', methods=['PUT', 'OPTIONS'])
@cuenta_impuesto_bp.route('/cuenta-impuesto/<int:id>/', methods=['PUT', 'OPTIONS'])
def actualizar_cuenta_impuesto(id):
    """Actualizar cuenta de impuesto"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta_impuesto = CuentaImpuesto.query.get(id)
        if not cuenta_impuesto:
            return jsonify({'error': 'Cuenta de impuesto no encontrada'}), 404
        
        data = request.get_json()
        errors = cuenta_impuesto_update_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        for key, value in data.items():
            if hasattr(cuenta_impuesto, key):
                if key == 'porcentaje':
                    setattr(cuenta_impuesto, key, Decimal(str(value)))
                else:
                    setattr(cuenta_impuesto, key, value)
        
        db.session.commit()
        result = cuenta_impuesto_schema.dump(cuenta_impuesto)
        return jsonify(result), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'error': 'Error de duplicidad'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cuenta_impuesto_bp.route('/cuenta-impuesto/<int:id>', methods=['DELETE', 'OPTIONS'])
@cuenta_impuesto_bp.route('/cuenta-impuesto/<int:id>/', methods=['DELETE', 'OPTIONS'])
def eliminar_cuenta_impuesto(id):
    """Desactivar cuenta de impuesto"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        cuenta_impuesto = CuentaImpuesto.query.get(id)
        if not cuenta_impuesto:
            return jsonify({'error': 'Cuenta de impuesto no encontrada'}), 404
        
        cuenta_impuesto.estado = False
        db.session.commit()
        return jsonify({'message': 'Cuenta de impuesto desactivada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
